import { useState, useEffect, useRef } from "react";

const useBinanceOrderBook = (pair) => {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const prevDataRef = useRef({ bids: [], asks: [] });

  useEffect(() => {
    if (!pair) return;

    const socketUrl = `wss://stream.binance.com:9443/ws/${pair?.toLowerCase()}@depth10@100ms`;
    const socket = new WebSocket(socketUrl);
    setLoading(true);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        const updatedBids = data.bids.slice(0, 10).map(([price, quantity]) => [
          parseFloat(price),
          parseFloat(quantity),
        ]);
        const updatedAsks = data.asks.slice(0, 10).map(([price, quantity]) => [
          parseFloat(price),
          parseFloat(quantity),
        ]);

        const priceChanges = {
          bids: updatedBids.map(([price, quantity], index) => {
            const prevPrice = prevDataRef.current.bids[index]?.[0] || price;
            const prevQuantity = prevDataRef.current.bids[index]?.[1] || quantity;

            return {
              price,
              quantity,
              priceChange:
                prevPrice !== 0 ? ((price - prevPrice) / prevPrice) * 100 : 0,
              quantityChange:
                prevQuantity !== 0
                  ? ((quantity - prevQuantity) / prevQuantity) * 100
                  : 0,
            };
          }),
          asks: updatedAsks.map(([price, quantity], index) => {
            const prevPrice = prevDataRef.current.asks[index]?.[0] || price;
            const prevQuantity = prevDataRef.current.asks[index]?.[1] || quantity;

            return {
              price,
              quantity,
              priceChange:
                prevPrice !== 0 ? ((price - prevPrice) / prevPrice) * 100 : 0,
              quantityChange:
                prevQuantity !== 0
                  ? ((quantity - prevQuantity) / prevQuantity) * 100
                  : 0,
            };
          }),
        };

        prevDataRef.current = {
          bids: updatedBids,
          asks: updatedAsks,
        };

        setOrderBook({
          bids: priceChanges.bids,
          asks: priceChanges.asks,
        });
      } catch (err) {
        setError("Failed to parse WebSocket data.");
        console.error("WebSocket Error:", err);
      }
    };

    socket.onerror = (err) => {
      setError("WebSocket connection error.");
      console.error("WebSocket Error:", err);
    };

    socket.onclose = () => setLoading(false);
    socket.onopen = () => setLoading(false);

    return () => {
      socket.close();
    };
  }, [pair]);

  return { orderBook, loading, error };
};

export default useBinanceOrderBook;
