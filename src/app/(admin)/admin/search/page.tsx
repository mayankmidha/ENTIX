import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { ArrowUpRight, BadgePercent, Package, Search, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  const [orders, products, customers, collections, draftOrders, discounts, giftCards, campaigns] = query
    ? await Promise.all([
        prisma.order.findMany({
          take: 8,
          where: {
            OR: [
              { orderNumber: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
              { shippingName: { contains: query, mode: 'insensitive' } },
              { items: { some: { title: { contains: query, mode: 'insensitive' } } } },
            ],
          },
          include: { items: { take: 2 } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.product.findMany({
          take: 8,
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { sku: { contains: query, mode: 'insensitive' } },
              { material: { contains: query, mode: 'insensitive' } },
              { gemstone: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: { images: { take: 1, orderBy: { position: 'asc' } }, inventory: true },
          orderBy: { updatedAt: 'desc' },
        }),
        prisma.customer.findMany({
          take: 8,
          where: {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
              { phone: { contains: query, mode: 'insensitive' } },
            ],
          },
          include: { orders: { select: { totalInr: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.collection.findMany({
          take: 8,
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { slug: { contains: query, mode: 'insensitive' } },
              { subtitle: { contains: query, mode: 'insensitive' } },
            ],
          },
          orderBy: { updatedAt: 'desc' },
        }),
        prisma.draftOrder.findMany({
          take: 8,
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { customerEmail: { contains: query, mode: 'insensitive' } },
              { customerName: { contains: query, mode: 'insensitive' } },
            ],
          },
          orderBy: { updatedAt: 'desc' },
        }),
        prisma.discount.findMany({
          take: 8,
          where: {
            OR: [
              { code: { contains: query, mode: 'insensitive' } },
              { title: { contains: query, mode: 'insensitive' } },
            ],
          },
          orderBy: { updatedAt: 'desc' },
        }),
        prisma.giftCard.findMany({
          take: 8,
          where: {
            OR: [
              { code: { contains: query, mode: 'insensitive' } },
              { recipientEmail: { contains: query, mode: 'insensitive' } },
            ],
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.marketingCampaign.findMany({
          take: 8,
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { subject: { contains: query, mode: 'insensitive' } },
              { body: { contains: query, mode: 'insensitive' } },
            ],
          },
          orderBy: { updatedAt: 'desc' },
        }),
      ])
    : [[], [], [], [], [], [], [], []];

  const total = orders.length + products.length + customers.length + collections.length + draftOrders.length + discounts.length + giftCards.length + campaigns.length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="border-b border-ink/10 pb-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">Store-wide search</div>
        <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
          Find anything fast.
        </h1>
        <form action="/admin/search" className="relative mt-5 max-w-3xl">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/28" />
          <input
            name="q"
            defaultValue={query}
            autoFocus
            placeholder="Search orders, products, SKUs, customers"
            className="h-[52px] w-full border border-ink/10 bg-white pl-12 pr-4 font-mono text-[12px] uppercase tracking-[0.11em] text-ink outline-none placeholder:text-ink/28 focus:border-ink/35"
          />
        </form>
        {query && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/38">
            {total} result{total === 1 ? '' : 's'} for "{query}"
          </p>
        )}
      </header>

      {!query ? (
        <section className="mt-5 grid gap-3 md:grid-cols-4">
          <Hint icon={ShoppingBag} label="Orders" text="Search by order number, customer, email, or item title." />
          <Hint icon={Package} label="Products" text="Search by title, SKU, material, or gemstone." />
          <Hint icon={Users} label="Customers" text="Search by name, email, or phone." />
          <Hint icon={BadgePercent} label="Promotions" text="Search discounts, gift cards, campaigns, and draft orders." />
        </section>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-4">
          <ResultPanel title="Orders" count={orders.length} href={`/admin/orders?q=${encodeURIComponent(query)}`}>
            {orders.map((order) => (
              <ResultLink key={order.id} href={`/admin/orders/${order.id}`} eyebrow={order.orderNumber} title={order.shippingName} meta={`${formatInr(order.totalInr)} · ${order.status}`} />
            ))}
          </ResultPanel>

          <ResultPanel title="Products" count={products.length} href={`/admin/products?q=${encodeURIComponent(query)}`}>
            {products.map((product) => (
              <ResultLink
                key={product.id}
                href={`/admin/products/${product.id}`}
                eyebrow={product.sku}
                title={product.title}
                meta={`${formatInr(product.priceInr)} · ${product.inventory?.stockQty ?? 0} in stock`}
              />
            ))}
          </ResultPanel>

          <ResultPanel title="Customers" count={customers.length} href={`/admin/customers?q=${encodeURIComponent(query)}`}>
            {customers.map((customer) => {
              const spend = customer.orders.reduce((sum, order) => sum + order.totalInr, 0);
              const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.email;
              return (
                <ResultLink key={customer.id} href={`/admin/customers/${customer.id}`} eyebrow={customer.email} title={name} meta={`${customer.orders.length} orders · ${formatInr(spend)}`} />
              );
            })}
          </ResultPanel>

          <ResultPanel title="Collections" count={collections.length} href={`/admin/collections?q=${encodeURIComponent(query)}`}>
            {collections.map((collection) => (
              <ResultLink key={collection.id} href={`/admin/collections/${collection.id}`} eyebrow={collection.slug} title={collection.title} meta={collection.isActive ? 'Active collection' : 'Inactive collection'} />
            ))}
          </ResultPanel>

          <ResultPanel title="Draft orders" count={draftOrders.length} href={`/admin/draft-orders?q=${encodeURIComponent(query)}`}>
            {draftOrders.map((draft) => (
              <ResultLink key={draft.id} href="/admin/draft-orders" eyebrow={draft.name} title={draft.customerName || draft.customerEmail || 'Draft order'} meta={`${formatInr(draft.totalInr)} · ${draft.status}`} />
            ))}
          </ResultPanel>

          <ResultPanel title="Discounts" count={discounts.length} href={`/admin/discounts?q=${encodeURIComponent(query)}`}>
            {discounts.map((discount) => (
              <ResultLink key={discount.id} href={`/admin/discounts/${discount.id}`} eyebrow={discount.code} title={discount.title} meta={`${discount.type} · ${discount.status}`} />
            ))}
          </ResultPanel>

          <ResultPanel title="Gift cards" count={giftCards.length} href={`/admin/gift-cards?q=${encodeURIComponent(query)}`}>
            {giftCards.map((card) => (
              <ResultLink key={card.id} href="/admin/gift-cards" eyebrow={card.code} title={card.recipientEmail || 'Gift card'} meta={`${formatInr(card.balanceInr)} balance · ${card.status}`} />
            ))}
          </ResultPanel>

          <ResultPanel title="Campaigns" count={campaigns.length} href={`/admin/marketing?q=${encodeURIComponent(query)}`}>
            {campaigns.map((campaign) => (
              <ResultLink key={campaign.id} href="/admin/marketing" eyebrow={campaign.channel} title={campaign.name} meta={`${campaign.status} · ${campaign.recipientCount} recipients`} />
            ))}
          </ResultPanel>
        </div>
      )}
    </div>
  );
}

function Hint({ icon: Icon, label, text }: { icon: any; label: string; text: string }) {
  return (
    <div className="border border-ink/8 bg-white p-4 shadow-sm">
      <Icon size={18} className="text-ink/42" />
      <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink">{label}</div>
      <p className="mt-2 text-[13px] leading-relaxed text-ink/50">{text}</p>
    </div>
  );
}

function ResultPanel({ title, count, href, children }: { title: string; count: number; href: string; children: React.ReactNode }) {
  return (
    <section className="border border-ink/8 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-[22px] font-medium tracking-normal text-ink">{title}</h2>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/35">{count} matches</div>
        </div>
        <Link href={href} className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/45 hover:text-ink">
          Open <ArrowUpRight size={13} />
        </Link>
      </div>
      <div className="grid gap-2">
        {count > 0 ? children : <div className="border border-ink/6 bg-[#f6f4ef] p-4 text-[13px] text-ink/40">No matches.</div>}
      </div>
    </section>
  );
}

function ResultLink({ href, eyebrow, title, meta }: { href: string; eyebrow: string; title: string; meta: string }) {
  return (
    <Link href={href} className="block border border-ink/8 p-3 transition-colors hover:bg-[#fbfaf7]">
      <div className="truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink/36">{eyebrow}</div>
      <div className="mt-1 truncate text-[14px] font-medium text-ink">{title}</div>
      <div className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.1em] text-ink/38">{meta}</div>
    </Link>
  );
}
