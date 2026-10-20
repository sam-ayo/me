'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

// Each name has a `[data-theme]` block in globals.css.
export const THEMES = ['light', 'dark'] as const;
type Theme = (typeof THEMES)[number];

const isTheme = (value: string | undefined): value is Theme =>
  THEMES.includes(value as Theme);

/* Mobile browsers tint their toolbars with the theme-color meta tag, so the
   tag follows the background of the mode. */
const syncThemeColor = () => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) return;
  meta.setAttribute('content', getComputedStyle(document.body).backgroundColor);
};

const ThemeSwitcher = ({ className }: { className?: string }) => {
  // `resolvedTheme` is the mode on the screen. It is "light" or "dark", also
  // when the reader follows the system setting.
  const { resolvedTheme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server does not know the stored mode, so the name shows after mount.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) syncThemeColor();
  }, [mounted, resolvedTheme]);

  // Before mount, the first render must match the server HTML.
  const current: Theme =
    mounted && isTheme(resolvedTheme) ? resolvedTheme : 'light';
  const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const apply = () => {
      // next-themes sets the attribute in an effect, after the View
      // Transition takes its snapshot. The attribute is set here first.
      root.dataset.theme = next;
      // A change back to the system mode follows the system setting again.
      setTheme(next === systemTheme ? 'system' : next);
    };

    if (!document.startViewTransition) {
      apply();
      return;
    }

    const transition = document.startViewTransition(apply);

    // Reduced motion keeps a short crossfade, so the change is not abrupt.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition.ready.then(() => {
        root.animate(
          { opacity: [0, 1] },
          {
            duration: 200,
            easing: 'ease',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
      return;
    }

    // A keyboard press has no pointer position, so the circle then starts at
    // the center of the button.
    const button = e.currentTarget.getBoundingClientRect();
    const x = e.detail === 0 ? button.left + button.width / 2 : e.clientX;
    const y = e.detail === 0 ? button.top + button.height / 2 : e.clientY;

    // The circle grows from the button until it covers the far corner.
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    transition.ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 400,
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Color mode: ${current}. Change to ${next}.`}
      className={`hover:underline ${className ?? ''}`}
    >
      [theme: <span className={mounted ? '' : 'invisible'}>{current}</span>]
    </button>
  );
};

export { ThemeSwitcher };
