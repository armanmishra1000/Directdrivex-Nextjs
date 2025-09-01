import { adminAuthService } from '@/services/adminAuthService';

interface ActivityLogEntry {
  action: string;
  entity: string;
  entity_id: string;
  details?: any;
  timestamp: string;
}

interface ActivityLogResponse {
  logs: Array<{
    id: string;
    admin_email: string;
    action: string;
    timestamp: string;
    ip_address?: string;
    endpoint?: string;
    details?: string;
  }>;
  total: number;
  limit: number;
  skip: number;
}

class ActivityLogsService {
  private readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin/auth`;

  /**
   * Log activity for audit trail
   */
  async logActivity(entry: ActivityLogEntry): Promise<void> {
    try {
      const response = await fetch(`${this.API_BASE}/activity-logs`, {
        method: 'POST',
        headers: adminAuthService.getAdminAuthHeaders(),
        body: JSON.stringify({
          action: entry.action,
          details: JSON.stringify(entry.details || {}),
          timestamp: entry.timestamp
        })
      });

      if (!response.ok) {
        throw new Error('Failed to log activity');
      }
    } catch (error) {
      // Fail silently for activity logging to not disrupt main operations
      console.warn('Failed to log activity:', error);
    }
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(limit: number = 50, skip: number = 0): Promise<ActivityLogResponse> {
    const response = await fetch(`${this.API_BASE}/activity-logs?limit=${limit}&skip=${skip}`, {
      headers: adminAuthService.getAdminAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to load activity logs');
    }

    return await response.json();
  }
}

export const activityLogsService = new ActivityLogsService();
