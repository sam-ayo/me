import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Nav } from "@/components/ui/nav";

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
   <body className={`font-menlo antialiased`}>
    <ThemeProvider
     attribute="class"
     defaultTheme="system"
     enableSystem
     disableTransitionOnChange
    >
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
      <Nav />
      {children}
    </div>
    </ThemeProvider>
   </body>
  </html>
 );
}
