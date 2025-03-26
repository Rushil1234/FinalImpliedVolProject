
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VolatilityMetrics from '@/components/VolatilityMetrics';
import { fetchVolatilityMetrics } from '@/utils/flaskConnector';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    // Attempt to connect to the Flask backend
    const checkBackendConnection = async () => {
      try {
        await fetchVolatilityMetrics();
        setConnectionStatus('connected');
      } catch (error) {
        console.log('Flask backend not available yet:', error);
        setConnectionStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };

    // Simulate initial loading
    const loadingTimer = setTimeout(() => {
      checkBackendConnection();
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse space-y-4 w-full max-w-md">
              <div className="h-8 bg-secondary rounded-md w-3/4 mx-auto"></div>
              <div className="h-64 bg-secondary rounded-lg w-full"></div>
              <div className="flex space-x-4">
                <div className="h-12 bg-secondary rounded-md w-1/2"></div>
                <div className="h-12 bg-secondary rounded-md w-1/2"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 max-w-7xl mx-auto">
            {connectionStatus === 'disconnected' && (
              <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 animate-fade-in">
                <h3 className="text-lg font-medium mb-2">Waiting for Flask Backend</h3>
                <p className="text-muted-foreground">
                  The Flask backend is not yet connected. Currently displaying sample data. 
                  Connect your Python Flask backend to see real data.
                </p>
                <div className="mt-4 text-sm">
                  <p className="font-mono bg-secondary/50 p-3 rounded-md overflow-x-auto">
                    Check src/utils/flaskConnector.ts for connection instructions
                  </p>
                </div>
              </div>
            )}
            
            <VolatilityMetrics />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
