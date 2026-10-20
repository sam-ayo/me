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
    <div className="page-column flex-grow overflow-hidden pb-14">
      {/* The tabs use 20px text and fill the column. Posts use smaller text,
          so a narrower measure keeps their lines readable. */}
      <div className="page-text">
        {isTabRoute ? (
          tabContent
        ) : (
          <div className="max-w-2xl">{pageContent}</div>
        )}
      </div>
    </div>
  );
}
