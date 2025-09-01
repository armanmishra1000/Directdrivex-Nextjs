"use client";

import { FileModalState, AdminFile } from "@/types/admin";
import { X, Trash, Shield, CloudArrowUp, AlertTriangle } from "lucide-react";

interface FileModalsProps {
  modalState: FileModalState;
  onClose: () => void;
  onConfirm: () => void;
}

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

export function FileModals({ modalState, onClose, onConfirm }: FileModalsProps) {
  if (!modalState.type) return null;

  const file = modalState.data as AdminFile;

  const renderContent = () => {
    switch (modalState.type) {
      case 'delete':
        return (
          <Modal title="Confirm Deletion" onClose={onClose} icon={Trash}>
            <p>Are you sure you want to permanently delete the file "{file.filename}"?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg">Delete</button>
            </div>
          </Modal>
        );
      case 'quarantine':
        return (
          <Modal title="Confirm Quarantine" onClose={onClose} icon={Shield}>
            <p>Are you sure you want to quarantine the file "{file.filename}"?</p>
             <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg">Quarantine</button>
            </div>
          </Modal>
        );
      case 'cleanup':
        return (
          <Modal title="System Cleanup" onClose={onClose} icon={Trash}>
            <p>This will scan for and remove orphaned files. This action can take some time. Are you sure you want to proceed?</p>
             <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg">Start Cleanup</button>
            </div>
          </Modal>
        );
      case 'bulk':
        const { action, reason, selectedFileIds } = modalState.data;
        return (
          <Modal title={`Confirm Bulk ${action}`} onClose={onClose} icon={AlertTriangle}>
            <p>Are you sure you want to <span className="font-bold">{action}</span> {selectedFileIds.size} selected files?</p>
            {reason && <p className="mt-2 text-sm text-slate-500">Reason: {reason}</p>}
             <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg">Confirm</button>
            </div>
          </Modal>
        );
      default:
        return null;
    }
  };

  return renderContent();
}