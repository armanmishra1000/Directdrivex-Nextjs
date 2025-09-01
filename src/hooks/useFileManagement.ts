"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  fileManagementService, 
  AdminFile, 
  FileSearchParams, 
  StorageStats, 
  FileTypeAnalytics,
  FileType,
  StorageLocation,
  FileStatus
} from '@/services/admin/fileManagementService';
import { adminSocketService } from '@/services/adminSocketService';
import { adminStatsService } from '@/services/adminStatsService';
import { toastService } from '@/services/toastService';

interface FileFilters {
  search: string;
  fileType: FileType | 'all';
  owner: string;
  storageLocation: StorageLocation | 'all';
  status: FileStatus | 'all';
  sizeMin: number | null;
  sizeMax: number | null;
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalFiles: number;
  totalPages: number;
}

interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export function useFileManagement() {
  // Core state
  const [files, setFiles] = useState<AdminFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // UI state
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  
  // Data state
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [fileTypeAnalytics, setFileTypeAnalytics] = useState<FileTypeAnalytics | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<FileFilters>({
    search: '',
    fileType: 'all',
    owner: '',
    storageLocation: 'all',
    status: 'all',
    sizeMin: null,
    sizeMax: null
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 50,
    totalFiles: 0,
    totalPages: 0
  });
  
  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: 'upload_date',
    sortOrder: 'desc'
  });

  // Real-time updates
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);

  /**
   * Load files with current filters and pagination
   */
  const loadFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: FileSearchParams = {
        page: pagination.currentPage,
        limit: pagination.pageSize,
        sort_by: sortConfig.sortBy,
        sort_order: sortConfig.sortOrder
      };
      
      // Add filters
      if (filters.search) params.search = filters.search;
      if (filters.fileType !== 'all') params.file_type = filters.fileType;
      if (filters.owner) params.owner_email = filters.owner;
      if (filters.storageLocation !== 'all') params.storage_location = filters.storageLocation;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.sizeMin !== null) params.size_min = filters.sizeMin;
      if (filters.sizeMax !== null) params.size_max = filters.sizeMax;
      
      const response = await fileManagementService.getFiles(params);
      
      setFiles(response.files);
      setStorageStats(response.storage_stats);
      setPagination(prev => ({
        ...prev,
        totalFiles: response.total,
        totalPages: response.total_pages
      }));
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load files';
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.pageSize, sortConfig, filters]);

  /**
   * Load file type analytics
   */
  const loadFileTypeAnalytics = useCallback(async () => {
    try {
      const analytics = await fileManagementService.getFileTypeAnalytics();
      setFileTypeAnalytics(analytics);
    } catch (err) {
      console.error('Error loading file type analytics:', err);
    }
  }, []);

  /**
   * Download file
   */
  const downloadFile = useCallback(async (file: AdminFile) => {
    try {
      const blob = await fileManagementService.downloadFile(file._id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toastService.success(`Downloaded ${file.filename}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file';
      toastService.error(errorMessage);
    }
  }, []);

  /**
   * Delete file with confirmation
   */
  const deleteFile = useCallback(async (file: AdminFile, reason?: string) => {
    try {
      await fileManagementService.deleteFile(file._id, reason);
      toastService.success(`Deleted ${file.filename}`);
      
      // Refresh data
      await loadFiles();
      await loadFileTypeAnalytics();
      
      // Note: Admin panel stats will be updated on next dashboard load
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      toastService.error(errorMessage);
    }
  }, [loadFiles, loadFileTypeAnalytics]);

  /**
   * Check file integrity
   */
  const checkFileIntegrity = useCallback(async (file: AdminFile) => {
    try {
      const result = await fileManagementService.checkFileIntegrity(file._id);
      
      if (result.status === 'verified') {
        toastService.success(`File integrity verified - ${result.checksum_match ? 'Checksum match' : 'No checksum'}`);
      } else if (result.status === 'corrupted') {
        toastService.error(`File corruption detected: ${result.corruption_type}`);
      } else {
        toastService.error(`File inaccessible: ${result.error}`);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check file integrity';
      toastService.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Move file to different location
   */
  const moveFile = useCallback(async (file: AdminFile, targetLocation: string, reason?: string) => {
    try {
      const result = await fileManagementService.moveFile(file._id, targetLocation, reason);
      toastService.success(`File moved to ${result.target_location || targetLocation}`);
      
      // Refresh data
      await loadFiles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move file';
      toastService.error(errorMessage);
    }
  }, [loadFiles]);

  /**
   * Force backup file
   */
  const forceBackup = useCallback(async (file: AdminFile, reason?: string) => {
    try {
      const result = await fileManagementService.forceBackup(file._id, reason);
      toastService.success(`File backup completed! Backup path: ${result.backup_path}`);
      
      // Refresh data
      await loadFiles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to backup file';
      toastService.error(errorMessage);
    }
  }, [loadFiles]);

  /**
   * Recover file from backup
   */
  const recoverFile = useCallback(async (file: AdminFile, reason?: string) => {
    try {
      await fileManagementService.recoverFile(file._id, reason);
      toastService.success('File recovered successfully from backup!');
      
      // Refresh data
      await loadFiles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to recover file';
      if (errorMessage.includes('no completed backup')) {
        toastService.error('Cannot recover file: No completed backup available');
      } else {
        toastService.error(errorMessage);
      }
    }
  }, [loadFiles]);

  /**
   * Quarantine file
   */
  const quarantineFile = useCallback(async (file: AdminFile, reason: string) => {
    try {
      await fileManagementService.quarantineFile(file._id, reason);
      toastService.success(`File ${file.filename} quarantined successfully`);
      
      // Refresh data
      await loadFiles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to quarantine file';
      toastService.error(errorMessage);
    }
  }, [loadFiles]);

  /**
   * Execute bulk action
   */
  const executeBulkAction = useCallback(async (action: string, reason?: string) => {
    if (selectedFiles.size === 0) return;
    
    try {
      const result = await fileManagementService.bulkAction(Array.from(selectedFiles), action, reason);
      toastService.success(result.message);
      
      // Clear selection
      setSelectedFiles(new Set());
      
      // Refresh data
      await loadFiles();
      await loadFileTypeAnalytics();
      
      // Note: Admin panel stats will be updated on next dashboard load
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bulk action failed';
      toastService.error(errorMessage);
    }
  }, [selectedFiles, loadFiles, loadFileTypeAnalytics]);

  /**
   * Handle orphaned files
   */
  const handleOrphanedFiles = useCallback(async () => {
    try {
      const response = await fileManagementService.getOrphanedFiles({ page: 1, limit: 50 });
      
      if (response.orphaned_files.length === 0) {
        toastService.info('No orphaned files found!');
        return response;
      }
      
      toastService.info(`Found ${response.total} orphaned files`);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load orphaned files';
      toastService.error(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Cleanup orphaned files
   */
  const cleanupOrphanedFiles = useCallback(async (cleanupType: 'soft' | 'hard', daysOld: number) => {
    try {
      const result = await fileManagementService.cleanupOrphanedFiles(cleanupType, daysOld);
      toastService.success(`Cleanup completed! ${result.files_affected} files affected`);
      
      // Refresh data
      await loadFiles();
      await loadFileTypeAnalytics();
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to cleanup orphaned files';
      toastService.error(errorMessage);
      throw err;
    }
  }, [loadFiles, loadFileTypeAnalytics]);

  /**
   * Get file preview
   */
  const getFilePreview = useCallback(async (file: AdminFile) => {
    if (!file.preview_available) {
      toastService.error('Preview not available for this file type');
      return;
    }
    
    try {
      const preview = await fileManagementService.getFilePreview(file._id);
      window.open(preview.preview_url, '_blank');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load file preview';
      toastService.error(errorMessage);
    }
  }, []);

  /**
   * Handle page change
   */
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);

  /**
   * Handle page size change
   */
  const handlePageSizeChange = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, currentPage: 1 }));
  }, []);

  /**
   * Handle sort change
   */
  const handleSortChange = useCallback((field: string) => {
    setSortConfig(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters: Partial<FileFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      search: '',
      fileType: 'all',
      owner: '',
      storageLocation: 'all',
      status: 'all',
      sizeMin: null,
      sizeMax: null
    });
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Toggle file selection
   */
  const toggleFileSelection = useCallback((fileId: string) => {
    setSelectedFiles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(fileId)) {
        newSelection.delete(fileId);
      } else {
        newSelection.add(fileId);
      }
      return newSelection;
    });
  }, []);

  /**
   * Select all files on current page
   */
  const selectAllFiles = useCallback(() => {
    if (selectedFiles.size === files.length && files.length > 0) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map(f => f._id)));
    }
  }, [files, selectedFiles.size]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    setSelectedFiles(new Set());
  }, []);

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async () => {
    await Promise.all([
      loadFiles(),
      loadFileTypeAnalytics()
    ]);
  }, []);

  // Computed values
  const isAllSelected = useMemo(() => 
    selectedFiles.size === files.length && files.length > 0, 
    [selectedFiles.size, files.length]
  );
  
  const isIndeterminate = useMemo(() => 
    selectedFiles.size > 0 && selectedFiles.size < files.length, 
    [selectedFiles.size, files.length]
  );

  const availableOwners = useMemo(() => 
    [...new Set(files.map(file => file.owner_email))].sort(), 
    [files]
  );

  // Load initial data
  useEffect(() => {
    loadFiles();
    loadFileTypeAnalytics();
  }, [pagination.currentPage, pagination.pageSize, sortConfig, filters]);

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!realTimeEnabled) return;

    const unsubscribe = adminSocketService.onEvent((event: string) => {
      if (event.includes('file_uploaded') || 
          event.includes('file_deleted') || 
          event.includes('file_updated')) {
        // Refresh file list when files change
        loadFiles();
        loadFileTypeAnalytics();
      }
    });

    return unsubscribe;
  }, [realTimeEnabled, loadFiles, loadFileTypeAnalytics]);

  // Utility functions
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }, []);

  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleString();
  }, []);

  const getFileIcon = useCallback((fileType: FileType) => {
    const iconMap = {
      document: 'document',
      image: 'image',
      video: 'video',
      audio: 'audio',
      archive: 'archive',
      other: 'file'
    };
    return iconMap[fileType] || 'file';
  }, []);

  const getStatusBadgeClass = useCallback((status: FileStatus): string => {
    const statusClasses = {
      completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
      pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
      uploading: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
      failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      quarantined: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    };
    return statusClasses[status] || statusClasses.completed;
  }, []);

  const getStorageBadgeClass = useCallback((location: StorageLocation): string => {
    const locationClasses = {
      gdrive: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      hetzner: "bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-400"
    };
    return locationClasses[location];
  }, []);

  const getStorageLocationName = useCallback((location: StorageLocation): string => {
    return location === 'gdrive' ? 'Google Drive' : 'Hetzner';
  }, []);

  return {
    // State
    files,
    loading,
    error,
    viewMode,
    showFilters,
    selectedFiles,
    storageStats,
    fileTypeAnalytics,
    filters,
    pagination,
    sortConfig,
    realTimeEnabled,
    
    // Computed values
    isAllSelected,
    isIndeterminate,
    availableOwners,
    
    // Actions
    loadFiles,
    loadFileTypeAnalytics,
    downloadFile,
    deleteFile,
    checkFileIntegrity,
    moveFile,
    forceBackup,
    recoverFile,
    quarantineFile,
    executeBulkAction,
    handleOrphanedFiles,
    cleanupOrphanedFiles,
    getFilePreview,
    refreshData,
    
    // UI actions
    setViewMode,
    setShowFilters,
    toggleFileSelection,
    selectAllFiles,
    clearSelection,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
    updateFilters,
    clearFilters,
    setRealTimeEnabled,
    
    // Utility functions
    formatBytes,
    formatDate,
    getFileIcon,
    getStatusBadgeClass,
    getStorageBadgeClass,
    getStorageLocationName
  };
}
