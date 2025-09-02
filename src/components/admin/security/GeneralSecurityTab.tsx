"use client";

import { useState } from "react";
import { mockSecurityConfig } from "./data";
import { SecurityConfig } from "@/types/security";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Globe } from "lucide-react";

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
              <Slider
                value={[config.session_timeout_minutes]}
                onValueChange={(value) => setConfig({ ...config, session_timeout_minutes: value[0] })}
                min={5} max={10080} step={5}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Max Login Attempts</label>
                <Input type="number" value={config.max_login_attempts} onChange={(e) => setConfig({ ...config, max_login_attempts: +e.target.value })} />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">Lockout Duration (mins)</label>
                <Input type="number" value={config.lockout_duration_minutes} onChange={(e) => setConfig({ ...config, lockout_duration_minutes: +e.target.value })} />
              </div>
            </div>
          </div>
        </GlassCard>
        <GlassCard title="Security Features">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20">
              <label className="font-medium">Strong Password Requirements</label>
              <Switch checked={config.require_strong_passwords} onCheckedChange={(checked) => setConfig({ ...config, require_strong_passwords: checked })} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20">
              <label className="font-medium">Two-Factor Authentication</label>
              <Switch checked={config.enable_two_factor_auth} onCheckedChange={(checked) => setConfig({ ...config, enable_two_factor_auth: checked })} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-900/20">
              <label className="font-medium">API Rate Limiting</label>
              <Switch checked={config.enable_api_rate_limiting} onCheckedChange={(checked) => setConfig({ ...config, enable_api_rate_limiting: checked })} />
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
                <Input
                  type="text"
                  value={origin}
                  onChange={(e) => handleOriginChange(index, e.target.value)}
                  placeholder="https://example.com"
                  className="pl-9"
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeOrigin(index)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addOrigin} className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Origin
          </Button>
        </div>
      </GlassCard>
    </div>
  );
}