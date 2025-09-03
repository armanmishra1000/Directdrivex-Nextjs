"use client";

import { useState, useEffect } from "react";
import { FileBrowserHeader } from "@/components/admin/files/FileBrowserHeader";
import { FileFilters } from "@/components/admin/files/FileFilters";
import { FileTypeAnalytics } from "@/components/admin/files/FileTypeAnalytics";
import { BulkActionsBar } from "@/components/admin/files/BulkActionsBar";
import { FileListView } from "@/components/admin/files/FileListView";
import { FileGridView } from "@/components/admin/files/FileGridView";
import { FilePagination } from "@/components/admin/files/FilePagination";
import { mockFiles, mockStorageStats, mockFileTypeAnalytics } from "@/components/admin/files/data";
import { FileItem, StorageStats, FileTypeAnalytics as FileTypeAnalyticsType, FilterState, SortConfig, PaginationState } from "@/types/file-browser";

export default function FileBrowserPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [fileTypeAnalytics, setFileTypeAnalytics] = useState<FileTypeAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    search: '', type: 'all', owner: '', storage: 'all', status: 'all',
  });
  const [sort, setSort] = useState<SortConfig>({ key: 'upload_date', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1, pageSize: 50, totalItems: 0, totalPages: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setFiles(mockFiles);
      setStorageStats(mockStorageStats);
      setFileTypeAnalytics(mockFileTypeAnalytics);
      setPagination(prev => ({ ...prev, totalItems: mockFiles.length, totalPages: Math.ceil(mockFiles.length / prev.pageSize) }));
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <FileBrowserHeader 
        stats={storageStats}
        loading={loading}
        onCleanup={() => alert('Cleanup initiated')}
        onRefresh={loadData}
      />
      
      <FileFilters 
        filters={filters}
        onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      {fileTypeAnalytics && <FileTypeAnalytics data={fileTypeAnalytics.file_types} />}
      
      <div className="overflow-hidden border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
        <BulkActionsBar 
          selectedCount={selectedFileIds.size}
          onAction={(action) => alert(`Bulk action: ${action}`)}
          onClear={() => setSelectedFileIds(new Set())}
        />

        {viewMode === 'list' ? (
          <FileListView 
            files={files}
            selectedFileIds={selectedFileIds}
            setSelectedFileIds={setSelectedFileIds}
            sortConfig={sort}
            onSortChange={(key) => setSort(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }))}
            onFileOperation={(op, file) => alert(`Operation: ${op} on ${file.filename}`)}
          />
        ) : (
          <div className="p-4">
            <FileGridView 
              files={files}
              selectedFileIds={selectedFileIds}
              setSelectedFileIds={setSelectedFileIds}
              onFileOperation={(op, file) => alert(`Operation: ${op} on ${file.filename}`)}
            />
          </div>
        )}

        <FilePagination 
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.pageSize}
        />
      </div>
    </div>
  );
}