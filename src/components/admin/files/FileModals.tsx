"use client";

import { ModalState } from "@/types/admin-files";
import { X, Shield, Move, AlertTriangle, Trash2 } from "lucide-react";

const Modal = ({ title, children, onClose, icon: Icon }: { title: string, children: React.ReactNode, onClose: () => void, icon: React.ElementType }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
    <div className="relative w-full max-w-lg p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between pb-4 border-b dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-500 dark:text-blue-400">
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>
      <div className="pt-6">{children}</div>
    </div>
  </div>
);

export function FileModals({ modalState, onClose }: { modalState: ModalState, onClose: () => void }) {
  if (!modalState.type) return null;

  const { type, data } = modalState;

  switch (type) {
    case 'integrity':
      return <Modal title="File Integrity Check" onClose={onClose} icon={Shield}><p>Integrity check results for {data.filename} would be shown here.</p></Modal>;
    case 'move':
      return <Modal title="Move File" onClose={onClose} icon={Move}><p>Options to move {data.filename} to a different storage location.</p></Modal>;
    case 'bulkConfirm':
      return <Modal title="Confirm Bulk Action" onClose={onClose} icon={AlertTriangle}><p>Confirmation for bulk action on {data.count} files.</p></Modal>;
    case 'orphaned':
      return <Modal title="Orphaned Files" onClose={onClose} icon={Trash2}><p>List of orphaned files and cleanup options.</p></Modal>;
    default:
      return null;
  }
}