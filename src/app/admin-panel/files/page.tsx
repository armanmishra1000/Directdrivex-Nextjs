"use client";

import { useState, useEffect } from "react";
import { FileBrowserHeader } from "@/components/admin/files/FileBrowserHeader";
import { FileFilters } from "@/components/admin/files/FileFilters";
import { FileTypeAnalytics } from "@/components/admin/files/FileTypeAnalytics";
import { BulkActionsBar } from "@/components/admin/files/BulkActionsBar";
import { FileListView } from "@/components/admin/files/FileListView";
import { FileGridView } from "@/components/admin/files/FileGridView";
import { FilePagination } from "@/components/admin/files/FilePagination";
import { OrphanedFilesModal } from "@/components/admin/files/modals/OrphanedFilesModal";
import { useFileBrowser } from "@/hooks/useFileBrowser";
import { useFileOperations } from "@/hooks/useFileOperations";
import { FileItem } from "@/types/file-browser";
import { adminAuthService } from "@/services/adminAuthService";
import { toastService } from "@/services/toastService";

export default function FileBrowserPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showOrphanedModal, setShowOrphanedModal] = useState(false);
  const [authWarningShown, setAuthWarningShown] = useState(false);
  
  // Use the file browser hook for state management
  const {
    files,
    storageStats,
    fileTypeAnalytics,
    loading,
    error,
    selectedFileIds,
    filters,
    sort,
    pagination,
    setSelectedFileIds,
    setFilters,
    setSort,
    setPagination,
    handleFileOperation,
    handleBulkAction,
    refreshData,
  } = useFileBrowser();

  // Use the file operations hook
  const {
    viewOrphanedFiles,
    cleanupOrphanedFiles,
  } = useFileOperations();

  // Check authentication status on mount
  useEffect(() => {
    if (!adminAuthService.isAdminAuthenticated() && !authWarningShown) {
      toastService.warning('Admin authentication required for full functionality');
      setAuthWarningShown(true);
    }
  }, [authWarningShown]);

  const handleOrphanedCleanup = async () => {
    try {
      if (!adminAuthService.isAdminAuthenticated()) {
        toastService.error('Please log in as admin to access cleanup features');
        return;
      }
      setShowOrphanedModal(true);
    } catch (error) {
      console.error('Error viewing orphaned files:', error);
      toastService.error('Feature not available - using demonstration mode');
    }
  };

  const handleBulkActionWithReason = async (action: string) => {
    if (selectedFileIds.size === 0) return;
    
    if (!adminAuthService.isAdminAuthenticated()) {
      toastService.error('Admin authentication required for bulk actions');
      return;
    }
    
    let reason: string | undefined;
    if (['delete', 'quarantine'].includes(action)) {
      const promptResult = window.prompt(`Reason for ${action} (optional):`);
      reason = promptResult || undefined;
    }
    
    await handleBulkAction(action, Array.from(selectedFileIds), reason);
  };

  const handleFileOperationWithParams = async (operation: string, file: FileItem, params?: any) => {
    console.log('Page: handleFileOperationWithParams called:', { operation, fileId: file._id, fileName: file.filename, params });
    
    if (!adminAuthService.isAdminAuthenticated() && !['download', 'preview'].includes(operation)) {
      console.log('Page: Authentication required for operation:', operation);
      toastService.error('Admin authentication required for this operation');
      return;
    }
    
    // Add filename to params for download operations
    const operationParams = {
      ...params,
      filename: file.filename
    };
    
    console.log('Page: Calling handleFileOperation with:', { operation, fileId: file._id, params: operationParams });
    await handleFileOperation(operation, file._id, operationParams);
  };



  // Show authentication prompt if not authenticated
  if (!adminAuthService.isAdminAuthenticated() && !loading && !error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-900/20">
            <span className="text-2xl">🔐</span>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">Authentication Required</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            Please log in as an administrator to access the file browser.
          </p>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Demo data is shown below for preview purposes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (loading && files.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-blue-600 rounded-full border-t-transparent animate-spin" />
          <p className="text-slate-600 dark:text-slate-400">Loading files...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20">
            <span className="text-xl text-red-600">⚠️</span>
          </div>
          <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-white">Error Loading Files</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">{error}</p>
          <button
            onClick={refreshData}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FileBrowserHeader 
        stats={storageStats}
        loading={loading}
        onCleanup={handleOrphanedCleanup}
        onRefresh={refreshData}
      />
      
      <FileFilters 
        filters={filters}
        onFilterChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      {fileTypeAnalytics && (
        <FileTypeAnalytics data={fileTypeAnalytics.file_types} />
      )}
      
      <BulkActionsBar 
        selectedCount={selectedFileIds.size}
        onAction={handleBulkActionWithReason}
        onClear={() => setSelectedFileIds(new Set())}
      />

      {viewMode === 'list' ? (
        <FileListView 
          files={files}
          selectedFileIds={selectedFileIds}
          setSelectedFileIds={setSelectedFileIds}
          sortConfig={sort}
          onSortChange={(key: string) => setSort(prev => ({ ...prev, key }))}
          onFileOperation={handleFileOperationWithParams}
        />
      ) : (
        <FileGridView 
          files={files}
          selectedFileIds={selectedFileIds}
          setSelectedFileIds={setSelectedFileIds}
          onFileOperation={handleFileOperationWithParams}
        />
      )}

      <FilePagination 
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={(page: number) => setPagination(prev => ({ ...prev, currentPage: page }))}
        totalItems={pagination.totalItems}
        itemsPerPage={pagination.pageSize}
      />

      {/* Orphaned Files Modal */}
      <OrphanedFilesModal
        isOpen={showOrphanedModal}
        onClose={() => setShowOrphanedModal(false)}
        onCleanupComplete={(result) => {
          console.log('Cleanup completed:', result);
          refreshData(); // Refresh the main file list
        }}
      />
    </div>
  );
}