# SpendLens AI

SpendLens AI is a free AI spend audit tool built for the Credex WebDev 2026 assignment. It helps startup founders, CTOs, and engineering managers review their AI tool spending, identify overspending, and estimate potential monthly and annual savings.

## Live URL

[https://spendlensai2.vercel.app](https://spendlensai2.vercel.app)

## Quick Start

1. Clone the repository
2. Install dependencies using `bun install`
3. Set up the environment variables
4. Run the development server with `bun run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Secrets must be configured via environment variables only.

Copy the `.env.example` file to `.env` and fill in the values:

```
DATABASE_URL=
GEMINI_API_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note on Resend**: The Resend API uses `onboarding@resend.dev` for demo purposes. For production, you should use a verified sender domain.

## Database Commands

The project uses Drizzle ORM. You can run the following commands:
- `bun run db:generate`: Generate migration files
- `bun run db:migrate`: Run migrations
- `bun run db:push`: Push schema changes directly to the database

## Deploy Instructions

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Configure the environment variables in the Vercel dashboard.
4. Deploy.

## 5 Technical/Product Trade-offs

1. **Deterministic Logic over AI Math**: The financial logic is hardcoded and deterministic rather than AI-generated to ensure consistent, testable, and defensible results.
2. **Client-side initial calculation**: The audit engine runs locally on the client for instant feedback. The result is only sent to the server if the user chooses to save or email the report.
3. **Fallback Summary**: If the Gemini API fails or is unavailable, the application falls back to a deterministic, rule-based text summary rather than breaking the user experience.
4. **Honeypot over Captcha**: We implemented a honeypot field (`website`) instead of a traditional captcha to reduce friction for legitimate users while still catching automated spam bots.
5. **Base UI / Shadcn**: We leveraged base UI primitives and Shadcn to rapidly build an accessible, responsive, and aesthetically pleasing interface without reinventing standard components.

## Screenshots / Demo

<!-- TODO: Add real Loom video link or 3 screenshots here -->
*Note: Final submission requires 3 real screenshots or a 30-second recording.*
