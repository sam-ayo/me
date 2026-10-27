'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';

export type TabName = 'about' | 'projects' | 'resume';

export const TAB_PATHS: Record<TabName, string> = {
  about: '/',
  projects: '/projects',
  resume: '/resume',
};

const PATH_TO_TAB: Record<string, TabName> = {
  '/': 'about',
  '/projects': 'projects',
  '/resume': 'resume',
};

export function pathnameToTab(pathname: string): TabName | null {
  if (PATH_TO_TAB[pathname]) return PATH_TO_TAB[pathname];
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/resume')) return 'resume';
  return null;
}

interface MobileTabContextValue {
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  isTabRoute: boolean;
}

const MobileTabContext = createContext<MobileTabContextValue>({
  activeTab: 'about',
  setActiveTab: () => {},
  isTabRoute: true,
});

export function MobileTabProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The first render reads the route, so a page that is not a tab does not
  // flash the tab content before an effect corrects it.
  const [activeTab, setActiveTabState] = useState<TabName>(
    () => pathnameToTab(pathname) ?? 'about',
  );
  const [isTabRoute, setIsTabRoute] = useState(
    () => pathnameToTab(pathname) !== null,
  );

  useEffect(() => {
    const tab = pathnameToTab(pathname);
    if (tab) {
      setActiveTabState(tab);
      setIsTabRoute(true);
    } else {
      setIsTabRoute(false);
    }
  }, [pathname]);

  const setActiveTab = useCallback((tab: TabName) => {
    setActiveTabState(tab);
    setIsTabRoute(true);
    const path = TAB_PATHS[tab];
    /* All the tabs are already on the page, so a tab switch only changes the
         URL. Next.js syncs `usePathname` with `pushState` and restores the
         entry on back and forward, with no server request. */
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  }, []);

  return (
    <MobileTabContext.Provider value={{ activeTab, setActiveTab, isTabRoute }}>
      {children}
    </MobileTabContext.Provider>
  );
}

export function useMobileTab() {
  return useContext(MobileTabContext);
}

export const TABS: TabName[] = ['about', 'projects', 'resume'];
