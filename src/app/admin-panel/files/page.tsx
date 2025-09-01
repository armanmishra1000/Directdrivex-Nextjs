"use client";

import { useState } from "react";
import { File as FileIcon } from "lucide-react";
import { FileDashboardHeader } from "@/components/admin/files/FileDashboardHeader";
import { FileFilters } from "@/components/admin/files/FileFilters";
import { FileAnalytics } from "@/components/admin/files/FileAnalytics";
import { BulkActionsBar } from "@/components/admin/files/BulkActionsBar";
import { FileListView } from "@/components/admin/files/FileListView";
import { FileGridView } from "@/components/admin/files/FileGridView";
import { FilePagination } from "@/components/admin/files/FilePagination";
import { useFileManager } from "@/hooks/useFileManager";
import { FileModals } from "@/components/admin/files/FileModals";

export default function FileManagementPage() {
  const {
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
  } = useFileManager();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-400/10 text-blue-500 dark:text-blue-400 rounded-lg flex items-center justify-center">
          <FileIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">File Management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Browse, manage, and administer all user files.</p>
        </div>
      </div>

      <FileDashboardHeader
        stats={stats}
        loading={loading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onToggleFilters={toggleFilters}
        onCleanup={() => handleFileAction('cleanup', null)}
      />

      <FileFilters
        isVisible={isFiltersVisible}
        filters={filters}
        onFilterChange={setFilters}
      />

      <FileAnalytics fileStats={stats} loading={loading} />

      <BulkActionsBar
        selectedCount={selectedFileIds.size}
        onBulkAction={(action, reason) => handleFileAction('bulk', { action, reason, selectedFileIds })}
      />

      <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
        {viewMode === 'list' ? (
          <FileListView
            files={files}
            loading={loading}
            error={error}
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedFileIds={selectedFileIds}
            onSelectionChange={handleSelectionChange}
            onFileAction={handleFileAction}
          />
        ) : (
          <FileGridView
            files={files}
            loading={loading}
            error={error}
            selectedFileIds={selectedFileIds}
            onSelectionChange={handleSelectionChange}
            onFileAction={handleFileAction}
          />
        )}
        <FilePagination
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>

      <FileModals
        modalState={modalState}
        onClose={closeModal}
        onConfirm={() => {
          // This would trigger the actual API call
          console.log("Confirmed action:", modalState);
          closeModal();
        }}
      />
    </div>
  );
}