'use client'
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  ChartBar,
  ShareNetwork,
  Lock,
  CurrencyDollar,
  Sparkle,
  Link as LinkIcon,
  UserCircle,
  TrendUp,
  ArrowDown,
  Gift,
} from "@phosphor-icons/react/dist/ssr";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Data ─────────────────────────────────────────────────────────────────────

const TOOLS = [
  "Cursor", "GitHub Copilot", "Claude", "ChatGPT",
  "OpenAI API", "Anthropic API", "Gemini", "Windsurf", "v0",
];

const STEPS = [
  {
    number: "01", icon: ChartBar,
    title: "Enter your AI stack",
    desc: "List your tools, plans, seats, and monthly spend. No account needed — takes under 2 minutes.",
  },
  {
    number: "02", icon: Sparkle,
    title: "Get a defensible savings audit",
    desc: "We benchmark your spend against current pricing tiers and generate a clear, shareable report.",
  },
  {
    number: "03", icon: ShareNetwork,
    title: "Share or book a consultation",
    desc: "Download your report, share a public URL, or book a Credex consultation to maximise savings.",
  },
];

const FEATURES = [
  { icon: Lock, title: "No login required", desc: "Start auditing instantly. Your email is only asked after you see value." },
  { icon: CurrencyDollar, title: "Current pricing-based audit", desc: "We use live plan data so your audit reflects what you'd actually pay today." },
  { icon: ChartBar, title: "Per-tool recommendations", desc: "Get actionable downgrade or consolidation advice for each AI tool you use." },
  { icon: Sparkle, title: "AI-generated summary", desc: "A concise, jargon-free narrative explaining your biggest saving opportunities." },
  { icon: LinkIcon, title: "Shareable public report URL", desc: "Send your CFO or board a clean, permanent link to your audit results." },
  { icon: UserCircle, title: "Lead capture after value", desc: "We only ask for contact info after you've already seen your savings — no bait and switch." },
];

const BENEFITS = [
  { icon: TrendUp, title: "Spot overspend instantly", desc: "See exactly which tools are bleeding budget and by how much, with no spreadsheets required.", grad: "from-blue-500 to-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40" },
  { icon: ArrowDown, title: "Downgrade with confidence", desc: "Understand which plan tiers genuinely fit your usage before you click 'change plan'.", grad: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-950/40 border-cyan-100 dark:border-cyan-900/40" },
  { icon: Gift, title: "Discover Credex credit opportunities", desc: "High-saving teams get matched with Credex credit programmes that offset AI costs.", grad: "from-indigo-500 to-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/40" },
];

const FAQS = [
  { q: "Is SpendLens AI free?", a: "Yes, 100% free. The audit, report, and shareable URL are all free. We never charge for the core audit." },
  { q: "Do I need to create an account?", a: "No account is needed to run an audit. Your email is optionally collected after the report is generated." },
  { q: "How are savings calculated?", a: "We compare your current spend against published pricing for every plan tier of each tool, factoring in seats and usage patterns to find the optimal configuration." },
  { q: "Will my report be public?", a: "A shareable URL is generated, but it is unlisted — only people with the link can access it. No data is shown in any public directory." },
  { q: "What happens if I have high savings potential?", a: "Teams with significant savings potential (typically $500+/month) are offered a free Credex consultation to help implement the recommendations." },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <Badge
      variant="outline"
      className="gap-1.5 rounded-full border-blue-200 dark:border-blue-800/60 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 px-3 py-1 text-xs font-semibold h-auto"
    >
      {children}
    </Badge>
  );
}

