import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Button } from './ui';

export interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ open, onClose, onConfirm }: LogoutConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ perspective: '1000px' }}>
      <div
        className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
      />
      <Dialog.Panel
        className={`relative max-w-sm w-full bg-slate-900 rounded-2xl p-6 shadow-2xl border border-red-500/20 transform transition-all duration-500 ${
          open ? 'scale-100 opacity-100 translate-y-0 rotate-y-0' : 'scale-95 opacity-0 translate-y-4 rotate-y-12'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: open ? 'rotateX(0deg) rotateY(0deg) scale(1)' : 'rotateX(10deg) rotateY(5deg) scale(0.95)'
        }}
      >
        <div className="absolute -inset-1 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/10 rounded-2xl blur-xl -z-10" />
        <div className="flex items-center gap-3">
          <div className="relative">
            <ExclamationTriangleIcon
              className="h-6 w-6 text-red-400 animate-bounce"
              style={{ animation: 'bounce 1s infinite, spin 3s linear infinite' }}
            />
          </div>
          <Dialog.Title className="text-lg font-semibold text-white">Confirm logout</Dialog.Title>
        </div>
        <Dialog.Description className="mt-2 text-sm text-slate-300">
          Are you sure you want to log out?
        </Dialog.Description>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondaryGray" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" onClick={handleConfirm}>
            Yes, logout
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
