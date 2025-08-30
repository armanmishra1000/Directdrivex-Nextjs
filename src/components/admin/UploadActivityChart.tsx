"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', uploads: 400 },
  { name: 'Tue', uploads: 300 },
  { name: 'Wed', uploads: 200 },
  { name: 'Thu', uploads: 278 },
  { name: 'Fri', uploads: 189 },
  { name: 'Sat', uploads: 239 },
  { name: 'Sun', uploads: 349 },
];

export function UploadActivityChart() {
  return (
    <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Upload Activity (Last 7 Days)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
            <XAxis dataKey="name" stroke="rgba(100, 116, 139, 0.8)" />
            <YAxis stroke="rgba(100, 116, 139, 0.8)" />
            <Tooltip
              contentStyle={{
                background: "rgba(30, 41, 59, 0.9)",
                border: "1px solid rgba(100, 116, 139, 0.2)",
                borderRadius: "0.75rem",
              }}
              labelStyle={{ color: "#f8fafc" }}
            />
            <Bar dataKey="uploads" fill="url(#colorUv)" />
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}