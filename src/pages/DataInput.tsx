
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Table as TableIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { fetchRawVolatilityData } from '@/utils/flaskConnector';

// Define types for the data
interface ImpliedVolatilityTableData {
  expirationDate: string;
  strikePrice: number;
  optionType: string;
  impliedVolatility: number;
}

interface PriceMovementData {
  expirationDate: string;
  expectedPriceMovement: number;
}

interface SimulationData {
  date: string;
  [key: string]: string | number;
}

const DataInput = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [impliedVolData, setImpliedVolData] = useState<ImpliedVolatilityTableData[]>([]);
  const [priceMovementData, setPriceMovementData] = useState<PriceMovementData[]>([]);
  const [simulationData, setSimulationData] = useState<SimulationData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchRawVolatilityData();
        
        // Set the data to state
        setImpliedVolData(data.impliedVolatilityTable);
        setPriceMovementData(data.expectedPriceMovement);
        setSimulationData(data.monteCarloSimulations);
        
        toast.success("Raw volatility data loaded successfully");
      } catch (error) {
        console.error('Error fetching raw data:', error);
        toast.error("Failed to load raw volatility data");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const goBack = () => {
    navigate('/');
  };

  const saveDataAndViewDetails = () => {
    // Save the current data to sessionStorage for display on the details page
    const combinedData = {
      ticker: 'CUSTOM',
      stockData: {
        ticker: 'CUSTOM',
        price: 221.81,
        priceChange: 3.25,
        priceChangePercent: 1.49,
        updatedAt: new Date().toISOString()
      },
      impliedVolatility: impliedVolData.map(item => ({
        date: item.expirationDate,
        strike: item.strikePrice,
        type: item.optionType === 'c' ? 'Call' : 'Put',
        volatility: item.impliedVolatility,
        movement: priceMovementData.find(p => p.expirationDate === item.expirationDate)?.expectedPriceMovement || 0,
        label: getExpirationLabel(item.expirationDate)
      })),
      historicalVolatility: [
        { period: '30-Day', volatility: 30.5, movement: 67.65 },
        { period: '1-Year', volatility: 26.2, movement: 168.93 },
      ],
      monteCarloSimulation: transformSimulationData(simulationData),
      volatilityComparison: [
        { date: 'Last Month', implied: 27.5, historical: 30.2 },
        { date: '2 Months Ago', implied: 25.8, historical: 28.7 },
        { date: '3 Months Ago', implied: 26.2, historical: 27.3 },
        { date: '4 Months Ago', implied: 24.1, historical: 25.8 },
        { date: '5 Months Ago', implied: 22.9, historical: 24.2 },
        { date: '6 Months Ago', implied: 23.5, historical: 22.1 },
      ]
    };
    
    sessionStorage.setItem('volatilityData', JSON.stringify(combinedData));
    toast.success("Data saved to session");
    navigate('/details?ticker=CUSTOM');
  };
  
  // Helper function to transform simulation data into format needed for charts
  const transformSimulationData = (data: SimulationData[]) => {
    if (!data.length) return [];
    
    const result = [];
    const totalSimulations = Object.keys(data[0]).filter(key => key.startsWith('Simulation')).length;
    
    // Take sample points to avoid overcrowding (e.g., every 7 days)
    const sampledDates = data.filter((_, index) => index % 7 === 0 || index === 0 || index === data.length - 1);
    
    for (const entry of sampledDates) {
      const simValues = [];
      for (let i = 1; i <= totalSimulations; i++) {
        const val = entry[`Simulation ${i}`];
        if (val !== undefined) {
          simValues.push(Number(val));
        }
      }
      
      // Calculate median and percentiles
      const sortedValues = [...simValues].sort((a, b) => a - b);
      const median = sortedValues[Math.floor(sortedValues.length / 2)];
      const lower05 = sortedValues[Math.floor(sortedValues.length * 0.05)];
      const upper95 = sortedValues[Math.floor(sortedValues.length * 0.95)];
      
      result.push({
        timestamp: formatSimulationDate(entry.date),
        median,
        lower05,
        upper95,
        values: simValues
      });
    }
    
    return result;
  };
  
  // Helper function to format simulation dates
  const formatSimulationDate = (dateString: string | number) => {
    if (typeof dateString === 'number') return String(dateString);
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return String(dateString);
      
      const today = new Date();
      const diffTime = Math.abs(date.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7) return `${diffDays} days`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
      return `${Math.floor(diffDays / 365)} years`;
    } catch {
      return String(dateString);
    }
  };
  
  // Helper function to get expiration label
  const getExpirationLabel = (dateString: string) => {
    try {
      const expirationDate = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(expirationDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 30) return 'Nearest';
      if (diffDays <= 90) return '~3 Months';
      if (diffDays <= 180) return '~6 Months';
      return '~1 Year';
    } catch {
      return 'Unknown';
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
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
            variant="default" 
            size="sm"
            onClick={saveDataAndViewDetails}
            className="flex items-center gap-1"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            View Volatility Metrics
          </Button>
        </div>
        
        {loading ? (
          <div className="w-full space-y-8 animate-pulse">
            <div className="h-8 w-3/4 bg-secondary rounded-md"></div>
            <div className="h-60 w-full bg-secondary rounded-lg"></div>
            <div className="h-60 w-full bg-secondary rounded-lg"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Implied Volatility Data</CardTitle>
                <CardDescription>
                  Option implied volatility metrics for different expirations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Expiration Date</TableHead>
                        <TableHead>Strike Price</TableHead>
                        <TableHead>Option Type</TableHead>
                        <TableHead>Implied Volatility (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {impliedVolData.map((row, i) => (
                        <TableRow key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                          <TableCell>{row.expirationDate}</TableCell>
                          <TableCell>${row.strikePrice.toFixed(1)}</TableCell>
                          <TableCell>{row.optionType === 'c' ? 'Call' : 'Put'}</TableCell>
                          <TableCell>{row.impliedVolatility.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expected Price Movement</CardTitle>
                <CardDescription>
                  Expected stock price movement by expiration date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Expiration Date</TableHead>
                        <TableHead>Expected Price Movement ($)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {priceMovementData.map((row, i) => (
                        <TableRow key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                          <TableCell>{row.expirationDate}</TableCell>
                          <TableCell>±${row.expectedPriceMovement.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Simulations</CardTitle>
                <CardDescription>
                  Simulated price trajectories over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        {Object.keys(simulationData[0] || {})
                          .filter(key => key !== 'date')
                          .map((sim, i) => (
                            <TableHead key={i}>{sim}</TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {simulationData.slice(0, 20).map((row, i) => (
                        <TableRow key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                          <TableCell>{row.date}</TableCell>
                          {Object.keys(row)
                            .filter(key => key !== 'date')
                            .map((sim, j) => (
                              <TableCell key={j}>
                                {typeof row[sim] === 'number' 
                                  ? (row[sim] as number).toFixed(2) 
                                  : row[sim]}
                              </TableCell>
                            ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Showing first 20 rows of simulation data. Use "View Volatility Metrics" button to see visualizations.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default DataInput;
