'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type TabName = 'about' | 'projects' | 'writings';

const TAB_PATHS: Record<TabName, string> = {
  about: '/',
  projects: '/projects',
  writings: '/writings',
};

const PATH_TO_TAB: Record<string, TabName> = {
  '/': 'about',
  '/projects': 'projects',
  '/writings': 'writings',
};

function pathnameToTab(pathname: string): TabName | null {
  if (PATH_TO_TAB[pathname]) return PATH_TO_TAB[pathname];
  if (pathname.startsWith('/projects')) return 'projects';
  if (pathname.startsWith('/writings')) return 'writings';
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
  const [activeTab, setActiveTabState] = useState<TabName>('about');
  const [isTabRoute, setIsTabRoute] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const tab = pathnameToTab(pathname);
    if (tab) {
      setActiveTabState(tab);
      setIsTabRoute(true);
    } else {
      setIsTabRoute(false);
    }
  }, [pathname]);

  const setActiveTab = useCallback(
    (tab: TabName) => {
      setActiveTabState(tab);
      setIsTabRoute(true);
      const path = TAB_PATHS[tab];
      if (pathname !== path) {
        router.push(path);
      }
    },
    [pathname, router],
  );

  return (
    <MobileTabContext.Provider value={{ activeTab, setActiveTab, isTabRoute }}>
      {children}
    </MobileTabContext.Provider>
  );
}

export function useMobileTab() {
  return useContext(MobileTabContext);
}

export const TABS: TabName[] = ['about', 'projects', 'writings'];
