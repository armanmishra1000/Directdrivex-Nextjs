"use client";

import { File, Image, Video, Music, FileText, FileArchive, Download, Eye, Shield, ArrowRight, CloudUpload, RotateCcw, Trash, CheckCircle } from 'lucide-react';
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
  none: { text: 'Not Backed Up', color: 'bg-amber-500' },
  in_progress: { text: 'Transferring', color: 'bg-blue-500' },
  completed: { text: 'Backed Up', color: 'bg-emerald-500' },
  failed: { text: 'Failed', color: 'bg-red-500' },
};

interface DriveListViewProps {
  files: DriveFileItem[];
}

export function DriveListView({ files }: DriveListViewProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs uppercase text-slate-700 bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="p-4"><input type="checkbox" /></th>
            <th scope="col" className="px-6 py-3">Filename</th>
            <th scope="col" className="px-6 py-3">Size</th>
            <th scope="col" className="px-6 py-3">Type</th>
            <th scope="col" className="px-6 py-3">Owner</th>
            <th scope="col" className="px-6 py-3">Upload Date</th>
            <th scope="col" className="px-6 py-3">Drive Account</th>
            <th scope="col" className="px-6 py-3">Backup Status</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => {
            const Icon = fileTypeIcons[file.file_type] || File;
            const status = backupStatusConfig[file.backup_status];
            return (
              <tr key={file._id} className="bg-white border-b dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
                <td className="p-4"><input type="checkbox" /></td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="truncate max-w-xs">{file.filename}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{file.size_formatted}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded bg-slate-100 dark:bg-slate-700">{file.file_type}</span></td>
                <td className="px-6 py-4 truncate max-w-xs">{file.owner_email}</td>
                <td className="px-6 py-4">{new Date(file.upload_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-mono text-xs">{file.gdrive_account_id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", status.color)} />
                    <span>{status.text}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-md"><Download className="w-4 h-4" /></button>
                    {file.preview_available && <button className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"><Eye className="w-4 h-4" /></button>}
                    <button className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md"><Trash className="w-4 h-4" /></button>
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