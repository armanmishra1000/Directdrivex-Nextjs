"use client";

import { useState } from "react";
import { Loader2, AlertTriangle, RefreshCw, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  status: 'good' | 'warning' | 'critical';
  isGdrive?: boolean;
}

export function StatCard({ title, value, icon: Icon, status, isGdrive = false }: StatCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      // Simulate success/fail
      if (Math.random() > 0.3) {
        setLoading(false);
      } else {
        setLoading(false);
        setError(true);
      }
    }, 1500);
  };

  const statusColors = {
    good: "from-emerald-500 to-green-600",
    warning: "from-amber-500 to-orange-600",
    critical: "from-red-500 to-rose-600",
  };

  const gdriveColors = "from-blue-500 to-sky-600";

  return (
    <div className="relative p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
          {loading ? (
            <div className="h-9 w-24 mt-1 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
          ) : error ? (
            <div className="flex items-center gap-2 mt-2 text-red-500 dark:text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Error</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 mt-1">{value}</p>
          )}
        </div>
        <div className={cn(
          "flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-lg",
          isGdrive ? gdriveColors : statusColors[status]
        )}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      {error && (
        <button onClick={handleRetry} className="absolute bottom-4 right-4 p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">
          <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-300" />
        </button>
      )}
    </div>
  );
}