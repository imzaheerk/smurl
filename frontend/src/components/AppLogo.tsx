import { useId } from 'react';
import { Link } from 'react-router-dom';
import { LANDING_FOCUS } from './app/appTheme';

interface SmurlMarkProps {
  gradId: string;
  className?: string;
}

export function SmurlMark({ gradId, className = '' }: SmurlMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={`${gradId}-border`} x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e879f9" />
          <stop offset="0.45" stopColor="#f472b6" />
          <stop offset="1" stopColor="#fbbf24" />
        </linearGradient>
        <linearGradient id={`${gradId}-letter`} x1="10" y1="8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5d0fe" />
          <stop offset="0.55" stopColor="#e879f9" />
          <stop offset="1" stopColor="#fcd34d" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#0c0818" />
      <rect
        x="1.25"
        y="1.25"
        width="29.5"
        height="29.5"
        rx="6.75"
        fill="#0a0514"
        stroke={`url(#${gradId}-border)`}
        strokeWidth="1.5"
      />
      <path
        d="M8 20.5c0-2.8 2.1-4.6 5.2-4.6h4M24 11.5c0 2.8-2.1 4.6-5.2 4.6h-4"
        stroke={`url(#${gradId}-border)`}
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.45"
      />
      <text
        x="16"
        y="22"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontSize="17"
        fontWeight="800"
        fill={`url(#${gradId}-letter)`}
        textAnchor="middle"
      >
        S
      </text>
    </svg>
  );
}

function SmurlWordmark({ size = 'md' }: { size?: 'md' | 'lg' | 'xl' }) {
  const wordSize =
    size === 'xl' ? 'text-3xl sm:text-4xl' : size === 'lg' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl';

  return (
    <span className={'leading-none ' + wordSize} style={{ fontFamily: "'Dancing Script', cursive" }}>
      <span className="bg-gradient-to-r from-fuchsia-200 via-fuchsia-300 to-pink-300 bg-clip-text font-semibold text-transparent">
        Sm
      </span>
      <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text font-semibold text-transparent">
        url
      </span>
    </span>
  );
}

export interface SmurlBrandProps {
  size?: 'md' | 'lg' | 'xl';
  layout?: 'horizontal' | 'vertical';
  className?: string;
  glow?: boolean;
}

/** Static logo mark + wordmark (splash, loading states). */
export function SmurlBrand({
  size = 'md',
  layout = 'horizontal',
  className = '',
  glow = true
}: SmurlBrandProps) {
  const gradId = useId().replace(/:/g, '');
  const markSize =
    size === 'xl'
      ? 'h-14 w-14 sm:h-16 sm:w-16'
      : size === 'lg'
        ? 'h-10 w-10 sm:h-11 sm:w-11'
        : 'h-9 w-9 sm:h-10 sm:w-10';

  const mark = (
    <div className="relative shrink-0">
      {glow && (
        <div
          className="pointer-events-none absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-fuchsia-500/45 via-pink-500/30 to-amber-400/40 opacity-60 blur-lg"
          aria-hidden
        />
      )}
      <SmurlMark gradId={gradId} className={'relative ' + markSize} />
    </div>
  );

  if (layout === 'vertical') {
    return (
      <div className={'flex flex-col items-center gap-3 ' + className}>
        {mark}
        <SmurlWordmark size={size} />
      </div>
    );
  }

  return (
    <div className={'flex items-center gap-2.5 ' + className}>
      {mark}
      <SmurlWordmark size={size} />
    </div>
  );
}

interface AppLogoProps {
  to: string;
  className?: string;
  size?: 'md' | 'lg';
}

export function AppLogo({ to, className = '', size = 'md' }: AppLogoProps) {
  return (
    <Link
      to={to}
      className={
        'group inline-flex rounded-xl transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] ' +
        LANDING_FOCUS +
        ' ' +
        className
      }
      aria-label="Smurl home"
    >
      <SmurlBrand size={size} glow />
    </Link>
  );
}
