'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Whether an element is currently on screen.
 *
 * Used to stop 3D scenes rendering while they are scrolled away. Two live
 * WebGL contexts on a phone is enough to get one of them dropped under memory
 * pressure, and there is no reason to burn a mobile GPU on a canvas nobody can
 * see. Defaults to `true` so the first paint is never blank if the observer is
 * unavailable.
 */
export function useInViewport(
  ref: RefObject<Element>,
  { rootMargin = '200px' }: { rootMargin?: string } = {},
): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return visible;
}
