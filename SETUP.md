# IdeaPhase — Setup Guide

## 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New project
2. In the SQL Editor, paste and run the contents of `supabase/schema.sql`
3. Go to **Authentication → Settings** and enable **Email invites**
4. Copy your project URL and keys from **Settings → API**

## 2. Stripe Setup

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Copy your **Publishable key** and **Secret key** from Developers → API Keys
3. For webhooks: Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`
   - Copy the webhook secret

## 3. Environment Variables

Copy `.env.local.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 4. Create Your Admin Account

1. Run `npm run dev` and go to `/login`
2. Sign up with your email (agstudios757@gmail.com)
3. In Supabase SQL Editor, run:
   ```sql
   UPDATE public.profiles SET role = 'admin'
   WHERE id = (SELECT id FROM auth.users WHERE email = 'agstudios757@gmail.com');
   ```
4. Log in — you'll be redirected to `/admin/dashboard`

## 5. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add all env vars in Vercel's project settings.

## How It Works

| Feature | How |
|---|---|
| Add a client | Admin → Clients → Add Client → fills email → Supabase sends invite email |
| Client logs in | They click the invite link, set a password, and land on their portal |
| Create invoice | Admin → Invoices → Create Invoice → pick client & amount |
| Client pays | Portal → Invoices → Pay button → Stripe Checkout → webhook marks paid |
| Share mockup | Admin → Mockups → Upload HTML file → get link → share with client |
| Client views mockup | Clicks link → sees HTML preview in browser (no auth required) |
