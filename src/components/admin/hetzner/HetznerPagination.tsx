"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface HetznerPaginationProps {
  currentPage: number;
  totalPages: number;
  totalFiles: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function HetznerPagination({ currentPage, totalPages, totalFiles, pageSize, onPageChange }: HetznerPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between w-full gap-4 px-4 py-3 sm:flex-row">
      <div className="text-sm text-slate-700 dark:text-slate-400">
        Showing {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalFiles)} of {totalFiles} files
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
        <span className="px-3 py-1 text-sm">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}