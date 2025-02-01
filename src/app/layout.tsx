import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/ui/nav";
import { JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/ui/footer";
import { Providers } from "@/components/ui/providers";

export const metadata: Metadata = {
  title: "Samuel Adeoye",
  description: "Samuel Adeoye. Software engineer. Entrepreneur.",
};

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable}`}>
      <body className={`antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col font-menlo">
            <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 flex-grow">
              <Nav />
              {children}
            </div>
            <Footer className="font-menlo text-secondary m-4 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
