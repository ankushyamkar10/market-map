'use client'
import Image from "next/image";
import OrderBook from "./components/OrderBook";
import SpreadIndicator from "./components/SpreadIndicator";
import OrderBookImbalanceIndicator from "./components/OrderBookImbalanceIndicator";
import MarketDepthChart from "./components/MarketDepthChart";
import { useState } from "react";

export default function Home() {
  const [selectedPair, setSelectedPair] = useState("BTCUSDT"); // Default pair
  const handlePairChange = (event) => {
    setSelectedPair(event.target.value);
  };

  return (
    <div>
      <OrderBook pair={selectedPair} handlePairChange={handlePairChange}/>
      <SpreadIndicator pair={selectedPair}/>
      <OrderBookImbalanceIndicator pair={selectedPair}/>
      <MarketDepthChart pair={selectedPair}/>
    </div>
  );
}