function GradientHeading({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <h2 id={id} className={`text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white ${className}`}>
      {children}
    </h2>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="flex-1 overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section aria-label="Hero" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-linear-to-b from-blue-100/60 via-cyan-50/30 to-transparent dark:from-blue-950/40 dark:via-slate-950/20 dark:to-transparent rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
            style={{ backgroundImage: "linear-gradient(to right,#6366f1 1px,transparent 1px),linear-gradient(to bottom,#6366f1 1px,transparent 1px)", backgroundSize: "48px 48px" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left copy */}
            <div className="flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              <div className="mb-5 flex justify-center lg:justify-start">
                <SectionBadge>
                  <Sparkle size={12} weight="fill" />
                  Free AI Spend Audit for Startup Teams
                </SectionBadge>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
                Find the leaks in{" "}
                <span className="bg-linear-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  your AI spend
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                Audit your AI tools, compare plans, and uncover monthly savings before your next invoice hits.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/audit"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "gap-2 rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 h-12 px-6"
                  )}
                >
                  Run Free Audit
                  <ArrowRight size={16} weight="bold" />
                </Link>
                <Link
                  href="#how-it-works"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "rounded-xl h-12 px-6 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
                  )}
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Right — audit preview card */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <div className="relative">
                <div aria-hidden="true" className="absolute -inset-4 bg-linear-to-r from-blue-500/20 to-cyan-400/20 rounded-3xl blur-2xl" />
                <Card className="relative rounded-2xl border-slate-200 dark:border-slate-700/60 shadow-2xl shadow-slate-300/40 dark:shadow-slate-900/80 bg-white dark:bg-slate-900 gap-5 py-6">
                  <CardHeader className="px-6 pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Audit Report</p>
                        <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100 mt-0.5">Acme Corp — May 2026</CardTitle>
                      </div>
                      <Badge className="rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/60 h-auto px-2.5 py-1">
                        Savings found
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 space-y-4">
                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 p-4">
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Monthly Savings</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">$1,240</p>
                      </div>
                      <div className="rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-100 dark:border-cyan-900/50 p-4">
                        <p className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-1">Annual Savings</p>
                        <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">$14,880</p>
                      </div>
                    </div>

                    {/* Tools */}
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">Tools audited</p>
                      <div className="space-y-2">
                        {[
                          { tool: "GitHub Copilot", saving: "$420/mo", action: "Downgrade to Individual" },
                          { tool: "Cursor Business", saving: "$380/mo", action: "Switch to Pro plan" },
                          { tool: "Claude Team", saving: "$440/mo", action: "Reduce seat count" },
                        ].map((item) => (
                          <div key={item.tool} className="flex items-center justify-between text-xs rounded-lg bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5">
                            <div>
                              <p className="font-semibold text-slate-700 dark:text-slate-200">{item.tool}</p>
                              <p className="text-slate-500 dark:text-slate-400 mt-0.5">{item.action}</p>
                            </div>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-3 whitespace-nowrap">{item.saving}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA strip */}
                    <div className="rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 p-4 text-white text-center">
                      <p className="text-xs font-semibold mb-1 opacity-90">🎯 High savings detected</p>
                      <p className="text-sm font-bold">Book a free Credex consultation</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools strip ──────────────────────────────────────────────── */}
      <section id="pricing-data" aria-label="Supported AI tools"
        className="py-12 border-y border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500 mb-7">
            Supports all major AI tools
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {TOOLS.map((tool) => (
              <Badge
                key={tool}
                variant="outline"
                className="rounded-full h-auto px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:scale-[1.04] transition-all duration-200 cursor-default"
              >
                {tool}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      <section id="how-it-works" aria-labelledby="how-it-works-heading" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionBadge>How it works</SectionBadge>
            <GradientHeading id="how-it-works-heading" className="mt-4">Audit in three simple steps</GradientHeading>
            <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              No complex setup. No data exports. Just answers about where your AI budget is going.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div aria-hidden="true" className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-linear-to-r from-blue-200 via-cyan-300 to-blue-200 dark:from-blue-900 dark:via-cyan-800 dark:to-blue-900" />
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.number} className="rounded-2xl border-slate-200/60 dark:border-slate-700/40 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 items-center text-center py-8 gap-4">
                  <CardHeader className="px-6 pb-0 items-center">
                    <div className="relative z-10 flex items-center justify-center size-20 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/30 dark:shadow-blue-900/50">
                      <Icon size={32} weight="duotone" className="text-white" />
                      <span className="absolute -top-2 -right-2 size-6 rounded-full bg-white dark:bg-slate-900 border-2 border-blue-500 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                        {step.number.slice(1)}
                      </span>
                    </div>
                    <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100 mt-1">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-6">
                    <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" aria-labelledby="features-heading" className="py-24 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionBadge>Features</SectionBadge>
            <GradientHeading className="mt-4" id="features-heading">
              Everything you need, nothing you don&apos;t
            </GradientHeading>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title}
                  className="group rounded-2xl border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/60 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800/60 hover:-translate-y-1 transition-all duration-300 py-6 gap-3">
                  <CardHeader className="px-6 pb-0">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/60 transition-colors shrink-0">
                        <Icon size={20} weight="duotone" className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">{f.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-6">
                    <CardDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why SpendLens AI ─────────────────────────────────────────── */}
      <section aria-labelledby="why-heading" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="flex-1 max-w-xl">
              <SectionBadge>Why SpendLens AI</SectionBadge>
              <GradientHeading className="mt-4 mb-5" id="why-heading">
                Most startups pay retail for AI — and don&apos;t realise it
              </GradientHeading>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                AI tools have exploded in variety and pricing complexity. Founders and engineering managers
                are subscribing to plans designed for much larger teams — or duplicating capabilities across three different products.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                SpendLens AI gives you a clear, unbiased read on where your AI budget is going and what you
                can actually do about it — before your next invoice lands.
              </p>
              <div className="mt-7 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle size={18} weight="fill" className="text-emerald-500 shrink-0" />
                No spreadsheets. No manual benchmarking. No guesswork.
              </div>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 gap-4">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <Card key={b.title} className={`flex-row rounded-2xl border ${b.bg} shadow-none hover:shadow-md transition-all duration-200 py-0 gap-0`}>
                    <CardContent className="flex gap-4 p-5">
                      <div className={`shrink-0 flex items-center justify-center size-11 rounded-xl bg-linear-to-br ${b.grad} shadow-md`}>
                        <Icon size={22} weight="duotone" className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-1">{b.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{b.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section aria-label="Call to action" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-blue-700 to-cyan-600 px-8 py-16 sm:px-16 text-center shadow-2xl shadow-blue-700/30">
            <div aria-hidden="true" className="absolute -top-24 -left-24 size-64 rounded-full bg-white/5 blur-2xl" />
            <div aria-hidden="true" className="absolute -bottom-24 -right-24 size-64 rounded-full bg-cyan-400/20 blur-2xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                Ready to audit your AI stack?
              </h2>
              <p className="text-blue-100 mb-8 max-w-lg mx-auto text-base leading-relaxed">
                Join hundreds of startup teams who&apos;ve uncovered thousands in monthly savings with a 2-minute audit.
              </p>
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-bold text-blue-700 bg-white hover:bg-blue-50 rounded-xl shadow-xl transition-all duration-200 hover:scale-[1.04] active:scale-[0.98]"
              >
                Start Free Audit
                <ArrowRight size={16} weight="bold" />
              </Link>
              <p className="mt-5 text-xs text-blue-200">
                No signup required. Email is optional after your report is generated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section id="faq" aria-labelledby="faq-heading" className="py-24 bg-slate-50/60 dark:bg-slate-900/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionBadge>FAQ</SectionBadge>
            <GradientHeading className="mt-4" id="faq-heading">Common questions</GradientHeading>
          </div>

          <Accordion className="space-y-3 gap-0">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="border border-slate-200 dark:border-slate-700/60 rounded-2xl overflow-hidden bg-white dark:bg-slate-800/50 not-last:border-b"
              >
                <AccordionTrigger className="px-6 py-5 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:no-underline hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <span className="mr-2 text-blue-500 dark:text-cyan-500 font-mono text-xs">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 text-slate-600 dark:text-slate-400">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

    </main>
  );
}
