"use client";

import { GeneratedReport, SystemOverviewReport, UserActivityReport, StorageUsageReport, CustomReport } from "@/types/reports";
import { StatCard } from "./StatCard";
import { Users, File, HardDrive, HeartPulse, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportDisplayProps {
  report: GeneratedReport;
  onClose: () => void;
  onExport: (format: 'json' | 'csv') => void;
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

const SystemOverviewDisplay = ({ report }: { report: SystemOverviewReport }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="User Statistics" value={report.user_statistics.total_users.toLocaleString()} label="Total Users" icon={Users} colorClass="text-blue-600" />
      <StatCard title="File Statistics" value={report.file_statistics.total_files.toLocaleString()} label="Total Files" icon={File} colorClass="text-emerald-600" />
      <StatCard title="Storage Usage" value={`${report.file_statistics.total_storage_gb.toFixed(1)} GB`} label="Total Storage" icon={HardDrive} colorClass="text-purple-600" />
      <StatCard title="System Performance" value={`${report.system_performance.uptime_percentage}%`} label="Uptime" icon={HeartPulse} colorClass="text-red-600" />
    </div>
    <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-base">Top Admin Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {report.admin_activity.top_actions.map(action => (
            <div key={action.action} className="flex items-center gap-2 p-2 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-sm">{action.action}</span>
              <Badge>{action.count}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

const UserActivityDisplay = ({ report }: { report: UserActivityReport }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Users Analyzed" value={report.summary.total_users_analyzed.toLocaleString()} label="" icon={Users} colorClass="text-blue-600" />
      <StatCard title="Active Users" value={report.summary.active_users_in_period.toLocaleString()} label="in period" icon={Users} colorClass="text-emerald-600" />
      <StatCard title="Files Uploaded" value={report.summary.total_files_in_period.toLocaleString()} label="in period" icon={File} colorClass="text-purple-600" />
      <StatCard title="Avg Files/User" value={report.summary.average_files_per_active_user.toFixed(1)} label="" icon={File} colorClass="text-amber-600" />
    </div>
  </div>
);

const StorageUsageDisplay = ({ report }: { report: StorageUsageReport }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Files" value={report.summary.total_files.toLocaleString()} label="" icon={File} colorClass="text-blue-600" />
      <StatCard title="Total Storage" value={`${report.summary.total_storage_gb.toFixed(1)} GB`} label="" icon={HardDrive} colorClass="text-emerald-600" />
      <StatCard title="Files in Period" value={report.summary.files_in_period.toLocaleString()} label="" icon={File} colorClass="text-purple-600" />
      <StatCard title="Avg File Size" value={`${report.summary.average_file_size_mb.toFixed(1)} MB`} label="" icon={File} colorClass="text-amber-600" />
    </div>
  </div>
);

const CustomReportDisplay = ({ report }: { report: CustomReport }) => (
  <div className="space-y-6">
    {Object.entries(report.results).map(([source, result]) => (
      <Card key={source} className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-base capitalize">{source.replace('_', ' ')} ({result.count} records)</CardTitle>
        </CardHeader>
        <CardContent>
          {result.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-600 dark:text-slate-400">
                  <tr>
                    {Object.keys(result.data[0]).map(key => <th key={key} className="p-2">{key}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {result.data.slice(0, 5).map((row, index) => (
                    <tr key={index} className="border-t border-slate-200 dark:border-slate-700">
                      {Object.values(row).map((value, i) => <td key={i} className="p-2">{String(value)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.data.length > 5 && <p className="text-xs text-center mt-2 text-slate-500">Showing first 5 of {result.count} records. Export for full data.</p>}
            </div>
          ) : <p className="text-sm text-slate-500">No records found for this data source.</p>}
        </CardContent>
      </Card>
    ))}
  </div>
);

export function ReportDisplay({ report, onClose, onExport }: ReportDisplayProps) {
  const renderReportContent = () => {
    switch (report.report_info.type) {
      case 'system_overview': return <SystemOverviewDisplay report={report as SystemOverviewReport} />;
      case 'user_activity': return <UserActivityDisplay report={report as UserActivityReport} />;
      case 'storage_usage': return <StorageUsageDisplay report={report as StorageUsageReport} />;
      case 'custom': return <CustomReportDisplay report={report as CustomReport} />;
      default: return <p>Unknown report type.</p>;
    }
  };

  return (
    <Card className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 shadow-slate-900/5 dark:shadow-black/10 shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{report.report_info.title}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
              <span>Generated: {formatDate(report.report_info.generated_at)}</span>
              <span>Period: {formatDate(report.report_info.period.from)} - {formatDate(report.report_info.period.to)}</span>
              <span>By: {report.report_info.generated_by}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onExport('json')}><Download className="w-4 h-4 mr-2" /> JSON</Button>
            <Button variant="outline" size="sm" onClick={() => onExport('csv')}><Download className="w-4 h-4 mr-2" /> CSV</Button>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {renderReportContent()}
      </CardContent>
    </Card>
  );
}