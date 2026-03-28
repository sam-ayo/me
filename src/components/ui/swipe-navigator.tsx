'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

const PAGES = ['/', '/projects', '/writings'];
const SWIPE_THRESHOLD = 80;

export function SwipeNavigator({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const getCurrentPageIndex = useCallback(() => {
    if (pathname === '/') return 0;
    const index = PAGES.findIndex(
      (page) => page !== '/' && pathname.startsWith(page)
    );
    return index === -1 ? -1 : index;
  }, [pathname]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Ignore if vertical swipe is dominant (user is scrolling)
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

      const currentIndex = getCurrentPageIndex();
      if (currentIndex === -1) return;

      if (deltaX < 0 && currentIndex < PAGES.length - 1) {
        // Swipe left → next page
        router.push(PAGES[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        // Swipe right → previous page
        router.push(PAGES[currentIndex - 1]);
      }
    },
    [getCurrentPageIndex, router]
  );

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
}
