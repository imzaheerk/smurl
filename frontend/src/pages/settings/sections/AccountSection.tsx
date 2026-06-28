import { useState } from 'react';
import { User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui';
import { LogoutConfirmModal } from '../../../components/LogoutConfirmModal';
import { APP_CARD, APP_LABEL } from '../../../components/app/appTheme';

export interface AccountSectionProps {
  email: string | null;
  onLogout: () => void;
}

export function AccountSection({ email, onLogout }: AccountSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={APP_CARD + ' p-4 sm:p-6'}
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 sm:h-10 sm:w-10">
          <User className="h-4 w-4 text-fuchsia-400 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white sm:text-lg">Account</h2>
          <p className="mt-0.5 text-xs text-violet-200/50 sm:text-sm">
            Signed-in account and session. Log out to switch accounts.
          </p>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-white/[0.06] bg-[#0a0514]/60 px-4 py-4">
        <p className={APP_LABEL + ' !mb-1 uppercase tracking-wider'}>Signed in as</p>
        <p className="break-all font-medium text-violet-100/90">{email ?? '—'}</p>
      </div>

      <Button
        type="button"
        variant="ghost"
        onClick={() => setConfirmOpen(true)}
        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 hover:!bg-red-500/20 hover:!text-red-300 focus-visible:!ring-red-400"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        Log out
      </Button>
      <LogoutConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={onLogout} />
    </motion.section>
  );
}
