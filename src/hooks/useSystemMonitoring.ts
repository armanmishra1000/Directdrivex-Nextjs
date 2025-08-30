"use client";

import { useState, useCallback, useEffect } from 'react';
import { systemMonitoringService } from '@/services/admin/systemMonitoringService';
import type {
  SystemHealthResponse,
  ApiMetricsResponse,
  DatabasePerformanceResponse,
  SystemAlertsResponse
} from '@/services/admin/systemMonitoringService';

interface UseSystemMonitoringReturn {
  // Data states
  systemHealth: SystemHealthResponse | null;
  apiMetrics: ApiMetricsResponse | null;
  databasePerformance: DatabasePerformanceResponse | null;
  systemAlerts: SystemAlertsResponse | null;
  
  // Loading states
  loading: {
    health: boolean;
    api: boolean;
    database: boolean;
    alerts: boolean;
  };
  
  // Error states
  error: {
    health: string | null;
    api: string | null;
    database: string | null;
    alerts: string | null;
  };
  
  // Auto-refresh state
  autoRefresh: boolean;
  
  // Actions
  loadSystemHealth: () => Promise<void>;
  loadApiMetrics: (hours?: number) => Promise<void>;
  loadDatabasePerformance: () => Promise<void>;
  loadSystemAlerts: () => Promise<void>;
  loadAllMetrics: () => Promise<void>;
  toggleAutoRefresh: () => void;
  refreshAll: () => void;
}

export function useSystemMonitoring(): UseSystemMonitoringReturn {
  // Data states
  const [systemHealth, setSystemHealth] = useState<SystemHealthResponse | null>(null);
  const [apiMetrics, setApiMetrics] = useState<ApiMetricsResponse | null>(null);
  const [databasePerformance, setDatabasePerformance] = useState<DatabasePerformanceResponse | null>(null);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlertsResponse | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    health: false,
    api: false,
    database: false,
    alerts: false
  });
  
  // Error states
  const [error, setError] = useState({
    health: null as string | null,
    api: null as string | null,
    database: null as string | null,
    alerts: null as string | null
  });
  
  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const setLoadingState = useCallback((key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  const setErrorState = useCallback((key: keyof typeof error, value: string | null) => {
    setError(prev => ({ ...prev, [key]: value }));
  }, []);

  const loadSystemHealth = useCallback(async () => {
    setLoadingState('health', true);
    setErrorState('health', null);
    
    try {
      const data = await systemMonitoringService.getSystemHealth();
      setSystemHealth(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load system health';
      setErrorState('health', errorMessage);
      console.error('Failed to load system health:', err);
    } finally {
      setLoadingState('health', false);
    }
  }, [setLoadingState, setErrorState]);

  const loadApiMetrics = useCallback(async (hours: number = 24) => {
    setLoadingState('api', true);
    setErrorState('api', null);
    
    try {
      const data = await systemMonitoringService.getApiMetrics(hours);
      setApiMetrics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load API metrics';
      setErrorState('api', errorMessage);
      console.error('Failed to load API metrics:', err);
    } finally {
      setLoadingState('api', false);
    }
  }, [setLoadingState, setErrorState]);

  const loadDatabasePerformance = useCallback(async () => {
    setLoadingState('database', true);
    setErrorState('database', null);
    
    try {
      const data = await systemMonitoringService.getDatabasePerformance();
      setDatabasePerformance(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load database performance';
      setErrorState('database', errorMessage);
      console.error('Failed to load database performance:', err);
    } finally {
      setLoadingState('database', false);
    }
  }, [setLoadingState, setErrorState]);

  const loadSystemAlerts = useCallback(async () => {
    setLoadingState('alerts', true);
    setErrorState('alerts', null);
    
    try {
      const data = await systemMonitoringService.getSystemAlerts();
      setSystemAlerts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load system alerts';
      setErrorState('alerts', errorMessage);
      console.error('Failed to load system alerts:', err);
    } finally {
      setLoadingState('alerts', false);
    }
  }, [setLoadingState, setErrorState]);

  const loadAllMetrics = useCallback(async () => {
    // Load all metrics in parallel for better performance
    await Promise.all([
      loadSystemHealth(),
      loadApiMetrics(),
      loadDatabasePerformance(),
      loadSystemAlerts()
    ]);
    
    // Update last refresh timestamp
    setLastRefresh(new Date());
  }, [loadSystemHealth, loadApiMetrics, loadDatabasePerformance, loadSystemAlerts]);

  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(prev => !prev);
  }, []);

  const refreshAll = useCallback(() => {
    // Only refresh if we're not already loading
    const isCurrentlyLoading = Object.values(loading).some(Boolean);
    if (!isCurrentlyLoading) {
      loadAllMetrics();
    }
  }, [loadAllMetrics, loading]);

  // Auto-refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        const isCurrentlyLoading = Object.values(loading).some(Boolean);
        if (!isCurrentlyLoading) {
          loadAllMetrics();
        }
      }, 30000); // 30 seconds
      
      // Log when auto-refresh is enabled
      console.log('System monitoring auto-refresh enabled (30s interval)');
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
        console.log('System monitoring auto-refresh disabled');
      }
    };
  }, [autoRefresh, loadAllMetrics, loading]);

  // Initial load
  useEffect(() => {
    console.log('System monitoring: Initial data load');
    loadAllMetrics();
    
    // Cleanup function
    return () => {
      console.log('System monitoring hook unmounted, cleaning up resources');
      // Make sure any pending requests are properly handled
      setLoading({
        health: false,
        api: false,
        database: false,
        alerts: false
      });
    };
  }, [loadAllMetrics]);

  return {
    systemHealth,
    apiMetrics,
    databasePerformance,
    systemAlerts,
    loading,
    error,
    autoRefresh,
    loadSystemHealth,
    loadApiMetrics,
    loadDatabasePerformance,
    loadSystemAlerts,
    loadAllMetrics,
    toggleAutoRefresh,
    refreshAll
  };
}
