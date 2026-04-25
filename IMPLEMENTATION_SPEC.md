# Entix Jewellery Implementation Spec

## 1. Product Direction

This is a luxury jewellery brand site, not a generic ecommerce skin.

The public experience should feel:
- editorial
- premium
- collectible
- giftable
- modern Indian luxury with international polish

The admin experience should feel:
- clean
- efficient
- merchant-friendly
- easy to operate without Shopify

## 2. Founder Constraints

- No appointment booking flow
- Wishlist is mandatory
- AI concierge and virtual try-on are not active add-ons in v1
- Their architecture should exist behind the scenes for later activation
- Vercel deployment should be straightforward

## 3. Visual System

### Palette
- warm ivory
- soft stone
- champagne gold
- deep espresso
- selective emerald / crimson / pearl accents

### Typography
- elegant serif for high-impact headlines
- refined sans-serif for interface and body
- high letter-spacing discipline in labels and nav

### Motion
- restrained premium motion
- staggered reveals
- elegant section transitions
- smooth hover polish
- 3D only where it adds luxury, not novelty

## 4. Public Routes

- `/`
  - hero
  - category discovery
  - editorial campaign blocks
  - bestsellers
  - gifting / occasion merchandising
  - trust strip
  - footer

- `/collections`
  - all collections landing

- `/collections/[slug]`
  - collection hero
  - filtering
  - sorting
  - product grid
  - wishlist actions

- `/products/[slug]`
  - gallery
  - price
  - variant or finish support if needed
  - quantity selector
  - add to cart
  - add to wishlist
  - trust / shipping detail
  - related products

- `/wishlist`
  - saved products
  - move to cart
  - empty state

- `/cart`
  - cart lines
  - subtotal
  - shipping note
  - CTA to checkout

- `/checkout`
  - shell or functional flow based on available backend progress

- `/about`
- `/contact`
- policy pages

## 5. Admin Modules

### Products
- list
- search
- filter
- create/edit
- images
- pricing
- stock
- SKU
- collection assignment

### Collections
- create/edit
- cover image
- merchandising order

### Orders
- list
- detail view
- status
- customer info
- item list
- payment state
- shipping state

### Customers
- list
- order history
- addresses

### Inventory
- stock summary
- low stock indicators

### Content
- homepage sections
- banners
- collection stories
- footer/settings copy

### Settings
- general site settings
- Razorpay keys/config placeholders
- shipping provider config placeholders

## 6. Backend Notes

Use a structure that can realistically grow:
- API route handlers or server actions where appropriate
- clean separation of public and admin concerns
- validation at boundaries
- seed script
- environment example

## 7. Launch Definition Of Done

The project is considered ready when:
- homepage feels premium and not theme-like
- collection and PDP feel luxurious on desktop and mobile
- wishlist works in UI and backend shape
- admin CRUD for products/collections/orders exists
- seed data makes the demo believable
- build succeeds
- app is runnable locally
- deploy instructions exist
