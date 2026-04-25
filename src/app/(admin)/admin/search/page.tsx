import { prisma } from '@/lib/prisma';
import { formatInr } from '@/lib/utils';
import { ArrowUpRight, Package, Search, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || '').trim();

  const [orders, products, customers] = query
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
      ])
    : [[], [], []];

  const total = orders.length + products.length + customers.length;

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
        <section className="mt-5 grid gap-3 md:grid-cols-3">
          <Hint icon={ShoppingBag} label="Orders" text="Search by order number, customer, email, or item title." />
          <Hint icon={Package} label="Products" text="Search by title, SKU, material, or gemstone." />
          <Hint icon={Users} label="Customers" text="Search by name, email, or phone." />
        </section>
      ) : (
        <div className="mt-5 grid gap-5 xl:grid-cols-3">
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
