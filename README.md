# Entix Jewellery

Production-ready Next.js commerce build for Entix Jewellery with:

- luxury storefront
- merchant admin dashboard
- product, collection, inventory, order, and customer surfaces
- Razorpay-ready checkout hooks
- Shiprocket / Delhivery-ready shipping hooks
- Prisma + PostgreSQL backend
- Vercel-friendly deployment shape

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Framer Motion
- Zustand
- pnpm

## Local Development

1. Copy envs:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
pnpm install
```

3. Push schema to your database:

```bash
pnpm db:push
```

4. Seed local data:

```bash
pnpm db:seed
```

5. Run the app:

```bash
pnpm dev
```

## Vercel Deployment

This repo is now prepared for Vercel with:

- `vercel.json`
- `pnpm` install/build commands
- Prisma client generation in `postinstall`
- production-safe base URL resolution

### Required Environment Variables

Set these in Vercel Project Settings:

```bash
DATABASE_URL=
ADMIN_JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD=
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_SITE_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
SHIPROCKET_EMAIL=
SHIPROCKET_PASSWORD=
DELHIVERY_API_TOKEN=
RESEND_API_KEY=
CRON_SECRET=
NEXT_PUBLIC_FEATURE_CONCIERGE=false
NEXT_PUBLIC_FEATURE_TRYON=false
NEXT_PUBLIC_FEATURE_WHATSAPP=false
NEXT_PUBLIC_FEATURE_RECOMMENDER=false
```

### Deploy Flow

1. Import the GitHub repo into Vercel.
2. Keep the framework preset as `Next.js`.
3. Confirm the Root Directory is this repo.
4. Add all required environment variables.
5. Deploy.

### Database Setup

Use a managed PostgreSQL database for production.

Before the first production deploy, run schema sync against the production database:

```bash
DATABASE_URL="your-production-db-url" pnpm db:push
```

If you want starter catalog data in production:

```bash
DATABASE_URL="your-production-db-url" pnpm db:seed
```

### Notes

- `NEXT_PUBLIC_BASE_URL` should be your production domain, for example `https://entix.jewellery`
- `NEXT_PUBLIC_SITE_URL` is kept as a compatibility alias
- admin login depends on `ADMIN_EMAIL` and `ADMIN_PASSWORD`
- abandoned-cart cron uses `CRON_SECRET`
- email sending becomes active when `RESEND_API_KEY` is present

## Useful Commands

```bash
pnpm dev
pnpm build
pnpm start
pnpm db:push
pnpm db:seed
pnpm db:studio
```
