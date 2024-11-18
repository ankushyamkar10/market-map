"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  CategoryScale,
  LinearScale,
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

const MarketDepthChart = ({ pair }) => {
  const {
    orderBook: { bids, asks },
    loading,
    error,
  } = useBinanceOrderBook(pair);
  const [depthData, setDepthData] = useState({
    bids: { prices: [], volumes: [] },
    asks: { prices: [], volumes: [] },
  });

  useEffect(() => {
    if (bids.length && asks.length) {
      const bidPrices = bids.map((bid) => parseFloat(bid.price));
      const bidVolumes = bids.map((bid) => parseFloat(bid.quantity));
      const askPrices = asks.map((ask) => parseFloat(ask.price));
      const askVolumes = asks.map((ask) => parseFloat(ask.quantity));

      setDepthData({
        bids: { prices: bidPrices, volumes: bidVolumes },
        asks: { prices: askPrices, volumes: askVolumes },
      });
    }
  }, [bids, asks]);

  return (
    <div
      className="container mx-auto bg-gray-50 dark:bg-gray-900 p-2 rounded-lg shadow-lg mb-10"
      id="market-depth"
    >
      <h3 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
        Market Depth Chart
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
      ) : !loading && depthData ? (
        <LineChart
          data={{
            labels: [
              ...depthData.bids.prices.slice().reverse(),
              ...depthData.asks.prices,
            ],
            datasets: [
              {
                label: "Bid Volume",
                data: [
                  ...depthData.bids.volumes.slice().reverse(),
                  ...Array(depthData.asks.prices.length).fill(0),
                ],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                fill: false,
              },
              {
                label: "Ask Volume",
                data: [
                  ...Array(depthData.bids.prices.length).fill(0),
                  ...depthData.asks.volumes,
                ],
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                title: {
                  display: true,
                  text: "Price",
                },
                ticks: {
                  callback: function (value) {
                    return value.toFixed(2);
                  },
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Volume",
                },
                ticks: {
                  stepSize: 10,
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

export default MarketDepthChart;
