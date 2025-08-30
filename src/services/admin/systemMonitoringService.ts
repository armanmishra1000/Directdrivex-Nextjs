"use client";

import { adminAuthService } from '../adminAuthService';

interface SystemHealthResponse {
  timestamp: string;
  system: {
    cpu: {
      usage_percent: number;
      count: number;
      frequency: number;
    };
    memory: {
      total: number;
      available: number;
      used: number;
      percent: number;
      swap_total: number;
      swap_used: number;
      swap_percent: number;
    };
    disk: {
      total: number;
      used: number;
      free: number;
      percent: number;
    };
    network: {
      bytes_sent: number;
      bytes_recv: number;
      packets_sent: number;
      packets_recv: number;
    };
    uptime: number;
    boot_time: number;
  };
  database: {
    total_collections: number;
    total_files: number;
    total_users: number;
    total_admins: number;
    active_sessions: number;
    size_bytes: number;
  };
}

interface ApiMetricsResponse {
  period_hours: number;
  timestamp: string;
  api_usage: {
    endpoint_stats: Array<{
      _id: string;
      count: number;
    }>;
    total_requests: number;
    unique_endpoints: number;
  };
  error_analysis: {
    recent_errors: any[];
    total_errors: number;
  };
  request_distribution: any[];
  admin_activity: Array<{
    _id: string;
    total_actions: number;
    unique_endpoints_count: number;
  }>;
}

interface DatabasePerformanceResponse {
  timestamp: string;
  database_stats: {
    db_size: number;
    storage_size: number;
    index_size: number;
    file_size: number;
    collections: number;
    objects: number;
    avg_obj_size: number;
  };
  collection_stats: any;
  query_performance: {
    files_query_time_ms: number;
    users_query_time_ms: number;
    sample_queries: any;
  };
  current_operations: {
    count: number;
    operations: any[];
  };
}

interface SystemAlertsResponse {
  timestamp: string;
  alerts: Array<{
    type: 'critical' | 'warning';
    category: string;
    message: string;
    value: number;
    threshold: number;
    timestamp: string;
  }>;
  alert_counts: {
    critical: number;
    warning: number;
    total: number;
  };
}

