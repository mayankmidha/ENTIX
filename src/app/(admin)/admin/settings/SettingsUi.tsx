import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, ChevronLeft, Save, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

export function SettingsFrame({
  eyebrow,
  title,
  description,
  saved,
  error,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  saved?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1120px] pb-24">
      <Link href="/admin/settings" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45 transition hover:text-ink">
        <ChevronLeft size={13} /> Settings
      </Link>

      <header className="mt-6 border-b border-ink/10 pb-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/38">{eyebrow}</div>
        <h1 className="mt-3 font-display text-[34px] font-medium leading-none tracking-normal text-ink sm:text-[42px]">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-ink/55">{description}</p>
      </header>

      {saved && (
        <div className="mt-5 flex items-start gap-3 border border-jade/20 bg-jade/[0.08] p-4 text-jade">
          <CheckCircle2 size={17} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em]">Saved</div>
            <p className="mt-1 text-[13px] leading-relaxed text-ink/58">Your changes are now stored in the admin configuration.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-5 flex items-start gap-3 border border-oxblood/20 bg-oxblood/5 p-4 text-oxblood">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em]">Needs attention</div>
            <p className="mt-1 text-[13px] leading-relaxed text-ink/58">{error}</p>
          </div>
        </div>
      )}

      <div className="mt-6">{children}</div>
    </div>
  );
}

export function SettingsPanel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-ink/8 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3 border-b border-ink/8 pb-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-ink/10 bg-[#f6f4ef] text-ink/55">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <h2 className="text-[15px] font-medium text-ink">{title}</h2>
          {description && <p className="mt-1 text-[13px] leading-relaxed text-ink/50">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="block font-mono text-[9px] uppercase tracking-[0.14em] text-ink/42">{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint && <span className="mt-2 block text-[12px] leading-relaxed text-ink/42">{hint}</span>}
    </label>
  );
}

export function TextInput({
  name,
  defaultValue,
  type = 'text',
  placeholder,
  required,
  autoComplete,
}: {
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <input
      name={name}
      type={type}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      className="min-h-12 w-full border border-ink/10 bg-[#f6f4ef] px-4 font-mono text-[12px] text-ink outline-none transition placeholder:text-ink/28 focus:border-ink/35 focus:bg-white"
    />
  );
}

export function TextArea({
  name,
  defaultValue,
  placeholder,
  rows = 5,
}: {
  name: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      name={name}
      defaultValue={defaultValue ?? ''}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y border border-ink/10 bg-[#f6f4ef] px-4 py-3 text-[13px] leading-relaxed text-ink outline-none transition placeholder:text-ink/28 focus:border-ink/35 focus:bg-white"
    />
  );
}

export function SelectInput({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue?: string | null;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue ?? options[0]?.value}
      className="min-h-12 w-full border border-ink/10 bg-[#f6f4ef] px-4 font-mono text-[12px] uppercase tracking-[0.08em] text-ink outline-none transition focus:border-ink/35 focus:bg-white"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function ToggleField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between gap-4 border border-ink/8 bg-[#f6f4ef] p-4">
      <span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-ink">{label}</span>
        {description && <span className="mt-1 block text-[12px] leading-relaxed text-ink/48">{description}</span>}
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0">
        <input name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="absolute inset-0 bg-ink/14 transition peer-checked:bg-jade" />
        <span className="absolute left-1 top-1 h-4 w-4 bg-white shadow-sm transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function SubmitBar({ label = 'Save settings' }: { label?: string }) {
  return (
    <div className="sticky bottom-16 z-10 mt-5 flex justify-end border border-ink/10 bg-white/92 p-3 shadow-sm backdrop-blur md:bottom-4">
      <button className="inline-flex min-h-12 items-center justify-center gap-2 bg-ink px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory transition hover:bg-ink-2 active:scale-[0.99]">
        <Save size={15} /> {label}
      </button>
    </div>
  );
}

export function StatusPill({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'good' | 'warn' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em]',
        tone === 'good' && 'border-jade/20 bg-jade/[0.08] text-jade',
        tone === 'warn' && 'border-oxblood/20 bg-oxblood/5 text-oxblood',
        tone === 'neutral' && 'border-ink/10 bg-[#f6f4ef] text-ink/48',
      )}
    >
      {children}
    </span>
  );
}
