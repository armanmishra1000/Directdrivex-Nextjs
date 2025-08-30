"use client";

import { useState, useMemo } from "react";
import { Users, Download, FileJson, ListFilter } from "lucide-react";
import { UserTable } from "@/components/admin/users/UserTable";
import { UserFilters } from "@/components/admin/users/UserFilters";
import { UserModals, ModalState } from "@/components/admin/users/UserModals";
import { mockUsers, User } from "@/components/admin/users/data";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [modalState, setModalState] = useState<ModalState>({ type: null, data: null });

  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const searchMatch = user.email.toLowerCase().includes(filters.search.toLowerCase());
      const roleMatch = filters.role === 'all' || user.role === filters.role;
      const statusMatch = filters.status === 'all' || user.status === filters.status;
      return searchMatch && roleMatch && statusMatch;
    });
  }, [users, filters]);

  const handleModalOpen = (type: ModalState['type'], data: any) => {
    setModalState({ type, data });
  };

  const handleModalClose = () => {
    setModalState({ type: null, data: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/10 dark:bg-blue-400/10 text-blue-500 dark:text-blue-400 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Manage, edit, and monitor all users.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center gap-2">
            <FileJson className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Filters */}
      <UserFilters filters={filters} setFilters={setFilters} />

      {/* Data Table */}
      <div className="p-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-400/20 dark:border-slate-400/10 rounded-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/10">
        <UserTable
          users={filteredUsers}
          loading={loading}
          error={error}
          selectedUserIds={selectedUserIds}
          setSelectedUserIds={setSelectedUserIds}
          onAction={handleModalOpen}
        />
      </div>

      {/* Modals */}
      <UserModals modalState={modalState} onClose={handleModalClose} />
    </div>
  );
}