import { useState, useCallback, useEffect, useMemo } from 'react';
import { AdminFile, StorageStats, FileTypeAnalytics } from '@/types/admin';
import { 
  fileManagementService, 
  type FileQueryParams, 
  type FileListResponse, 
  type BulkActionResponse,
  type OrphanedFilesResponse,
  type FileOperationResult
} from '@/services/admin/fileManagementService';
import { activityLogsService } from '@/services/admin/activityLogsService';
import { useAdminSocket } from './useAdminSocket';
import { toast } from 'sonner';

export type ViewMode = 'list' | 'grid';
export type SortField = 'filename' | 'size_bytes' | 'upload_date' | 'owner_email';
export type SortOrder = 'asc' | 'desc';

interface FileBrowserState {
  // Data
  files: AdminFile[];
  selectedFiles: string[];
  storageStats: StorageStats | null;
  fileTypeAnalytics: FileTypeAnalytics | null;
  
  // Pagination
  currentPage: number;
  pageSize: number;
  totalFiles: number;
  totalPages: number;
  
  // Filters
  searchTerm: string;
  fileTypeFilter: string;
  ownerFilter: string;
  storageLocationFilter: string;
  statusFilter: string;
  sizeMinFilter: number | null;
  sizeMaxFilter: number | null;
  
  // Sorting
  sortBy: SortField;
  sortOrder: SortOrder;
  
  // UI State
  loading: boolean;
  error: string | null;
  showFilters: boolean;
  viewMode: ViewMode;
  showBulkActions: boolean;
  bulkActionType: string;
  bulkActionReason: string;
}

const initialState: FileBrowserState = {
    files: [],
    selectedFiles: [],
  storageStats: null,
  fileTypeAnalytics: null,
      currentPage: 1,
      pageSize: 50,
      totalFiles: 0,
  totalPages: 0,
  searchTerm: '',
  fileTypeFilter: '',
  ownerFilter: '',
  storageLocationFilter: '',
  statusFilter: '',
  sizeMinFilter: null,
  sizeMaxFilter: null,
  sortBy: 'upload_date',
  sortOrder: 'desc',
  loading: false,
  error: null,
  showFilters: false,
    viewMode: 'list',
  showBulkActions: false,
  bulkActionType: '',
  bulkActionReason: ''
};

