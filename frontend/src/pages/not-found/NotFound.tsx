import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export const NotFound = () => {
  const [searchParams] = useSearchParams();
  const fromShortLink = searchParams.get('from') === 'short';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-500/[0.04] blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm px-8 py-12 text-center shadow-xl">
          <p className="text-5xl md:text-6xl font-bold text-slate-600 tracking-tight">
            404
          </p>
          <h1 className="mt-5 text-lg font-medium text-slate-200">
            {fromShortLink ? "This link isn't here anymore." : "Page not found."}
          </h1>
          <p className="mt-2 text-slate-500 text-sm leading-relaxed">
            {fromShortLink
              ? "The short link may be invalid or expired."
              : "The page you're looking for doesn't exist or was moved."}
          </p>

          <p className="mt-8 text-sm text-slate-400">
            <Link
              to={ROUTES.HOME}
              className="text-teal-400 hover:text-teal-300 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
            >
              Go to home
            </Link>
            {fromShortLink && (
              <>
                {' · '}
                <Link
                  to={ROUTES.SHORTEN_HASH}
                  className="text-teal-400 hover:text-teal-300 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
                >
                  Create a short link
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
