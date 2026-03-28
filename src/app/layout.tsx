import type { Metadata } from 'next';
import './globals.css';
import { Nav } from '@/components/ui/nav';
import { JetBrains_Mono } from 'next/font/google';
import { Footer } from '@/components/ui/footer';
import { Providers } from '@/components/ui/providers';
import { SwipeNavigator } from '@/components/ui/swipe-navigator';

export const metadata: Metadata = {
  title: 'Samuel | Adeoye',
  description: 'Samuel Adeoye. Software engineer. Entrepreneur.',
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
          <div className="min-h-screen flex flex-col font-menlo">
            <div className="sticky top-0 z-[9999] bg-background">
              <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8">
                <Nav />
              </div>
            </div>
            <SwipeNavigator>
              <div className="mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 flex-grow overflow-hidden">
                {children}
              </div>
            </SwipeNavigator>
            <Footer className="font-menlo text-secondary m-4 mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
