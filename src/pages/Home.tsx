
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, FileUp, TrendingUp, Table } from 'lucide-react';

const Home = () => {
  const [ticker, setTicker] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const popularTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA'];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticker.trim()) {
      setError('Please enter a ticker symbol');
      return;
    }
    
    navigate(`/details?ticker=${ticker.toUpperCase()}`);
  };
  
  const handlePopularTicker = (symbol: string) => {
    navigate(`/details?ticker=${symbol}`);
  };
  
  const goToDataInput = () => {
    navigate('/data-input');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#003366] to-[#055b49]">
            Implied & Historical Volatility Metrics
          </h1>
          <p className="text-xl text-muted-foreground">
            Analyze volatility metrics for any stock to make informed investment decisions
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md mb-8"
        >
          <Card className="border-2 border-primary/10 shadow-lg">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => {
                        setTicker(e.target.value.toUpperCase());
                        setError('');
                      }}
                      placeholder="Enter stock ticker symbol (e.g., AAPL)"
                      className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg bg-[#003366] hover:bg-[#003366]/80"
                  size="lg"
                >
                  <TrendingUp className="mr-2 h-5 w-5" /> 
                  Get Volatility Metrics
                </Button>
              </form>
              
              <div className="mt-8">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={goToDataInput}
                >
                  <Table className="mr-2 h-4 w-4" />
                  View Data Tables
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-xl"
        >
          <h2 className="text-xl font-medium mb-4 text-center">Popular Tickers</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {popularTickers.map((symbol) => (
              <Button
                key={symbol}
                variant="secondary"
                onClick={() => handlePopularTicker(symbol)}
                className="px-5 py-2 hover:bg-[#bdd7ee] hover:text-[#003366]"
              >
                {symbol}
              </Button>
            ))}
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
