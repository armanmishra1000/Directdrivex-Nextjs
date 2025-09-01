"use client";

import { AdminFile, FileSortConfig } from "@/types/admin";
import { Loader2, AlertTriangle, FolderOpen, ArrowUp, ArrowDown, Download, Eye, ShieldCheck, ArrowRightLeft, CloudArrowUp, Shield, ArrowUturnLeft, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

// ... (helper components for badges and icons would go here)

interface FileListViewProps {
  files: AdminFile[];
  loading: boolean;
  error: string | null;
  sortConfig: FileSortConfig;
  onSort: (key: keyof AdminFile) => void;
  selectedFileIds: Set<string>;
  onSelectionChange: (fileId: string, isSelected: boolean) => void;
  onFileAction: (type: string, file: AdminFile) => void;
}

export function FileListView({ files, loading, error, sortConfig, onSort, selectedFileIds, onSelectionChange, onFileAction }: FileListViewProps) {
  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="h-96 flex flex-col items-center justify-center text-red-500"><AlertTriangle className="w-10 h-10 mb-2" /><p>{error}</p></div>;
  if (files.length === 0) return <div className="h-96 flex flex-col items-center justify-center text-slate-500"><FolderOpen className="w-12 h-12 mb-2" /><p>No files found.</p></div>;

  const SortableHeader = ({ label, sortKey }: { label: string, sortKey: keyof AdminFile }) => (
    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => onSort(sortKey)}>
      <div className="flex items-center gap-1">
        {label}
        {sortConfig.key === sortKey && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300 sticky top-0">
          <tr>
            <th scope="col" className="p-4"><input type="checkbox" /></th>
            <SortableHeader label="Filename" sortKey="filename" />
            <SortableHeader label="Size" sortKey="size" />
            <th scope="col" className="px-6 py-3">Type</th>
            <th scope="col" className="px-6 py-3">Owner</th>
            <SortableHeader label="Upload Date" sortKey="uploadDate" />
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Location</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
              <td className="p-4"><input type="checkbox" checked={selectedFileIds.has(file.id)} onChange={(e) => onSelectionChange(file.id, e.target.checked)} /></td>
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-white truncate max-w-xs">{file.filename}</td>
              <td className="px-6 py-4">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
              <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">{file.type}</span></td>
              <td className="px-6 py-4">{file.owner}</td>
              <td className="px-6 py-4">{new Date(file.uploadDate).toLocaleDateString()}</td>
              <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">{file.status}</span></td>
              <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">{file.storageLocation}</span></td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <button onClick={() => onFileAction('download', file)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md"><Download className="w-4 h-4" /></button>
                  <button onClick={() => onFileAction('preview', file)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onFileAction('delete', file)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"><Trash className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}