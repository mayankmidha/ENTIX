import { notFound, permanentRedirect, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function StoreRedirectFallback({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const path = `/${slug.join('/')}`;
  const candidates = [path, path.endsWith('/') ? path.slice(0, -1) : `${path}/`];

  const savedRedirect = await prisma.redirect
    .findFirst({
      where: { fromPath: { in: candidates } },
    })
    .catch(() => null);

  if (!savedRedirect) notFound();

  const paramsString = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => paramsString.append(key, item));
    } else if (value) {
      paramsString.set(key, value);
    }
  }

  const target = paramsString.toString()
    ? `${savedRedirect.toPath}${savedRedirect.toPath.includes('?') ? '&' : '?'}${paramsString}`
    : savedRedirect.toPath;

  if (savedRedirect.statusCode === 301 || savedRedirect.statusCode === 308) {
    permanentRedirect(target);
  }

  redirect(target);
}
