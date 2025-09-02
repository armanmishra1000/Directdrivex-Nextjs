"use client";

import { useState } from "react";
import { mockSecurityConfig } from "./data";
import { SecurityConfig } from "@/types/security";
import { Trash2, Plus, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Switch Component
const CustomSwitch = ({ checked, onCheckedChange }: { checked: boolean, onCheckedChange: (checked: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
      checked ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"
    )}
  >
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

const GlassCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
    {children}
  </div>
);

export function GeneralSecurityTab() {
  const [config, setConfig] = useState<SecurityConfig>(mockSecurityConfig);

  const handleOriginChange = (index: number, value: string) => {
    const newOrigins = [...config.allowed_cors_origins];
    newOrigins[index] = value;
    setConfig({ ...config, allowed_cors_origins: newOrigins });
  };

  const addOrigin = () => {
    setConfig({ ...config, allowed_cors_origins: [...config.allowed_cors_origins, ''] });
  };

  const removeOrigin = (index: number) => {
    const newOrigins = config.allowed_cors_origins.filter((_, i) => i !== index);
    setConfig({ ...config, allowed_cors_origins: newOrigins });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <GlassCard title="Authentication Settings">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium">Session Timeout: {config.session_timeout_minutes} mins</label>
              <input
                type="range"
                value={config.session_timeout_minutes}
                onChange={(e) => setConfig({ ...config, session_timeout_minutes: +e.target.value })}
                min={5} max={10080} step={5}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-indigo-600 [&::-webkit-slider-thumb]:rounded-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Max Login Attempts</label>
                <input type="number" value={config.max_login_attempts} onChange={(e) => setConfig({ ...config, max_login_attempts: +e.target.value })} className="w-full px-3 py-2 bg-white border rounded-md dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Lockout Duration (mins)</label>
                <input type="number" value={config.lockout_duration_minutes} onChange={(e) => setConfig({ ...config, lockout_duration_minutes: +e.target.value })} className="w-full px-3 py-2 bg-white border rounded-md dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
              </div>
            </div>
          </div>
        </GlassCard>
        <GlassCard title="Security Features">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20">
              <label className="font-medium">Strong Password Requirements</label>
              <CustomSwitch checked={config.require_strong_passwords} onCheckedChange={(checked) => setConfig({ ...config, require_strong_passwords: checked })} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20">
              <label className="font-medium">Two-Factor Authentication</label>
              <CustomSwitch checked={config.enable_two_factor_auth} onCheckedChange={(checked) => setConfig({ ...config, enable_two_factor_auth: checked })} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20">
              <label className="font-medium">API Rate Limiting</label>
              <CustomSwitch checked={config.enable_api_rate_limiting} onCheckedChange={(checked) => setConfig({ ...config, enable_api_rate_limiting: checked })} />
            </div>
          </div>
        </GlassCard>
      </div>
      <GlassCard title="CORS Origins">
        <div className="space-y-3">
          {config.allowed_cors_origins.map((origin, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-grow">
                <Globe className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => handleOriginChange(index, e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-9 pr-3 py-2 bg-white border rounded-md dark:bg-slate-900 border-slate-300 dark:border-slate-600"
                />
              </div>
              <button className="p-2 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => removeOrigin(index)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
          <button className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600" onClick={addOrigin}>
            <Plus className="w-4 h-4 mr-2" /> Add Origin
          </button>
        </div>
      </GlassCard>
    </div>
  );
}