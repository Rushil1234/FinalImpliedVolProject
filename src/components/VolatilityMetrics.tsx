
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface VolatilityMetricsProps {
  className?: string;
}

const VolatilityMetrics: React.FC<VolatilityMetricsProps> = ({ className }) => {
  const [loading, setLoading] = useState(true);
  
  // Mock data - to be replaced with data from Flask backend
  const impliedVolatilityData = [
    { name: '2025-04-17', value: 28.26, movement: 44.97, label: 'Nearest' },
    { name: '2025-08-15', value: 23.82, movement: 96.31, label: '~3 Months' },
    { name: '2025-12-19', value: 19.60, movement: 108.86, label: '~6 Months' },
    { name: '2025-12-19', value: 19.60, movement: 108.86, label: '~1 Year' },
  ];
  
  const historicalVolatilityData = [
    { period: '30-Day', value: 33.04, movement: 73.91 },
    { period: '1-Year', value: 26.90, movement: 174.38 },
  ];

  useEffect(() => {
    // Simulate loading data from backend
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

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
      {loading ? (
        loadingAnimation
      ) : (
        <>
          <div>
            <h2 className="text-2xl font-semibold mb-1 animate-fade-in">Implied & Historical Volatility Metrics</h2>
            <p className="text-muted-foreground animate-fade-in">Options analytics data from different time horizons</p>
          </div>
          
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
                      dataKey="value" 
                      fill="rgba(59, 130, 246, 0.8)" 
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
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                    <p className="metric-value text-primary">{item.value}%</p>
                    <p className="text-sm text-muted-foreground">
                      Expected ±${item.movement}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {historicalVolatilityData.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{item.period} Historical Volatility</span>
                    <span className="metric-value text-primary">{item.value}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Average stock movement:
                    </p>
                    <p className="text-xl font-semibold">±${item.movement}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VolatilityMetrics;
