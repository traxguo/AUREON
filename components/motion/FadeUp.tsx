'use client';

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type FadeUpProps = {
  children: ReactNode;
  /** Stagger index — 80 ms apart, matching the motion spec. */
  index?: number;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'article' | 'tr';
} & Omit<HTMLMotionProps<'div'>, 'children' | 'className'>;

/**
 * The single reveal used everywhere outside the hero: 24 px up, fade in.
 * Deliberately plain — the hero and the field map are the only places allowed
 * to perform.
 */
export function FadeUp({
  children,
  index = 0,
  delay = 0,
  className,
  as = 'div',
  ...rest
}: FadeUpProps) {
  const reduced = useReducedMotion();
  // The motion factories are structurally identical for the props we pass; the
  // cast just stops TS from trying to unify six element-specific prop maps.
  const Component = motion[as] as typeof motion.div;

  return (
    <Component
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{
        duration: reduced ? 0.25 : 0.6,
        delay: delay + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default FadeUp;
