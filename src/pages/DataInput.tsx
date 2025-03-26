
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { ArrowRight, FileUp, Save } from 'lucide-react';

const DataInput = () => {
  const navigate = useNavigate();
  const [ticker, setTicker] = useState('');
  const [impliedVolatilityData, setImpliedVolatilityData] = useState('');
  const [priceMovementData, setPriceMovementData] = useState('');
  const [monteCarloData, setMonteCarloData] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);

  const parseImpliedVolatility = (data: string) => {
    try {
      // Skip header line
      const lines = data.trim().split('\n').slice(1);
      return lines.map(line => {
        const [date, strike, type, volatility] = line.split('\t');
        return {
          date,
          strike: parseFloat(strike),
          type: type === 'c' ? 'Call' : 'Put',
          volatility: parseFloat(volatility),
          movement: 0 // Will be set in preview
        };
      });
    } catch (error) {
      console.error('Error parsing implied volatility data:', error);
      toast.error('Invalid implied volatility data format');
      return [];
    }
  };

  const parsePriceMovement = (data: string) => {
    try {
      // Skip header line
      const lines = data.trim().split('\n').slice(1);
      const movements = lines.map(line => {
        const [date, movement] = line.split('\t');
        return {
          date,
          movement: parseFloat(movement)
        };
      });
      return movements;
    } catch (error) {
      console.error('Error parsing price movement data:', error);
      toast.error('Invalid price movement data format');
      return [];
    }
  };

  const parseMonteCarloData = (data: string) => {
    try {
      const lines = data.trim().split('\n');
      const headers = lines[0].split('\t');
      
      // Create an array of objects for each timestamp
      const simulations = lines.slice(1).map(line => {
        const values = line.split('\t');
        const timestamp = values[0];
        
        // Create an object with each simulation value
        const simData: any = { timestamp };
        for (let i = 1; i < values.length; i++) {
          simData[`sim${i}`] = parseFloat(values[i]);
        }
        
        // Add additional stats
        const numericalValues = values.slice(1).map(v => parseFloat(v));
        simData.median = calculateMedian(numericalValues);
        simData.upper95 = calculatePercentile(numericalValues, 0.95);
        simData.lower05 = calculatePercentile(numericalValues, 0.05);
        
        return simData;
      });
      
      return simulations;
    } catch (error) {
      console.error('Error parsing Monte Carlo data:', error);
      toast.error('Invalid Monte Carlo data format');
      return [];
    }
  };

  const calculateMedian = (values: number[]) => {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };

  const calculatePercentile = (values: number[], percentile: number) => {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil(percentile * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
  };

  const generatePreview = () => {
    if (!ticker) {
      toast.error('Please enter a ticker symbol');
      return;
    }

    if (!impliedVolatilityData || !priceMovementData) {
      toast.error('Please enter both implied volatility and price movement data');
      return;
    }

    const ivData = parseImpliedVolatility(impliedVolatilityData);
    const priceMovements = parsePriceMovement(priceMovementData);
    
    // Match price movements with implied volatility
    const matchedIvData = ivData.map((iv, index) => {
      const movement = priceMovements[index]?.movement || 0;
      return { ...iv, movement };
    });

    const mcData = monteCarloData ? parseMonteCarloData(monteCarloData) : [];

    // Create historical volatility data (sample)
    const hvData = [
      { period: '30 Days', volatility: 33.04, movement: 73.91 },
      { period: '1 Year', volatility: 26.90, movement: 174.38 }
    ];

    // Create volatility comparison data (sample)
    const vcData = matchedIvData.map((iv, index) => {
      const date = iv.date;
      return {
        date,
        implied: iv.volatility,
        historical: index === 0 ? 33.04 : 26.90 // Sample values
      };
    });

    const previewData = {
      ticker,
      stockData: { 
        ticker,
        price: 221.81, // Sample price
        priceChange: 1.25, // Sample price change
        priceChangePercent: 0.57, // Sample percent
        updatedAt: new Date().toISOString()
      },
      impliedVolatility: matchedIvData,
      historicalVolatility: hvData,
      monteCarloSimulation: mcData,
      volatilityComparison: vcData
    };
    
    setPreviewData(previewData);
    toast.success('Preview generated');
  };

  const saveAndView = () => {
    if (!previewData) {
      toast.error('Please generate a preview first');
      return;
    }

    // In a real app, this would save to the backend
    // For now we'll just store in sessionStorage
    sessionStorage.setItem('volatilityData', JSON.stringify(previewData));
    toast.success('Data saved');
    navigate(`/details?ticker=${ticker}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-primary">Volatility Data Input</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-1"
            >
              <ArrowRight className="h-4 w-4" />
              Go to Search
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Ticker Information</CardTitle>
              <CardDescription>Enter the stock ticker symbol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="ticker" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Ticker Symbol</label>
                  <input
                    id="ticker"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    placeholder="e.g. AAPL"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Implied Volatility Data</CardTitle>
              <CardDescription>
                Paste implied volatility data in format: Expiration Date ⇥ Strike Price ⇥ Option Type ⇥ Implied Volatility (%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Expiration Date	Strike Price	Option Type	Implied Volatility (%)
2025-03-28	222.5	c	22.505937546539528
2025-06-20	220.0	c	28.94845433683013
..."
                className="min-h-[150px] font-mono text-xs"
                value={impliedVolatilityData}
                onChange={(e) => setImpliedVolatilityData(e.target.value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Expected Price Movement Data</CardTitle>
              <CardDescription>
                Paste expected price movement data in format: Expiration Date ⇥ Expected Price Movement ($)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Expiration Date	Expected Price Movement ($)
2025-03-28	5.8427432337372025
2025-06-20	31.168025846404664
..."
                className="min-h-[100px] font-mono text-xs"
                value={priceMovementData}
                onChange={(e) => setPriceMovementData(e.target.value)}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monte Carlo Simulation Data (Optional)</CardTitle>
              <CardDescription>
                Paste Monte Carlo simulation data as a tab-separated table
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Date	Simulation 1	Simulation 2	Simulation 3	Simulation 4	Simulation 5	Simulation 6
2025-03-26	221.810000	221.810000	221.810000	221.810000	221.810000	221.810000
..."
                className="min-h-[100px] font-mono text-xs"
                value={monteCarloData}
                onChange={(e) => setMonteCarloData(e.target.value)}
              />
            </CardContent>
          </Card>
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4">
              <Button 
                onClick={generatePreview}
                className="flex items-center gap-2"
              >
                <FileUp className="h-4 w-4" />
                Generate Preview
              </Button>
              
              <Button 
                onClick={saveAndView}
                disabled={!previewData}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save & View Results
              </Button>
            </div>
          </div>
          
          {previewData && (
            <Card>
              <CardHeader>
                <CardTitle>Data Preview</CardTitle>
                <CardDescription>
                  Preview of the implied volatility data that will be displayed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Expiration Date</TableHead>
                        <TableHead>Strike</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Implied Volatility</TableHead>
                        <TableHead className="text-right">Expected Movement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.impliedVolatility.map((row: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>${row.strike.toFixed(1)}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>{parseFloat(row.volatility).toFixed(2)}%</TableCell>
                          <TableCell className="text-right">±${row.movement.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataInput;
