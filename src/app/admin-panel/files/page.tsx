"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { 
  File as FileIcon, 
  HardDrive, 
  Cloud, 
  Server, 
  Filter, 
  Trash2, 
  List, 
  LayoutGrid, 
  Search, 
  Download, 
  Eye, 
  ShieldCheck, 
  Move, 
  CloudUpload, 
  AlertTriangle, 
  RotateCcw, 
  Trash, 
  ChevronDown, 
  Info, 
  Loader2, 
  FolderOpen,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileQuestion,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  RefreshCw,
  Wifi,
  WifiOff
} from "lucide-react";
import { cn } from "@/lib/utils";

// MOCK DATA & TYPES (to be replaced with actual service calls)
type FileStatus = 'completed' | 'pending' | 'uploading' | 'failed';
type StorageLocation = 'gdrive' | 'hetzner';
type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

interface AdminFile {
  _id: string;
  filename: string;
  size_bytes: number;
  file_type: FileType;
  owner_email: string;
  upload_date: string;
  status: FileStatus;
  storage_location: StorageLocation;
  preview_available: boolean;
}

const mockFiles: AdminFile[] = Array.from({ length: 48 }, (_, i) => {
  const types: FileType[] = ['document', 'image', 'video', 'audio', 'archive', 'other'];
  const statuses: FileStatus[] = ['completed', 'pending', 'uploading', 'failed'];
  const locations: StorageLocation[] = ['gdrive', 'hetzner'];
  const fileType = types[i % types.length];
  let filename = `document_${i + 1}.pdf`;
  if (fileType === 'image') filename = `photo_${i + 1}.jpg`;
  if (fileType === 'video') filename = `recording_${i + 1}.mp4`;
  if (fileType === 'audio') filename = `song_${i + 1}.mp3`;
  if (fileType === 'archive') filename = `backup_${i + 1}.zip`;
  
  return {
    _id: `file_${i + 1}`,
    filename,
    size_bytes: Math.floor(Math.random() * 100000000) + 10000,
    file_type: fileType,
    owner_email: `user${i % 5 + 1}@example.com`,
    upload_date: new Date(Date.now() - i * 3600000).toISOString(),
    status: statuses[i % statuses.length],
    storage_location: locations[i % locations.length],
    preview_available: fileType === 'image' || fileType === 'document',
  };
});

const fileTypeAnalyticsData = {
  document: { count: 12, percentage: 25, color: "bg-blue-500", size: 450000000 },
  image: { count: 15, percentage: 31.25, color: "bg-emerald-500", size: 380000000 },
  video: { count: 8, percentage: 16.67, color: "bg-purple-500", size: 2500000000 },
  audio: { count: 7, percentage: 14.58, color: "bg-amber-500", size: 220000000 },
  archive: { count: 6, percentage: 12.5, color: "bg-slate-500", size: 1500000000 },
};

