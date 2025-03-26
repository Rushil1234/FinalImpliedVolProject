/**
 * Flask API Connector
 * 
 * This utility provides functions to interact with the Flask backend.
 * Replace the placeholder API_BASE_URL with your actual Flask server URL when setting up.
 */

// Update this when your Flask server is running
const API_BASE_URL = 'https://your-ngrok-url.ngrok.io';

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

export interface ImpliedVolatilityTableData {
  expirationDate: string;
  strikePrice: number;
  optionType: string;
  impliedVolatility: number;
}

export interface PriceMovementData {
  expirationDate: string;
  expectedPriceMovement: number;
}

export interface SimulationData {
  date: string;
  [key: string]: string | number;
}

export interface RawVolatilityData {
  impliedVolatilityTable: ImpliedVolatilityTableData[];
  expectedPriceMovement: PriceMovementData[];
  monteCarloSimulations: SimulationData[];
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
 * Fetches raw volatility data tables from the Flask backend
 */
export const fetchRawVolatilityData = async (): Promise<RawVolatilityData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/raw-volatility-data`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching raw volatility data:', error);
    
    // Return mock data if backend is not available
    return {
      impliedVolatilityTable: [
        { expirationDate: '2025-03-28', strikePrice: 222.5, optionType: 'c', impliedVolatility: 22.51 },
        { expirationDate: '2025-06-20', strikePrice: 220.0, optionType: 'c', impliedVolatility: 28.95 },
        { expirationDate: '2025-09-19', strikePrice: 220.0, optionType: 'c', impliedVolatility: 29.70 },
        { expirationDate: '2026-03-20', strikePrice: 220.0, optionType: 'c', impliedVolatility: 30.25 }
      ],
      expectedPriceMovement: [
        { expirationDate: '2025-03-28', expectedPriceMovement: 5.84 },
        { expirationDate: '2025-06-20', expectedPriceMovement: 31.17 },
        { expirationDate: '2025-09-19', expectedPriceMovement: 45.87 },
        { expirationDate: '2026-03-20', expectedPriceMovement: 66.54 }
      ],
      monteCarloSimulations: generateMockSimulationData()
    };
  }
};

// Helper function to generate mock simulation data for testing
const generateMockSimulationData = (): SimulationData[] => {
  const simulationData: SimulationData[] = [];
  const startDate = new Date('2025-03-26');
  const startPrice = 221.81;
  
  // Create 90 days of simulation data
  for (let i = 0; i < 90; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    const dateString = currentDate.toISOString().split('T')[0];
    const row: SimulationData = { date: dateString };
    
    // Generate 6 simulations
    for (let sim = 1; sim <= 6; sim++) {
      // On day 0, all simulations start at the same price
      if (i === 0) {
        row[`Simulation ${sim}`] = startPrice;
        continue;
      }
      
      // Get yesterday's price for this simulation
      const yesterdayPrice = simulationData[i - 1][`Simulation ${sim}`] as number;
      
      // Random daily return between -3% and +3%
      const dailyReturn = (Math.random() * 0.06) - 0.03;
      row[`Simulation ${sim}`] = yesterdayPrice * (1 + dailyReturn);
    }
    
    simulationData.push(row);
  }
  
  return simulationData;
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
 *    @app.route('/api/raw-volatility-data')
 *    def get_raw_volatility_data():
 *        # Return raw data tables
 *        return jsonify({
 *            'impliedVolatilityTable': [
 *                {'expirationDate': '2025-03-28', 'strikePrice': 222.5, 'optionType': 'c', 'impliedVolatility': 22.51},
 *                # More data...
 *            ],
 *            'expectedPriceMovement': [
 *                {'expirationDate': '2025-03-28', 'expectedPriceMovement': 5.84},
 *                # More data...
 *            ],
 *            'monteCarloSimulations': [
 *                {'date': '2025-03-26', 'Simulation 1': 221.81, 'Simulation 2': 221.81, ...},
 *                # More data...
 *            ]
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
