"use client";

import { GeographicDistribution } from "@/types/analytics";
import { cn } from "@/lib/utils";

export function GeographicDistribution({ data }: { data: GeographicDistribution | null }) {
  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <h3 className="mb-4 font-semibold text-slate-800 dark:text-slate-200">Geographic Distribution</h3>
      <div className="space-y-3">
        {data?.countries.map((country, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1 text-sm">
              <span className="font-medium text-slate-700 dark:text-slate-300">{country.country}</span>
              <span className="text-slate-500 dark:text-slate-400">{country.count} users ({country.percentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${country.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}