"use client";

import { useState, useEffect, useCallback } from 'react';
import { AdminFile, FileStats, FilePaginationState, FileSortConfig, FileModalState } from '@/types/admin';
import { fileManagementService } from '@/services/admin/fileManagementService';
import { mockFileStats } from '@/components/admin/files/data';

export function useFileManager() {
  const [stats, setStats] = useState<FileStats>(mockFileStats);
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    owner: '',
    location: 'all',
    status: 'all',
    minSize: '',
    maxSize: '',
  });

  const [sortConfig, setSortConfig] = useState<FileSortConfig>({ key: 'uploadDate', direction: 'desc' });
  
  const [pagination, setPagination] = useState<FilePaginationState>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  const [selectedFileIds, setSelectedFileIds] = useState<Set<string>>(new Set());
  const [modalState, setModalState] = useState<FileModalState>({ type: null, data: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, filesData] = await Promise.all([
        fileManagementService.getStats(),
        fileManagementService.getFiles(filters, sortConfig, { page: pagination.currentPage, pageSize: pagination.pageSize }),
      ]);
      setStats(statsData);
      setFiles(filesData.files);
      setPagination(filesData.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [filters, sortConfig, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleFilters = () => setIsFiltersVisible(prev => !prev);

  const handleSort = (key: keyof AdminFile) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSelectionChange = (fileId: string, isSelected: boolean) => {
    setSelectedFileIds(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(fileId);
      } else {
        newSet.delete(fileId);
      }
      return newSet;
    });
  };

  const handleFileAction = (type: FileModalState['type'], data: any) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  return {
    stats,
    files,
    loading,
    error,
    viewMode,
    setViewMode,
    isFiltersVisible,
    toggleFilters,
    filters,
    setFilters,
    sortConfig,
    handleSort,
    pagination,
    handlePageChange,
    selectedFileIds,
    handleSelectionChange,
    modalState,
    handleFileAction,
    closeModal,
  };
}