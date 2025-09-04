"use client";

import { HetznerHeader } from "@/components/admin/hetzner/HetznerHeader";
import { HetznerStatsDashboard } from "@/components/admin/hetzner/HetznerStatsDashboard";
import { HetznerFilters } from "@/components/admin/hetzner/HetznerFilters";
import { HetznerFileTypeAnalytics } from "@/components/admin/hetzner/HetznerFileTypeAnalytics";
import { HetznerBulkActionsBar } from "@/components/admin/hetzner/HetznerBulkActionsBar";
import { HetznerFileListView } from "@/components/admin/hetzner/HetznerFileListView";
import { HetznerFileGridView } from "@/components/admin/hetzner/HetznerFileGridView";
import { HetznerPagination } from "@/components/admin/hetzner/HetznerPagination";
import { useHetznerFileManagement } from "@/hooks/useHetznerFileManagement";
import { Loader2, Server } from "lucide-react";

export default function HetznerManagementPage() {
  const {
    files, stats, analytics, loading, error, currentPage, totalPages, totalFiles, pageSize,
    selectedFiles, showFilters, viewMode, sortBy, sortOrder, filters,
    loadFiles, setFilters, clearFilters, setShowFilters,
    toggleFileSelection, selectAllFiles, clearSelection, setSortBy,
    setPage, setViewMode,
    downloadFile, previewFile, recoverFile, deleteFile, executeBulkAction,
  } = useHetznerFileManagement();

  return (
    <div className="space-y-6">
      <HetznerHeader loading={loading} showFilters={showFilters} onToggleFilters={() => setShowFilters(!showFilters)} onRefresh={loadFiles} />
      <HetznerStatsDashboard stats={stats} />
      {showFilters && <HetznerFilters filters={filters} onFiltersChange={setFilters} onSearch={loadFiles} onClearFilters={clearFilters} />}
      <HetznerFileTypeAnalytics analytics={analytics} />
      <HetznerBulkActionsBar selectedCount={selectedFiles.length} onExecute={executeBulkAction} onClear={clearSelection} />

      {loading && files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p>Loading Hetzner backup files...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center text-red-500">{error}</div>
      ) : files.length === 0 ? (
        <div className="py-12 text-center text-slate-500">
          <Server className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Hetzner backup files found</h3>
          <p>Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
          {viewMode === 'list' ? (
            <HetznerFileListView
              files={files}
              selectedFiles={selectedFiles}
              onToggleSelection={toggleFileSelection}
              onSelectAll={selectAllFiles}
              onSort={setSortBy}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onDownload={downloadFile}
              onPreview={previewFile}
              onRecover={recoverFile}
              onDelete={deleteFile}
            />
          ) : (
            <HetznerFileGridView
              files={files}
              selectedFiles={selectedFiles}
              onToggleSelection={toggleFileSelection}
              onDownload={downloadFile}
              onPreview={previewFile}
              onDelete={deleteFile}
            />
          )}
          <HetznerPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalFiles={totalFiles}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}