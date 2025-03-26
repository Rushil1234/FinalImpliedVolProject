
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, Search } from 'lucide-react';

const Home = () => {
  const [ticker, setTicker] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        navigate(`/details?ticker=${ticker.toUpperCase()}`);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border-secondary">
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
