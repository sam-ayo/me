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
    <div className="md:hidden mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 flex-grow overflow-hidden pb-14">
      <div className="max-w-2xl">{isTabRoute ? tabContent : pageContent}</div>
    </div>
  );
}