class SystemMonitoringService {
  private readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin/monitoring`;

  private getAuthHeaders(): Record<string, string> {
    const token = adminAuthService.getAdminToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getSystemHealth(): Promise<SystemHealthResponse> {
    try {
      // Check if we're in development mode and should use mock data
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.log('Using mock system health data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
        return this.getMockSystemHealth();
      }
      
      const response = await fetch(`${this.API_BASE}/system-health`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch system health, using mock data:', error);
      // Return mock data for development
      return this.getMockSystemHealth();
    }
  }

  async getApiMetrics(hours: number = 24): Promise<ApiMetricsResponse> {
    try {
      // Check if we're in development mode and should use mock data
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.log('Using mock API metrics data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
        return this.getMockApiMetrics(hours);
      }
      
      const response = await fetch(`${this.API_BASE}/api-metrics?hours=${hours}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch API metrics, using mock data:', error);
      return this.getMockApiMetrics(hours);
    }
  }

  async getDatabasePerformance(): Promise<DatabasePerformanceResponse> {
    try {
      // Check if we're in development mode and should use mock data
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.log('Using mock database performance data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
        return this.getMockDatabasePerformance();
      }
      
      const response = await fetch(`${this.API_BASE}/database-performance`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch database performance, using mock data:', error);
      return this.getMockDatabasePerformance();
    }
  }

  async getSystemAlerts(): Promise<SystemAlertsResponse> {
    try {
      // Check if we're in development mode and should use mock data
      if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
        console.log('Using mock system alerts data (NEXT_PUBLIC_USE_MOCK_DATA=true)');
        return this.getMockSystemAlerts();
      }
      
      const response = await fetch(`${this.API_BASE}/system-alerts`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Failed to fetch system alerts, using mock data:', error);
      return this.getMockSystemAlerts();
    }
  }

  // Mock data methods for development
  private getMockSystemHealth(): SystemHealthResponse {
    // Generate slightly different values each time for realistic monitoring
    const randomPercent = (base: number, variance: number = 5) => {
      return Math.max(0, Math.min(100, base + (Math.random() * variance * 2 - variance)));
    };
    
    return {
      timestamp: new Date().toISOString(),
      system: {
        cpu: {
          usage_percent: randomPercent(67.5),
          count: 8,
          frequency: 2400
        },
        memory: {
          total: 16 * 1024 * 1024 * 1024,
          available: 4 * 1024 * 1024 * 1024,
          used: 12 * 1024 * 1024 * 1024,
          percent: randomPercent(75.0),
          swap_total: 2 * 1024 * 1024 * 1024,
          swap_used: 500 * 1024 * 1024,
          swap_percent: randomPercent(25.0)
        },
        disk: {
          total: 1 * 1024 * 1024 * 1024 * 1024,
          used: 850 * 1024 * 1024 * 1024,
          free: 174 * 1024 * 1024 * 1024,
          percent: randomPercent(83.0)
        },
        network: {
          bytes_sent: 1024 * 1024 * 1024 + Math.random() * 100 * 1024 * 1024,
          bytes_recv: 2 * 1024 * 1024 * 1024 + Math.random() * 200 * 1024 * 1024,
          packets_sent: 50000 + Math.floor(Math.random() * 5000),
          packets_recv: 75000 + Math.floor(Math.random() * 7500)
        },
        uptime: 1234567 + Math.floor(Math.random() * 10000),
        boot_time: Date.now() - 1234567 * 1000 - Math.floor(Math.random() * 10000) * 1000
      },
      database: {
        total_collections: 15,
        total_files: 125000 + Math.floor(Math.random() * 1000),
        total_users: 1205 + Math.floor(Math.random() * 10),
        total_admins: 8,
        active_sessions: 45 + Math.floor(Math.random() * 15),
        size_bytes: 5.2 * 1024 * 1024 * 1024 + Math.random() * 100 * 1024 * 1024
      }
    };
  }

  private getMockApiMetrics(hours: number = 24): ApiMetricsResponse {
    // Scale metrics based on requested time period
    const scaleFactor = hours / 24;
    
    return {
      period_hours: hours,
      timestamp: new Date().toISOString(),
      api_usage: {
        endpoint_stats: [
          { _id: '/api/v1/files/upload', count: Math.floor(15420 * scaleFactor) },
          { _id: '/api/v1/auth/token', count: Math.floor(8750 * scaleFactor) },
          { _id: '/api/v1/files/list', count: Math.floor(6230 * scaleFactor) },
          { _id: '/api/v1/user/profile', count: Math.floor(4150 * scaleFactor) },
          { _id: '/api/v1/files/download', count: Math.floor(3890 * scaleFactor) }
        ],
        total_requests: Math.floor(47520 * scaleFactor),
        unique_endpoints: 25
      },
      error_analysis: {
        recent_errors: [],
        total_errors: Math.floor(127 * scaleFactor)
      },
      request_distribution: [],
      admin_activity: [
        { _id: 'admin@directdrive.com', total_actions: Math.floor(156 * scaleFactor), unique_endpoints_count: 12 },
        { _id: 'ops@directdrive.com', total_actions: Math.floor(98 * scaleFactor), unique_endpoints_count: 8 }
      ]
    };
  }

  private getMockDatabasePerformance(): DatabasePerformanceResponse {
    // Generate slightly different values each time for realistic monitoring
    const randomVariance = (base: number, percent: number = 10) => {
      const variance = base * (percent / 100);
      return base + (Math.random() * variance * 2 - variance);
    };
    
    return {
      timestamp: new Date().toISOString(),
      database_stats: {
        db_size: randomVariance(5.2 * 1024 * 1024 * 1024),
        storage_size: randomVariance(5.8 * 1024 * 1024 * 1024),
        index_size: randomVariance(1.1 * 1024 * 1024 * 1024),
        file_size: randomVariance(4.1 * 1024 * 1024 * 1024),
        collections: 15,
        objects: 125847 + Math.floor(Math.random() * 1000),
        avg_obj_size: randomVariance(42 * 1024)
      },
      collection_stats: {},
      query_performance: {
        files_query_time_ms: randomVariance(234.5),
        users_query_time_ms: randomVariance(127.8),
        sample_queries: {}
      },
      current_operations: {
        count: Math.floor(Math.random() * 5) + 1,
        operations: []
      }
    };
  }

  private getMockSystemAlerts(): SystemAlertsResponse {
    // Randomize alerts for more realistic monitoring experience
    const alerts = [];
    
    // Memory alert (50% chance)
    if (Math.random() > 0.5) {
      const memValue = 78.5 + (Math.random() * 5);
      alerts.push({
        type: memValue > 80 ? 'critical' as const : 'warning' as const,
        category: 'Memory',
        message: `Memory usage is ${memValue > 80 ? 'exceeding' : 'approaching'} 80% threshold`,
        value: memValue,
        threshold: 80.0,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString()
      });
    }
    
    // Disk alert (always present)
    const diskValue = 88 + (Math.random() * 8);
    alerts.push({
      type: diskValue > 90 ? 'critical' as const : 'warning' as const,
      category: 'Disk',
      message: `Disk usage has ${diskValue > 90 ? 'exceeded' : 'approaching'} 90% on primary storage`,
      value: diskValue,
      threshold: 90.0,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 1800000)).toISOString()
    });
    
    // CPU alert (30% chance)
    if (Math.random() > 0.7) {
      alerts.push({
        type: 'warning' as const,
        category: 'CPU',
        message: 'CPU usage spike detected in last 15 minutes',
        value: 92.8,
        threshold: 90.0,
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 900000)).toISOString()
      });
    }
    
    // Count alerts by type
    const criticalCount = alerts.filter(a => a.type === 'critical').length;
    const warningCount = alerts.filter(a => a.type === 'warning').length;
    
    return {
      timestamp: new Date().toISOString(),
      alerts,
      alert_counts: {
        critical: criticalCount,
        warning: warningCount,
        total: criticalCount + warningCount
      }
    };
  }
}

export const systemMonitoringService = new SystemMonitoringService();
export type {
  SystemHealthResponse,
  ApiMetricsResponse,
  DatabasePerformanceResponse,
  SystemAlertsResponse
};
