'use client';

import { ThemeProvider } from './theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { THEMES } from './theme-switcher';

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* The old "palette" key held names of removed palettes. A new key
          sends returning readers to the system mode. */}
      <ThemeProvider
        attribute="data-theme"
        themes={[...THEMES]}
        defaultTheme="system"
        storageKey="color-mode"
        enableSystem
        disableTransitionOnChange
      >
        {/* Keeps fades but drops movement for readers who ask for less motion. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
