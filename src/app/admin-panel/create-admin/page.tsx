"use client";

import { UserPlus, Lock } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { CreateAdminForm } from "@/components/admin/CreateAdminForm";
import { Loader2 } from "lucide-react";

const AccessDenied = () => (
  <div className="w-full max-w-2xl p-6 text-center border shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-red-500/20 dark:border-red-400/20 rounded-2xl shadow-slate-900/5 dark:shadow-black/10">
    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10">
      <Lock className="w-6 h-6 text-red-500" />
    </div>
    <h2 className="text-xl font-bold text-red-800 dark:text-red-300">Access Denied</h2>
    <p className="mt-2 text-slate-600 dark:text-slate-400">
      You do not have the required permissions to create new admin users. This action is restricted to Super Admins only.
    </p>
  </div>
);

export default function CreateAdminPage() {
  const { isSuperAdmin, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 text-blue-500 rounded-lg bg-blue-500/10 dark:bg-blue-400/10 dark:text-blue-400">
          <UserPlus className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Admin User</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create new admin or superadmin accounts. (Superadmin only)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start justify-center">
        {isSuperAdmin() ? <CreateAdminForm /> : <AccessDenied />}
      </div>
    </div>
  );
}