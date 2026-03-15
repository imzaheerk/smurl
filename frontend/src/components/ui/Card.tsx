import { type ReactNode } from 'react';
import { CARD_SLATE_BASE } from '../../constants/styles';

interface CardProps {
  children: ReactNode;
  /** Extra class names (padding, shadow, etc.). */
  className?: string;
  /** Predefined padding: p3, p4, p5. Default p4. */
  padding?: 'p3' | 'p4' | 'p5' | 'none';
  /** Add shadow. */
  shadow?: boolean;
  as?: 'div' | 'article' | 'section';
}

const paddingClass = {
  p3: ' p-3',
  p4: ' p-4',
  p5: ' p-5',
  none: ''
} as const;

export function Card({
  children,
  className = '',
  padding = 'p4',
  shadow,
  as: Tag = 'div'
}: CardProps) {
  const base = CARD_SLATE_BASE + paddingClass[padding];
  const shadowClass = shadow ? ' shadow-lg shadow-slate-950/70' : '';
  return (
    <Tag className={base + shadowClass + (className ? ' ' + className : '')}>
      {children}
    </Tag>
  );
}
