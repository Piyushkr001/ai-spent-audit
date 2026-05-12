## Day 1 — 2026-05-06
**Hours worked:** 6
**What I did:** Bootstrapped the Next.js project. Installed Tailwind CSS, Lucide Icons, and base UI primitives. Set up the initial routing structure for the landing page and the /audit route.
**What I learned:** I learned how to integrate unstyled accessible components (like Base UI and Radix) with Tailwind CSS to create a bespoke design system without fighting default framework styles.
**Blockers / what I'm stuck on:** I initially struggled with hydration errors caused by using the `asChild` prop incorrectly with some Base UI components.
**Plan for tomorrow:** Refactor the landing page UI using shadcn components to finalize the hero section and features block.

## Day 2 — 2026-05-07
**Hours worked:** 5
**What I did:** Refactored the landing page using Shadcn. Built the responsive form for the /audit page to capture team size, use case, and an array of AI tools.
**What I learned:** Managing complex nested state arrays in React (for the dynamic list of tools) requires careful state cloning or using a robust form library. I opted for localized state management to keep the dependencies light.
**Blockers / what I'm stuck on:** The tool selector dropdown was clipping behind other elements on mobile. Fixed using React portals.
**Plan for tomorrow:** Implement the deterministic audit engine logic and pricing data structure.

## Day 3 — 2026-05-08
**Hours worked:** 7
**What I did:** Built the deterministic rule engine (`runAudit`). Added pricing for 9 tools across various tiers. Integrated Drizzle ORM and Neon Postgres to save audit results.
**What I learned:** Drizzle's typed schema definition makes it incredibly safe to insert complex JSON payloads into Postgres `jsonb` columns.
**Blockers / what I'm stuck on:** Writing tests for the audit engine took longer than expected because the overlap rules required careful edge-case handling.
**Plan for tomorrow:** Integrate the Gemini API for the AI summary, set up Resend emails.

## Day 4 — 2026-05-09
**Hours worked:** 4
**What I did:** Integrated Google Gemini for the qualitative executive summary. Added Resend to email users their public report link. Wrote all required documentation (Architecture, Metrics, GTM).
**What I learned:** Prompt engineering for financial data requires strict instructions to prevent the LLM from hallucinating numbers.
**Blockers / what I'm stuck on:** None. The core features are running smoothly.
**Plan for tomorrow:** Refine the codebase, implement environment variable safety, and polish UI.

## Day 5 — 2026-05-10
**Hours worked:** 5
**What I did:** Implemented server-side data trimming for leads. Re-audited the pricing.ts file against PRICING_DATA.md to ensure enterprise tiers were correctly mapped to -1 (custom).
**What I learned:** Always sanitize string inputs (like company name and role) before writing to the database to prevent formatting inconsistencies.
**Blockers / what I'm stuck on:** Resolving final Vercel build warnings regarding testing packages in the wrong dependency block.
**Plan for tomorrow:** Complete final markdown documentation and prepare for code freeze.

## Day 6 — 2026-05-11
**Hours worked:** 3
**What I did:** Moved testing libraries to devDependencies. Finalized REFLECTION.md, and updated the README with clear instructions for the Loom demo.
**What I learned:** Creating a cohesive README and accurate Devlog is just as critical as the code itself when handing off a project.
**Blockers / what I'm stuck on:** Waiting to conduct real user interviews before submission.
**Plan for tomorrow:** Fix pricing data verifications, add exact interview templates, and prep for recording the demo.

## Day 7 — 2026-05-12
**Hours worked:** 2
**What I did:** Cleaned up placeholder screenshots that were 0 bytes. Updated PRICING_DATA.md to mark unverified tiers (like Claude Max, Gemini Pro, Gemini Ultra, v0 Team) as custom/usage-based (-1). Ensured null saving for empty inputs. 
**What I learned:** Faking data or screenshots is a bad practice; it's better to leave a clear TODO for the final missing pieces.
**Blockers / what I'm stuck on:** I still need to record the final Loom video and conduct the 3 real user interviews.
**Plan for tomorrow:** Conduct 3 user interviews, record the 30-second Loom demo, rotate secrets, check CI, and officially submit the assignment.
