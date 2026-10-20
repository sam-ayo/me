'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useMobileTab, TABS } from './mobile-tab-context';

// A drag past this share of the width changes the tab.
const DISTANCE_THRESHOLD = 0.25;
// A flick faster than this (px per ms) changes the tab at any distance.
const VELOCITY_THRESHOLD = 0.4;
// A move this long (px) decides whether the gesture is a swipe or a scroll.
const AXIS_LOCK_DISTANCE = 8;

type Drag = {
  startX: number;
  startY: number;
  startTime: number;
  axis: 'x' | 'y' | null;
  dx: number;
};

export function MobileTabContainer({
  aboutContent,
  projectsContent,
  resumeContent,
}: {
  aboutContent: React.ReactNode;
  projectsContent: React.ReactNode;
  resumeContent: React.ReactNode;
}) {
  const { activeTab, setActiveTab } = useMobileTab();
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<Drag | null>(null);
  const [height, setHeight] = useState<number>();

  const activeIndex = TABS.indexOf(activeTab);

  /* The panels sit side by side, so without a fixed height the strip takes the
     height of the longest panel and a short tab scrolls into empty space. */
  useLayoutEffect(() => {
    const panel = panelRefs.current[activeIndex];
    if (!panel) return;
    setHeight(panel.offsetHeight);
    const observer = new ResizeObserver(() => setHeight(panel.offsetHeight));
    observer.observe(panel);
    return () => observer.disconnect();
  }, [activeIndex]);

  /* The drag writes the transform straight to the track, so a touch move does
     not render React or restyle the panels. */
  const setTrackOffset = useCallback(
    (dx: number, animate: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(calc(${-activeIndex * 100}% + ${dx}px))`;
    },
    [activeIndex],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // A second finger must not restart a drag that is already in progress.
    if (drag.current || e.touches.length > 1) return;
    const touch = e.touches[0];
    drag.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: performance.now(),
      axis: null,
      dx: 0,
    };
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const state = drag.current;
      if (!state) return;
      const touch = e.touches[0];
      const dx = touch.clientX - state.startX;
      const dy = touch.clientY - state.startY;

      if (!state.axis) {
        if (Math.hypot(dx, dy) < AXIS_LOCK_DISTANCE) return;
        state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      }
      if (state.axis !== 'x') return;

      // Past the first or the last tab, the strip resists the drag.
      const atEdge =
        (dx > 0 && activeIndex === 0) ||
        (dx < 0 && activeIndex === TABS.length - 1);
      state.dx = atEdge ? dx * 0.2 : dx;
      setTrackOffset(state.dx, false);
    },
    [activeIndex, setTrackOffset],
  );

  const handleTouchEnd = useCallback(() => {
    const state = drag.current;
    drag.current = null;
    if (!state || state.axis !== 'x') return;

    const width = trackRef.current?.offsetWidth ?? window.innerWidth;
    const velocity = Math.abs(state.dx) / (performance.now() - state.startTime);
    const passed =
      Math.abs(state.dx) > width * DISTANCE_THRESHOLD ||
      velocity > VELOCITY_THRESHOLD;
    const next = activeIndex + (state.dx < 0 ? 1 : -1);

    // React keeps the inline transform, so the track settles on the new tab
    // with the class transition.
    setTrackOffset(0, true);
    if (passed && next >= 0 && next < TABS.length) {
      setActiveTab(TABS[next]);
    }
  }, [activeIndex, setActiveTab, setTrackOffset]);

  const panels = [aboutContent, projectsContent, resumeContent];

  return (
    <div
      className="overflow-hidden touch-pan-y touch-pinch-zoom"
      style={{ height }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* A click on desktop switches the tab at once, as a native tab does. On
          a phone the strip slides, so the motion matches the swipe. */}
      <div
        ref={trackRef}
        className="flex items-start transition-transform [transition-duration:250ms] ease-drawer will-change-transform motion-reduce:duration-0 md:duration-0"
        style={{ transform: `translateX(${-activeIndex * 100}%)` }}
      >
        {panels.map((content, i) => (
          <div
            key={TABS[i]}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            // Off-screen panels stay out of the tab order and screen readers.
            inert={i !== activeIndex}
            className="w-full flex-shrink-0"
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  );
}
