"use client";

import { useState, useMemo } from "react";
import { FileBrowserHeader } from "@/components/admin/files/FileBrowserHeader";
import { FileFilters } from "@/components/admin/files/FileFilters";
import { FileTypeAnalytics } from "@/components/admin/files/FileTypeAnalytics";
import { BulkActionsBar } from "@/components/admin/files/BulkActionsBar";
import { FileListView } from "@/components/admin/files/FileListView";
import { FileGridView } from "@/components/admin/files/FileGridView";
import { FilePagination } from "@/components/admin/files/FilePagination";
import { mockFiles, mockStorageStats, mockFileTypeAnalytics } from "@/components/admin/files/data";
import { FileItem, FilterState, SortConfig } from "@/types/file-browser";

export default function FileBrowserPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'all',
    owner: '',
    storage: 'all',
    status: 'all',
    sizeMin: 0,
    sizeMax: 50 * 1024 * 1024 * 1024, // 50GB
  });
  const [sort, setSort] = useState<SortConfig>({ key: 'date', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredAndSortedFiles = useMemo(() => {
    let filtered = mockFiles.filter(file => {
      const searchLower = filters.search.toLowerCase();
      const sizeBytes = file.size;

      return (
        (file.name.toLowerCase().includes(searchLower) || file.owner.toLowerCase().includes(searchLower)) &&
        (filters.type === 'all' || file.type === filters.type) &&
        (filters.storage === 'all' || file.storage === filters.storage) &&
        (filters.status === 'all' || file.status === filters.status) &&
        (sizeBytes >= filters.sizeMin && sizeBytes <= filters.sizeMax)
      );
    });

    return filtered.sort((a, b) => {
      const aValue = a[sort.key];
      const bValue = b[sort.key];
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filters, sort]);

  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedFiles.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedFiles, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedFiles.length / itemsPerPage);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };
  
  const handleSortChange = (key: keyof FileItem) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="space-y-6">
      <FileBrowserHeader 
        stats={mockStorageStats} 
        onCleanup={() => alert('Cleanup initiated')}
      />
      <FileFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <FileTypeAnalytics data={mockFileTypeAnalytics} />
      
      <BulkActionsBar 
        selectedCount={selectedFileIds.size}
        onAction={(action) => alert(`Bulk action: ${action}`)}
        onClear={() => setSelectedFileIds(new Set())}
      />

      {viewMode === 'list' ? (
        <FileListView 
          files={paginatedFiles}
          selectedFileIds={selectedFileIds}
          setSelectedFileIds={setSelectedFileIds}
          sortConfig={sort}
          onSortChange={handleSortChange}
        />
      ) : (
        <FileGridView 
          files={paginatedFiles}
          selectedFileIds={selectedFileIds}
          setSelectedFileIds={setSelectedFileIds}
        />
      )}

      <FilePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredAndSortedFiles.length}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}