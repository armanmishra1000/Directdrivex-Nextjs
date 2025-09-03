"use client";

import { useState, useEffect } from 'react';
import { DriveHeader } from '@/components/admin/drive/DriveHeader';
import { DriveFilters } from '@/components/admin/drive/DriveFilters';
import { DriveAnalytics } from '@/components/admin/drive/DriveAnalytics';
import { DriveBulkActions } from '@/components/admin/drive/DriveBulkActions';
import { DriveListView } from '@/components/admin/drive/DriveListView';
import { DriveGridView } from '@/components/admin/drive/DriveGridView';
import { DrivePagination } from '@/components/admin/drive/DrivePagination';
import { mockFiles, mockDriveStats, mockFileTypeAnalytics } from '@/components/admin/drive/data';
import { DriveFileItem, DriveStats, FileTypeAnalytics } from '@/types/drive';

export default function DriveManagementPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [stats, setStats] = useState<DriveStats | null>(null);
  const [analytics, setAnalytics] = useState<FileTypeAnalytics | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setFiles(mockFiles);
      setStats(mockDriveStats);
      setAnalytics(mockFileTypeAnalytics);
      setLoading(false);
    }, 1000);
  }, []);

  const handleClearFilters = () => {
    // Logic to clear filters
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DriveHeader
        stats={stats}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onRefresh={() => {}}
      />
      <DriveFilters
        showFilters={showFilters}
        onClearFilters={handleClearFilters}
      />
      <DriveAnalytics analytics={analytics} />
      <DriveBulkActions selectedCount={selectedFiles.length} onClear={() => setSelectedFiles([])} />
      
      <div className="overflow-hidden border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
        {viewMode === 'list' ? (
          <DriveListView files={files} />
        ) : (
          <div className="p-4">
            <DriveGridView files={files} />
          </div>
        )}
        <DrivePagination
          currentPage={1}
          totalPages={10}
          totalFiles={stats?.total_files || 0}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
}