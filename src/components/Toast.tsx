import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm bg-[#131722] border-l-4 border-l-[#ff5500] border border-[#2a2f44] p-3.5 shadow-2xl flex items-center justify-between gap-3 text-xs font-mono text-[#faf8f5] animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className="text-[#8e97a8] hover:text-[#faf8f5] p-1 transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
