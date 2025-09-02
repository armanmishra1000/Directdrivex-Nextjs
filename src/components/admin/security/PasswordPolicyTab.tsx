"use client";

import { useState } from "react";
import { mockPasswordPolicy } from "./data";
import { PasswordPolicy } from "@/types/security";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const GlassCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="p-6 border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
    <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">{title}</h3>
    {children}
  </div>
);

export function PasswordPolicyTab() {
  const [policy, setPolicy] = useState<PasswordPolicy>(mockPasswordPolicy);

  return (
    <GlassCard title="Password Requirements">
      <div className="space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium">Minimum Length: {policy.min_length} characters</label>
          <Slider
            value={[policy.min_length]}
            onValueChange={(value) => setPolicy({ ...policy, min_length: value[0] })}
            min={8} max={32} step={1}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="require_uppercase" checked={policy.require_uppercase} onCheckedChange={(checked) => setPolicy({ ...policy, require_uppercase: !!checked })} />
            <label htmlFor="require_uppercase">Require Uppercase</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="require_lowercase" checked={policy.require_lowercase} onCheckedChange={(checked) => setPolicy({ ...policy, require_lowercase: !!checked })} />
            <label htmlFor="require_lowercase">Require Lowercase</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="require_numbers" checked={policy.require_numbers} onCheckedChange={(checked) => setPolicy({ ...policy, require_numbers: !!checked })} />
            <label htmlFor="require_numbers">Require Numbers</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="require_special_chars" checked={policy.require_special_chars} onCheckedChange={(checked) => setPolicy({ ...policy, require_special_chars: !!checked })} />
            <label htmlFor="require_special_chars">Require Special Characters</label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Password History</label>
            <Input type="number" value={policy.password_history_count} onChange={(e) => setPolicy({ ...policy, password_history_count: +e.target.value })} />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password Expiry (days)</label>
            <Input type="number" value={policy.password_expiry_days} onChange={(e) => setPolicy({ ...policy, password_expiry_days: +e.target.value })} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}