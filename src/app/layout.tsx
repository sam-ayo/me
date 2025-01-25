import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Nav } from "@/components/ui/nav";

const geistSans = Geist({
 variable: "--font-geist-sans",
 subsets: ["latin"],
});

const geistMono = Geist_Mono({
 variable: "--font-geist-mono",
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "Samuel Adeoye",
 description: "Samuel Adeoye. Software engineer. Entrepreneur.",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html lang="en">
   <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ThemeProvider
     attribute="class"
     defaultTheme="system"
     enableSystem
     disableTransitionOnChange
    >
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
   <Nav />
     {children}
    </div>
    </ThemeProvider>
   </body>
  </html>
 );
}
