import { CheckCircle2, Quote, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const REVIEWS = [
  {
    quote:
      'We swapped messy campaign URLs for Smurl links in under an hour. Click reporting by country alone paid for the switch.',
    name: 'Maya Chen',
    role: 'Growth Lead',
    company: 'Flowline Studio',
    rating: 5,
    theme: {
      ring: 'from-fuchsia-400 via-pink-400 to-fuchsia-500',
      glow: 'shadow-[0_0_40px_rgba(232,121,249,0.12)]',
      border: 'border-fuchsia-500/25',
      bg: 'from-fuchsia-500/[0.12] via-transparent to-transparent',
      avatar: 'text-fuchsia-200',
      featured: false
    }
  },
  {
    quote:
      'The API is exactly what we needed — shorten from CI, track from the dashboard. No browser gymnastics required.',
    name: 'James Okonkwo',
    role: 'Staff Engineer',
    company: 'Northwind Labs',
    rating: 5,
    theme: {
      ring: 'from-violet-400 via-fuchsia-400 to-pink-400',
      glow: 'shadow-[0_0_50px_rgba(167,139,250,0.18)]',
      border: 'border-fuchsia-500/30',
      bg: 'from-violet-500/[0.14] via-fuchsia-500/[0.06] to-transparent',
      avatar: 'text-violet-200',
      featured: true
    }
  },
  {
    quote:
      'QR codes for print, short links for social, one dashboard for everything. Our clients finally see unified click data.',
    name: 'Sofia Reyes',
    role: 'Account Director',
    company: 'Pixelwave Media',
    rating: 5,
    theme: {
      ring: 'from-amber-400 via-orange-300 to-amber-500',
      glow: 'shadow-[0_0_40px_rgba(251,191,36,0.12)]',
      border: 'border-amber-500/25',
      bg: 'from-amber-500/[0.12] via-transparent to-transparent',
      avatar: 'text-amber-200',
      featured: false
    }
  }
] as const;

const REVIEW_STATS = [
  { value: '4.9', label: 'Average rating', suffix: '/5' },
  { value: '2.4k+', label: 'Teams onboarded' },
  { value: '98%', label: 'Would recommend' }
] as const;

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const starClass = size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={
            starClass +
            ' ' +
            (i < rating ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]' : 'fill-white/10 text-white/10')
          }
          aria-hidden
        />
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: (typeof REVIEWS)[number]; index: number }) {
  const initials = review.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
  const featured = review.theme.featured;

  return (
    <ScrollReveal delay={index * 100} className="h-full">
      <motion.figure
        whileHover={{ y: featured ? -3 : -2 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className={
          'group relative flex h-full flex-col overflow-hidden rounded-xl border bg-[#0c0818]/70 backdrop-blur-xl transition-shadow duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.4)] ' +
          review.theme.border +
          ' ' +
          review.theme.glow +
          (featured ? ' md:-translate-y-1' : '')
        }
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 opacity-80"
          aria-hidden
        />
        <div
          className={'pointer-events-none absolute inset-0 bg-gradient-to-br ' + review.theme.bg}
          aria-hidden
        />

        <Quote
          className="pointer-events-none absolute -right-1 -top-1 h-14 w-14 text-white/[0.03] transition-colors duration-300 group-hover:text-fuchsia-500/[0.06]"
          aria-hidden
        />

        <div className="relative flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <StarRating rating={review.rating} />
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-300/90">
              <CheckCircle2 className="h-2.5 w-2.5 shrink-0" aria-hidden />
              Verified
            </span>
          </div>

          <blockquote className="relative mt-3 flex-1 text-sm leading-snug text-violet-100/85">
            <span className="bg-gradient-to-r from-fuchsia-200/90 via-violet-100/90 to-amber-100/80 bg-clip-text font-medium text-transparent">
              &ldquo;{review.quote}&rdquo;
            </span>
          </blockquote>

          <figcaption className="relative mt-4 flex items-center gap-2.5 border-t border-white/[0.06] pt-3">
            <div className="relative shrink-0">
              <div
                className={
                  'absolute -inset-0.5 rounded-lg bg-gradient-to-br opacity-80 blur-[2px] ' + review.theme.ring
                }
                aria-hidden
              />
              <span
                className={
                  'relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-[#0a0514] text-[10px] font-bold ' +
                  review.theme.avatar
                }
              >
                {initials}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{review.name}</p>
              <p className="truncate text-xs text-violet-300/50">
                {review.role} · {review.company}
              </p>
            </div>
          </figcaption>
        </div>
      </motion.figure>
    </ScrollReveal>
  );
}

export function ReviewsSection() {
  return (
    <section className="relative mt-16 md:mt-20" aria-label="Customer reviews">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"
        aria-hidden
      />

      <ScrollReveal>
        <div className="mb-10 text-center">
          <p className={LANDING_SECTION_LABEL}>Reviews</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Loved by{' '}
            <span className="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              marketers & builders
            </span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-violet-200/50">
            Real feedback from teams running campaigns, APIs, and client reporting on Smurl.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c0818]/40 p-4 max-sm:p-3 sm:p-5 md:p-6">
        <div
          className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-[100px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-amber-500/10 blur-[90px]"
          aria-hidden
        />

        <ScrollReveal delay={60}>
          <div className="relative mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {REVIEW_STATS.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0a0514]/50 px-3.5 py-3 sm:flex-col sm:items-center sm:justify-center sm:px-4 sm:text-center"
              >
                <p className="text-xl font-bold tabular-nums text-white sm:text-2xl">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-base font-semibold text-amber-400/70">{stat.suffix}</span>
                  )}
                </p>
                <p className="text-xs text-violet-400/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="relative mb-4 flex justify-center">
          <div className="hero-badge-border inline-flex items-center gap-3 rounded-full p-px">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-[#0a0514]/90 px-3.5 py-1.5 backdrop-blur-md">
              <StarRating rating={5} />
              <span className="text-xs font-semibold text-amber-300">4.9</span>
              <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden />
              <span className="hidden items-center gap-1.5 text-xs text-violet-400/55 sm:inline-flex">
                <Users className="h-3.5 w-3.5" aria-hidden />
                Trusted by growing teams
              </span>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-1 items-stretch gap-3 md:grid-cols-3 md:gap-4">
          {REVIEWS.map((review, i) => (
            <ReviewCard key={review.name} review={review} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use ReviewsSection — kept for backwards compatibility */
export const TestimonialsSection = ReviewsSection;
