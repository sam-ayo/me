'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { pathnameToTab } from '@/components/mobile-tab-context';

const STORAGE_KEY = 'scroll-positions';

export function getScrollPositions(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveScrollPosition(path: string, y = window.scrollY) {
  const positions = getScrollPositions();
  positions[path] = y;
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

  useEffect(() => {
    const handleBeforeNav = () => {
      saveScrollPosition(prevPathname.current);
    };

    // A swipe between the mobile tabs changes the route with no click.
    document.addEventListener('click', handleBeforeNav, { capture: true });
    document.addEventListener('touchstart', handleBeforeNav, {
      capture: true,
      passive: true,
    });
    window.addEventListener('beforeunload', handleBeforeNav);

    return () => {
      document.removeEventListener('click', handleBeforeNav, { capture: true });
      document.removeEventListener('touchstart', handleBeforeNav, {
        capture: true,
      });
      window.removeEventListener('beforeunload', handleBeforeNav);
    };
  }, []);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // The tab strip scrolls in the same frame as its slide starts, so it
      // restores the scroll position for a change between two tabs.
      const betweenTabs =
        pathnameToTab(pathname) !== null &&
        pathnameToTab(prevPathname.current) !== null;
      if (!betweenTabs) {
        requestAnimationFrame(() => {
          restoreScrollPosition(pathname);
        });
      }
      prevPathname.current = pathname;
    }
  }, [pathname]);

  return null;
}
