"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart as ChartJS } from "chart.js";
import useBinanceOrderBook from "../hooks/useBinanceOrderBook";
import Loading from "./Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Line),
  {
    ssr: false,
  }
);

const SpreadIndicator = ({ pair }) => {
  const {
    orderBook: { bids, asks },
    loading,
    error,
  } = useBinanceOrderBook(pair);
  const [spreadData, setSpreadData] = useState([]);

  useEffect(() => {
    if (bids.length && asks.length) {
      const bestBid = bids[0].price;
      const bestAsk = asks[0].price;
      const spread = bestAsk - bestBid;

      setSpreadData((prevData) => {
        const newData = [...prevData, spread];
        if (newData.length > 60) newData.shift();
        return newData;
      });
    }
  }, [bids, asks]);

  return (
    <div
      className="container mx-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-10"
      id="spread-indicator"
    >
      <h3 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
        Spread Indicator
      </h3>
      {error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">
            {error || "An error occurred while loading data."}
          </span>
        </div>
      ) : !loading && spreadData ? (
        <LineChart
          data={{
            labels: spreadData.map((_, index) => index),
            datasets: [
              {
                label: "Spread",
                data: spreadData,
                fill: false,
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                type: "category",
                title: {
                  display: true,
                  text: "Time (minutes)",
                },
              },
              y: {
                ticks: {
                  beginAtZero: true,
                  stepSize: 1,
                },
                title: {
                  display: true,
                  text: "Spread (Price Difference)",
                },
              },
            },
            plugins: {
              tooltip: {
                backgroundColor: "#333",
                titleColor: "#fff",
                bodyColor: "#fff",
              },
              legend: {
                labels: {
                  color: "#fff",
                },
              },
            },
          }}
        />
      ) : (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default SpreadIndicator;
