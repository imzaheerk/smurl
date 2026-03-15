import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui';
import { LogoutConfirmModal } from '../../../components/LogoutConfirmModal';

export interface AccountSectionProps {
  email: string | null;
  onLogout: () => void;
}

export function AccountSection({ email, onLogout }: AccountSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);
  const handleConfirm = () => {
    onLogout();
    closeConfirm();
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl"
    >
      <div className="flex items-start gap-3 mb-4 sm:mb-6">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white">Account</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Signed-in account and session. Log out to use a different account.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-4 mb-4">
        <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Signed in as</p>
        <p className="text-slate-200 font-medium break-all">{email ?? '—'}</p>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={openConfirm}
        className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:!bg-red-500/20 hover:!text-red-300 focus-visible:!ring-red-400 focus-visible:!ring-offset-slate-900 touch-manipulation"
      >
        <LogOut className="w-4 h-4 shrink-0" />
        Log out
      </Button>
      <LogoutConfirmModal open={confirmOpen} onClose={closeConfirm} onConfirm={handleConfirm} />
    </motion.section>
  );
}
