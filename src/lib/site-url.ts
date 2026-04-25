function normalizeUrl(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/$/, '');
  }

  return `https://${trimmed.replace(/\/$/, '')}`;
}

export function getBaseUrl() {
  return (
    normalizeUrl(process.env.NEXT_PUBLIC_BASE_URL) ||
    normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL) ||
    normalizeUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
    normalizeUrl(process.env.VERCEL_URL) ||
    'http://localhost:3000'
  );
}

