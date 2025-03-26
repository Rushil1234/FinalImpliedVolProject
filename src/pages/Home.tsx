
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Search, TrendingUp, LineChart, BarChart3, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const [ticker, setTicker] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const popularTickers = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      setIsLoading(true);
      toast.info(`Fetching data for ${ticker.toUpperCase()}...`);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/details?ticker=${ticker.toUpperCase()}`);
      }, 1000);
    } else {
      toast.error("Please enter a valid ticker symbol");
    }
  };

  const selectPopularTicker = (selectedTicker: string) => {
    setTicker(selectedTicker);
    toast.info(`Selected ${selectedTicker}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Volatility Metrics Analysis
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track implied and historical volatility metrics for any publicly traded company
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-lg border-secondary mb-12">
              <CardHeader className="text-center bg-secondary/20 rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-primary">Volatility Metrics</CardTitle>
                <CardDescription>
                  Enter a stock ticker to view detailed implied and historical volatility metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="ticker" className="text-sm font-medium">
                      Stock Ticker
                    </label>
                    <div className="relative">
                      <Input
                        id="ticker"
                        placeholder="e.g. AAPL, MSFT, GOOGL"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        className="pl-10"
                        autoComplete="off"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularTickers.map((t) => (
                      <Button
                        key={t}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => selectPopularTicker(t)}
                        className="transition-all hover:bg-secondary hover:text-secondary-foreground"
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-accent hover:bg-accent/90"
                    disabled={!ticker.trim() || isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                        Loading...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        View Metrics
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Implied Volatility</h3>
                  <p className="text-muted-foreground">
                    View expected future volatility derived from options pricing across different expirations
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-secondary/30 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Monte Carlo Simulation</h3>
                  <p className="text-muted-foreground">
                    View price prediction models with statistical distribution of possible outcomes
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Historical Analysis</h3>
                  <p className="text-muted-foreground">
                    Compare historical volatility metrics with market-implied expectations
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
