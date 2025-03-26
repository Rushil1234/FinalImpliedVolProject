
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { fetchVolatilityMetrics, VolatilityMetricsData } from '@/utils/flaskConnector';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

const Details = () => {
  const [searchParams] = useSearchParams();
  const ticker = searchParams.get('ticker') || 'PH';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VolatilityMetricsData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const metricsData = await fetchVolatilityMetrics(ticker);
        setData(metricsData);
      } catch (error) {
        console.error('Error loading volatility data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ticker]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse space-y-8 w-full max-w-6xl">
              <div className="h-24 bg-secondary rounded-md w-3/4 mx-auto"></div>
              <div className="h-64 bg-secondary rounded-lg w-full"></div>
              <div className="h-64 bg-secondary rounded-lg w-full"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-52 bg-secondary rounded-lg"></div>
                <div className="h-52 bg-secondary rounded-lg"></div>
              </div>
              <div className="h-80 bg-secondary rounded-lg w-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-primary">No Data Available</h2>
            <p className="mt-2 text-muted-foreground">
              We couldn't load the data for {ticker}. Please try another ticker.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stock Overview */}
          <Card className="overflow-hidden border-primary/10">
            <CardHeader className="bg-primary text-primary-foreground">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-3xl font-bold">{ticker}</CardTitle>
                  <CardDescription className="text-primary-foreground/80">
                    Volatility Analysis Dashboard
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">${data.stockData.price.toFixed(2)}</div>
                  <div className={`flex items-center justify-end ${data.stockData.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {data.stockData.priceChange >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span>${Math.abs(data.stockData.priceChange).toFixed(2)} ({data.stockData.priceChangePercent.toFixed(2)}%)</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Monte Carlo Simulation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-accent" />
                Monte Carlo Price Predictions
              </CardTitle>
              <CardDescription>
                Simulated future price movement with 90% confidence interval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.monteCarloSimulation}
                    margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
                  >
                    <defs>
                      <linearGradient id="colorUpper" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003366" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#003366" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="colorLower" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#055B49" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#055B49" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `$${value}`} 
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`$${value.toFixed(2)}`, '']} 
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        fontSize: 12
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="upper95" 
                      stroke="#003366" 
                      fillOpacity={1} 
                      fill="url(#colorUpper)" 
                      strokeWidth={1}
                      name="95th Percentile"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="median" 
                      stroke="#BDD7EE" 
                      strokeWidth={2}
                      dot={{ r: 5, fill: "#BDD7EE", strokeWidth: 1, stroke: "#003366" }}
                      name="Median Prediction"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="lower05" 
                      stroke="#055B49" 
                      fillOpacity={1} 
                      fill="url(#colorLower)" 
                      strokeWidth={1}
                      name="5th Percentile"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Historical vs Implied Volatility */}
          <Card>
            <CardHeader>
              <CardTitle>Historical vs Implied Volatility</CardTitle>
              <CardDescription>
                Comparison of historical realized volatility and market-implied volatility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.volatilityComparison}
                    margin={{ top: 10, right: 30, left: 30, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`} 
                      domain={[0, 'auto']}
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}%`, '']} 
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        fontSize: 12
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="implied" 
                      stroke="#003366" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                      name="Implied Volatility"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="historical" 
                      stroke="#055B49" 
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#fff", strokeWidth: 2 }}
                      name="Historical Volatility"
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Volatility Metrics Tables */}
          <div className="grid grid-cols-1 gap-8">
            {/* Implied Volatility Table */}
            <Card>
              <CardHeader>
                <CardTitle>Implied Volatility Metrics for {ticker}</CardTitle>
                <CardDescription>
                  Market-implied volatility calculated from option prices at different expirations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-primary">
                      <TableRow>
                        <TableHead className="text-primary-foreground">Expiration Date</TableHead>
                        <TableHead className="text-primary-foreground">Strike</TableHead>
                        <TableHead className="text-primary-foreground">Type</TableHead>
                        <TableHead className="text-primary-foreground">Implied Volatility</TableHead>
                        <TableHead className="text-primary-foreground">Expected Movement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.impliedVolatility.map((item, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell>${item.strike.toFixed(1)}</TableCell>
                          <TableCell>{item.type}</TableCell>
                          <TableCell>{item.volatility.toFixed(2)}%</TableCell>
                          <TableCell>±${item.movement.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Historical Volatility Table */}
            <Card>
              <CardHeader>
                <CardTitle>Historical Volatility Metrics</CardTitle>
                <CardDescription>
                  Realized volatility calculated from historical price movements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-primary">
                      <TableRow>
                        <TableHead className="text-primary-foreground">Period</TableHead>
                        <TableHead className="text-primary-foreground">Historical Volatility</TableHead>
                        <TableHead className="text-primary-foreground">Avg. Movement</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.historicalVolatility.map((item, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? 'table-row-even' : 'table-row-odd'}>
                          <TableCell>{item.period}</TableCell>
                          <TableCell>{item.volatility.toFixed(2)}%</TableCell>
                          <TableCell>±${item.movement.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Details;
