"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Download, RefreshCw, Loader2, AlertTriangle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// Types (as derived from activity-logs.component.ts)
interface AdminActivityLog {
  id: string;
  admin_email: string;
  action: string;
  timestamp: string;
  ip_address?: string;
  details?: string;
}

// Mock Data Generation
const generateMockLogs = (count: number): AdminActivityLog[] => {
  const actions = ['login', 'login_failed', 'create_admin', 'view_profile', 'view_activity_logs', 'update_user', 'delete_file'];
  const admins = ['super@admin.com', 'ops@admin.com', 'support@admin.com', 'dev@admin.com'];
  const details = [
    'User session initiated successfully.',
    'Failed login attempt for user: unknown@user.com',
    'New administrator account created for new@admin.com.',
    'Viewed user profile for user_id: usr_12345',
    'Accessed the main activity log dashboard.',
    'Updated user role for user_id: usr_67890 to admin.',
    'Permanently deleted file: report_q3.pdf'
  ];

  return Array.from({ length: count }, (_, i) => {
    const timestamp = new Date(Date.now() - i * 3600000 * Math.random()).toISOString();
    const action = actions[i % actions.length];
    return {
      id: `log_${i + 1}`,
      admin_email: admins[i % admins.length],
      action: action,
      timestamp: timestamp,
      ip_address: `192.168.1.${i % 255}`,
      details: details[i % details.length],
    };
  });
};

const mockLogs = generateMockLogs(150);

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(25);
  
  // Filter State
  const [filters, setFilters] = useState({
    action: '',
    admin: '',
    dateFrom: '',
    dateTo: '',
  });

  const availableActions = useMemo(() => [...new Set(mockLogs.map(log => log.action))].sort(), []);
  const availableAdmins = useMemo(() => [...new Set(mockLogs.map(log => log.admin_email))].sort(), []);

  const filteredLogs = useMemo(() => {
    return mockLogs.filter(log => {
      const actionMatch = !filters.action || log.action === filters.action;
      const adminMatch = !filters.admin || log.admin_email === filters.admin;
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
      return actionMatch && adminMatch && dateMatch;
    });
  }, [filters]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredLogs.slice(start, start + limit);
  }, [filteredLogs, currentPage, limit]);

  const totalPages = useMemo(() => Math.ceil(filteredLogs.length / limit), [filteredLogs, limit]);

  const paginationPages = useMemo(() => {
    const maxPagesToShow = 5;
    const pages: number[] = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const loadLogs = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLogs(mockLogs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const clearFilters = () => {
    setFilters({ action: '', admin: '', dateFrom: '', dateTo: '' });
  };

  const getActionBadgeClass = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'login_failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'create_admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'view_profile': return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
      case 'view_activity_logs': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const formatAction = (action: string) => action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formatTimestamp = (timestamp: string) => new Date(timestamp).toLocaleString();

  return (
    <div className="space-y-6">
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Activity Logs</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Monitor all administrative actions and system access</p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5">
                <Download className="w-4 h-4 mr-2" /> Export CSV
              </button>
              <button onClick={loadLogs} className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:-translate-y-0.5">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700/50 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="action" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Action</label>
              <select id="action" name="action" value={filters.action} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all hover:-translate-y-px focus:-translate-y-px focus:shadow-lg">
                <option value="">All Actions</option>
                {availableActions.map(action => <option key={action} value={action}>{formatAction(action)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="admin" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Admin</label>
              <select id="admin" name="admin" value={filters.admin} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all hover:-translate-y-px focus:-translate-y-px focus:shadow-lg">
                <option value="">All Admins</option>
                {availableAdmins.map(admin => <option key={admin} value={admin}>{admin}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-slate-700 dark:text-slate-300">From Date</label>
              <input type="date" id="dateFrom" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all hover:-translate-y-px focus:-translate-y-px focus:shadow-lg" />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-slate-700 dark:text-slate-300">To Date</label>
              <input type="date" id="dateTo" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all hover:-translate-y-px focus:-translate-y-px focus:shadow-lg" />
            </div>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button onClick={clearFilters} className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 hover:underline transition-colors">Clear Filters</button>
            <p className="text-sm text-slate-500 dark:text-slate-400">Showing {paginatedLogs.length} of {filteredLogs.length} logs</p>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-8 text-center">
              <div className="inline-flex items-center">
                <Loader2 className="animate-spin h-6 w-6 text-indigo-600 mr-3" />
                <span className="text-slate-600 dark:text-slate-300">Loading activity logs...</span>
              </div>
            </div>
          ) : error ? (
            <div className="px-6 py-8">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-500/20 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-red-400" /></div>
                  <div className="ml-3"><p className="text-sm font-medium text-red-800 dark:text-red-300">{error}</p></div>
                </div>
              </div>
            </div>
          ) : paginatedLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <h3 className="mt-2 text-sm font-medium text-slate-900 dark:text-white">No activity logs found</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">No logs match your current filter criteria.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Admin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {paginatedLogs.map(log => (
                  <tr key={log.id} className="transition-all duration-200 ease-in-out border-l-4 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/20 hover:border-indigo-500 hover:translate-x-0.5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">{formatTimestamp(log.timestamp)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-200">{log.admin_email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn("inline-flex px-2 py-1 text-xs font-semibold rounded-full", getActionBadgeClass(log.action))}>{formatAction(log.action)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 font-mono">{log.ip_address || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">{log.details || 'No details'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && !loading && !error && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-700 dark:text-slate-300">Page {currentPage} of {totalPages}</div>
              <div className="flex space-x-2">
                <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1} className="px-3 py-1 text-sm font-medium text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-px hover:shadow-md">Previous</button>
                {paginationPages.map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={cn("px-3 py-1 text-sm font-medium border rounded-md transition-all hover:-translate-y-px hover:shadow-md", currentPage === page ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700')}>{page}</button>
                ))}
                <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages} className="px-3 py-1 text-sm font-medium text-slate-500 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-px hover:shadow-md">Next</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}