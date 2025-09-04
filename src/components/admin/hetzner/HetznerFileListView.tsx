"use client";

import { HetznerFileItem } from "@/types/hetzner";
import { Download, Eye, RotateCcw, Trash2, Image, Video, Music, FileText, FileArchive, File } from "lucide-react";
import { cn } from "@/lib/utils";

const fileTypeIcons: { [key: string]: React.ElementType } = {
  image: Image, video: Video, audio: Music, document: FileText, archive: FileArchive, other: File
};

const fileTypeBadges: { [key: string]: string } = {
  image: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800',
  video: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
  audio: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
  document: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800',
  archive: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800',
  other: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800',
};

interface HetznerFileListViewProps {
  files: HetznerFileItem[];
  selectedFiles: string[];
  onToggleSelection: (fileId: string) => void;
  onSelectAll: () => void;
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onDownload: (file: HetznerFileItem) => void;
  onPreview: (file: HetznerFileItem) => void;
  onRecover: (file: HetznerFileItem) => void;
  onDelete: (file: HetznerFileItem) => void;
}

export function HetznerFileListView({ files, selectedFiles, onToggleSelection, onSelectAll, onSort, sortBy, sortOrder, onDownload, onPreview, onRecover, onDelete }: HetznerFileListViewProps) {
  const isAllSelected = selectedFiles.length === files.length && files.length > 0;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs uppercase text-slate-700 bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th className="p-4"><input type="checkbox" checked={isAllSelected} onChange={onSelectAll} /></th>
            <th className="px-6 py-3 cursor-pointer" onClick={() => onSort('filename')}>Filename</th>
            <th className="px-6 py-3 cursor-pointer" onClick={() => onSort('size_bytes')}>Size</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Owner</th>
            <th className="px-6 py-3 cursor-pointer" onClick={() => onSort('upload_date')}>Upload Date</th>
            <th className="px-6 py-3">Source Account</th>
            <th className="px-6 py-3">Backup Path</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y dark:bg-slate-800 divide-slate-200 dark:divide-slate-700">
          {files.map(file => {
            const Icon = fileTypeIcons[file.file_type] || File;
            return (
              <tr key={file._id} className={cn("hover:bg-slate-50 dark:hover:bg-slate-700/50", selectedFiles.includes(file._id) && "bg-green-50 dark:bg-green-900/20")}>
                <td className="p-4"><input type="checkbox" checked={selectedFiles.includes(file._id)} onChange={() => onToggleSelection(file._id)} /></td>
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white"><div className="flex items-center gap-2"><Icon className="w-4 h-4" /><span className="truncate max-w-xs">{file.filename}</span></div></td>
                <td className="px-6 py-4">{file.size_formatted}</td>
                <td className="px-6 py-4"><span className={cn("px-2 py-1 text-xs font-semibold rounded-full", fileTypeBadges[file.file_type])}>{file.file_type}</span></td>
                <td className="px-6 py-4 truncate max-w-xs">{file.owner_email}</td>
                <td className="px-6 py-4">{new Date(file.upload_date).toLocaleString()}</td>
                <td className="px-6 py-4">{file.gdrive_account_id}</td>
                <td className="px-6 py-4 truncate max-w-xs">{file.hetzner_remote_path}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onDownload(file)} className="p-2 text-blue-600 rounded-full hover:bg-blue-100"><Download className="w-4 h-4" /></button>
                    {file.preview_available && <button onClick={() => onPreview(file)} className="p-2 text-purple-600 rounded-full hover:bg-purple-100"><Eye className="w-4 h-4" /></button>}
                    <button onClick={() => onRecover(file)} className="p-2 text-emerald-600 rounded-full hover:bg-emerald-100"><RotateCcw className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(file)} className="p-2 text-red-600 rounded-full hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
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