import { Dialog } from '@headlessui/react';
import { LogOut, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui';
import { LANDING_SECTION_LABEL } from './app/appTheme';

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
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

      <Dialog.Panel
        as={motion.div}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="relative w-full max-w-md overflow-hidden rounded-t-2xl border border-white/[0.08] border-b-0 bg-[#0c0818] shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:rounded-2xl sm:border-b"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.05] via-transparent to-fuchsia-500/[0.04]"
          aria-hidden
        />

        <div className="relative p-5 sm:p-6">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="absolute right-3 top-3 p-1.5"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="flex flex-col items-center text-center sm:items-start sm:pr-10 sm:text-left">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl bg-red-500/20 blur-xl"
                aria-hidden
              />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
                <LogOut className="h-5 w-5 text-red-400" aria-hidden />
              </div>
            </div>

            <p className={'mt-4 ' + LANDING_SECTION_LABEL}>Session</p>
            <Dialog.Title className="mt-1 text-lg font-semibold text-white sm:text-xl">
              Sign out of Smurl?
            </Dialog.Title>
            <Dialog.Description className="mt-2 max-w-sm text-sm leading-relaxed text-violet-200/55">
              You&apos;ll need to sign in again to access your dashboard, links, and analytics.
            </Dialog.Description>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="secondaryCyan"
              onClick={onClose}
              className="min-h-[44px] w-full rounded-xl px-5 sm:w-auto"
            >
              Stay signed in
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirm}
              className="min-h-[44px] w-full gap-2 rounded-xl px-5 hover:scale-100 sm:w-auto"
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              Sign out
            </Button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
