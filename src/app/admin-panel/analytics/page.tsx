"use client";

import { BarChart, Users, UserPlus, Database, Heart, RefreshCw } from "lucide-react";
import { useUserAnalytics } from "@/hooks/useUserAnalytics";
import { StatCard } from "@/components/admin/analytics/StatCard";
import { RegistrationTrendsChart } from "@/components/admin/analytics/RegistrationTrendsChart";
import { GeographicDistribution } from "@/components/admin/analytics/GeographicDistribution";
import { StorageDistribution } from "@/components/admin/analytics/StorageDistribution";
import { ActivityPatterns } from "@/components/admin/analytics/ActivityPatterns";
import { cn } from "@/lib/utils";

export default function UserAnalyticsPage() {
  const { loading, data, errors, refreshAllData, onPeriodChange } = useUserAnalytics();

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getRetentionClass = (rate: number): string => {
    if (rate >= 80) return 'text-emerald-600';
    if (rate >= 60) return 'text-green-600';
    if (rate >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <BarChart className="w-6 h-6" /> User Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Comprehensive insights into user behavior and system usage.</p>
        </div>
        <button onClick={refreshAllData} className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Users"
          icon={Users}
          loading={loading.activeUsers}
          error={errors.activeUsers}
          mainMetric={data.activeUsersStats?.total_active.toLocaleString() || '0'}
          label="Total Active"
          breakdown={[
            { label: 'Daily', value: data.activeUsersStats?.daily_active.toLocaleString() || '0' },
            { label: 'Weekly', value: data.activeUsersStats?.weekly_active.toLocaleString() || '0' },
            { label: 'Monthly', value: data.activeUsersStats?.monthly_active.toLocaleString() || '0' },
          ]}
        />
        <StatCard
          title="Registration Trends"
          icon={UserPlus}
          loading={loading.registrationTrends}
          error={errors.registrationTrends}
          mainMetric={data.registrationTrends?.total_registrations.toLocaleString() || '0'}
          label="Total Registrations"
          breakdown={[
            { label: 'Period', value: data.registrationTrends?.period || 'N/A' },
            { label: 'Growth', value: `${data.registrationTrends?.growth_rate || 0}%`, color: (data.registrationTrends?.growth_rate || 0) >= 0 ? 'text-emerald-600' : 'text-red-600' },
          ]}
        />
        <StatCard
          title="Storage Usage"
          icon={Database}
          loading={loading.storage}
          error={errors.storage}
          mainMetric={formatBytes(data.storageAnalytics?.total_storage || 0)}
          label="Total Storage"
          breakdown={[
            { label: 'Avg/User', value: formatBytes(data.storageAnalytics?.average_per_user || 0) },
            { label: 'Top Users', value: data.storageAnalytics?.top_users.length.toString() || '0' },
          ]}
        />
        <StatCard
          title="User Retention"
          icon={Heart}
          loading={loading.retention}
          error={errors.retention}
          mainMetric={`${data.retentionMetrics?.retention_rate_30d || 0}%`}
          label="30-Day Retention"
          breakdown={[
            { label: '7-Day', value: `${data.retentionMetrics?.retention_rate_7d || 0}%`, color: getRetentionClass(data.retentionMetrics?.retention_rate_7d || 0) },
            { label: 'Churn', value: `${data.retentionMetrics?.churn_rate || 0}%`, color: getRetentionClass(100 - (data.retentionMetrics?.churn_rate || 0)) },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RegistrationTrendsChart trends={data.registrationTrends} onPeriodChange={(p) => onPeriodChange(p, 'registration')} />
        <GeographicDistribution data={data.geographicData} />
        <StorageDistribution data={data.storageAnalytics} />
        <ActivityPatterns data={data.activityPatterns} onPeriodChange={(p) => onPeriodChange(p, 'activity')} />
      </div>
    </div>
  );
}