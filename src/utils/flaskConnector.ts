
/**
 * Flask API Connector
 * 
 * This utility provides functions to interact with the Flask backend.
 * Replace the placeholder API_BASE_URL with your actual Flask server URL when setting up.
 */

// Update this when your Flask server is running
const API_BASE_URL = 'http://localhost:5000';

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

export interface VolatilityMetricsData {
  impliedVolatility: ImpliedVolatilityData[];
  historicalVolatility: HistoricalVolatilityData[];
}

/**
 * Fetches volatility metrics data from the Flask backend
 */
export const fetchVolatilityMetrics = async (): Promise<VolatilityMetricsData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/volatility-metrics`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching volatility metrics:', error);
    
    // Return mock data if backend is not available
    // This should be removed when your Flask backend is connected
    return {
      impliedVolatility: [
        { date: '2025-04-17', strike: 650.0, type: 'c', volatility: 28.26, movement: 44.97, label: 'Nearest' },
        { date: '2025-08-15', strike: 650.0, type: 'c', volatility: 23.82, movement: 96.31, label: '~3 Months' },
        { date: '2025-12-19', strike: 650.0, type: 'c', volatility: 19.60, movement: 108.86, label: '~6 Months' },
        { date: '2025-12-19', strike: 650.0, type: 'c', volatility: 19.60, movement: 108.86, label: '~1 Year' },
      ],
      historicalVolatility: [
        { period: '30-Day', volatility: 33.04, movement: 73.91 },
        { period: '1-Year', volatility: 26.90, movement: 174.38 },
      ]
    };
  }
};

/**
 * To connect this frontend to your Flask backend:
 * 
 * 1. Set up a Flask server with CORS enabled:
 *    
 *    from flask import Flask, jsonify
 *    from flask_cors import CORS
 *    
 *    app = Flask(__name__)
 *    CORS(app)
 *    
 *    @app.route('/api/volatility-metrics')
 *    def get_volatility_metrics():
 *        # Your Python logic to generate the data
 *        return jsonify({
 *            'impliedVolatility': [...],
 *            'historicalVolatility': [...]
 *        })
 *    
 *    if __name__ == '__main__':
 *        app.run(debug=True)
 * 
 * 2. Install required packages:
 *    pip install flask flask-cors
 * 
 * 3. Update the API_BASE_URL constant in this file to match your Flask server URL
 */
