# PlanCanvas — Setup Guide

## Prerequisites

- Node.js 18+
- A Supabase project
- A Stripe account

---

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In your project dashboard, go to **SQL Editor**.
3. Open and run the file `supabase/schema.sql` — this creates the `profiles` and `pages` tables, RLS policies, and triggers.
4. From **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`

### Enable Email Auth

In your Supabase dashboard → **Authentication → Providers → Email**: make sure it's enabled. Optionally disable "Confirm email" for faster testing.

---

## 2. Stripe Setup

1. Go to [stripe.com](https://stripe.com) and create an account.
2. Create a **Product** (e.g., "PlanCanvas Premium") with a recurring **Price** of $9/month.
3. Copy the Price ID (starts with `price_...`) → `STRIPE_PREMIUM_PRICE_ID`
4. From **Developers → API Keys**, copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
5. Set up a **Webhook** pointing to `https://your-domain.com/api/stripe/webhook`:
   - Events to listen for:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

For local development, use the [Stripe CLI](https://stripe.com/docs/stripe-cli):
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 3. Environment Variables

Copy `.env.local` and fill in all values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 4. Local Development

```bash
npm install --legacy-peer-deps
npm run dev
```

App will be running at `http://localhost:3000`.

---

## 5. Deploy to Vercel

1. Push your repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel URL.
5. Deploy.
6. Update your Stripe webhook URL to your production domain.

---

## Architecture Overview

```
app/
├── (auth)/login        # Login page
├── (auth)/signup       # Signup page
├── api/
│   └── stripe/
│       ├── create-checkout  # Start subscription
│       ├── create-portal    # Manage billing
│       └── webhook          # Stripe events
├── auth/callback       # Supabase OAuth callback
├── planner/            # Main planner app
└── settings/           # Account & billing

components/
├── canvas/ExcalidrawCanvas   # Drawing canvas
├── planner/PlannerProvider   # Data provider
├── settings/SettingsClient   # Billing UI
└── sidebar/Sidebar           # Page navigation

lib/
├── supabase/           # Client, server, middleware helpers
├── stripe.ts           # Stripe instance + plan config
└── types.ts            # Shared TypeScript types

store/
└── plannerStore.ts     # Zustand global state

supabase/
└── schema.sql          # Database schema
```
