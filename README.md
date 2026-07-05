# Law Buddy

> Understand new laws in plain language and see how they affect you personally.

Law Buddy turns dense legislation into clear, personalized explanations. Individuals get a
plain-language feed of laws that matter to them; businesses get a compliance view of what
new regulations mean for their operations — with an AI "Buddy" on hand to answer questions.

## Features

- **Plain-language law feed** — new and relevant laws summarized without the legalese.
- **Personal & business spaces** — organize laws around a personal profile or a company, each with its own onboarding wizard.
- **Compliance dashboard** — a business-focused overview with an at-a-glance compliance score and reports.
- **Buddy chat** — an AI assistant that answers questions about a law and how it applies to you.
- **Reports** — exportable summaries (PDF via jsPDF).
- **Authentication** — email/password auth with protected, profile-gated routes.
- **Light & dark mode.**

## Tech stack

| Layer      | Tools |
|------------|-------|
| Framework  | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/) (SWC) |
| Styling    | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives) |
| State/data | [TanStack Query](https://tanstack.com/query), [React Router](https://reactrouter.com/) |
| UI/UX      | [Framer Motion](https://www.framer.com/motion/), [Recharts](https://recharts.org/), [Lucide](https://lucide.dev/) icons |
| Backend    | [Supabase](https://supabase.com/) — Postgres, Auth, Storage, Edge Functions |
| Testing    | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A [Supabase](https://supabase.com/) project (for auth, database, and edge functions)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then fill in your Supabase project values in .env

# 3. Start the dev server
npm run dev
```

The app runs at **http://localhost:8080**.

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run build:dev` | Development-mode build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Project structure

```
src/
├── components/          # Shared UI components
│   ├── landing/         # Landing-page sections (hero, features, pricing, FAQ…)
│   └── ui/              # shadcn/ui primitives
├── contexts/            # React context providers (Auth, Spaces)
├── hooks/               # Reusable hooks
├── integrations/
│   └── supabase/        # Supabase client & generated types
├── lib/                 # Utilities and static law data
├── pages/               # Route-level pages (Landing, Onboarding, Spaces, Chat…)
└── test/                # Test setup and examples

supabase/
├── functions/           # Edge Functions (buddy-chat, generate-feed)
├── migrations/          # SQL schema migrations
└── config.toml          # Supabase project config
```

## Supabase backend

The app expects a linked Supabase project. Using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
# Link your project
supabase link --project-ref <your-project-ref>

# Apply the database schema
supabase db push

# Deploy the edge functions
supabase functions deploy buddy-chat
supabase functions deploy generate-feed
```

The `buddy-chat` and `generate-feed` functions call an external AI model gateway and read
the following **function secrets** (set them in the Supabase dashboard or via
`supabase secrets set`):

- `TNG_API_KEY` — API key for the model gateway
- `TNG_TEAM_NAME` — team identifier (defaults to `default`)

> **Security note:** `.env` holds only the public Supabase **anon** key, which is safe to
> ship in the frontend as long as Row-Level Security is enabled on your tables. Never put a
> `service_role` key in `.env`.

## License

Released under the [MIT License](LICENSE).
