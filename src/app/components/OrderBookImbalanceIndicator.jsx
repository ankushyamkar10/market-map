"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  CategoryScale,
  LinearScale,
  BarElement,
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
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Bar),
  {
    ssr: false,
  }
);

const OrderBookImbalanceIndicator = ({ pair }) => {
  const {
    orderBook: { bids, asks },
    loading,
    error,
  } = useBinanceOrderBook(pair);
  const [imbalanceData, setImbalanceData] = useState([]);

  useEffect(() => {
    if (bids.length && asks.length) {
      const totalBuyVolume = bids.reduce(
        (acc, bid) => acc + parseFloat(bid.quantity),
        0
      );
      const totalSellVolume = asks.reduce(
        (acc, ask) => acc + parseFloat(ask.quantity),
        0
      );

      const imbalance =
        (totalBuyVolume - totalSellVolume) / (totalBuyVolume + totalSellVolume);

      setImbalanceData((prevData) => {
        const newData = [...prevData, imbalance];
        if (newData.length > 60) newData.shift();
        return newData;
      });
    }
  }, [bids, asks]);

  return (
    <div
  className="container mx-auto bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-10"
  id="order-book-imbalance-indicator"
>
  <h3 className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
    Order Book Imbalance Indicator
  </h3>

  {error ? (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <span className="block sm:inline">{error || "An error occurred while loading data."}</span>
    </div>
  ) : !loading && imbalanceData ? (
    <BarChart
      data={{
        labels: imbalanceData.map((_, index) => index),
        datasets: [
          {
            label: "Imbalance",
            data: imbalanceData,
            backgroundColor: imbalanceData.map((val) =>
              val > 0 ? "rgba(75, 192, 192, 0.6)" : "rgba(255, 99, 132, 0.6)"
            ),
            borderColor: imbalanceData.map((val) =>
              val > 0 ? "rgba(75, 192, 192, 1)" : "rgba(255, 99, 132, 1)"
            ),
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Time (minutes)",
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            min: -1,
            max: 1,
            title: {
              display: true,
              text: "Imbalance Ratio",
            },
            ticks: {
              stepSize: 0.2,
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

export default OrderBookImbalanceIndicator;
