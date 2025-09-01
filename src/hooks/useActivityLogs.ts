"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  AdminActivityLog, 
  AdminActivityLogResponse,
  ActivityLogParams,
  LogFilters,
  PaginationState,
  ExportResponse
} from '@/types/admin';
import { activityLogsService } from '@/services/admin/activityLogsService';
import { adminSocketService } from '@/services/adminSocketService';
import { adminAuthService } from '@/services/adminAuthService';
import { toastService } from '@/services/toastService';

// Default filter state
const defaultFilters: LogFilters = {
  action: 'all',
  admin: 'all',
  dateFrom: '',
  dateTo: '',
  search: ''
};

// Default pagination state
const defaultPagination: PaginationState = {
  currentPage: 1,
  pageSize: 25, // Match Angular default
  totalItems: 0,
  totalPages: 0
};

export function useActivityLogs() {
  // Core state
  const [logs, setLogs] = useState<AdminActivityLog[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<LogFilters>(defaultFilters);
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [availableAdmins, setAvailableAdmins] = useState<string[]>([]);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>(defaultPagination);

  // Real-time updates state
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  /**
   * Load activity logs with current filters and pagination
   */
  const loadLogs = useCallback(async (params?: ActivityLogParams) => {
    setLoading(true);
    setError(null);

    try {
      const requestParams: ActivityLogParams = {
        page: params?.page || pagination.currentPage,
        limit: params?.limit || pagination.pageSize,
        action: filters.action !== 'all' ? filters.action : undefined,
        admin_email: filters.admin !== 'all' ? filters.admin : undefined,
        date_from: filters.dateFrom || undefined,
        date_to: filters.dateTo || undefined,
        search: filters.search || undefined,
        ...params
      };

      const response = await activityLogsService.getActivityLogs(requestParams);

      setLogs(response.logs);
      setPagination({
        currentPage: requestParams.page || 1,
        pageSize: requestParams.limit || pagination.pageSize,
        totalItems: response.total,
        totalPages: Math.ceil(response.total / (requestParams.limit || pagination.pageSize))
      });

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load activity logs');
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  /**
   * Load filter options (available actions and admins)
   */
  const loadFilterOptions = useCallback(async () => {
    try {
      const options = await activityLogsService.getFilterOptions();
      setAvailableActions(options.actions);
      setAvailableAdmins(options.admins);
    } catch (err) {
      console.warn('Failed to load filter options:', err);
      // Filter options will be empty but functionality continues
    }
  }, []);

  /**
   * Export activity logs
   */
  const exportLogs = useCallback(async (format: 'csv' | 'xlsx' = 'csv') => {
    try {
      const response: ExportResponse = await activityLogsService.exportActivityLogs(filters, format);
      
      // Create download link
      const url = URL.createObjectURL(response.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toastService.success(`Activity logs exported to ${format.toUpperCase()} successfully`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to export logs to ${format}`;
      toastService.error(errorMessage);
      throw err;
    }
  }, [filters]);

  /**
   * Refresh logs (reset to first page)
   */
  const refreshLogs = useCallback(async () => {
    await loadLogs({ page: 1 });
  }, [loadLogs]);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({
        ...prev,
        currentPage: page
      }));
    }
  }, [pagination.totalPages]);

  /**
   * Handle page size change
   */
  const handlePageSizeChange = useCallback((size: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: size,
      currentPage: 1 // Reset to first page
    }));
  }, []);

  /**
   * Update filters and reset to first page
   */
  const updateFilters = useCallback((newFilters: Partial<LogFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
    
    // Reset to first page when filters change
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPagination(prev => ({
      ...prev,
      currentPage: 1
    }));
  }, []);

  /**
   * Format action for display
   */
  const formatAction = useCallback((action: string): string => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, []);

  /**
   * Format timestamp for display
   */
  const formatTimestamp = useCallback((timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  }, []);

  /**
   * Get action badge CSS class
   */
  const getActionBadgeClass = useCallback((action: string): string => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400';
      case 'login_failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'create_admin':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'view_profile':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      case 'view_activity_logs':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'update_user_status':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'reset_user_password':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'bulk_user_action':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400';
      case 'export_users':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'security_scan':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  }, []);

  /**
   * Memoized filtered logs (for client-side filtering if needed)
   */
  const filteredLogs = useMemo(() => {
    if (!logs) return [];
    
    // Server-side filtering is preferred, but this provides client-side fallback
    return logs.filter(log => {
      const searchMatch = !filters.search || 
        log.admin_email.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.action.toLowerCase().includes(filters.search.toLowerCase()) ||
        (log.details && log.details.toLowerCase().includes(filters.search.toLowerCase()));
      
      const actionMatch = filters.action === 'all' || log.action === filters.action;
      const adminMatch = filters.admin === 'all' || log.admin_email === filters.admin;
      
      let dateMatch = true;
      if (filters.dateFrom || filters.dateTo) {
        const logDate = new Date(log.timestamp);
        if (filters.dateFrom) {
          dateMatch = dateMatch && logDate >= new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          dateMatch = dateMatch && logDate <= toDate;
        }
      }
      
      return searchMatch && actionMatch && adminMatch && dateMatch;
    });
  }, [logs, filters]);

  /**
   * Setup real-time updates using WebSocket
   */
  useEffect(() => {
    if (!realTimeEnabled || !adminAuthService.isAdminAuthenticated()) return;

    const token = adminAuthService.getAdminToken();
    if (!token) return;

    // Connect to WebSocket for real-time updates
    adminSocketService.connect(token);

    const unsubscribe = adminSocketService.onEvent((event: string) => {
      // Check if this is an activity log event
      if (event.includes('admin') || event.includes('login') || event.includes('activity')) {
        // Refresh logs when we get relevant real-time events
        // Add small delay to ensure backend has processed the event
        setTimeout(() => {
          refreshLogs();
        }, 1000);
      }
    });

    return unsubscribe;
  }, [realTimeEnabled, refreshLogs]);

  /**
   * Initial data load and filter options load
   */
  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([
        loadLogs(),
        loadFilterOptions()
      ]);
    };

    initializeData();
  }, []); // Only run once on mount

  /**
   * Reload when pagination changes
   */
  useEffect(() => {
    if (logs !== null) { // Avoid initial load
      loadLogs();
    }
  }, [pagination.currentPage, pagination.pageSize]);

  /**
   * Reload when filters change  
   */
  useEffect(() => {
    if (logs !== null) { // Avoid initial load
      loadLogs();
    }
  }, [filters]);

  /**
   * Enable real-time updates by default if authenticated
   */
  useEffect(() => {
    if (adminAuthService.isAdminAuthenticated()) {
      setRealTimeEnabled(true);
    }
  }, []);

  return {
    // State
    logs,
    loading,
    error,
    filters,
    pagination,
    availableActions,
    availableAdmins,
    realTimeEnabled,

    // Computed
    filteredLogs,

    // Actions  
    loadLogs,
    exportLogs,
    refreshLogs,
    handlePageChange,
    handlePageSizeChange,
    updateFilters: updateFilters,
    clearFilters,
    
    // Utilities
    formatAction,
    formatTimestamp,
    getActionBadgeClass,
    
    // Real-time control
    setRealTimeEnabled
  };
}
