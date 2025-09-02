"use client";

import { FileItem, SortConfig } from "@/types/file-browser";
import { cn } from "@/lib/utils";
import { FileImage, FileVideo, FileText, FileArchive, FileAudio, FileQuestion, MoreVertical, Download, Edit, Trash2, Shield, ArrowUp, ArrowDown } from "lucide-react";
import { FaGoogleDrive } from "react-icons/fa";
import { FaServer } from "react-icons/fa6";

const fileTypeConfig = {
  image: { icon: FileImage, color: "text-blue-500" },
  video: { icon: FileVideo, color: "text-purple-500" },
  document: { icon: FileText, color: "text-orange-500" },
  archive: { icon: FileArchive, color: "text-pink-500" },
  audio: { icon: FileAudio, color: "text-green-500" },
  other: { icon: FileQuestion, color: "text-slate-500" },
};

const statusConfig = {
  completed: { color: "bg-emerald-500" },
  pending: { color: "bg-amber-500" },
  uploading: { color: "bg-blue-500" },
  failed: { color: "bg-red-500" },
  deleted: { color: "bg-slate-500" },
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const SortableHeader = ({ label, sortKey, sortConfig, onSortChange }: { label: string, sortKey: keyof FileItem, sortConfig: SortConfig, onSortChange: (key: keyof FileItem) => void }) => (
  <th scope="col" className="px-4 py-3 cursor-pointer" onClick={() => onSortChange(sortKey)}>
    <div className="flex items-center gap-1">
      {label}
      {sortConfig.key === sortKey && (
        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
      )}
    </div>
  </th>
);

interface FileListViewProps {
  files: FileItem[];
  selectedFileIds: Set<string>;
  setSelectedFileIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  sortConfig: SortConfig;
  onSortChange: (key: keyof FileItem) => void;
}

export function FileListView({ files, selectedFileIds, setSelectedFileIds, sortConfig, onSortChange }: FileListViewProps) {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedFileIds(new Set(files.map(f => f.id)));
    } else {
      setSelectedFileIds(new Set());
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelection = new Set(selectedFileIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedFileIds(newSelection);
  };

  return (
    <div className="overflow-hidden border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs uppercase text-slate-700 bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
            <tr>
              <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedFileIds.size === files.length && files.length > 0} /></th>
              <SortableHeader label="File" sortKey="name" sortConfig={sortConfig} onSortChange={onSortChange} />
              <SortableHeader label="Size" sortKey="size" sortConfig={sortConfig} onSortChange={onSortChange} />
              <SortableHeader label="Owner" sortKey="owner" sortConfig={sortConfig} onSortChange={onSortChange} />
              <SortableHeader label="Date" sortKey="date" sortConfig={sortConfig} onSortChange={onSortChange} />
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Storage</th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => {
              const { icon: Icon, color } = fileTypeConfig[file.type];
              return (
                <tr key={file.id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                  <td className="p-4"><input type="checkbox" checked={selectedFileIds.has(file.id)} onChange={() => handleSelectOne(file.id)} /></td>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      <Icon className={cn("w-5 h-5", color)} />
                      <span className="truncate max-w-xs">{file.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatBytes(file.size)}</td>
                  <td className="px-4 py-3 truncate max-w-xs">{file.owner}</td>
                  <td className="px-4 py-3">{new Date(file.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", statusConfig[file.status].color)} />
                      <span>{file.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {file.storage === 'gdrive' ? <FaGoogleDrive className="w-5 h-5 text-green-500" /> : <FaServer className="w-5 h-5 text-blue-500" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative group">
                      <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><MoreVertical className="w-4 h-4" /></button>
                      <div className="absolute right-0 z-10 hidden p-1 mt-2 bg-white border rounded-md shadow-lg dark:bg-slate-900 border-slate-200 dark:border-slate-700 group-hover:block">
                        <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Download className="w-4 h-4" /> Download</button>
                        <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Edit className="w-4 h-4" /> Details</button>
                        <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"><Shield className="w-4 h-4" /> Quarantine</button>
                        <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /> Delete</button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}