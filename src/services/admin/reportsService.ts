import {
  ReportTemplate,
  ReportFormState,
  CustomReportFormState,
  GeneratedReport,
  SystemOverviewReport,
  UserActivityReport,
  StorageUsageReport,
  CustomReport,
} from '@/types/reports';
import { adminAuthService } from '../adminAuthService';

class ReportsService {
  private readonly API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/v1/admin/reports`;

  private getAuthHeaders(): HeadersInit {
    const token = adminAuthService.getAdminToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getReportTemplates(): Promise<ReportTemplate[]> {
    // In a real app, this would be an API call.
    return Promise.resolve([
      { id: 'template1', name: 'Weekly User Activity Summary', description: 'A summary of user sign-ups, logins, and file uploads over the last 7 days.', type: 'user_activity', default_period_days: 7, includes: ['Users', 'Activity', 'Growth'] },
      { id: 'template2', name: 'Monthly Storage Overview', description: 'Detailed breakdown of storage usage by file type and top users for the last month.', type: 'storage_usage', default_period_days: 30, includes: ['Storage', 'Files', 'Users'] },
      { id: 'template3', name: 'Quarterly System Health Report', description: 'Comprehensive system performance, uptime, and error rate statistics for the last quarter.', type: 'system_overview', default_period_days: 90, includes: ['System', 'Performance', 'Admin'] },
    ]);
  }

  async generateReport(params: ReportFormState): Promise<GeneratedReport> {
    // This would make a real API call. For now, it returns mock data.
    console.log('Generating report with params:', params);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    const reportInfo = {
      type: params.report_type,
      title: `${params.report_type.replace('_', ' ')} Report`,
      generated_at: new Date().toISOString(),
      generated_by: adminAuthService.getCurrentAdmin()?.email || 'admin@enterprise.com',
      period: { from: params.date_from, to: params.date_to, days: 7 },
    };

    if (params.report_type === 'system_overview') {
      return {
        report_info: { ...reportInfo, title: 'System Overview' },
        user_statistics: { total_users: 1234, active_users: 890, new_users_in_period: 45, growth_rate: 3.8 },
        file_statistics: { total_files: 56789, files_uploaded_in_period: 1234, total_storage_gb: 128.5, average_file_size_mb: 2.3, type_distribution: [{ type: 'image', count: 25000, size_gb: 60.1 }, { type: 'video', count: 5000, size_gb: 40.2 }] },
        system_performance: { uptime_percentage: 99.98, average_response_time_ms: 120, total_api_requests: 1250345, error_rate_percentage: 0.12 },
        growth_metrics: { user_growth_percentage: 3.8, file_growth_percentage: 2.2 },
        admin_activity: { top_actions: [{ action: 'user_login', count: 500 }, { action: 'file_upload', count: 1234 }] },
      } as SystemOverviewReport;
    }

    if (params.report_type === 'user_activity') {
      return {
        report_info: { ...reportInfo, title: 'User Activity' },
        summary: { total_users_analyzed: 1234, active_users_in_period: 890, total_files_in_period: 1234, average_files_per_active_user: 1.4 },
        top_users_by_activity: [{ email: 'top.user@example.com', files_in_period: 150, storage_mb: 345.6 }],
      } as UserActivityReport;
    }

    if (params.report_type === 'storage_usage') {
      return {
        report_info: { ...reportInfo, title: 'Storage Usage', group_by: params.group_by },
        summary: { total_files: 56789, total_storage_gb: 128.5, files_in_period: 1234, average_file_size_mb: 2.3 },
        detailed_breakdown: [{ user: 'top.user@example.com', files: 150, storage_gb: 0.34 }],
      } as StorageUsageReport;
    }

    throw new Error('Invalid report type');
  }

  async generateCustomReport(params: CustomReportFormState): Promise<CustomReport> {
    console.log('Generating custom report with params:', params);
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      report_info: {
        type: 'custom',
        title: params.title,
        generated_at: new Date().toISOString(),
        generated_by: adminAuthService.getCurrentAdmin()?.email || 'admin@enterprise.com',
        period: { from: params.date_from, to: params.date_to, days: 7 },
      },
      results: {
        users: { count: 10, data: [{ email: 'user@example.com', created_at: new Date().toISOString() }] },
        files: { count: 25, data: [{ filename: 'report.pdf', file_size: 1024 }] },
        admin_activity_logs: { count: 5, data: [] },
        notifications: { count: 0, data: [] },
        notification_deliveries: { count: 0, data: [] },
        backup_logs: { count: 0, data: [] },
      },
    };
  }
}

export const reportsService = new ReportsService();