export function useFileBrowser() {
  const [state, setState] = useState<FileBrowserState>(initialState);
  const { isConnected } = useAdminSocket();

  // Memoized query parameters
  const queryParams = useMemo((): FileQueryParams => ({
    page: state.currentPage,
    limit: state.pageSize,
    search: state.searchTerm || undefined,
    file_type: state.fileTypeFilter || undefined,
    owner_email: state.ownerFilter || undefined,
    storage_location: state.storageLocationFilter || undefined,
    file_status: state.statusFilter || undefined,
    size_min: state.sizeMinFilter || undefined,
    size_max: state.sizeMaxFilter || undefined,
    sort_by: state.sortBy,
    sort_order: state.sortOrder
  }), [
    state.currentPage,
    state.pageSize,
    state.searchTerm,
    state.fileTypeFilter,
    state.ownerFilter,
    state.storageLocationFilter,
    state.statusFilter,
    state.sizeMinFilter,
    state.sizeMaxFilter,
    state.sortBy,
    state.sortOrder
  ]);

  /**
   * Load files with current filters and pagination
   */
  const loadFiles = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: FileListResponse = await fileManagementService.getFiles(queryParams);
      
      setState(prev => ({
        ...prev,
        files: response.files,
        totalFiles: response.total,
        totalPages: response.total_pages,
        storageStats: response.storage_stats,
        loading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load files';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false
      }));
        toast.error(errorMessage);
      }
  }, [queryParams]);

  /**
   * Load file type analytics
   */
  const loadFileTypeAnalytics = useCallback(async () => {
    try {
      const analytics = await fileManagementService.getFileTypeAnalytics();
      setState(prev => ({ ...prev, fileTypeAnalytics: analytics }));
    } catch (error) {
      console.error('Failed to load file type analytics:', error);
    }
  }, []);

  /**
   * Log file operation for audit trail
   */
  const logFileOperation = useCallback(async (operation: string, fileId: string, details?: any) => {
    try {
      await activityLogsService.logActivity({
        action: `file_${operation}`,
        entity: 'file',
        entity_id: fileId,
        details: details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('Failed to log file operation:', error);
    }
  }, []);

  /**
   * Search files
   */
  const onSearch = useCallback(() => {
    setState(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  /**
   * Update filters
   */
  const setFilters = useCallback((filters: Partial<FileQueryParams>) => {
    setState(prev => ({
      ...prev,
      searchTerm: filters.search ?? prev.searchTerm,
      fileTypeFilter: filters.file_type ?? prev.fileTypeFilter,
      ownerFilter: filters.owner_email ?? prev.ownerFilter,
      storageLocationFilter: filters.storage_location ?? prev.storageLocationFilter,
      statusFilter: filters.file_status ?? prev.statusFilter,
      sizeMinFilter: filters.size_min ?? prev.sizeMinFilter,
      sizeMaxFilter: filters.size_max ?? prev.sizeMaxFilter,
      currentPage: 1 // Reset to first page when filters change
    }));
  }, []);

  /**
   * Update sorting
   */
  const onSortChange = useCallback((field: SortField) => {
    setState(prev => {
      const newSortOrder = prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc';
      return {
        ...prev,
        sortBy: field,
        sortOrder: newSortOrder
      };
    });
  }, []);

  /**
   * Change page
   */
  const onPageChange = useCallback((page: number) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  /**
   * Toggle file selection
   */
  const toggleFileSelection = useCallback((fileId: string) => {
    setState(prev => {
      const selectedFiles = prev.selectedFiles.includes(fileId)
        ? prev.selectedFiles.filter(id => id !== fileId)
        : [...prev.selectedFiles, fileId];

      return {
        ...prev,
        selectedFiles,
        showBulkActions: selectedFiles.length > 0
      };
    });
  }, []);

  /**
   * Select all files
   */
  const selectAllFiles = useCallback(() => {
    setState(prev => {
      const allSelected = prev.selectedFiles.length === prev.files.length;
      const selectedFiles = allSelected ? [] : prev.files.map(f => f._id);

      return {
        ...prev,
        selectedFiles,
        showBulkActions: selectedFiles.length > 0
      };
    });
  }, []);

  /**
   * Clear file selection
   */
  const clearSelection = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFiles: [],
      showBulkActions: false,
      bulkActionType: '',
      bulkActionReason: ''
    }));
  }, []);

  /**
   * Download file
   */
  const downloadFile = useCallback((file: AdminFile) => {
    fileManagementService.downloadFile(file);
    logFileOperation('download', file._id, { filename: file.filename });
  }, [logFileOperation]);

  /**
   * Check file integrity
   */
  const checkFileIntegrity = useCallback(async (file: AdminFile) => {
    try {
      const result: FileOperationResult = await fileManagementService.checkIntegrity(file._id);
      const integrityResult = result.integrity_check!;
      
      let message = '';
      if (integrityResult.status === 'verified') {
        message = `File integrity check passed!\n\nStatus: ${integrityResult.status}\nChecksum match: ${integrityResult.checksum_match}\nLast check: ${new Date(integrityResult.last_check!).toLocaleString()}`;
        toast.success('File integrity verified');
      } else if (integrityResult.status === 'corrupted') {
        message = `WARNING: File integrity check failed!\n\nStatus: ${integrityResult.status}\nCorruption detected: ${integrityResult.corruption_detected}\nCorruption type: ${integrityResult.corruption_type || 'Unknown'}\n\nPlease consider recovering from backup.`;
        toast.error('File corruption detected');
      } else if (integrityResult.status === 'inaccessible') {
        message = `ERROR: File is inaccessible!\n\nStatus: ${integrityResult.status}\nError: ${integrityResult.error}\n\nFile may need to be recovered from backup.`;
        toast.error('File is inaccessible');
      }
      
      alert(message);
      await logFileOperation('integrity_check', file._id, integrityResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check file integrity';
      toast.error(errorMessage);
    }
  }, [logFileOperation]);

  /**
   * Move file
   */
  const moveFile = useCallback(async (file: AdminFile) => {
    const targetLocation = prompt('Enter target Google Drive account ID (e.g., account_1, account_2, account_3):');
    if (!targetLocation) return;
    
    const reason = prompt('Reason for moving file (optional):');
    
    try {
      const result = await fileManagementService.moveFile(file._id, targetLocation, reason || undefined);
      toast.success(`File moved successfully to ${result.target_location}`);
      await logFileOperation('move', file._id, { targetLocation, reason });
      loadFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to move file';
      toast.error(errorMessage);
    }
  }, [logFileOperation, loadFiles]);

  /**
   * Force backup
   */
  const forceBackup = useCallback(async (file: AdminFile) => {
    if (!confirm(`Force backup for "${file.filename}" to Hetzner storage?`)) return;
    
    const reason = prompt('Reason for force backup (optional):');
    
    try {
      const result = await fileManagementService.forceBackup(file._id, reason || undefined);
      toast.success(`File backup completed!\nBackup path: ${result.backup_path}`);
      await logFileOperation('force_backup', file._id, { reason, backupPath: result.backup_path });
      loadFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to backup file';
      toast.error(errorMessage);
    }
  }, [logFileOperation, loadFiles]);

  /**
   * Recover file
   */
  const recoverFile = useCallback(async (file: AdminFile) => {
    if (!confirm(`Recover "${file.filename}" from backup? This will restore the file if it's corrupted or missing.`)) return;
    
    const reason = prompt('Reason for file recovery (optional):');
    
    try {
      await fileManagementService.recoverFile(file._id, reason || undefined);
      toast.success('File recovered successfully from backup!');
      await logFileOperation('recover', file._id, { reason });
      loadFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to recover file';
      toast.error(errorMessage);
    }
  }, [logFileOperation, loadFiles]);

  /**
   * Quarantine file
   */
  const quarantineFile = useCallback(async (file: AdminFile) => {
    if (!confirm(`Quarantine "${file.filename}"? This will mark the file as suspicious and prevent access.`)) return;
    
    const reason = prompt('Reason for quarantine:');
    if (!reason) {
      toast.error('Reason is required for quarantine');
      return;
    }
    
    try {
      const result = await fileManagementService.quarantineFile(file._id, reason);
      toast.success(result.message);
      await logFileOperation('quarantine', file._id, { reason });
      loadFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to quarantine file';
      toast.error(errorMessage);
    }
  }, [logFileOperation, loadFiles]);

  /**
   * Preview file
   */
  const previewFile = useCallback(async (file: AdminFile) => {
    if (!file.preview_available) return;
    
    try {
      const previewData = await fileManagementService.getPreview(file._id);
      window.open(previewData.preview_url, '_blank');
      await logFileOperation('preview', file._id, { filename: file.filename });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load preview';
      toast.error(errorMessage);
    }
  }, [logFileOperation]);

  /**
   * Delete file
   */
  const deleteFile = useCallback(async (file: AdminFile) => {
    if (!confirm(`Are you sure you want to delete "${file.filename}"?`)) return;
    
    const reason = prompt('Reason for deletion (optional):');
    
    try {
      await fileManagementService.deleteFile(file._id, reason || undefined);
      toast.success('File deleted successfully');
      await logFileOperation('delete', file._id, { filename: file.filename, reason });
      loadFiles();
      loadFileTypeAnalytics();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete file';
      toast.error(errorMessage);
    }
  }, [logFileOperation, loadFiles, loadFileTypeAnalytics]);

  /**
   * Execute bulk action
   */
  const executeBulkAction = useCallback(async () => {
    if (!state.bulkActionType || state.selectedFiles.length === 0) return;
    
    try {
      const result = await fileManagementService.bulkAction(
        state.selectedFiles,
        state.bulkActionType,
        state.bulkActionReason || undefined
      );
      
      toast.success(result.message);
      await logFileOperation('bulk_action', 'multiple', {
        action: state.bulkActionType,
        reason: state.bulkActionReason,
        fileIds: state.selectedFiles,
        filesAffected: result.files_affected
      });
      
      clearSelection();
      loadFiles();
      loadFileTypeAnalytics();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bulk action failed';
      toast.error(errorMessage);
    }
  }, [state.bulkActionType, state.selectedFiles, state.bulkActionReason, logFileOperation, clearSelection, loadFiles, loadFileTypeAnalytics]);

  /**
   * View orphaned files
   */
  const viewOrphanedFiles = useCallback(async () => {
    try {
      const result: OrphanedFilesResponse = await fileManagementService.getOrphanedFiles();
      
      if (result.orphaned_files.length === 0) {
        toast.success('No orphaned files found!');
        return result;
      }
      
      let message = `Found ${result.total} orphaned files:\n\n`;
      result.orphaned_files.slice(0, 10).forEach((file: { filename: string; size_formatted: string; orphan_reason: string }) => {
        message += `• ${file.filename} (${file.size_formatted})\n  Reason: ${file.orphan_reason}\n\n`;
      });
      
      if (result.orphaned_files.length > 10) {
        message += `... and ${result.orphaned_files.length - 10} more files.\n\n`;
      }
      
      message += 'Would you like to clean up orphaned files?';
      
      if (confirm(message)) {
        await cleanupOrphanedFiles();
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load orphaned files';
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  /**
   * Cleanup orphaned files
   */
  const cleanupOrphanedFiles = useCallback(async () => {
    const cleanupType = confirm('Choose cleanup type:\n\nOK = Soft delete (mark as deleted)\nCancel = Hard delete (remove from database)') ? 'soft' : 'hard';
    const daysOldStr = prompt('Clean up files older than how many days?', '7');
    
    if (!daysOldStr || isNaN(Number(daysOldStr))) {
      toast.error('Invalid number of days');
      return;
    }
    
    const daysOld = Number(daysOldStr);
    const confirmMessage = `This will ${cleanupType} delete all orphaned files older than ${daysOld} days.\n\nThis action cannot be undone${cleanupType === 'hard' ? ' (files will be permanently removed)' : ''}.\n\nContinue?`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      const result = await fileManagementService.cleanupOrphaned(cleanupType, daysOld);
      toast.success(`Cleanup completed!\n\n${result.message}\nFiles affected: ${result.files_affected}`);
      await logFileOperation('cleanup_orphaned', 'bulk', { cleanupType, daysOld, filesAffected: result.files_affected });
      loadFiles();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup orphaned files';
      toast.error(errorMessage);
    }
  }, [logFileOperation, loadFiles]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchTerm: '',
      fileTypeFilter: '',
      ownerFilter: '',
      storageLocationFilter: '',
      statusFilter: '',
      sizeMinFilter: null,
      sizeMaxFilter: null,
      currentPage: 1
    }));
  }, []);

  /**
   * Get file icon class
   */
  const getFileIcon = useCallback((fileType: string): string => {
    const icons: { [key: string]: string } = {
      'image': 'fas fa-image',
      'video': 'fas fa-video',
      'audio': 'fas fa-music',
      'document': 'fas fa-file-text',
      'archive': 'fas fa-file-archive',
      'other': 'fas fa-file'
    };
    return icons[fileType] || icons['other'];
  }, []);

  /**
   * Format date
   */
  const formatDate = useCallback((dateString: string): string => {
    return new Date(dateString).toLocaleString();
  }, []);

  // Load initial data
  useEffect(() => {
    loadFiles();
    loadFileTypeAnalytics();
  }, [loadFiles, loadFileTypeAnalytics]);

  // Reload when filters change
  useEffect(() => {
        loadFiles();
  }, [queryParams]);

  // Listen for real-time updates
  useEffect(() => {
    if (isConnected) {
      // You can add socket event listeners here for real-time updates
      // For now, we'll just reload the data periodically or on specific events
    }
  }, [isConnected, loadFiles]);

  return {
    // State
    ...state,

    // Actions
    loadFiles,
    loadFileTypeAnalytics,
    onSearch,
    setFilters,
    onSortChange,
    onPageChange,
    toggleFileSelection,
    selectAllFiles,
    clearSelection,
    
    // File operations
    downloadFile,
    checkFileIntegrity,
    moveFile,
    forceBackup,
    recoverFile,
    quarantineFile,
    previewFile,
    deleteFile,
    executeBulkAction,
    
    // System operations
    viewOrphanedFiles,
    cleanupOrphanedFiles,
    clearFilters,
    
    // Utilities
    getFileIcon,
    formatDate,
    
    // State setters
    setViewMode: (mode: ViewMode) => setState(prev => ({ ...prev, viewMode: mode })),
    setShowFilters: (show: boolean) => setState(prev => ({ ...prev, showFilters: show })),
    setBulkActionType: (type: string) => setState(prev => ({ ...prev, bulkActionType: type })),
    setBulkActionReason: (reason: string) => setState(prev => ({ ...prev, bulkActionReason: reason })),
    setSearchTerm: (term: string) => setState(prev => ({ ...prev, searchTerm: term }))
  };
}