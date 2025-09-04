"use client";

import { HetznerFileItem } from "@/types/hetzner";
import { Download, Eye, Trash2, Image, Video, Music, FileText, FileArchive, File } from "lucide-react";
import { cn } from "@/lib/utils";

const fileTypeIcons: { [key: string]: React.ElementType } = {
  image: Image, video: Video, audio: Music, document: FileText, archive: FileArchive, other: File
};

interface HetznerFileGridViewProps {
  files: HetznerFileItem[];
  selectedFiles: string[];
  onToggleSelection: (fileId: string) => void;
  onDownload: (file: HetznerFileItem) => void;
  onPreview: (file: HetznerFileItem) => void;
  onDelete: (file: HetznerFileItem) => void;
}

export function HetznerFileGridView({ files, selectedFiles, onToggleSelection, onDownload, onPreview, onDelete }: HetznerFileGridViewProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {files.map(file => {
        const Icon = fileTypeIcons[file.file_type] || File;
        const isSelected = selectedFiles.includes(file._id);
        return (
          <div key={file._id} className={cn("relative group border rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-1", isSelected ? "border-green-500 ring-2 ring-green-500" : "border-slate-200 dark:border-slate-700")}>
            <div className="absolute z-10 top-2 left-2"><input type="checkbox" checked={isSelected} onChange={() => onToggleSelection(file._id)} /></div>
            <div className="flex items-center justify-center h-32 rounded-t-xl bg-slate-100 dark:bg-slate-800"><Icon className="w-12 h-12 text-slate-400" /></div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-b-xl">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{file.filename}</p>
              <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{file.size_formatted}</span>
                <span>{new Date(file.upload_date).toLocaleDateString()}</span>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onDownload(file)} className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-md"><Download className="w-3 h-3 text-blue-500" /></button>
                {file.preview_available && <button onClick={() => onPreview(file)} className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-md"><Eye className="w-3 h-3 text-purple-500" /></button>}
                <button onClick={() => onDelete(file)} className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-md"><Trash2 className="w-3 h-3 text-red-500" /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}