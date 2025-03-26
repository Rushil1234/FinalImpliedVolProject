/**
 * Flask API Connector
 * 
 * This utility provides functions to interact with the Flask backend.
 * Replace the placeholder API_BASE_URL with your actual Flask server URL when setting up.
 */

// Update this when your Flask server is running
const API_BASE_URL = 'http://127.0.0.1:5000';

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
  values?: number[];
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
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching stock data for ${ticker}:`, error);
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
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching volatility metrics for ${ticker}:`, error);
    const stockData = await fetchStockData(ticker);
    return {
      stockData,
      impliedVolatility: [],
      historicalVolatility: [],
      monteCarloSimulation: [],
      volatilityComparison: [],
    };
  }
};

