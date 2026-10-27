'use client';

import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useMobileTab, TABS, TAB_PATHS } from './mobile-tab-context';
import {
  getScrollPositions,
  saveScrollPosition,
} from './ui/scroll-restoration';

// A move this long (px) decides whether the gesture is a swipe or a scroll.
const AXIS_LOCK_DISTANCE = 8;
// The release velocity comes from the touch samples of this period (ms).
const VELOCITY_WINDOW = 100;
// The deceleration of a flick, as in the iOS scroll view.
const DECELERATION_RATE = 0.998;

/* A critically damped spring has no bounce, so the strip stops on the tab.
   The spring starts at the finger velocity, so a release has no seam. The
   rest values are small because the position unit is one panel width. */
const SPRING = {
  type: 'spring',
  visualDuration: 0.35,
  bounce: 0,
  restDelta: 0.001,
  restSpeed: 0.01,
} as const;

// The desktop switches the tab at once, as a native tab does.
const INSTANT_QUERY = '(min-width: 768px), (prefers-reduced-motion: reduce)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type Drag = {
  startX: number;
  startY: number;
  // The strip position at the touch start, in panel widths.
  startPosition: number;
  axis: 'x' | 'y' | null;
  samples: { t: number; x: number }[];
};

// The distance (px) that a flick travels before it stops.
function project(velocity: number) {
  return ((velocity / 1000) * DECELERATION_RATE) / (1 - DECELERATION_RATE);
}

// Past an edge, the strip follows the finger less as the drag gets longer.
function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  return (
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))
  );
}

