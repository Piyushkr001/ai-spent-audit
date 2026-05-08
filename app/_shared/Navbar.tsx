"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { List as MenuIcon, ArrowRight } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ModeToggle } from "./ModeToggle";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing Data", href: "#pricing-data" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-sm border-b border-slate-200/60 dark:border-slate-800/60"
            : "bg-transparent"
        }`}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        >
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/Images/Logo/logo_light.svg"
              alt="SpendLens AI"
              width={130}
              height={40}
              priority
              style={{ width: "auto", height: "36px" }}
              className="cursor-pointer hover:opacity-90 dark:hidden"
            />
            <Image
              src="/Images/Logo/logo_dark.svg"
              alt="SpendLens AI"
              width={130}
              height={40}
              priority
              style={{ width: "auto", height: "36px" }}
              className="cursor-pointer hover:opacity-90 hidden dark:block"
            />
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="px-3.5 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-all duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            <ModeToggle />
            <Link
              href="/audit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/40 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              aria-label="Run Free Audit"
            >
              Run Free Audit
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>

          {/* Mobile right actions */}
          <div className="md:hidden flex items-center gap-1">
            <ModeToggle />

            {/* Sheet trigger — Base UI render prop, no asChild */}
            <Sheet open={open} onOpenChange={setOpen}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="text-slate-600 dark:text-slate-300"
              >
                <MenuIcon size={22} />
              </Button>

              <SheetContent side="right" className="w-72 p-0 flex flex-col">
                {/* Drawer header */}
                <SheetHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/Images/Logo/logo_light.svg"
                      alt="SpendLens AI"
                      width={110}
                      height={32}
                      style={{ width: "auto", height: "28px" }}
                      className="dark:hidden"
                    />
                    <Image
                      src="/Images/Logo/logo_dark.svg"
                      alt="SpendLens AI"
                      width={110}
                      height={32}
                      style={{ width: "auto", height: "28px" }}
                      className="hidden dark:block"
                    />
                  </SheetTitle>
                </SheetHeader>

                {/* Drawer nav links */}
                <nav
                  aria-label="Mobile navigation"
                  className="flex-1 px-4 py-6"
                >
                  <ul className="space-y-1" role="list">
                    {NAV_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="flex items-center px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-cyan-400 transition-all"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <Separator />

                {/* Drawer CTA */}
                <div className="px-5 py-6">
                  <Link
                    href="/audit"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02]"
                  >
                    Run Free Audit
                    <ArrowRight size={15} weight="bold" />
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
    </>
  );
}
