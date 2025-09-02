"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cog, Shield, Key, Users, Save, RotateCcw } from "lucide-react";
import { GeneralSecurityTab } from "./GeneralSecurityTab";
import { AccessRulesTab } from "./AccessRulesTab";
import { PasswordPolicyTab } from "./PasswordPolicyTab";
import { ActiveSessionsTab } from "./ActiveSessionsTab";

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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="general"><Cog className="w-4 h-4 mr-2" />General</TabsTrigger>
          <TabsTrigger value="access-rules"><Shield className="w-4 h-4 mr-2" />Access Rules</TabsTrigger>
          <TabsTrigger value="password-policy"><Key className="w-4 h-4 mr-2" />Password Policy</TabsTrigger>
          <TabsTrigger value="sessions"><Users className="w-4 h-4 mr-2" />Active Sessions</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
          <GeneralSecurityTab />
        </TabsContent>
        <TabsContent value="access-rules" className="mt-6">
          <AccessRulesTab />
        </TabsContent>
        <TabsContent value="password-policy" className="mt-6">
          <PasswordPolicyTab />
        </TabsContent>
        <TabsContent value="sessions" className="mt-6">
          <ActiveSessionsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}