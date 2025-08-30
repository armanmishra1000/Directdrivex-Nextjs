"use client";

import { useState } from "react";
import { User, UserRole, UserStatus } from "./data";
import { cn } from "@/lib/utils";
import { Eye, Edit, File, Shield, Slash, CheckCircle, Key, MoreVertical, Loader2, AlertTriangle } from "lucide-react";

interface UserTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
  selectedUserIds: Set<string>;
  setSelectedUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  onAction: (type: string, data: any) => void;
}

const RoleBadge = ({ role }: { role: UserRole }) => {
  const roleStyles = {
    superadmin: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    regular: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  };
  return <span className={cn("px-2 py-1 text-xs font-medium rounded-full", roleStyles[role])}>{role}</span>;
};

const StatusBadge = ({ status }: { status: UserStatus }) => {
  const statusStyles = {
    active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
    suspended: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    banned: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  };
  return <span className={cn("px-2 py-1 text-xs font-medium rounded-full", statusStyles[status])}>{status}</span>;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export function UserTable({ users, loading, error, selectedUserIds, setSelectedUserIds, onAction }: UserTableProps) {
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(new Set(users.map(u => u.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectOne = (userId: string) => {
    const newSelection = new Set(selectedUserIds);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUserIds(newSelection);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-lg font-semibold">Failed to load users</p>
        <p>{error}</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <Users className="w-12 h-12 mb-4" />
        <p className="text-lg font-semibold">No users found</p>
        <p>Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-300">
          <tr>
            <th scope="col" className="p-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedUserIds.size === users.length && users.length > 0} /></th>
            <th scope="col" className="px-6 py-3">User</th>
            <th scope="col" className="px-6 py-3">Role</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Files</th>
            <th scope="col" className="px-6 py-3">Storage</th>
            <th scope="col" className="px-6 py-3">Created</th>
            <th scope="col" className="px-6 py-3">Last Login</th>
            <th scope="col" className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600/20">
              <td className="p-4"><input type="checkbox" checked={selectedUserIds.has(user.id)} onChange={() => handleSelectOne(user.id)} /></td>
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-white">{user.email}</div>
                <div className="text-xs text-slate-500">{user.id}</div>
              </td>
              <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
              <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
              <td className="px-6 py-4">{user.filesCount}</td>
              <td className="px-6 py-4">{formatBytes(user.storageUsed)}</td>
              <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">{new Date(user.lastLogin).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1">
                  <button onClick={() => onAction('view', user)} className="p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-md"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onAction('files', user)} className="p-1.5 text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 rounded-md"><File className="w-4 h-4" /></button>
                  <button onClick={() => onAction('edit', user)} className="p-1.5 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/20 rounded-md"><Edit className="w-4 h-4" /></button>
                  {user.status === 'active' && <button onClick={() => onAction('suspend', user)} className="p-1.5 text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded-md"><Shield className="w-4 h-4" /></button>}
                  {user.status !== 'banned' && <button onClick={() => onAction('ban', user)} className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md"><Slash className="w-4 h-4" /></button>}
                  {user.status !== 'active' && <button onClick={() => onAction('activate', user)} className="p-1.5 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-md"><CheckCircle className="w-4 h-4" /></button>}
                  <button onClick={() => onAction('reset_password', user)} className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"><Key className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}