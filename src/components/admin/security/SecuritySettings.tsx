"use client";

import { useState } from "react";
import { Cog, Shield, Key, Users, Save, RotateCcw } from "lucide-react";
import { GeneralSecurityTab } from "./GeneralSecurityTab";
import { AccessRulesTab } from "./AccessRulesTab";
import { PasswordPolicyTab } from "./PasswordPolicyTab";
import { ActiveSessionsTab } from "./ActiveSessionsTab";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "general", label: "General", icon: Cog },
  { id: "access-rules", label: "Access Rules", icon: Shield },
  { id: "password-policy", label: "Password Policy", icon: Key },
  { id: "sessions", label: "Active Sessions", icon: Users },
];

export function SecuritySettings() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 text-white rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Security Settings</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage your system's security configuration.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600">
            <RotateCcw className="w-4 h-4" /> Reset Changes
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
            <Save className="w-4 h-4" /> Save All Settings
          </button>
        </div>
      </div>

      {/* Custom Tabs */}
      <div>
        <div className="grid w-full grid-cols-2 p-1 rounded-lg md:grid-cols-4 bg-slate-100 dark:bg-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center justify-center px-3 py-2 text-sm font-medium transition-colors rounded-md",
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              )}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-6">
          {activeTab === 'general' && <GeneralSecurityTab />}
          {activeTab === 'access-rules' && <AccessRulesTab />}
          {activeTab === 'password-policy' && <PasswordPolicyTab />}
          {activeTab === 'sessions' && <ActiveSessionsTab />}
        </div>
      </div>
    </div>
  );
}