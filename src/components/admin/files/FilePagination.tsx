"use client";

import { FilePaginationState } from "@/types/admin";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FilePaginationProps {
  pagination: FilePaginationState;
  onPageChange: (page: number) => void;
}

export function FilePagination({ pagination, onPageChange }: FilePaginationProps) {
  const { currentPage, totalPages, totalItems, pageSize } = pagination;
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Showing {startItem}-{endItem} of {totalItems} files
      </p>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 disabled:opacity-50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm">Page {currentPage} of {totalPages}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 disabled:opacity-50">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}