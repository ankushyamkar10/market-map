"use client";
import React, { useState } from "react";
import useBinanceOrderBook from "../hooks/useBinanceOrderBook";
import Loading from "./Loading";

const OrderBook = ({ pair, handlePairChange }) => {
  const {
    orderBook: { bids, asks },
    loading,
    error,
  } = useBinanceOrderBook(pair);

  const getPriceChangeClass = (prevPrice, currentPrice) => {
    const priceChange = ((currentPrice - prevPrice) / prevPrice) * 100;
    if (priceChange > 5) return "text-green-500";
    if (priceChange < -5) return "text-red-500";
    return "";
  };

  return (
    <div
      className="container mx-auto my-10 px-6 py-8 max-w-4xl"
      id="order-book"
    >
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        Order Book -
        <select
          value={pair}
          onChange={handlePairChange}
          className="text-3xl bg-transparent rounded-lg p-2 pl-0 outline-none"
        >
          <option value="BTCUSDT" className="text-lg">
            BTC/USDT
          </option>
          <option value="ETHUSDT" className="text-lg">
            ETH/USDT
          </option>
          <option value="ADAUSDT" className="text-lg">
            ADA/USDT
          </option>
        </select>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
        <div className="bg-green-50 dark:bg-green-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-6 text-center">
            Bids
          </h3>
          <div className="grid grid-cols-2 text-lg font-medium border-b-2 border-green-300 dark:border-green-600 pb-2 mb-4">
            <span className="text-left text-black dark:text-white">Price</span>
            <span className="text-right text-black dark:text-white">
              Quantity
            </span>
          </div>
          <div className="space-y-4">
            {!loading && bids ? (
              bids.length ? (
                bids.map(({ price, quantity, priceChange }, index) => (
                  <div key={index} className="grid grid-cols-2 text-lg">
                    <span
                      className={`text-left text-sm md:text-base ${getPriceChangeClass(
                        priceChange,
                        price
                      )}`}
                    >
                      {price}
                    </span>
                    <span className="text-right text-gray-800 dark:text-gray-300 text-sm md:text-base">
                      {quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-300">
                  No bids available
                </p>
              )
            ) : (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
        </div>

        {/* Asks Section */}
        <div className="bg-red-50 dark:bg-red-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-6 text-center">
            Asks
          </h3>
          <div className="grid grid-cols-2 text-lg font-medium border-b-2 border-red-300 dark:border-red-600 pb-2 mb-4">
            <span className="text-left text-black dark:text-white">Price</span>
            <span className="text-right text-black dark:text-white">
              Quantity
            </span>
          </div>
          <div className="space-y-4">
            {error ? (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">
                  {error || "An error occurred while loading data."}
                </span>
              </div>
            ) : !loading && asks ? (
              asks.length ? (
                asks.map(({ price, quantity, priceChange }, index) => (
                  <div key={index} className="grid grid-cols-2 text-lg">
                    <span
                      className={`text-left text-sm md:text-base ${getPriceChangeClass(
                        priceChange,
                        price
                      )}`}
                    >
                      {price}
                    </span>
                    <span className="text-right text-gray-800 dark:text-gray-300 text-sm md:text-base">
                      {quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-300">
                  No asks available
                </p>
              )
            ) : (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
