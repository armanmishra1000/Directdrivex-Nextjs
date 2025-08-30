"use client";

import { User } from "./data";
import { X, Info, Edit, Shield, File, Database } from "lucide-react";

export interface ModalState {
  type: 'view' | 'edit' | 'suspend' | 'ban' | 'activate' | 'reset_password' | 'files' | 'storage' | null;
  data: any;
}

interface UserModalsProps {
  modalState: ModalState;
  onClose: () => void;
}

const Modal = ({ title, children, onClose, icon: Icon }: { title: string, children: React.ReactNode, onClose: () => void, icon: React.ElementType }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
    <div className="relative w-full max-w-2xl p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl" onClick={e => e.stopPropagation()}>
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

export function UserModals({ modalState, onClose }: UserModalsProps) {
  if (!modalState.type) return null;

  const user = modalState.data as User;

  const renderModalContent = () => {
    switch (modalState.type) {
      case 'view':
        return (
          <Modal title="User Details" onClose={onClose} icon={Info}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong className="text-slate-500">Email:</strong> {user.email}</div>
              <div><strong className="text-slate-500">Role:</strong> {user.role}</div>
              <div><strong className="text-slate-500">Status:</strong> {user.status}</div>
              <div><strong className="text-slate-500">Files:</strong> {user.filesCount}</div>
              <div><strong className="text-slate-500">Storage Used:</strong> {(user.storageUsed / (1024 ** 3)).toFixed(2)} GB</div>
              <div><strong className="text-slate-500">Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
              <div><strong className="text-slate-500">Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</div>
            </div>
          </Modal>
        );
      case 'edit':
        return (
          <Modal title="Edit User" onClose={onClose} icon={Edit}>
            <p>Edit form for {user.email} would go here.</p>
          </Modal>
        );
      case 'suspend':
      case 'ban':
      case 'activate':
        return (
          <Modal title={`Confirm ${modalState.type.charAt(0).toUpperCase() + modalState.type.slice(1)}`} onClose={onClose} icon={Shield}>
            <p>Are you sure you want to {modalState.type} the user {user.email}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg">Confirm</button>
            </div>
          </Modal>
        );
      case 'files':
        return (
          <Modal title={`Files for ${user.email}`} onClose={onClose} icon={File}>
            <p>A table of files for this user would be displayed here.</p>
          </Modal>
        );
      case 'storage':
        return (
          <Modal title={`Storage Insights for ${user.email}`} onClose={onClose} icon={Database}>
            <p>Detailed storage insights would be displayed here.</p>
          </Modal>
        );
      default:
        return null;
    }
  };

  return renderModalContent();
}