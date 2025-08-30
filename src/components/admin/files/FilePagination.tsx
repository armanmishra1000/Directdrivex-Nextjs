"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function FilePagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: any) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Showing {startItem}-{endItem} of {totalItems} files
      </p>
      <div className="inline-flex rounded-lg shadow-sm">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 text-sm font-medium rounded-l-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-50">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 text-sm font-medium rounded-r-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 disabled:opacity-50">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}