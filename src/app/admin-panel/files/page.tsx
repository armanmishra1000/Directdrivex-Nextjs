'use client';

import React from 'react';
import { 
  Search, 
  Filter, 
  List, 
  LayoutGrid, 
  Download, 
  Eye, 
  ShieldCheck, 
  Move, 
  CloudUpload, 
  AlertTriangle, 
  RotateCcw, 
  Trash2, 
  HardDrive, 
  Server, 
  File as FileIcon, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Archive,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Loader2,
  FolderOpen
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useFileBrowser } from '@/hooks/useFileBrowser';
import { AdminFile } from '@/types/admin';

export default function FilesPage() {
  const {
    files, selectedFiles, storageStats, fileTypeAnalytics,
    currentPage, pageSize, totalFiles, totalPages,
    searchTerm, sortBy, sortOrder, loading, error, showFilters, viewMode,
    onSearch, setFilters, onSortChange, onPageChange,
    toggleFileSelection, selectAllFiles, clearSelection,
    downloadFile, checkFileIntegrity, moveFile, forceBackup, recoverFile,
    quarantineFile, previewFile, deleteFile, executeBulkAction,
    viewOrphanedFiles, clearFilters, formatDate,
    setViewMode, setShowFilters, setBulkActionType, setBulkActionReason, setSearchTerm
  } = useFileBrowser();

  const FileIconComponent = ({ fileType }: { fileType: string }) => {
    const iconMap = {
      image: <ImageIcon className="w-4 h-4" />,
      video: <Video className="w-4 h-4" />,
      audio: <Music className="w-4 h-4" />,
      document: <FileText className="w-4 h-4" />,
      archive: <Archive className="w-4 h-4" />,
      other: <FileIcon className="w-4 h-4" />
    };
    return iconMap[fileType as keyof typeof iconMap] || iconMap.other;
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'uploading': return 'secondary';
      case 'failed': return 'destructive';
      case 'deleted': return 'outline';
      default: return 'secondary';
    }
  };

  const getFileTypeBadgeColor = (fileType: string) => {
    const colors = {
      image: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      video: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      audio: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      document: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      archive: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
      other: 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-300'
    };
    return colors[fileType as keyof typeof colors] || colors.other;
  };

  const FileActions = ({ file }: { file: AdminFile }) => (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" onClick={() => downloadFile(file)} title="Download"><Download className="w-4 h-4" /></Button>
      {file.preview_available && <Button size="icon" variant="ghost" onClick={() => previewFile(file)} title="Preview"><Eye className="w-4 h-4" /></Button>}
      <Button size="icon" variant="ghost" onClick={() => checkFileIntegrity(file)} title="Check Integrity"><ShieldCheck className="w-4 h-4" /></Button>
      <Button size="icon" variant="ghost" onClick={() => moveFile(file)} title="Move File"><Move className="w-4 h-4" /></Button>
      <Button size="icon" variant="ghost" onClick={() => forceBackup(file)} title="Force Backup"><CloudUpload className="w-4 h-4" /></Button>
      <Button size="icon" variant="ghost" onClick={() => quarantineFile(file)} title="Quarantine"><AlertTriangle className="w-4 h-4" /></Button>
      <Button size="icon" variant="ghost" onClick={() => recoverFile(file)} title="Recover from Backup"><RotateCcw className="w-4 h-4" /></Button>
      <Button size="icon" variant="ghost" onClick={() => deleteFile(file)} title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">File Browser</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-2" />Filters</Button>
          <Button variant="outline" onClick={viewOrphanedFiles}><Trash className="w-4 h-4 mr-2" />Cleanup</Button>
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg">
            <Button size="sm" variant={viewMode === 'list' ? 'secondary' : 'ghost'} onClick={() => setViewMode('list')} className="rounded-r-none"><List className="w-4 h-4" /></Button>
            <Button size="sm" variant={viewMode === 'grid' ? 'secondary' : 'ghost'} onClick={() => setViewMode('grid')} className="rounded-l-none"><LayoutGrid className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {storageStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-4"><div className="flex items-center gap-3"><FileIcon className="w-6 h-6 text-blue-500" /><div><div className="text-xl font-bold">{storageStats.total_files.toLocaleString()}</div><div className="text-xs text-slate-500">Total Files</div></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><HardDrive className="w-6 h-6 text-green-500" /><div><div className="text-xl font-bold">{storageStats.total_storage_formatted}</div><div className="text-xs text-slate-500">Total Storage</div></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><Cloud className="w-6 h-6 text-sky-500" /><div><div className="text-xl font-bold">{storageStats.gdrive_files.toLocaleString()}</div><div className="text-xs text-slate-500">Google Drive</div></div></div></Card>
          <Card className="p-4"><div className="flex items-center gap-3"><Server className="w-6 h-6 text-purple-500" /><div><div className="text-xl font-bold">{storageStats.hetzner_files.toLocaleString()}</div><div className="text-xs text-slate-500">Hetzner</div></div></div></Card>
        </div>
      )}

      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && onSearch()} />
            {/* Other filters would go here */}
            <Button onClick={onSearch}>Search</Button>
            <Button variant="ghost" onClick={clearFilters}>Clear</Button>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {fileTypeAnalytics && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold mb-2">File Type Distribution</h3>
            <div className="flex w-full h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
              {fileTypeAnalytics.file_types.map(type => (
                <div key={type._id} className={cn(getFileTypeBadgeColor(type._id), 'h-full')} style={{ width: `${type.percentage}%` }} title={`${type._id}: ${type.count} files`} />
              ))}
            </div>
          </div>
        )}

        {selectedFiles.length > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{selectedFiles.length} files selected</span>
            <div className="flex items-center gap-2">
              <Select onValueChange={setBulkActionType}><SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="Bulk Action..." /></SelectTrigger><SelectContent><SelectItem value="delete">Delete</SelectItem><SelectItem value="quarantine">Quarantine</SelectItem><SelectItem value="backup">Force Backup</SelectItem></SelectContent></Select>
              <Input placeholder="Reason (optional)" onChange={(e) => setBulkActionReason(e.target.value)} className="h-8 text-xs" />
              <Button size="sm" onClick={executeBulkAction}>Execute</Button>
              <Button size="sm" variant="ghost" onClick={clearSelection}><X className="w-4 h-4" /></Button>
            </div>
          </div>
        )}

        {loading ? <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        : error ? <div className="flex flex-col items-center justify-center h-96 text-red-500"><AlertTriangle className="w-12 h-12 mb-4" /><p>{error}</p></div>
        : files.length === 0 ? <div className="flex flex-col items-center justify-center h-96 text-slate-500"><FolderOpen className="w-16 h-16 mb-4" /><p>No files found</p></div>
        : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-4"><Checkbox checked={selectedFiles.length === files.length} onCheckedChange={() => selectAllFiles()} /></th>
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => onSortChange('filename')}>Filename {sortBy === 'filename' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => onSortChange('size_bytes')}>Size {sortBy === 'size_bytes' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="px-6 py-3 text-left">Owner</th>
                  <th className="px-6 py-3 text-left cursor-pointer" onClick={() => onSortChange('upload_date')}>Date {sortBy === 'upload_date' && (sortOrder === 'asc' ? '↑' : '↓')}</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:bg-slate-800 divide-slate-200 dark:divide-slate-700">
                {files.map(file => (
                  <tr key={file._id} className={cn("hover:bg-slate-50 dark:hover:bg-slate-600/20", selectedFiles.includes(file._id) && "bg-blue-50 dark:bg-blue-900/20")}>
                    <td className="p-4"><Checkbox checked={selectedFiles.includes(file._id)} onCheckedChange={() => toggleFileSelection(file._id)} /></td>
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{file.filename}</td>
                    <td className="px-6 py-4">{file.size_formatted}</td>
                    <td className="px-6 py-4">{file.owner_email}</td>
                    <td className="px-6 py-4">{formatDate(file.upload_date)}</td>
                    <td className="px-6 py-4"><Badge variant={getStatusBadgeVariant(file.status)}>{file.status}</Badge></td>
                    <td className="px-6 py-4"><FileActions file={file} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {files.map(file => (
              <Card key={file._id} className={cn("p-4 text-center", selectedFiles.includes(file._id) && "ring-2 ring-blue-500")}>
                <Checkbox checked={selectedFiles.includes(file._id)} onCheckedChange={() => toggleFileSelection(file._id)} className="absolute top-2 left-2" />
                <div className="w-16 h-16 mx-auto mb-2 text-5xl"><FileIconComponent fileType={file.file_type} /></div>
                <p className="font-semibold truncate">{file.filename}</p>
                <p className="text-xs text-slate-500">{file.size_formatted}</p>
                <div className="mt-2"><FileActions file={file} /></div>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
            <span className="text-sm text-slate-600 dark:text-slate-400">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="outline" onClick={() => onPageChange(1)} disabled={currentPage === 1}><ChevronsLeft className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Button>
              <Button size="icon" variant="outline" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}