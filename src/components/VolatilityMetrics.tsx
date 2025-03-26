
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, ComposedChart, Area
} from 'recharts';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
} from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ImpliedVolatilityData, 
  HistoricalVolatilityData, 
  MonteCarloData,
  VolatilityComparisonData
} from '@/utils/flaskConnector';

interface VolatilityMetricsProps {
  className?: string;
  impliedVolatilityData: ImpliedVolatilityData[];
  historicalVolatilityData: HistoricalVolatilityData[];
  monteCarloData: MonteCarloData[];
  volatilityComparisonData: VolatilityComparisonData[];
  stockPrice: number;
  isLoading: boolean;
}

const VolatilityMetrics: React.FC<VolatilityMetricsProps> = ({ 
  className, 
  impliedVolatilityData, 
  historicalVolatilityData,
  monteCarloData,
  volatilityComparisonData,
  stockPrice,
  isLoading
}) => {
  const loadingAnimation = (
    <div className="w-full h-full flex flex-col gap-4 animate-pulse">
      <div className="h-8 w-3/4 bg-secondary rounded-md"></div>
      <div className="h-60 w-full bg-secondary rounded-lg"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="h-40 bg-secondary rounded-lg"></div>
        <div className="h-40 bg-secondary rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className={cn("w-full space-y-8", className)}>
      {isLoading ? (
        loadingAnimation
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-semibold mb-1 animate-fade-in">Implied & Historical Volatility Metrics</h2>
            <p className="text-muted-foreground animate-fade-in">Options analytics data from different time horizons</p>
          </div>
          
          {/* Implied Volatility Bar Chart */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Implied Volatility</CardTitle>
              <CardDescription>
                Volatility calculated from option prices, representing expected future volatility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={impliedVolatilityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="label" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tickFormatter={(value) => `${value}%`} 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value}%`, 'IV']} 
                      labelFormatter={(label) => `${label} Expiration`}
                      contentStyle={{ 
                        borderRadius: 8, 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        fontSize: 12
                      }}
                    />
                    <Bar 
                      dataKey="volatility" 
                      fill="rgba(0, 51, 102, 0.8)" 
                      radius={[4, 4, 0, 0]} 
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {impliedVolatilityData.map((item, index) => (
                  <div key={index} className="space-y-2 p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.label}</p>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="metric-value text-primary">{item.volatility}%</p>
                    <p className="text-sm text-muted-foreground">
                      Expected ±${item.movement}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Monte Carlo Simulation Chart */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Monte Carlo Price Predictions</CardTitle>
              <CardDescription>
                Simulated price trajectories over time based on volatility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={monteCarloData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="timestamp" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="upper95"
                      stroke="none"
                      fill="rgba(189, 215, 238, 0.6)"
                      name="95% Confidence"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower05"
                      stroke="none"
                      fill="transparent"
                      name="5% Confidence"
                    />
                    <Line
                      type="monotone"
                      dataKey="median"
                      stroke="rgba(5, 91, 73, 1)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Median Price"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Historical vs Implied Volatility Chart */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Historical vs Implied Volatility</CardTitle>
              <CardDescription>
                Comparison of past realized volatility against market expectations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={volatilityComparisonData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="implied"
                      stroke="rgba(0, 51, 102, 1)"
                      strokeWidth={2}
                      name="Implied Vol"
                    />
                    <Line
                      type="monotone"
                      dataKey="historical"
                      stroke="rgba(5, 91, 73, 1)"
                      strokeWidth={2}
                      name="Historical Vol"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Historical Volatility Bar Chart */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Historical Volatility</CardTitle>
              <CardDescription>
                Realized volatility calculated from past price data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={historicalVolatilityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="period" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value: number) => [`${value}%`, 'HV']} />
                    <Bar
                      dataKey="volatility"
                      fill="rgba(5, 91, 73, 0.8)"
                      radius={[4, 4, 0, 0]}
                      name="Historical Vol"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {historicalVolatilityData.map((item, index) => (
                  <div key={index} className="space-y-2 p-4 rounded-lg bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{item.period} Historical Vol</p>
                      <p className="metric-value text-primary">{item.volatility}%</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Average stock movement: <span className="font-semibold">±${item.movement}</span>
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Metrics Tables */}
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Volatility Metrics Tables</CardTitle>
              <CardDescription>Detailed metrics for analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Implied Volatility Metrics</h3>
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
                        {impliedVolatilityData.map((row, i) => (
                          <TableRow key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>${row.strike.toFixed(1)}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.volatility}%</TableCell>
                            <TableCell className="text-right">±${row.movement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Historical Volatility Metrics</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[180px]">Period</TableHead>
                          <TableHead>Historical Volatility</TableHead>
                          <TableHead className="text-right">Avg. Movement</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {historicalVolatilityData.map((row, i) => (
                          <TableRow key={i} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                            <TableCell>{row.period}</TableCell>
                            <TableCell>{row.volatility}%</TableCell>
                            <TableCell className="text-right">±${row.movement}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default VolatilityMetrics;
