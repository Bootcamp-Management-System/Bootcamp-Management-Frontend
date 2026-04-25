import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const AdminModal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-3xl bg-portal-card border border-portal-border rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-portal-border">
          <h3 className="text-lg font-bold text-portal-text">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-portal-text-muted hover:text-portal-text hover:bg-portal-border/40 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
