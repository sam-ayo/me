'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const STORAGE_KEY = 'scroll-positions';

function getScrollPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveScrollPosition(path: string) {
  const positions = getScrollPositions();
  positions[path] = window.scrollY;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
}

function restoreScrollPosition(path: string) {
  const positions = getScrollPositions();
  const y = positions[path];
  if (y != null) {
    window.scrollTo(0, y);
  } else {
    window.scrollTo(0, 0);
  }
}

export function ScrollRestoration() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  // Save scroll position before navigating away
  useEffect(() => {
    const handleBeforeNav = () => {
      saveScrollPosition(prevPathname.current);
    };

    // Save on any click (captures nav clicks before route change)
    document.addEventListener('click', handleBeforeNav, { capture: true });
    // Save on swipe-triggered navigation
    window.addEventListener('beforeunload', handleBeforeNav);

    return () => {
      document.removeEventListener('click', handleBeforeNav, { capture: true });
      window.removeEventListener('beforeunload', handleBeforeNav);
    };
  }, []);

  // Restore scroll position when pathname changes
  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Use requestAnimationFrame to ensure DOM has rendered
      requestAnimationFrame(() => {
        restoreScrollPosition(pathname);
      });
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return null;
}
