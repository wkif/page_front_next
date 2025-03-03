import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from "@/components/ui/sonner"

import 'react-big-calendar/lib/css/react-big-calendar.css';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kifs home page",
  description: "A homepage of kifs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
