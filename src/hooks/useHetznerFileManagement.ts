import { useState, useEffect, useCallback } from 'react';
import { HetznerFileItem, HetznerStats, HetznerFileTypeAnalytics } from '@/types/hetzner';
import { hetznerFileManagementService } from '@/services/admin/hetznerFileManagementService';

export function useHetznerFileManagement() {
  const [files, setFiles] = useState<HetznerFileItem[]>([]);
  const [stats, setStats] = useState<HetznerStats | null>(null);
  const [analytics, setAnalytics] = useState<HetznerFileTypeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalFiles, setTotalFiles] = useState(0);
  const [pageSize] = useState(50);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState('upload_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState({
    search: '',
    fileType: '',
    owner: '',
    backupStatus: '',
    sizeMin: null,
    sizeMax: null,
  });

  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await hetznerFileManagementService.getFiles({
        page: currentPage,
        limit: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
        ...filters,
      });
      setFiles(response.files);
      setStats(response.hetzner_stats);
      setTotalFiles(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError('Failed to load Hetzner files.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, sortBy, sortOrder, filters]);

  const loadAnalytics = useCallback(async () => {
    try {
      const response = await hetznerFileManagementService.getFileTypeAnalytics();
      setAnalytics(response);
    } catch (err) {
      console.error("Failed to load analytics", err);
    }
  }, []);

  useEffect(() => {
    loadFiles();
    loadAnalytics();
  }, [loadFiles, loadAnalytics]);

  const clearFilters = () => {
    setFilters({
      search: '',
      fileType: '',
      owner: '',
      backupStatus: '',
      sizeMin: null,
      sizeMax: null,
    });
    setCurrentPage(1);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(f => f._id));
    }
  };

  const clearSelection = () => setSelectedFiles([]);

  const setSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Placeholder file operations
  const downloadFile = async (file: HetznerFileItem) => alert(`Downloading ${file.filename}`);
  const previewFile = async (file: HetznerFileItem) => alert(`Previewing ${file.filename}`);
  const recoverFile = async (file: HetznerFileItem) => alert(`Recovering ${file.filename}`);
  const deleteFile = async (file: HetznerFileItem) => alert(`Deleting ${file.filename}`);
  const executeBulkAction = async (action: string) => alert(`Executing ${action} on ${selectedFiles.length} files.`);

  return {
    files, stats, analytics, loading, error, currentPage, totalPages, totalFiles, pageSize,
    selectedFiles, showFilters, viewMode, sortBy, sortOrder, filters,
    loadFiles, loadAnalytics, setFilters, clearFilters, setShowFilters,
    toggleFileSelection, selectAllFiles, clearSelection, setSortBy: setSort,
    setPage: setCurrentPage, setViewMode,
    downloadFile, previewFile, recoverFile, deleteFile, executeBulkAction,
  };
}