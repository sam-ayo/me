import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/ui/nav';
import { JetBrains_Mono } from 'next/font/google';
import { Footer } from '@/components/ui/footer';
import { Providers } from '@/components/ui/providers';
import { SwipeNavigator } from '@/components/ui/swipe-navigator';
import { ScrollRestoration } from '@/components/ui/scroll-restoration';
import { MobileTabProvider } from '@/components/mobile-tab-context';
import { MobileTabContent } from '@/components/mobile-tab-content';
import { MobileTabLayout } from '@/components/mobile-tab-layout';

export const metadata: Metadata = {
  title: 'Samuel | Adeoye',
  description: 'Samuel Adeoye. Software engineer. Entrepreneur.',
  icons: {
    icon: '/favicon.ico?v=2',
  },
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <Providers>
          <MobileTabProvider>
            <ScrollRestoration />
            <div className="min-h-screen flex flex-col font-menlo">
              <div className="sticky top-0 z-[9999] bg-background">
                <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8">
                  <Nav />
                </div>
              </div>

              {/* Desktop: normal page routing */}
              <SwipeNavigator>
                <div className="hidden md:block mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 flex-grow overflow-hidden pb-14">
                  {children}
                </div>
              </SwipeNavigator>

              {/* Mobile: tab-based content or regular page for non-tab routes */}
              <MobileTabLayout
                tabContent={<MobileTabContent />}
                pageContent={children}
              />
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-background">
              <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8">
                <Footer className="font-menlo text-secondary py-4" />
              </div>
            </div>
          </MobileTabProvider>
        </Providers>
      </body>
    </html>
  );
}
