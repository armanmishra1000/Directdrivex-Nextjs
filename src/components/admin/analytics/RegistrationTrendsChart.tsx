"use client";

import { RegistrationTrends } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface RegistrationTrendsChartProps {
  trends: RegistrationTrends | null;
  onPeriodChange: (period: string) => void;
}

export function RegistrationTrendsChart({ trends, onPeriodChange }: RegistrationTrendsChartProps) {
  const maxCount = trends ? Math.max(...trends.data.map(d => d.count), 0) : 0;

  return (
    <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Registration Trends</h3>
        <select onChange={(e) => onPeriodChange(e.target.value)} defaultValue="monthly" className="px-2 py-1 text-sm bg-white border rounded-md dark:bg-slate-800 border-slate-300 dark:border-slate-600">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="flex items-end h-48 gap-2">
        {trends?.data.map((item, index) => (
          <div key={index} className="relative flex-1 h-full group">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-500"
              style={{ height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
            ></div>
            <div className="absolute -bottom-6 text-xs text-center w-full text-slate-500 dark:text-slate-400">{item.date}</div>
            <div className="absolute p-2 text-xs text-white transition-opacity duration-200 opacity-0 -top-8 bg-slate-800 rounded-md group-hover:opacity-100">
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}