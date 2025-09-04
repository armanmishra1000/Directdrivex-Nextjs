"use client";

import { useState, useCallback, useEffect } from 'react';
import { analyticsService } from '@/services/admin/analyticsService';
import { UseUserAnalyticsReturn } from '@/types/analytics';

export function useUserAnalytics(): UseUserAnalyticsReturn {
  const [loading, setLoading] = useState({
    activeUsers: true,
    registrationTrends: true,
    geographic: true,
    storage: true,
    activity: true,
    retention: true,
  });

  const [data, setData] = useState<UseUserAnalyticsReturn['data']>({
    activeUsersStats: null,
    registrationTrends: null,
    geographicData: null,
    storageAnalytics: null,
    activityPatterns: null,
    retentionMetrics: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchData = useCallback(async (key: keyof typeof data, fetcher: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
    try {
      const result = await fetcher();
      setData(prev => ({ ...prev, [key]: result }));
    } catch (error) {
      setErrors(prev => ({ ...prev, [key]: `Failed to load ${key}` }));
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const loadAllData = useCallback(() => {
    fetchData('activeUsersStats', analyticsService.getActiveUsersStats);
    fetchData('registrationTrends', () => analyticsService.getRegistrationTrends('monthly'));
    fetchData('geographicData', analyticsService.getGeographicDistribution);
    fetchData('storageAnalytics', analyticsService.getStorageAnalytics);
    fetchData('activityPatterns', () => analyticsService.getActivityPatterns(7));
    fetchData('retentionMetrics', analyticsService.getRetentionMetrics);
  }, [fetchData]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const onPeriodChange = (period: string, type: 'registration' | 'activity') => {
    if (type === 'registration') {
      fetchData('registrationTrends', () => analyticsService.getRegistrationTrends(period));
    } else if (type === 'activity') {
      fetchData('activityPatterns', () => analyticsService.getActivityPatterns(Number(period)));
    }
  };

  return {
    loading,
    data,
    errors,
    refreshAllData: loadAllData,
    onPeriodChange,
  };
}