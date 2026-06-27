import { type ComponentType } from 'react';
import { Toaster, ToastBar, resolveValue, toast, type Toast } from 'react-hot-toast';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

type ToastVisual = {
  accent: string;
  glow: string;
  iconWrap: string;
  iconColor: string;
  Icon: ComponentType<{ className?: string }>;
  label: string;
};

function getToastVisual(type: Toast['type']): ToastVisual {
  switch (type) {
    case 'success':
      return {
        accent: 'from-fuchsia-500 via-pink-500 to-amber-400',
        glow: 'from-fuchsia-500/10 via-transparent to-amber-400/5',
        iconWrap: 'border-fuchsia-500/25 bg-fuchsia-500/10',
        iconColor: 'text-fuchsia-400',
        Icon: CheckCircle2,
        label: 'Success'
      };
    case 'error':
      return {
        accent: 'from-red-500 via-rose-500 to-red-400',
        glow: 'from-red-500/10 via-transparent to-rose-500/5',
        iconWrap: 'border-red-500/25 bg-red-500/10',
        iconColor: 'text-red-400',
        Icon: AlertCircle,
        label: 'Error'
      };
    default:
      return {
        accent: 'from-violet-500 via-fuchsia-500 to-pink-400',
        glow: 'from-violet-500/10 via-transparent to-fuchsia-500/5',
        iconWrap: 'border-violet-500/25 bg-violet-500/10',
        iconColor: 'text-violet-300',
        Icon: Info,
        label: 'Notice'
      };
  }
}

function NotificationToast({ toast: t }: { toast: Toast }) {
  const visual = getToastVisual(t.type);
  const { Icon } = visual;

  return (
    <div
      className={
        'pointer-events-auto relative w-full max-w-[min(420px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0818]/95 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ' +
        (t.visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.98] opacity-0')
      }
      role={t.type === 'error' ? 'alert' : 'status'}
      aria-live={t.type === 'error' ? 'assertive' : 'polite'}
    >
      <div
        className={'pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ' + visual.accent}
        aria-hidden
      />
      <div
        className={'pointer-events-none absolute inset-0 bg-gradient-to-br ' + visual.glow}
        aria-hidden
      />

      <div className="relative flex items-start gap-3 p-4">
        <div
          className={
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ' + visual.iconWrap
          }
        >
          <Icon className={'h-4 w-4 ' + visual.iconColor} aria-hidden />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-400/55">
            {visual.label}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-violet-100/90">
            {resolveValue(t.message, t)}
          </p>
        </div>

        <button
          type="button"
          onClick={() => toast.dismiss(t.id)}
          className="shrink-0 rounded-lg p-1.5 text-violet-400/45 transition hover:bg-white/[0.05] hover:text-fuchsia-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/50 max-sm:flex max-sm:min-h-[44px] max-sm:min-w-[44px] max-sm:items-center max-sm:justify-center max-sm:p-2.5"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerClassName="!top-[calc(3.75rem+env(safe-area-inset-top,0px))] sm:!top-6"
      toastOptions={{
        duration: 4200,
        className: '!bg-transparent !p-0 !shadow-none !max-w-none',
        success: { duration: 3600 },
        error: { duration: 5200 }
      }}
    >
      {(t) => (
        <ToastBar toast={t}>
          {() => <NotificationToast toast={t} />}
        </ToastBar>
      )}
    </Toaster>
  );
}
