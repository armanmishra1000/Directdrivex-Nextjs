"use client";

import { File, Image, Video, Music, FileText, FileArchive, Download, Eye, Trash } from 'lucide-react';
import { DriveFileItem } from '@/types/drive';
import { cn } from '@/lib/utils';

const fileTypeIcons = {
  image: Image,
  video: Video,
  audio: Music,
  document: FileText,
  archive: FileArchive,
  other: File,
};

const backupStatusConfig = {
  none: { text: 'Not Backed Up', color: 'border-amber-500' },
  in_progress: { text: 'Transferring', color: 'border-blue-500' },
  completed: { text: 'Backed Up', color: 'border-emerald-500' },
  failed: { text: 'Failed', color: 'border-red-500' },
};

interface DriveGridViewProps {
  files: DriveFileItem[];
}

export function DriveGridView({ files }: DriveGridViewProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {files.map(file => {
        const Icon = fileTypeIcons[file.file_type] || File;
        const status = backupStatusConfig[file.backup_status];
        return (
          <div key={file._id} className={cn("relative group border rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-1", status.color)}>
            <div className="absolute z-10 top-2 left-2"><input type="checkbox" /></div>
            <div className="flex items-center justify-center h-32 rounded-t-xl bg-slate-100 dark:bg-slate-800">
              <Icon className="w-12 h-12 text-slate-400" />
            </div>
            <div className="p-3 bg-white dark:bg-slate-900 rounded-b-xl">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white">{file.filename}</p>
              <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{file.size_formatted}</span>
                <span>{new Date(file.upload_date).toLocaleDateString()}</span>
              </div>
              <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-md"><Download className="w-3 h-3" /></button>
                {file.preview_available && <button className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-md"><Eye className="w-3 h-3" /></button>}
                <button className="p-1.5 bg-white dark:bg-slate-700 rounded-md shadow-md"><Trash className="w-3 h-3 text-red-500" /></button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}