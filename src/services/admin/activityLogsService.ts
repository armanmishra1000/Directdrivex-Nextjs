"use client";

import {
  AdminActivityLog,
  AdminActivityLogResponse,
  ActivityLogParams,
  LogFilters,
  ExportResponse
} from '@/types/admin';
import { adminAuthService } from '../adminAuthService';

class ActivityLogsService {
  private readonly API_BASE = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin`;

  /**
   * Get activity logs with optional filtering, sorting, and pagination
   */
  async getActivityLogs(params: ActivityLogParams = {}): Promise<AdminActivityLogResponse> {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.action && params.action !== 'all') queryParams.append('action', params.action);
      if (params.admin_email && params.admin_email !== 'all') queryParams.append('admin_email', params.admin_email);
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      if (params.search) queryParams.append('search', params.search);

      const response = await fetch(`${this.API_BASE}/auth/activity-logs?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to fetch activity logs');
      }

      return await response.json();
    } catch (error) {
      console.warn('Activity logs endpoint not available, using fallback data:', error);
      
      // Return mock data as fallback for development
      return this.getMockActivityLogs(params);
    }
  }

  /**
   * Export activity logs as CSV or Excel
   */
  async exportActivityLogs(filters: LogFilters, format: 'csv' | 'xlsx' = 'csv'): Promise<ExportResponse> {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      queryParams.append('format', format);
      if (filters.action && filters.action !== 'all') queryParams.append('action', filters.action);
      if (filters.admin && filters.admin !== 'all') queryParams.append('admin_email', filters.admin);
      if (filters.dateFrom) queryParams.append('date_from', filters.dateFrom);
      if (filters.dateTo) queryParams.append('date_to', filters.dateTo);
      if (filters.search) queryParams.append('search', filters.search);

      const response = await fetch(`${this.API_BASE}/auth/activity-logs/export?${queryParams.toString()}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to export activity logs');
      }

      const blob = await response.blob();
      return {
        blob,
        filename: `admin-activity-logs-${new Date().toISOString().split('T')[0]}.${format}`
      };
    } catch (error) {
      console.warn('Export endpoint not available, generating client-side export:', error);
      
      // Generate client-side CSV as fallback
      const allLogs = await this.getActivityLogs({ limit: 10000, ...filters });
      const csvContent = this.generateCSV(allLogs.logs);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      
      return {
        blob,
        filename: `admin-activity-logs-${new Date().toISOString().split('T')[0]}.csv`
      };
    }
  }

  /**
   * Generate CSV content from activity logs
   */
  private generateCSV(logs: AdminActivityLog[]): string {
    const headers = ['Timestamp', 'Admin Email', 'Action', 'IP Address', 'Endpoint', 'Details'];
    const rows = logs.map(log => [
      log.timestamp,
      log.admin_email,
      log.action,
      log.ip_address || 'N/A',
      log.endpoint || 'N/A',
      (log.details || 'N/A').replace(/,/g, ';') // Handle CSV comma conflicts
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  /**
   * Get unique filter options from logs
   */
  async getFilterOptions(): Promise<{ actions: string[], admins: string[] }> {
    try {
      const response = await fetch(`${this.API_BASE}/auth/activity-logs/filters`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || 'Failed to fetch filter options');
      }

      return await response.json();
    } catch (error) {
      console.warn('Filter options endpoint not available, using mock data:', error);
      
      // Extract from mock data
      const mockData = this.getMockActivityLogs({ limit: 1000 });
      const actions = [...new Set(mockData.logs.map(log => log.action))].sort();
      const admins = [...new Set(mockData.logs.map(log => log.admin_email))].sort();
      
      return { actions, admins };
    }
  }

  /**
   * Get authorization headers
   */
  private getAuthHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${adminAuthService.getAdminToken()}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Generate mock activity logs for development and fallback
   */
  private getMockActivityLogs(params: ActivityLogParams = {}): AdminActivityLogResponse {
    const actions = [
      'login',
      'login_failed', 
      'create_admin',
      'view_profile',
      'view_activity_logs',
      'view_user_details',
      'update_user_status',
      'reset_user_password',
      'bulk_user_action',
      'export_users',
      'view_system_stats',
      'view_google_drive_stats',
      'backup_initiated',
      'storage_cleanup',
      'security_scan'
    ];
    
    const admins = [
      'super@admin.com',
      'ops@admin.com', 
      'support@admin.com',
      'dev@admin.com',
      'security@admin.com'
    ];
    
    const ipRanges = ['192.168.1.', '10.0.0.', '172.16.0.', '203.0.113.'];
    
    const detailsTemplates = {
      login: 'Administrator successfully authenticated',
      login_failed: 'Failed authentication attempt - invalid credentials',
      create_admin: 'Created new administrator account',
      view_profile: 'Accessed administrator profile information',
      view_activity_logs: 'Viewed system activity logs',
      view_user_details: 'Accessed user account details',
      update_user_status: 'Updated user account status',
      reset_user_password: 'Reset user account password',
      bulk_user_action: 'Performed bulk action on multiple users',
      export_users: 'Exported user data to CSV',
      view_system_stats: 'Accessed system performance statistics',
      view_google_drive_stats: 'Viewed Google Drive storage statistics',
      backup_initiated: 'Initiated system backup process',
      storage_cleanup: 'Performed storage cleanup operation',
      security_scan: 'Initiated security vulnerability scan'
    };

    const endpoints = {
      login: '/api/v1/admin/auth/token',
      login_failed: '/api/v1/admin/auth/token',
      create_admin: '/api/v1/admin/auth/create-admin',
      view_profile: '/api/v1/admin/auth/me',
      view_activity_logs: '/api/v1/admin/auth/activity-logs',
      view_user_details: '/api/v1/admin/users/{user_id}',
      update_user_status: '/api/v1/admin/users/{user_id}/status',
      reset_user_password: '/api/v1/admin/users/{user_id}/reset-password',
      bulk_user_action: '/api/v1/admin/users/bulk',
      export_users: '/api/v1/admin/users/export',
      view_system_stats: '/api/v1/admin/monitoring/system-health',
      view_google_drive_stats: '/api/v1/admin/storage/google-drive/combined-stats',
      backup_initiated: '/api/v1/admin/backup/initiate',
      storage_cleanup: '/api/v1/admin/storage/cleanup',
      security_scan: '/api/v1/admin/security/scan'
    };

    // Generate comprehensive mock data
    const totalLogs = 450; // Large dataset for testing
    const allLogs: AdminActivityLog[] = Array.from({ length: totalLogs }, (_, i) => {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const admin = admins[Math.floor(Math.random() * admins.length)];
      const ipRange = ipRanges[Math.floor(Math.random() * ipRanges.length)];
      const ipSuffix = Math.floor(Math.random() * 254) + 1;
      
      // Generate realistic timestamps (last 30 days)
      const daysAgo = Math.floor(Math.random() * 30);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minutesAgo = Math.floor(Math.random() * 60);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      timestamp.setHours(timestamp.getHours() - hoursAgo);
      timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

      return {
        id: `log_${i + 1}`,
        admin_email: admin,
        action: action,
        timestamp: timestamp.toISOString(),
        ip_address: `${ipRange}${ipSuffix}`,
        endpoint: endpoints[action as keyof typeof endpoints] || '/api/v1/admin/unknown',
        details: detailsTemplates[action as keyof typeof detailsTemplates] || 'Administrative action performed'
      };
    });

    // Apply filters
    let filteredLogs = [...allLogs];
    
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredLogs = filteredLogs.filter(log => 
        log.admin_email.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower) ||
        (log.details && log.details.toLowerCase().includes(searchLower)) ||
        (log.endpoint && log.endpoint.toLowerCase().includes(searchLower))
      );
    }
    
    if (params.action && params.action !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.action === params.action);
    }
    
    if (params.admin_email && params.admin_email !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.admin_email === params.admin_email);
    }
    
    if (params.date_from || params.date_to) {
      filteredLogs = filteredLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        let dateMatch = true;
        
        if (params.date_from) {
          dateMatch = dateMatch && logDate >= new Date(params.date_from);
        }
        if (params.date_to) {
          const toDate = new Date(params.date_to);
          toDate.setHours(23, 59, 59, 999);
          dateMatch = dateMatch && logDate <= toDate;
        }
        
        return dateMatch;
      });
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply pagination
    const page = params.page || 1;
    const limit = params.limit || 25;
    const skip = (page - 1) * limit;
    const paginatedLogs = filteredLogs.slice(skip, skip + limit);

    return {
      logs: paginatedLogs,
      total: filteredLogs.length,
      limit: limit,
      skip: skip
    };
  }
}

export const activityLogsService = new ActivityLogsService();
