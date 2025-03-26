
/**
 * Flask API Connector
 * 
 * This utility provides functions to interact with the Flask backend.
 * Replace the placeholder API_BASE_URL with your actual Flask server URL when setting up.
 */

// Update this when your Flask server is running
const API_BASE_URL = 'http://localhost:5000';

export interface StockData {
  ticker: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  updatedAt: string;
}

export interface ImpliedVolatilityData {
  date: string;
  strike: number;
  type: string;
  volatility: number;
  movement: number;
  label: string;
}

export interface HistoricalVolatilityData {
  period: string;
  volatility: number;
  movement: number;
}

export interface MonteCarloData {
  timestamp: string;
  median: number;
  upper95: number;
  lower05: number;
  values?: number[]; // Optional array of all simulation values at this timestamp
}

export interface VolatilityComparisonData {
  date: string;
  implied: number;
  historical: number;
}

export interface VolatilityMetricsData {
  stockData: StockData;
  impliedVolatility: ImpliedVolatilityData[];
  historicalVolatility: HistoricalVolatilityData[];
  monteCarloSimulation: MonteCarloData[];
  volatilityComparison: VolatilityComparisonData[];
}

/**
 * Fetches stock data for the given ticker
 */
export const fetchStockData = async (ticker: string): Promise<StockData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stock/${ticker}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
    
    // Return mock data if backend is not available
    return {
      ticker: ticker.toUpperCase(),
      price: 645.92,
      priceChange: 3.47,
      priceChangePercent: 0.54,
      updatedAt: new Date().toISOString(),
    };
  }
};

/**
 * Fetches volatility metrics data from the Flask backend for a specific ticker
 */
export const fetchVolatilityMetrics = async (ticker: string): Promise<VolatilityMetricsData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/volatility-metrics/${ticker}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching volatility metrics for ${ticker}:`, error);
    
    // Return mock data if backend is not available
    const stockData = await fetchStockData(ticker);
    
    return {
      stockData,
      impliedVolatility: [
        { date: '2025-04-17', strike: 650.0, type: 'Call', volatility: 28.26, movement: 44.97, label: 'Nearest' },
        { date: '2025-08-15', strike: 650.0, type: 'Call', volatility: 23.82, movement: 96.31, label: '~3 Months' },
        { date: '2025-12-19', strike: 650.0, type: 'Call', volatility: 19.60, movement: 108.86, label: '~6 Months' },
        { date: '2025-12-19', strike: 650.0, type: 'Call', volatility: 19.60, movement: 108.86, label: '~1 Year' },
      ],
      historicalVolatility: [
        { period: '30-Day', volatility: 33.04, movement: 73.91 },
        { period: '1-Year', volatility: 26.90, movement: 174.38 },
      ],
      monteCarloSimulation: [
        { timestamp: 'Now', median: stockData.price, upper95: stockData.price, lower05: stockData.price },
        { timestamp: '1 month', median: stockData.price * 1.02, upper95: stockData.price * 1.15, lower05: stockData.price * 0.92 },
        { timestamp: '3 months', median: stockData.price * 1.05, upper95: stockData.price * 1.25, lower05: stockData.price * 0.85 },
        { timestamp: '6 months', median: stockData.price * 1.08, upper95: stockData.price * 1.35, lower05: stockData.price * 0.80 },
        { timestamp: '1 year', median: stockData.price * 1.12, upper95: stockData.price * 1.45, lower05: stockData.price * 0.75 },
      ],
      volatilityComparison: [
        { date: 'Last Month', implied: 27.5, historical: 30.2 },
        { date: '2 Months Ago', implied: 25.8, historical: 28.7 },
        { date: '3 Months Ago', implied: 26.2, historical: 27.3 },
        { date: '4 Months Ago', implied: 24.1, historical: 25.8 },
        { date: '5 Months Ago', implied: 22.9, historical: 24.2 },
        { date: '6 Months Ago', implied: 23.5, historical: 22.1 },
      ]
    };
  }
};

/**
 * To connect this frontend to your Flask backend:
 * 
 * 1. Set up a Flask server with CORS enabled:
 *    
 *    from flask import Flask, jsonify, request
 *    from flask_cors import CORS
 *    
 *    app = Flask(__name__)
 *    CORS(app)
 *    
 *    @app.route('/api/stock/<ticker>')
 *    def get_stock_data(ticker):
 *        # Your Python logic to fetch current stock price
 *        return jsonify({
 *            'ticker': ticker.upper(),
 *            'price': 645.92,
 *            'priceChange': 3.47,
 *            'priceChangePercent': 0.54,
 *            'updatedAt': '2023-03-26T14:30:00Z'
 *        })
 *    
 *    @app.route('/api/volatility-metrics/<ticker>')
 *    def get_volatility_metrics(ticker):
 *        # Your Python logic to calculate volatility metrics
 *        # Include Monte Carlo simulations here
 *        # Include historical vs implied volatility comparison
 *        return jsonify({
 *            'stockData': {
 *                'ticker': ticker.upper(),
 *                'price': 645.92,
 *                'priceChange': 3.47,
 *                'priceChangePercent': 0.54,
 *                'updatedAt': '2023-03-26T14:30:00Z'
 *            },
 *            'impliedVolatility': [...],
 *            'historicalVolatility': [...],
 *            'monteCarloSimulation': [...],
 *            'volatilityComparison': [...]
 *        })
 *    
 *    if __name__ == '__main__':
 *        app.run(debug=True)
 * 
 * 2. Install required packages:
 *    pip install flask flask-cors numpy pandas matplotlib
 * 
 * 3. Update the API_BASE_URL constant in this file to match your Flask server URL
 */
