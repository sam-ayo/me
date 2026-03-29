'use client';

import { useMobileTab } from './mobile-tab-context';

export function MobileTabLayout({
  tabContent,
  pageContent,
}: {
  tabContent: React.ReactNode;
  pageContent: React.ReactNode;
}) {
  const { isTabRoute } = useMobileTab();

  return (
    <div className="md:hidden mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 flex-grow overflow-hidden pb-14">
      {isTabRoute ? tabContent : pageContent}
    </div>
  );
}
