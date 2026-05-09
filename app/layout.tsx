import type { Metadata } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "./_shared/Footer";
import { Navbar } from "./_shared/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import {Toaster} from 'react-hot-toast'


const exo = Exo_2({
  variable:"--font-exo",
  subsets:['latin'],
  weight:['400','500','600','700'],
  style:['normal','italic']
})
          
export const metadata: Metadata = {
  title: "SpendLens AI",
  description: "Find the leaks in your AI spend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning
      lang="en"
      className={cn("h-full", "antialiased", exo.className)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Navbar />
        {children}
        <Footer/>
        <Toaster  position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
