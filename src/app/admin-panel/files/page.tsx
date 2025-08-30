"use client";

import { useState, useEffect, useMemo } from "react";
import { FolderOpen, List, LayoutGrid, Search, Filter, Trash2 } from "lucide-react";
import { mockFiles, mockStorageStats, mockFileTypeAnalytics } from "@/components/admin/files/data";
import { FileStatsCards } from "@/components/admin/files/FileStatsCards";
import { FileFilters } from "@/components/admin/files/FileFilters";
import { FileTypeAnalytics } from "@/components/admin/files/FileTypeAnalytics";
import { FileListView } from "@/components/admin/files/FileListView";
import { FileGridView } from "@/components/admin/files/FileGridView";
import { BulkActionsBar } from "@/components/admin/files/BulkActionsBar";
import { FilePagination } from "@/components/admin/files/FilePagination";
import { FileModals } from "@/components/admin/files/FileModals";
import { AdminFile, ModalState } from "@/types/admin-files";

export default function FileBrowserPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [modalState, setModalState] = useState<ModalState>({ type: null, data: null });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    fileType: "all",
    owner: "",
    location: "all",
    status: "all",
    minSize: "",
    maxSize: "",
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'uploadDate', direction: 'desc' });

  // Simulate data fetching
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFiles(mockFiles);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = files.filter(file => {
      const searchMatch = file.filename.toLowerCase().includes(filters.search.toLowerCase()) || file.owner.toLowerCase().includes(filters.search.toLowerCase());
      const typeMatch = filters.fileType === 'all' || file.type === filters.fileType;
      const ownerMatch = filters.owner === '' || file.owner.toLowerCase().includes(filters.owner.toLowerCase());
      const locationMatch = filters.location === 'all' || file.storage === filters.location;
      const statusMatch = filters.status === 'all' || file.status === filters.status;
      const minSizeMatch = filters.minSize === '' || file.size >= parseInt(filters.minSize);
      const maxSizeMatch = filters.maxSize === '' || file.size <= parseInt(filters.maxSize);
      return searchMatch && typeMatch && ownerMatch && locationMatch && statusMatch && minSizeMatch && maxSizeMatch;
    });

    filtered.sort((a, b) => {
      const key = sortConfig.key as keyof AdminFile;
      if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [files, filters, sortConfig]);

  const paginatedFiles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredAndSortedFiles.slice(start, end);
  }, [filteredAndSortedFiles, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedFiles.length / pageSize);

  const handleModalOpen = (type: ModalState['type'], data: any) => {
    setModalState({ type, data });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-500 dark:text-emerald-400 rounded-lg flex items-center justify-center">
          <FolderOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">File Browser</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage all files across storage systems.</p>
        </div>
      </div>

      <FileStatsCards stats={mockStorageStats} />
      <FileTypeAnalytics analytics={mockFileTypeAnalytics} />

      <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FileFilters filters={filters} setFilters={setFilters} />
            <div className="inline-flex rounded-lg shadow-sm">
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>
                <List className="w-5 h-5" />
              </button>
              <button onClick={() => setViewMode('grid')} className={`px-3 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}>
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <BulkActionsBar selectedCount={selectedFileIds.size} onClear={() => setSelectedFileIds(new Set())} />

        {viewMode === 'list' ? (
          <FileListView
            files={paginatedFiles}
            loading={loading}
            selectedFileIds={selectedFileIds}
            setSelectedFileIds={setSelectedFileIds}
            onAction={handleModalOpen}
            sortConfig={sortConfig}
            setSortConfig={setSortConfig}
          />
        ) : (
          <FileGridView
            files={paginatedFiles}
            loading={loading}
            selectedFileIds={selectedFileIds}
            setSelectedFileIds={setSelectedFileIds}
            onAction={handleModalOpen}
          />
        )}

        <FilePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAndSortedFiles.length}
          itemsPerPage={pageSize}
        />
      </div>

      <FileModals modalState={modalState} onClose={() => setModalState({ type: null, data: null })} />
    </div>
  );
}