// Helper Components
const StatCard = ({ icon: Icon, value, label, color }: { icon: React.ElementType, value: string, label: string, color: string }) => (
  <div className="p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-700/30 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10 flex items-center gap-4 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: `${color}1A` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

const getFileIcon = (fileType: FileType) => {
  switch (fileType) {
    case 'document': return <FileText className="w-8 h-8 text-blue-500" />;
    case 'image': return <FileImage className="w-8 h-8 text-emerald-500" />;
    case 'video': return <FileVideo className="w-8 h-8 text-purple-500" />;
    case 'audio': return <FileAudio className="w-8 h-8 text-amber-500" />;
    case 'archive': return <FileArchive className="w-8 h-8 text-slate-500" />;
    default: return <FileQuestion className="w-8 h-8 text-slate-400" />;
  }
};

const StatusBadge = ({ status }: { status: FileStatus }) => {
  const styles = {
    completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    uploading: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  };
  return <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", styles[status])}>{status}</span>;
};

const StorageBadge = ({ location }: { location: StorageLocation }) => {
  const styles = {
    gdrive: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    hetzner: "bg-sky-100 text-sky-800 dark:bg-sky-900/20 dark:text-sky-400",
  };
  return <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full", styles[location])}>{location === 'gdrive' ? 'Google Drive' : 'Hetzner'}</span>;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export default function FileBrowserPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFiles(new Set(mockFiles.map(f => f._id)));
    } else {
      setSelectedFiles(new Set());
    }
  };

  const handleSelectOne = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(fileId)) {
        newSelection.delete(fileId);
      } else {
        newSelection.add(fileId);
      }
      return newSelection;
    });
  };

  const isAllSelected = selectedFiles.size === mockFiles.length && mockFiles.length > 0;
  const isIndeterminate = selectedFiles.size > 0 && selectedFiles.size < mockFiles.length;

  const renderContent = () => {
    if (loading) {
      return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
    }
    if (mockFiles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-500">
          <FolderOpen className="w-16 h-16 mb-4" />
          <p className="text-xl font-semibold">No files found</p>
          <p>The file repository is currently empty.</p>
        </div>
      );
    }
    return viewMode === 'list' ? renderListView() : renderGridView();
  };

  const renderListView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs uppercase text-slate-700 bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={isAllSelected} ref={el => el && (el.indeterminate = isIndeterminate)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" /></th>
            <th scope="col" className="px-6 py-3">Filename</th>
            <th scope="col" className="px-6 py-3">Size</th>
            <th scope="col" className="px-6 py-3">Owner</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockFiles.map(file => (
            <tr key={file._id} className={cn("bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20", selectedFiles.has(file._id) && "bg-blue-50 dark:bg-blue-900/20")}>
              <td className="p-4"><input type="checkbox" checked={selectedFiles.has(file._id)} onChange={() => handleSelectOne(file._id)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" /></td>
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{file.filename}</td>
              <td className="px-6 py-4">{formatBytes(file.size_bytes)}</td>
              <td className="px-6 py-4">{file.owner_email}</td>
              <td className="px-6 py-4">{new Date(file.upload_date).toLocaleDateString()}</td>
              <td className="px-6 py-4"><StatusBadge status={file.status} /></td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><Download className="w-4 h-4" /></button>
                  <button className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"><Eye className="w-4 h-4" /></button>
                  <button className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><Trash className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {mockFiles.map(file => (
        <div key={file._id} className={cn("border rounded-lg p-4 flex flex-col items-center text-center transition-all", selectedFiles.has(file._id) ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:-translate-y-1")}>
          <div className="w-full flex justify-between items-start mb-2">
            <input type="checkbox" checked={selectedFiles.has(file._id)} onChange={() => handleSelectOne(file._id)} className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
            <div className="flex gap-1">
              <button className="p-1 text-blue-600 hover:bg-blue-100 rounded-md"><Download className="w-4 h-4" /></button>
              <button className="p-1 text-red-600 hover:bg-red-100 rounded-md"><Trash className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="mb-2">{getFileIcon(file.file_type)}</div>
          <p className="w-full font-semibold truncate text-slate-900 dark:text-white">{file.filename}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(file.size_bytes)}</p>
          <p className="w-full text-xs truncate text-slate-500 dark:text-slate-400">{file.owner_email}</p>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={file.status} />
            <StorageBadge location={file.storage_location} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-400/10 text-blue-500 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <FileIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">File Browser</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage all user-uploaded files.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="flex items-center bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg">
            <button onClick={() => setViewMode('list')} className={cn("p-2 rounded-l-md", viewMode === 'list' ? "bg-blue-600 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-600")}><List className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded-r-md", viewMode === 'grid' ? "bg-blue-600 text-white" : "hover:bg-slate-50 dark:hover:bg-slate-600")}><LayoutGrid className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileIcon} value="1.2M" label="Total Files" color="#3b82f6" />
        <StatCard icon={HardDrive} value="25.6 TB" label="Total Storage" color="#10b981" />
        <StatCard icon={Cloud} value="18.2 TB" label="Google Drive" color="#f59e0b" />
        <StatCard icon={Server} value="7.4 TB" label="Hetzner" color="#ef4444" />
      </div>

      {/* Search & Filters Panel */}
      {showFilters && (
        <div className="p-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-700/30 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" placeholder="Search by filename or owner..." className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <select className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option>All File Types</option></select>
            <select className="w-full h-10 px-3 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"><option>All Statuses</option></select>
            <button className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">Clear Filters</button>
          </div>
        </div>
      )}

      {/* Analytics & File Browser */}
      <div className="overflow-hidden border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
        {/* Analytics */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">File Type Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(fileTypeAnalyticsData).map(([key, value]) => (
              <div key={key} className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium capitalize text-slate-800 dark:text-slate-200">{key}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{value.count} files</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-600">
                  <div className={cn("h-2 rounded-full", value.color)} style={{ width: `${value.percentage}%` }} />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{formatBytes(value.size)}</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{value.percentage.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedFiles.size > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-700 flex items-center justify-between">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{selectedFiles.size} files selected</span>
            <div className="flex items-center gap-2">
              <select className="h-8 px-2 text-xs bg-white border rounded-md dark:bg-slate-700 border-slate-300 dark:border-slate-600"><option>Bulk Action...</option></select>
              <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Execute</button>
              <button onClick={() => setSelectedFiles(new Set())} className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-full"><X className="w-4 h-4 text-blue-700 dark:text-blue-300" /></button>
            </div>
          </div>
        )}

        {renderContent()}

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-600 dark:text-slate-400">Showing 1-48 of 1,247 files</span>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}