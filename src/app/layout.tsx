import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Nav } from '@/components/ui/nav';
import { IBM_Plex_Mono } from 'next/font/google';
import { Footer } from '@/components/ui/footer';
import { Providers } from '@/components/ui/providers';
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

// Mobile browsers tint their toolbars with this color.
export const viewport: Viewport = {
  themeColor: '#e2dfd5',
  colorScheme: 'light dark',
};

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plexMono.variable}`}
      suppressHydrationWarning
    >
      <body className={`antialiased`}>
        <Providers>
          <MobileTabProvider>
            <ScrollRestoration />
            <div className="min-h-screen flex flex-col font-menlo leading-loose">
              <div className="sticky top-0 z-[9999] bg-background">
                <div className="page-column">
                  <div className="page-text">
                    <Nav />
                  </div>
                </div>
              </div>

              {/* The tab routes share one tab strip. Other routes render as
                  normal pages. */}
              <MobileTabLayout
                tabContent={<MobileTabContent />}
                pageContent={children}
              />
            </div>
            {/* No entry fade here. The footer covers the content below it, so a
                fade shows that content and then hides it again. */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-background">
              <div className="page-column">
                <div className="page-text">
                  <Footer className="font-menlo text-secondary py-4" />
                </div>
              </div>
            </div>
          </MobileTabProvider>
        </Providers>
      </body>
    </html>
  );
}
