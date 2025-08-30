"use client";

import { useState } from "react";
import { Monitor, RefreshCw, AlertTriangle } from "lucide-react";
import { SystemAlerts } from "@/components/admin/monitoring/SystemAlerts";
import { SystemHealthCard } from "@/components/admin/monitoring/SystemHealthCard";
import { DatabasePerformance } from "@/components/admin/monitoring/DatabasePerformance";
import { ApplicationMetrics } from "@/components/admin/monitoring/ApplicationMetrics";
import { useSystemMonitoring } from "@/hooks/useSystemMonitoring";

// Transform data for existing components
const transformHealthData = (health: any) => ({
  cpu: { usage_percent: health?.system?.cpu?.usage_percent || 0 },
  memory: { percent: health?.system?.memory?.percent || 0 },
  disk: { percent: health?.system?.disk?.percent || 0 },
  uptime: health?.system?.uptime || 0
});

const transformDbData = (db: any) => ({
  stats: {
    collections: db?.database_stats?.collections || 0,
    objects: db?.database_stats?.objects || 0,
    db_size: db?.database_stats?.db_size || 0,
    index_size: db?.database_stats?.index_size || 0,
    avg_obj_size: db?.database_stats?.avg_obj_size || 0
  },
  query_performance: {
    files_query_time_ms: db?.query_performance?.files_query_time_ms || 0,
    users_query_time_ms: db?.query_performance?.users_query_time_ms || 0
  },
  current_operations: {
    count: db?.current_operations?.count || 0
  }
});

const transformAppData = (api: any, health: any) => ({
  stats: {
    total_files: health?.database?.total_files || 0,
    total_users: health?.database?.total_users || 0,
    api_requests_24h: api?.api_usage?.total_requests || 0,
    api_errors_24h: api?.error_analysis?.total_errors || 0
  },
  top_endpoints: api?.api_usage?.endpoint_stats?.map((ep: any) => ({
    endpoint: ep._id || 'Unknown',
    count: ep.count || 0
  })) || [],
  admin_activity: api?.admin_activity?.map((admin: any) => ({
    admin: admin._id || 'Unknown',
    actions: admin.total_actions || 0
  })) || []
});

// Error fallback component
function ErrorFallback() {
  return (
    <div className="p-6 text-center border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
      <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
      <h2 className="mb-2 text-xl font-semibold text-red-800 dark:text-red-300">System Monitoring Error</h2>
      <p className="mb-4 text-red-700 dark:text-red-400">
        There was an error loading the system monitoring dashboard.
      </p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
      >
        Reload Page
      </button>
    </div>
  );
}

export default function MonitoringPage() {
  const [componentError, setComponentError] = useState<boolean>(false);

  // If there's a component error, show the error fallback
  if (componentError) {
    return <ErrorFallback />;
  }

  try {
    // Use the system monitoring hook
    const {
      systemHealth,
      apiMetrics,
      databasePerformance,
      systemAlerts,
      loading,
      error,
      autoRefresh,
      toggleAutoRefresh,
      refreshAll
    } = useSystemMonitoring();

    // Transform alerts data for the SystemAlerts component
    const alerts = systemAlerts?.alerts?.map(alert => ({
      type: alert.type,
      category: alert.category,
      message: alert.message,
      timestamp: alert.timestamp
    })) || [];

    const isLoading = loading.health || loading.api || loading.database || loading.alerts;
    const hasError = error.health || error.api || error.database || error.alerts;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-blue-500 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 dark:text-blue-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Monitoring</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Real-time system health and performance monitoring
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input 
                type="checkbox" 
                checked={autoRefresh} 
                onChange={toggleAutoRefresh}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 focus:ring-2" 
              />
              Auto-refresh (30s)
            </label>
            <button 
              onClick={refreshAll} 
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing...' : 'Refresh All'}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {hasError && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-900/30">
            <h3 className="mb-2 font-medium text-red-800 dark:text-red-300">System Monitoring Errors</h3>
            <div className="space-y-1 text-sm text-red-700 dark:text-red-400">
              {error.health && <p>System Health: {error.health}</p>}
              {error.api && <p>API Metrics: {error.api}</p>}
              {error.database && <p>Database Performance: {error.database}</p>}
              {error.alerts && <p>System Alerts: {error.alerts}</p>}
            </div>
          </div>
        )}

        {/* System Alerts */}
        {alerts.length > 0 && (
          <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
            <SystemAlerts alerts={alerts} loading={loading.alerts} />
          </div>
        )}

        {/* System Health */}
        <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
          <SystemHealthCard 
            health={systemHealth ? transformHealthData(systemHealth) : null} 
            loading={loading.health} 
          />
        </div>

        {/* Database Performance */}
        <DatabasePerformance 
          performance={databasePerformance ? transformDbData(databasePerformance) : null} 
          loading={loading.database} 
        />

        {/* Application Metrics */}
        <ApplicationMetrics 
          metrics={apiMetrics && systemHealth ? transformAppData(apiMetrics, systemHealth) : null} 
          loading={loading.api || loading.health} 
        />
      </div>
    );
  } catch (error) {
    console.error("Error in MonitoringPage:", error);
    setComponentError(true);
    return <ErrorFallback />;
  }
}