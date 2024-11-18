# Market Map Web App  

**Market Map** is a real-time web application providing users with in-depth analysis of market depth, order book imbalance, and bid-ask spread indicators for cryptocurrency trading pairs.  

---

## Features  

- **Market Depth Chart:** Visualizes bid and ask volumes at different price levels.  
- **Order Book Imbalance Indicator:** Highlights buying vs. selling pressure over time.  
- **Spread Indicator:** Tracks the difference between the best bid and ask prices in real-time.  

---

## Libraries Used  

### Frontend  
- **React**: For building the user interface.  
- **Next.js**: For server-side rendering and routing.  
- **Chart.js & React-Chartjs-2**: For rendering interactive data visualizations.  
- **Tailwind CSS**: For responsive and modern styling.  

### Backend (if applicable)  
- **WebSocket**: For consuming real-time Binance data streams.  

---

## Installation  

### Prerequisites  
- **Node.js** (v16 or later)  
- **npm** or **yarn** package manager  

### Steps  
1. Clone the repository:  
   bash
   git clone https://github.com/ankushyamkar10/market-map.git  
   cd market-map  
     

2. Install dependencies:  
   bash
   npm install  
   # or  
   yarn install  
     

3. Run the development server:  
   bash
   npm run dev  
   # or  
   yarn dev  
     

4. Open the application:  
   Navigate to `http://localhost:3000` in your browser.  

---

## Assumptions  

- The app is designed to visualize cryptocurrency order books using Binance's WebSocket API.  
- Data is streamed for a specific trading pair (default: BTC/USDT).  
- The app assumes the structure of Binance's depth data (`bids` and `asks` are arrays of `[price, quantity]`).  

---

## Additional Setup  

- Ensure a stable internet connection for consuming real-time WebSocket data.  
- Binance WebSocket API endpoint: `wss://stream.binance.com:9443/ws/{pair}@depth10@100ms`  
  - Replace `{pair}` with your desired trading pair (e.g., `btcusdt`).  

---

## File Structure  

marketmap/ 
├── src/app/
|   ├──components/  
|      ├── MarketDepthChart.jsx  
|      ├── OrderBookImbalanceIndicator.jsx
|      └── SpreadIndicator.jsx
|      └── OrderBook.jsx
|   ├── hooks/  
|      └── useBinanceOrderBook.js  
├── package.json  
└── README.md  

---

## Future Enhancements  

- Add support for multiple trading pairs.  
- Include historical data for deeper analysis.  
- Integrate additional exchanges for broader Market Insights.  

---

## License  

This project is licensed under the MIT License.  

**Happy trading! 🚀**  