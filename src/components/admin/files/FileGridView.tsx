"use client";

import { FileItem } from "@/types/file-browser";
import { cn } from "@/lib/utils";
import { FileImage, FileVideo, FileText, FileArchive, FileAudio, FileQuestion, MoreVertical, Download, Edit, Trash2, Shield } from "lucide-react";
import { FaGoogleDrive } from "react-icons/fa";
import { FaServer } from "react-icons/fa6";

const fileTypeConfig = {
  image: { icon: FileImage, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
  video: { icon: FileVideo, color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
  document: { icon: FileText, color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
  archive: { icon: FileArchive, color: "text-pink-500", bgColor: "bg-pink-50 dark:bg-pink-900/20" },
  audio: { icon: FileAudio, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-900/20" },
  other: { icon: FileQuestion, color: "text-slate-500", bgColor: "bg-slate-100 dark:bg-slate-700" },
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

interface FileGridViewProps {
  files: FileItem[];
  selectedFileIds: Set<string>;
  setSelectedFileIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function FileGridView({ files, selectedFileIds, setSelectedFileIds }: FileGridViewProps) {
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
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {files.map(file => {
        const { icon: Icon, color, bgColor } = fileTypeConfig[file.type];
        const isSelected = selectedFileIds.has(file.id);
        return (
          <div key={file.id} className={cn("relative group border rounded-xl transition-all duration-200", isSelected ? "border-blue-500 ring-2 ring-blue-500" : "border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1")}>
            <div className="absolute top-2 left-2 z-10">
              <input type="checkbox" checked={isSelected} onChange={() => handleSelectOne(file.id)} className="w-4 h-4 text-blue-600 rounded" />
            </div>
            <div className="absolute top-2 right-2 z-10">
              <div className="relative">
                <button className="p-1.5 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </button>
                <div className="absolute right-0 z-20 hidden p-1 mt-1 bg-white border rounded-md shadow-lg dark:bg-slate-900 border-slate-200 dark:border-slate-700 group-hover:block">
                  <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Download className="w-4 h-4" /> Download</button>
                  <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded hover:bg-slate-100 dark:hover:bg-slate-800"><Edit className="w-4 h-4" /> Details</button>
                  <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"><Shield className="w-4 h-4" /> Quarantine</button>
                  <button className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 className="w-4 h-4" /> Delete</button>
                </div>
              </div>
            </div>
            <div className={cn("flex items-center justify-center h-32 rounded-t-xl", bgColor)}>
              <Icon className={cn("w-12 h-12", color)} />
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-b-xl">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white" title={file.name}>{file.name}</p>
              <div className="flex items-center justify-between mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{formatBytes(file.size)}</span>
                {file.storage === 'gdrive' ? <FaGoogleDrive className="w-4 h-4 text-green-500" /> : <FaServer className="w-4 h-4 text-blue-500" />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}