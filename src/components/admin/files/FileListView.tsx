"use client";

import { AdminFile, FileType, FileStatus, StorageLocation } from "@/types/admin-files";
import { cn } from "@/lib/utils";
import { File, Image, Video, Music, Archive, FileText, Download, Eye, Shield, Move, Cloud, AlertTriangle, Trash2, ArrowUp, ArrowDown } from "lucide-react";

const fileTypeIcons: Record<FileType, React.ElementType> = {
  image: Image, video: Video, audio: Music, document: FileText, archive: Archive, other: File,
};

const statusColors: Record<FileStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  uploading: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
};

const storageColors: Record<StorageLocation, string> = {
  gdrive: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  hetzner: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileListView({ files, loading, selectedFileIds, setSelectedFileIds, onAction, sortConfig, setSortConfig }: any) {
  const handleSort = (key: string) => {
    setSortConfig((prev: any) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const SortableHeader = ({ label, sortKey }: { label: string, sortKey: string }) => (
    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort(sortKey)}>
      <div className="flex items-center gap-1">
        {label}
        {sortConfig.key === sortKey && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
      </div>
    </th>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="p-4"><input type="checkbox" /></th>
            <SortableHeader label="Filename" sortKey="filename" />
            <SortableHeader label="Size" sortKey="size" />
            <th scope="col" className="px-6 py-3">Type</th>
            <SortableHeader label="Owner" sortKey="owner" />
            <SortableHeader label="Upload Date" sortKey="uploadDate" />
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Storage</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file: AdminFile) => {
            const FileIcon = fileTypeIcons[file.type];
            return (
              <tr key={file.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                <td className="p-4"><input type="checkbox" /></td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-2"><FileIcon className="w-4 h-4" /> {file.filename}</td>
                <td className="px-6 py-4">{formatBytes(file.size)}</td>
                <td className="px-6 py-4 capitalize">{file.type}</td>
                <td className="px-6 py-4">{file.owner}</td>
                <td className="px-6 py-4">{new Date(file.uploadDate).toLocaleDateString()}</td>
                <td className="px-6 py-4"><span className={cn("px-2 py-1 text-xs font-medium rounded-full", statusColors[file.status])}>{file.status}</span></td>
                <td className="px-6 py-4"><span className={cn("px-2 py-1 text-xs font-medium rounded-full", storageColors[file.storage])}>{file.storage}</span></td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md"><Download className="w-4 h-4" /></button>
                    <button className="p-1.5 text-emerald-500 hover:bg-emerald-100 rounded-md"><Shield className="w-4 h-4" /></button>
                    <button className="p-1.5 text-amber-500 hover:bg-amber-100 rounded-md"><AlertTriangle className="w-4 h-4" /></button>
                    <button className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}