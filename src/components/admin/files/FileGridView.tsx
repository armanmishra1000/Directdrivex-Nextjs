"use client";

import { AdminFile } from "@/types/admin";
import { Loader2, AlertTriangle, FolderOpen, Download, Eye, Trash, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileGridViewProps {
  files: AdminFile[];
  loading: boolean;
  error: string | null;
  selectedFileIds: Set<string>;
  onSelectionChange: (fileId: string, isSelected: boolean) => void;
  onFileAction: (type: string, file: AdminFile) => void;
}

const FileCard = ({ file, isSelected, onSelectionChange, onFileAction }: { file: AdminFile, isSelected: boolean, onSelectionChange: (id: string, selected: boolean) => void, onFileAction: (type: string, file: AdminFile) => void }) => (
  <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-lg p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between">
      <input type="checkbox" checked={isSelected} onChange={(e) => onSelectionChange(file.id, e.target.checked)} />
      <div className="flex gap-1">
        <button onClick={() => onFileAction('download', file)} className="p-1.5 text-blue-500 hover:bg-blue-100 rounded-md"><Download className="w-4 h-4" /></button>
        <button onClick={() => onFileAction('preview', file)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md"><Eye className="w-4 h-4" /></button>
        <button onClick={() => onFileAction('delete', file)} className="p-1.5 text-red-500 hover:bg-red-100 rounded-md"><Trash className="w-4 h-4" /></button>
      </div>
    </div>
    <div className="text-center">
      {/* Large file type icon placeholder */}
      <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 text-xs font-mono uppercase">{file.type}</div>
    </div>
    <div className="text-sm">
      <p className="font-medium text-slate-900 dark:text-white truncate">{file.filename}</p>
      <p className="text-slate-500 dark:text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      <p className="text-slate-500 dark:text-slate-400 truncate">Owner: {file.owner}</p>
    </div>
    <div className="flex justify-between items-center text-xs mt-auto">
      <span className="px-2 py-1 font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">{file.status}</span>
      <span className="px-2 py-1 font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">{file.storageLocation}</span>
    </div>
  </div>
);

export function FileGridView({ files, loading, error, selectedFileIds, onSelectionChange, onFileAction }: FileGridViewProps) {
  if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  if (error) return <div className="h-96 flex flex-col items-center justify-center text-red-500"><AlertTriangle className="w-10 h-10 mb-2" /><p>{error}</p></div>;
  if (files.length === 0) return <div className="h-96 flex flex-col items-center justify-center text-slate-500"><FolderOpen className="w-12 h-12 mb-2" /><p>No files found.</p></div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {files.map(file => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={selectedFileIds.has(file.id)}
          onSelectionChange={onSelectionChange}
          onFileAction={onFileAction}
        />
      ))}
    </div>
  );
}