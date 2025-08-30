"use client";

import { AdminFile, FileType } from "@/types/admin-files";
import { cn } from "@/lib/utils";
import { File, Image, Video, Music, Archive, FileText, Download, Eye, Trash2 } from "lucide-react";

const fileTypeIcons: Record<FileType, React.ElementType> = {
  image: Image, video: Video, audio: Music, document: FileText, archive: Archive, other: File,
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function FileGridView({ files, loading, selectedFileIds, setSelectedFileIds, onAction }: any) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {files.map((file: AdminFile) => {
        const FileIcon = fileTypeIcons[file.type];
        return (
          <div key={file.id} className="relative group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm overflow-hidden">
            <div className="absolute top-2 left-2 z-10"><input type="checkbox" /></div>
            <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 bg-white/50 backdrop-blur-sm rounded-md"><Download className="w-4 h-4" /></button>
              <button className="p-1.5 bg-white/50 backdrop-blur-sm rounded-md"><Eye className="w-4 h-4" /></button>
              <button className="p-1.5 bg-white/50 backdrop-blur-sm rounded-md"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="h-32 flex items-center justify-center bg-slate-50 dark:bg-slate-700">
              <FileIcon className="w-12 h-12 text-slate-400" />
            </div>
            <div className="p-4">
              <p className="font-medium text-slate-900 dark:text-white truncate">{file.filename}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{formatBytes(file.size)}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{file.owner}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}