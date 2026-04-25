# Master Prompt For Claude Or Gemini

You are building a complete production-ready jewellery commerce website and backend for **Entix Jewellery**.

Build it as a **new standalone project** at:

`/Users/midha/Desktop/Entix-Jewellery-Website`

Do not stop at planning. Implement the project end-to-end.

## Goal

Create a luxury jewellery ecommerce experience that feels world-class and more premium than any common Shopify theme. The site should feel editorial, expensive, modern, and high-conviction. It should be deployable to Vercel and include a proper backend plus merchant admin dashboard for a real jewellery business.

## Design References

Use these references for structure, pacing, and luxury energy:

- Homepage benchmark: [https://www.tiffany.com/](https://www.tiffany.com/)
- Menu benchmark: [https://www.rocksbox.com/](https://www.rocksbox.com/)
- Collection benchmark: [https://outhouse-jewellery.com/collections/spring-26](https://outhouse-jewellery.com/collections/spring-26)
- Product page benchmark: [https://outhouse-jewellery.com/products/leopard-crimson-cascade-earrings](https://outhouse-jewellery.com/products/leopard-crimson-cascade-earrings)

Important:
- Capture the luxury feel, content architecture, elegance, visual hierarchy, and polish
- Do **not** copy their logo, brand text, code, images, or proprietary assets
- Deliver an Entix-original interpretation that is benchmark-level or better

## Non-Negotiables

- Brand name: **Entix Jewellery**
- Public site must feel premium and luxurious
- **No appointments**
- **Wishlist is required**
- Must support **250 products**
- Include:
  - homepage
  - luxury menu / discovery hub
  - collection page
  - product detail page
  - wishlist
  - cart
  - checkout shell
  - about page
  - policy/content pages
- Include backend/admin:
  - products
  - collections
  - inventory
  - orders
  - customers
  - shipping settings
  - payment settings
  - homepage/content control
- Include Razorpay integration hooks
- Include Shiprocket or Delhivery integration hooks
- Keep **AI concierge** and **virtual try-on** as **architecture-ready modules only**, hidden/inactive in v1
- Must be deployable to **Vercel**

## Recommended Stack

Use this stack unless there is a strong implementation reason to improve it:

- Next.js 15
- TypeScript
- App Router
- Tailwind CSS
- Framer Motion
- Three.js with `@react-three/fiber` and `@react-three/drei` for premium hero moments
- PostgreSQL
- Prisma ORM
- NextAuth or a clean custom auth setup for admin access
- Zod for validation

## Build Style

Do not produce generic template work.

The UI should have:
- strong typography
- rich spacing rhythm
- layered cream / champagne / gold / stone palette
- editorial photography treatment
- premium hover states
- smooth but restrained motion
- subtle parallax or 3D accents where meaningful
- extremely polished mobile experience

Avoid:
- cheap gradients
- dashboard boilerplate
- default SaaS styling
- purple startup visuals
- obvious theme-looking sections

## Public-Site Scope

Build these routes:

- `/`
- `/collections`
- `/collections/[slug]`
- `/products/[slug]`
- `/wishlist`
- `/cart`
- `/checkout`
- `/about`
- `/contact`
- `/shipping-policy`
- `/return-policy`
- `/privacy-policy`
- `/terms`

The homepage should include:
- announcement bar
- sticky premium header
- hero section with a dramatic luxury composition
- shop by category
- collection/story sections
- bestselling product rail
- gifting or occasion-led merchandising
- trust strip
- premium footer

The menu should feel like a luxury discovery layer, not a plain dropdown.

The collection page should support:
- filters
- sorting
- category refinement
- price refinement
- availability
- wishlist actions

The product page should support:
- immersive gallery
- product info
- price
- stock state
- quantity selector
- add to cart
- add to wishlist
- shipping/trust details
- related products

## Admin / Backend Scope

Build a merchant dashboard with these sections:

- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/collections`
- `/admin/orders`
- `/admin/customers`
- `/admin/inventory`
- `/admin/content`
- `/admin/settings/payments`
- `/admin/settings/shipping`
- `/admin/settings/general`

Admin capabilities:
- CRUD for products
- product image support
- collection management
- inventory status
- order list and order detail view
- customer records
- homepage content editing
- basic shipping rule settings
- Razorpay configuration surface
- Shiprocket/Delhivery configuration surface

## Data Model

At minimum include:

- Product
- ProductImage
- Collection
- CollectionProduct
- InventoryItem
- Customer
- Address
- Order
- OrderItem
- Cart
- Wishlist
- PageContent
- SiteSetting
- PaymentProviderSetting
- ShippingProviderSetting
- AdminUser

## Seed Data

Seed the project with:
- 20 sample jewellery products across bangles, earrings, necklaces, and rings
- 3-5 collections
- sample orders
- sample customers
- homepage content

Structure it so the business can later scale to 250 products cleanly.

## Future-Ready Modules

Do not ship these live in v1, but create the architecture so they can be activated later without major refactors:

- AI shopping concierge
- virtual try-on
- WhatsApp automation
- recommendation engine

This means:
- feature flags or config stubs
- placeholder service interfaces
- schema room for future records if useful
- clean frontend insertion points, but hidden in v1

## Quality Bar

Before you finish, ensure:

- all routes render
- no placeholder broken links
- build passes
- TypeScript passes
- mobile experience is strong
- admin pages are usable
- public experience feels premium
- code is organized, readable, and maintainable

## Deliverables

When done, provide:

- folder structure summary
- routes built
- backend modules built
- environment variables needed
- how to run locally
- how to deploy to Vercel
- what is complete now
- what is architecture-ready for phase 2

Start building immediately. Do not stop at a plan. Make sensible product decisions where needed and keep the quality bar high.
