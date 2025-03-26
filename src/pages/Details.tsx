
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VolatilityMetrics from '@/components/VolatilityMetrics';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';
import { fetchVolatilityMetrics, fetchStockData } from '@/utils/flaskConnector';

const Details = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ticker = searchParams.get('ticker') || 'AAPL';
  
  const [loading, setLoading] = useState(true);
  const [stockData, setStockData] = useState({ 
    ticker: ticker,
    price: 0,
    priceChange: 0,
    priceChangePercent: 0,
    updatedAt: ''
  });
  
  const [metrics, setMetrics] = useState({
    impliedVolatility: [],
    historicalVolatility: [],
    monteCarloSimulation: [],
    volatilityComparison: []
  });
  
  useEffect(() => {
    loadData();
  }, [ticker]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const metricsData = await fetchVolatilityMetrics(ticker);
      setStockData(metricsData.stockData);
      setMetrics({
        impliedVolatility: metricsData.impliedVolatility,
        historicalVolatility: metricsData.historicalVolatility,
        monteCarloSimulation: metricsData.monteCarloSimulation,
        volatilityComparison: metricsData.volatilityComparison
      });
      
      // Show toast when data is loaded
      toast.success(`${ticker} data loaded successfully`);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(`Failed to load data for ${ticker}`);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshData = () => {
    loadData();
  };
  
  const goBack = () => {
    navigate('/');
  };
  
  const getPriceChangeColor = () => {
    if (stockData.priceChange > 0) return 'text-green-600';
    if (stockData.priceChange < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };
  
  const getPriceChangeIcon = () => {
    if (stockData.priceChange > 0) return <ChevronUp className="h-5 w-5" />;
    if (stockData.priceChange < 0) return <ChevronDown className="h-5 w-5" />;
    return null;
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goBack}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshData}
              className="flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          
          <Card className="bg-primary/5 w-full md:w-auto">
            <CardContent className="p-4 flex items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-bold text-primary">{ticker}</h2>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(stockData.updatedAt).toLocaleString()}
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-mono font-semibold">${stockData.price.toFixed(2)}</p>
                <div className={`flex items-center justify-end ${getPriceChangeColor()}`}>
                  {getPriceChangeIcon()}
                  <span className="font-medium">
                    {stockData.priceChange > 0 ? '+' : ''}{stockData.priceChange.toFixed(2)} ({stockData.priceChange > 0 ? '+' : ''}{stockData.priceChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <VolatilityMetrics 
          impliedVolatilityData={metrics.impliedVolatility}
          historicalVolatilityData={metrics.historicalVolatility}
          monteCarloData={metrics.monteCarloSimulation}
          volatilityComparisonData={metrics.volatilityComparison}
          stockPrice={stockData.price}
          isLoading={loading}
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Details;
