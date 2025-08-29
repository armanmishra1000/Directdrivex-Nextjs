"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  FileText,
  Database,
  CloudUpload,
  Network,
  Download,
  Share2,
  FolderPlus,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data to populate the dashboard
const mockUser = {
  email: "user@directdrive.com",
  totalFiles: 1258,
  storageUsedGB: 6.8,
  storageLimitGB: 10,
};

const recentFiles = [
  {
    type: "pdf",
    name: "presentation-final.pdf",
    size: "2.4 MB",
    time: "2 hours ago",
  },
  {
    type: "doc",
    name: "project-requirements.docx",
    size: "1.8 MB",
    time: "4 hours ago",
  },
  {
    type: "sql",
    name: "database-backup.sql",
    size: "15.2 MB",
    time: "1 day ago",
  },
];

const fileTypeIcons = {
  pdf: {
    icon: <FileText className="w-5 h-5 text-red-600" strokeWidth={2} />,
    bg: "bg-red-100",
  },
  doc: {
    icon: <FileText className="w-5 h-5 text-blue-600" strokeWidth={2} />,
    bg: "bg-blue-100",
  },
  sql: {
    icon: <Database className="w-5 h-5 text-green-600" strokeWidth={2} />,
    bg: "bg-green-100",
  },
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setLoading(false);
      // To test error state, uncomment the line below
      // setError("Failed to load dashboard data. Please try again.");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const storagePercentage =
    (mockUser.storageUsedGB / mockUser.storageLimitGB) * 100;
  const remainingStorageGB = mockUser.storageLimitGB - mockUser.storageUsedGB;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-bolt-blue mx-auto animate-spin mb-4" />
          <p className="text-lg text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-bolt-blue hover:bg-bolt-blue/90 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 -z-10" />
      <div className="relative z-10 min-h-screen font-inter">
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Welcome back, {mockUser.email}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-bolt-blue bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                Upload Files
              </button>
              <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-bolt-blue hover:bg-bolt-blue/90 rounded-lg transition-colors">
                <Upload className="w-4 h-4 mr-2" strokeWidth={2} />
                Quick Upload
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Card: Total Files */}
            <StatCard
              title="Total Files"
              value={mockUser.totalFiles.toLocaleString()}
              subtitle="Files in your account"
              icon={<FileText className="w-6 h-6 text-bolt-blue" strokeWidth={2} />}
              iconBg="bg-bolt-blue/10"
            />
            {/* Stat Card: Storage Used */}
            <StatCard
              title="Storage Used"
              value={`${mockUser.storageUsedGB} GB`}
              subtitle={`of ${mockUser.storageLimitGB} GB available`}
              icon={<Database className="w-6 h-6 text-bolt-cyan" strokeWidth={2} />}
              iconBg="bg-bolt-cyan/10"
            >
              <ProgressBar percentage={storagePercentage} color="bg-bolt-cyan" />
            </StatCard>
            {/* Stat Card: Remaining Storage */}
            <StatCard
              title="Remaining Storage"
              value={`${remainingStorageGB.toFixed(1)} GB`}
              subtitle="storage available"
              icon={<CloudUpload className="w-6 h-6 text-green-500" strokeWidth={2} />}
              iconBg="bg-green-500/10"
            />
            {/* Stat Card: Usage Percentage */}
            <StatCard
              title="Usage Percentage"
              value={`${storagePercentage.toFixed(0)}%`}
              subtitle="of storage used"
              icon={<Network className="w-6 h-6 text-bolt-purple" strokeWidth={2} />}
              iconBg="bg-bolt-purple/10"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Files */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Recent Files
                </h3>
                <a
                  href="#"
                  className="text-bolt-blue hover:underline text-sm font-medium"
                >
                  View all
                </a>
              </div>
              <div className="divide-y divide-slate-100 -mx-6">
                {recentFiles.map((file, index) => (
                  <FileRow key={index} file={file} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <QuickActionButton icon={<FolderPlus className="w-5 h-5" />}>
                    Create New Folder
                  </QuickActionButton>
                  <QuickActionButton icon={<Share2 className="w-5 h-5" />}>
                    Share Link
                  </QuickActionButton>
                  <QuickActionButton icon={<Download className="w-5 h-5" />}>
                    Download All
                  </QuickActionButton>
                </div>
              </div>

              {/* Storage Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Storage
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Used</span>
                    <span className="font-medium text-slate-900">
                      {mockUser.storageUsedGB} GB
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Available</span>
                    <span className="font-medium text-slate-900">
                      {remainingStorageGB.toFixed(1)} GB
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-bolt-blue to-bolt-cyan h-3 rounded-full"
                      style={{ width: `${storagePercentage}%` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
                  </div>
                  <p className="text-xs text-center text-slate-500">
                    {storagePercentage.toFixed(0)}% of your storage is used
                  </p>
                  <button className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-bolt-blue hover:bg-bolt-blue/90 rounded-lg transition-colors">
                    Upgrade Storage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Sub-components for cleaner structure

const StatCard = ({ title, value, subtitle, icon, iconBg, children }: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  children?: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div
        className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          iconBg
        )}
      >
        {icon}
      </div>
    </div>
    {children && <div className="mt-4">{children}</div>}
  </div>
);

const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
  <div className="w-full bg-slate-200 rounded-full h-2 relative overflow-hidden">
    <div
      className={cn("h-2 rounded-full", color)}
      style={{ width: `${percentage}%` }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
  </div>
);

const FileRow = ({ file }: { file: (typeof recentFiles)[0] }) => {
  const { icon, bg } = fileTypeIcons[file.type as keyof typeof fileTypeIcons];
  return (
    <div className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-center space-x-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            bg
          )}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-slate-500">
            {file.size} &bull; {file.time}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <Download className="w-4 h-4" strokeWidth={2} />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
            <Share2 className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <button className="w-full inline-flex items-center justify-start px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-bolt-blue hover:border-bolt-blue transition-colors">
    <span className="mr-3">{icon}</span>
    {children}
  </button>
);