"use client";

const ProgressBar = ({ label, value, color, darkColor }: { label: string, value: number, color: string, darkColor: string }) => (
  <div>
    <div className="flex justify-between mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
      <div className={`bg-gradient-to-r ${color} dark:${darkColor} h-2.5 rounded-full`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export function StorageDistributionChart() {
  return (
    <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10 h-full">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Storage Distribution</h3>
      <div className="space-y-4">
        <ProgressBar label="Google Drive" value={75} color="from-blue-500 to-sky-500" darkColor="from-blue-400 to-sky-400" />
        <ProgressBar label="Hetzner" value={25} color="from-red-500 to-orange-500" darkColor="from-red-400 to-orange-400" />
      </div>
    </div>
  );
}