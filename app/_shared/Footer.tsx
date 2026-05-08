import Link from "next/link";
import Image from "next/image";

const PRODUCT_LINKS = [
  { label: "Run Free Audit", href: "/audit" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Pricing Data", href: "#pricing-data" },
];

const RESOURCE_LINKS = [
  { label: "AI Tool Comparison", href: "#" },
  { label: "Savings Calculator", href: "#" },
  { label: "Starter Guide", href: "#" },
  { label: "FAQ", href: "#faq" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Use", href: "#" },
  { label: "Credex Assignment", href: "#" },
];

export function Footer() {
  return (
    <footer className="dark:bg-slate-950 bg-linear-to-br from-blue-200 via-cyan-300 to-indigo-600 text-slate-700 border-t border-slate-800/60">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <Image src="/Images/Logo/logo_light.svg" alt="Logo" width={150} height={150} priority className="cursor-pointer hover:opacity-90 dark:hidden" />
            <Image src="/Images/Logo/logo_dark.svg" alt="Logo" width={150} height={150} priority className="cursor-pointer hover:opacity-90 hidden dark:block" />
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              Free AI spend auditing for startup founders, CTOs, and engineering
              managers. Find the leaks before your next invoice hits.
            </p>
            {/* Trust badge */}
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-xs text-blue-300">
              <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
              No signup required
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-800 mb-4">
              Product
            </h3>
            <ul className="space-y-2.5" role="list">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-800 mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5" role="list">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-800 mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5" role="list">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} SpendLens AI. All rights reserved.</p>
          <p className="text-center text-slate-100">
            Built for the{" "}
            <span className="text-cyan-500 font-medium">
              Credex WebDev 2026 Assignment
            </span>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