function scrollPositionOf(index: number) {
  return getScrollPositions()[TAB_PATHS[TABS[index]]] ?? 0;
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const drag = useRef<Drag | null>(null);
  const spring = useRef<AnimationPlaybackControls | null>(null);
  const releaseVelocity = useRef<number | null>(null);
  const moving = useRef(false);

  const activeIndex = TABS.indexOf(activeTab);
  const shownIndex = useRef(activeIndex);

  /* The position is the strip offset in panel widths, so a window resize
     does not move the strip off the tab. React sets the transform only from
     the motion value, so a render does not stop the spring. */
  const [initialIndex] = useState(activeIndex);
  const position = useMotionValue(-initialIndex);
  const transform = useTransform(position, (p) => `translateX(${p * 100}%)`);

  /* The panels sit side by side, so without a fixed height the strip takes
     the height of the longest panel and a short tab scrolls into empty space.
     While the strip moves, it keeps the longest height, so the panel that
     leaves is not cut off. */
  const fitHeight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const panels = panelRefs.current;
    const height = moving.current
      ? Math.max(...panels.map((panel) => panel?.offsetHeight ?? 0))
      : (panels[shownIndex.current]?.offsetHeight ?? 0);
    container.style.height = `${height}px`;
  }, []);

  /* Each tab keeps its own scroll position, but the window has one scroll
     position. While the strip moves, each inactive panel moves vertically, so
     it shows the part at its own scroll position. Then a tab change does not
     make a panel jump. */
  const alignPanels = useCallback(() => {
    const scrollY = window.scrollY;
    panelRefs.current.forEach((panel, i) => {
      if (!panel) return;
      const offset =
        i === shownIndex.current ? 0 : scrollY - scrollPositionOf(i);
      panel.style.transform = offset ? `translateY(${offset}px)` : '';
    });
  }, []);

  const startMoving = useCallback(() => {
    if (moving.current) return;
    moving.current = true;
    saveScrollPosition(TAB_PATHS[TABS[shownIndex.current]]);
    fitHeight();
    alignPanels();
  }, [fitHeight, alignPanels]);

  const stopMoving = useCallback(() => {
    moving.current = false;
    panelRefs.current.forEach((panel) => {
      if (panel) panel.style.transform = '';
    });
    fitHeight();
  }, [fitHeight]);

  const settle = useCallback(
    (index: number, velocity = position.getVelocity()) => {
      startMoving();
      spring.current?.stop();
      spring.current = animate(position, -index, {
        ...SPRING,
        velocity,
        onComplete: () => {
          spring.current = null;
          stopMoving();
        },
      });
    },
    [position, startMoving, stopMoving],
  );

  useLayoutEffect(() => {
    fitHeight();
    const observer = new ResizeObserver(fitHeight);
    panelRefs.current.forEach((panel) => panel && observer.observe(panel));
    return () => observer.disconnect();
  }, [fitHeight]);

  /* A tab change from the nav, a swipe, or the back button. The window
     scrolls in the same frame as the slide starts, so no frame shows the
     new tab at the old scroll position. */
  useLayoutEffect(() => {
    const previous = shownIndex.current;
    if (previous === activeIndex) return;

    const velocity = releaseVelocity.current;
    releaseVelocity.current = null;
    const instant = window.matchMedia(
      velocity === null ? INSTANT_QUERY : REDUCED_MOTION_QUERY,
    ).matches;

    saveScrollPosition(TAB_PATHS[TABS[previous]]);
    shownIndex.current = activeIndex;

    if (instant) {
      spring.current?.stop();
      spring.current = null;
      position.jump(-activeIndex);
      stopMoving();
      window.scrollTo(0, scrollPositionOf(activeIndex));
      return;
    }

    // The scroll position of the previous tab is already saved, so this does
    // not call startMoving, which saves the position of the shown tab.
    moving.current = true;
    fitHeight();
    window.scrollTo(0, scrollPositionOf(activeIndex));
    alignPanels();
    settle(activeIndex, velocity ?? position.getVelocity());
  }, [activeIndex, position, alignPanels, fitHeight, settle, stopMoving]);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      // A second finger must not restart a drag that is already in progress.
      if (drag.current || e.touches.length > 1) return;
      const touch = e.touches[0];
      // A touch catches the strip where it is, as a finger catches a page.
      spring.current?.stop();
      spring.current = null;
      drag.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startPosition: position.get(),
        axis: null,
        samples: [],
      };
    },
    [position],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const state = drag.current;
      if (!state) return;
      const touch = e.touches[0];
      const dx = touch.clientX - state.startX;
      const dy = touch.clientY - state.startY;

      if (!state.axis) {
        if (Math.hypot(dx, dy) < AXIS_LOCK_DISTANCE) return;
        state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (state.axis === 'x') startMoving();
        // A vertical scroll lets a caught strip finish its slide.
        else if (moving.current) settle(shownIndex.current, 0);
      }
      if (state.axis !== 'x') return;
      // The strip allows a vertical pan, so the page scrolls with the vertical
      // drift of a swipe unless the move is canceled.
      if (e.cancelable) e.preventDefault();

      const now = performance.now();
      state.samples.push({ t: now, x: dx });
      while (now - state.samples[0].t > VELOCITY_WINDOW) state.samples.shift();

      const width = trackRef.current?.offsetWidth ?? window.innerWidth;
      const raw = state.startPosition * width + dx;
      const min = -(TABS.length - 1) * width;
      let offset = raw;
      if (raw > 0) offset = rubberband(raw, width);
      else if (raw < min) offset = min + rubberband(raw - min, width);
      position.set(offset / width);
    },
    [position, settle, startMoving],
  );

  // React adds touch listeners as passive, so they cannot cancel a scroll.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    return () => container.removeEventListener('touchmove', handleTouchMove);
  }, [handleTouchMove]);

  const handleTouchEnd = useCallback(() => {
    const state = drag.current;
    drag.current = null;
    if (!state) return;
    // A tap or a scroll lets a caught strip finish its slide.
    if (state.axis !== 'x') {
      if (moving.current && !spring.current) settle(shownIndex.current, 0);
      return;
    }

    const width = trackRef.current?.offsetWidth ?? window.innerWidth;
    const { samples } = state;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const elapsed = performance.now() - first.t;
    // A finger that stopped before the release has no velocity.
    const pxPerSecond =
      samples.length > 1 && elapsed <= VELOCITY_WINDOW
        ? ((last.x - first.x) / (last.t - first.t || 1)) * 1000
        : 0;

    /* The strip goes to the tab nearest to where the flick would stop, so a
       short fast flick changes the tab. A swipe moves one tab at most. */
    const projected = position.get() + project(pxPerSecond) / width;
    const current = shownIndex.current;
    const next = Math.min(
      Math.max(Math.round(-projected), current - 1, 0),
      current + 1,
      TABS.length - 1,
    );
    const velocity = pxPerSecond / width;

    if (next === current) {
      settle(current, velocity);
    } else {
      releaseVelocity.current = velocity;
      setActiveTab(TABS[next]);
    }
  }, [position, setActiveTab, settle]);

  const panels = [aboutContent, projectsContent, resumeContent];

  return (
    <div
      ref={containerRef}
      className="overflow-hidden touch-pan-y touch-pinch-zoom"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <motion.div
        ref={trackRef}
        className="flex items-start will-change-transform"
        style={{ transform }}
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
      </motion.div>
    </div>
  );
}
