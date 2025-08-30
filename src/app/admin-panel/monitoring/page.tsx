"use client";

import { useState, useEffect } from "react";
import { Monitor, RefreshCw, Loader2 } from "lucide-react";
import { SystemAlerts } from "@/components/admin/monitoring/SystemAlerts";
import { SystemHealthCard } from "@/components/admin/monitoring/SystemHealthCard";
import { DatabasePerformance } from "@/components/admin/monitoring/DatabasePerformance";
import { ApplicationMetrics } from "@/components/admin/monitoring/ApplicationMetrics";
import { SystemAlert, SystemHealth, DatabasePerformance as DBPerf, ApplicationMetrics as AppMetrics } from "@/types/monitoring";

// Mock Data
const mockAlerts: SystemAlert[] = [
  { type: 'critical', category: 'Database', message: 'High latency detected on primary DB.', timestamp: new Date().toISOString() },
  { type: 'warning', category: 'CPU', message: 'CPU usage at 85% on server-02.', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

const mockHealth: SystemHealth = {
  cpu: { usage_percent: 65 },
  memory: { percent: 78 },
  disk: { percent: 92 },
  uptime: 1234567,
};

const mockDbPerf: DBPerf = {
  stats: { collections: 15, objects: 12580, db_size: 5.2 * 1024**3, index_size: 1.1 * 1024**3, avg_obj_size: 450 * 1024 },
  query_performance: { files_query_time_ms: 850, users_query_time_ms: 1200 },
  current_operations: { count: 3 },
};

const mockAppMetrics: AppMetrics = {
  stats: { total_files: 1500000, total_users: 1200, api_requests_24h: 250000, api_errors_24h: 150 },
  top_endpoints: [
    { endpoint: '/api/v1/upload/initiate', count: 120000 },
    { endpoint: '/api/v1/upload/quota-info', count: 80000 },
    { endpoint: '/api/v1/auth/token', count: 30000 },
  ],
  admin_activity: [
    { admin: 'super@admin.com', actions: 150 },
    { admin: 'ops@admin.com', actions: 95 },
  ],
};

export default function SystemMonitoringPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [dbPerf, setDbPerf] = useState<DBPerf | null>(null);
  const [appMetrics, setAppMetrics] = useState<AppMetrics | null>(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Simulate API call
      setAlerts(mockAlerts);
      setHealth(mockHealth);
      setDbPerf(mockDbPerf);
      setAppMetrics(mockAppMetrics);
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchData();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchData, 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-400/10 text-blue-500 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Monitoring</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Live overview of system health and performance.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={autoRefresh} onChange={() => setAutoRefresh(!autoRefresh)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
            Auto-refresh (30s)
          </label>
          <button onClick={fetchData} disabled={loading} className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh All'}
          </button>
        </div>
      </div>

      {/* Alerts */}
      <SystemAlerts alerts={alerts} loading={loading} />

      {/* System Health */}
      <SystemHealthCard health={health} loading={loading} />

      {/* Database Performance */}
      <DatabasePerformance performance={dbPerf} loading={loading} />

      {/* Application Metrics */}
      <ApplicationMetrics metrics={appMetrics} loading={loading} />
    </div>
  );
}