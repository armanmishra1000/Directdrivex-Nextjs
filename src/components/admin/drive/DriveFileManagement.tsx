"use client";

import { useState, useEffect } from 'react';
import { DriveFileItem, DriveStats, FileTypeAnalytics } from '@/types/drive';
import { mockFiles, mockDriveStats, mockFileTypeAnalytics } from './data';
import { FaGoogleDrive } from 'react-icons/fa';
import { File, HardDrive, RefreshCw, CheckCircle, AlertTriangle, Filter, List, LayoutGrid, Search, PieChart, Loader2, Cloud } from 'lucide-react';
import { cn } from '@/lib/utils';

// Sub-components (placeholders for now, will be created in separate files)
const FileFilters = ({ onFilter, onClear, show, onSearch }: any) => (
  <div className={cn("p-4 mt-4 bg-slate-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 transition-all duration-300", show ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden p-0 border-0")}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <select onChange={e => onFilter('fileType', e.target.value)} className="w-full h-10 px-3 bg-white border rounded-md dark:bg-slate-700 border-slate-300 dark:border-slate-600">
        <option value="">All Types</option>
        <option value="image">Images</option>
        <option value="video">Videos</option>
      </select>
      <input type="text" placeholder="Owner email..." onChange={e => onFilter('owner', e.target.value)} className="w-full h-10 px-3 bg-white border rounded-md dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
      <select onChange={e => onFilter('backupStatus', e.target.value)} className="w-full h-10 px-3 bg-white border rounded-md dark:bg-slate-700 border-slate-300 dark:border-slate-600">
        <option value="">All Status</option>
        <option value="completed">Backed Up</option>
        <option value="failed">Failed</option>
      </select>
      <input type="number" placeholder="Min Size (MB)" onChange={e => onFilter('sizeMin', e.target.value)} className="w-full h-10 px-3 bg-white border rounded-md dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
      <input type="number" placeholder="Max Size (MB)" onChange={e => onFilter('sizeMax', e.target.value)} className="w-full h-10 px-3 bg-white border rounded-md dark:bg-slate-700 border-slate-300 dark:border-slate-600" />
    </div>
    <div className="flex justify-end mt-4">
      <button onClick={onClear} className="px-4 py-2 text-sm font-medium bg-white border rounded-md text-slate-700 dark:bg-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-500 hover:bg-slate-50">Clear Filters</button>
    </div>
  </div>
);
const FileTypeAnalyticsChart = ({ analytics }: { analytics: FileTypeAnalytics }) => (
  <div className="p-6 mt-6 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold"><PieChart className="w-5 h-5" /> Drive File Type Distribution</h3>
    <div className="flex gap-1 h-8 rounded-full overflow-hidden">
      {analytics.file_types.map(type => (
        <div key={type._id} style={{ width: `${type.percentage}%` }} className={cn("transition-all", `bg-${{image:'blue',video:'purple',document:'orange',archive:'pink',audio:'green'}[type._id]}-500`)} title={`${type._id}: ${type.count} files (${type.size_formatted})`}></div>
      ))}
    </div>
    <div className="grid grid-cols-2 gap-4 mt-4 text-sm md:grid-cols-3 lg:grid-cols-5">
      {analytics.file_types.map(type => (
        <div key={type._id} className="flex items-center gap-2">
          <div className={cn("w-3 h-3 rounded-full", `bg-${{image:'blue',video:'purple',document:'orange',archive:'pink',audio:'green'}[type._id]}-500`)}></div>
          <div>
            <div className="font-medium capitalize">{type._id}</div>
            <div className="text-xs text-slate-500">{type.count} files</div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
const FileListView = ({ files }: { files: DriveFileItem[] }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="text-xs text-left uppercase bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
        <tr>
          <th className="p-3"><input type="checkbox" /></th>
          <th className="p-3">Filename</th>
          <th className="p-3">Size</th>
          <th className="p-3">Owner</th>
          <th className="p-3">Backup Status</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {files.slice(0, 10).map(file => (
          <tr key={file._id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
            <td className="p-3"><input type="checkbox" /></td>
            <td className="p-3 font-medium text-slate-800 dark:text-slate-100 truncate max-w-xs">{file.filename}</td>
            <td className="p-3">{file.size_formatted}</td>
            <td className="p-3 truncate max-w-xs">{file.owner_email}</td>
            <td className="p-3"><span className={cn("px-2 py-1 text-xs rounded-full", file.backup_status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')}>{file.backup_status}</span></td>
            <td className="p-3">...</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const FileGridView = ({ files }: { files: DriveFileItem[] }) => (
  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
    {files.slice(0, 12).map(file => (
      <div key={file._id} className="p-4 text-center border rounded-lg dark:border-slate-700 hover:shadow-md">
        <File className="w-12 h-12 mx-auto mb-2 text-blue-500" />
        <p className="text-sm font-medium truncate">{file.filename}</p>
        <p className="text-xs text-slate-500">{file.size_formatted}</p>
      </div>
    ))}
  </div>
);

export function DriveFileManagement() {
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [driveStats, setDriveStats] = useState<DriveStats | null>(null);
  const [fileTypeAnalytics, setFileTypeAnalytics] = useState<FileTypeAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      setFiles(mockFiles);
      setDriveStats(mockDriveStats);
      setFileTypeAnalytics(mockFileTypeAnalytics);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-slate-50 dark:bg-slate-900 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center pb-4 mb-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <FaGoogleDrive className="text-blue-500" /> Drive File Management
        </h2>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button onClick={() => setShowFilters(!showFilters)} className="px-3 py-2 text-sm font-medium bg-white border rounded-md text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
          </button>
          <button onClick={loadData} disabled={loading} className="px-3 py-2 text-sm font-medium bg-white border rounded-md text-slate-700 dark:bg-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50">
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
          <div className="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-md">
            <button onClick={() => setViewMode('list')} className={cn("p-1.5 rounded", viewMode === 'list' && "bg-white dark:bg-slate-600 shadow")}>
              <List className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('grid')} className={cn("p-1.5 rounded", viewMode === 'grid' && "bg-white dark:bg-slate-600 shadow")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={File} title="Available Files" value={driveStats?.total_files.toLocaleString()} />
        <StatCard icon={HardDrive} title="Total Storage" value={driveStats?.total_storage_formatted} />
        <StatCard icon={RefreshCw} title="Transferring" value={driveStats?.transferring_to_hetzner.toLocaleString()} />
        <StatCard icon={CheckCircle} title="Backed Up" value={driveStats?.backed_up_to_hetzner.toLocaleString()} />
        <StatCard icon={AlertTriangle} title="Failed Backups" value={driveStats?.failed_backups.toLocaleString()} className="text-red-500" />
      </div>

      {/* Search & Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
          <input type="text" placeholder="Search drive files..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-12 pl-10 pr-24 bg-white border rounded-md dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button className="absolute h-10 px-4 text-sm font-semibold text-white -translate-y-1/2 bg-blue-600 rounded right-1 top-1/2 hover:bg-blue-700">Search</button>
        </div>
        <FileFilters show={showFilters} onFilter={() => {}} onClear={() => {}} onSearch={() => {}} />
      </div>

      {/* Analytics */}
      {fileTypeAnalytics && <FileTypeAnalyticsChart analytics={fileTypeAnalytics} />}

      {/* Main Content */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : error ? (
          <div className="p-4 text-center text-red-600 bg-red-100 border border-red-200 rounded-md">{error}</div>
        ) : (
          viewMode === 'list' ? <FileListView files={files} /> : <FileGridView files={files} />
        )}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <span className="text-sm text-slate-600 dark:text-slate-400">Showing 1-10 of {files.length} files</span>
        <div className="flex gap-1">
          <button className="px-3 py-1 text-sm border rounded-md dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">Previous</button>
          <button className="px-3 py-1 text-sm border rounded-md dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">Next</button>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ icon: Icon, title, value, className }: any) => (
  <div className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center gap-4">
    <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-700">
      <Icon className={cn("w-6 h-6 text-slate-600 dark:text-slate-300", className)} />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  </div>
);