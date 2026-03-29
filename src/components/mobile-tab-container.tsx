'use client';

import { useCallback, useRef } from 'react';
import { useMobileTab, TABS } from './mobile-tab-context';

const SWIPE_THRESHOLD = 80;

export function MobileTabContainer({
  aboutContent,
  projectsContent,
  writingsContent,
}: {
  aboutContent: React.ReactNode;
  projectsContent: React.ReactNode;
  writingsContent: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useMobileTab();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const scrollPositions = useRef<Record<string, number>>({});
  const panelRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const activeIndex = TABS.indexOf(activeTab);

  const handleTabChange = useCallback(
    (tab: (typeof TABS)[number]) => {
      // Save current tab's scroll position
      const currentPanel = panelRefs.current[activeTab];
      if (currentPanel) {
        scrollPositions.current[activeTab] = window.scrollY;
      }

      setActiveTab(tab);

      // Restore new tab's scroll position
      requestAnimationFrame(() => {
        const savedY = scrollPositions.current[tab] ?? 0;
        window.scrollTo(0, savedY);
      });
    },
    [activeTab, setActiveTab]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;

      // Ignore if vertical swipe is dominant
      if (Math.abs(deltaY) > Math.abs(deltaX)) return;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

      const currentIndex = TABS.indexOf(activeTab);

      if (deltaX < 0 && currentIndex < TABS.length - 1) {
        // Swipe left -> next tab
        handleTabChange(TABS[currentIndex + 1]);
      } else if (deltaX > 0 && currentIndex > 0) {
        // Swipe right -> previous tab
        handleTabChange(TABS[currentIndex - 1]);
      }
    },
    [activeTab, handleTabChange]
  );

  const panels = [aboutContent, projectsContent, writingsContent];

  return (
    <div
      className="overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {panels.map((content, i) => (
          <div
            key={TABS[i]}
            ref={(el) => {
              panelRefs.current[TABS[i]] = el;
            }}
            className="w-full flex-shrink-0"
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
