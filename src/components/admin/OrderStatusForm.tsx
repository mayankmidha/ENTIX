'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { updateOrderStatus } from '@/app/(admin)/admin/orders/actions';
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentStatus,
} from '@/app/(admin)/admin/orders/constants';

interface Props {
  orderId: string;
  initialStatus: string;
  initialPaymentStatus: string;
  initialTracking: string | null;
}

export function OrderStatusForm({
  orderId,
  initialStatus,
  initialPaymentStatus,
  initialTracking,
}: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus);
  const [tracking, setTracking] = useState(initialTracking || '');
  const [isPending, startTransition] = useTransition();

  const dirty =
    status !== initialStatus ||
    paymentStatus !== initialPaymentStatus ||
    tracking !== (initialTracking || '');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, {
          status: status as OrderStatus,
          paymentStatus: paymentStatus as PaymentStatus,
          trackingNumber: tracking,
        });
        toast.success('Order updated');
      } catch (err: any) {
        toast.error(err?.message || 'Could not update order');
      }
    });
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-[32px] border border-ink/5 bg-white p-8 shadow-sm space-y-6"
    >
      <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/30 border-b border-ink/5 pb-4">
        Fulfillment Controls
      </h2>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">
          Order Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full bg-ivory-2/40 rounded-full px-5 py-3 font-mono text-[12px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-ink/20"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">
          Payment Status
        </label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full bg-ivory-2/40 rounded-full px-5 py-3 font-mono text-[12px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-ink/20"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/40 mb-2">
          Tracking Number
        </label>
        <input
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          placeholder="e.g. DLH-4821-X"
          className="w-full bg-ivory-2/40 rounded-full px-5 py-3 font-mono text-[13px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-ink/20"
        />
      </div>

      <button
        type="submit"
        disabled={!dirty || isPending}
        className="w-full flex items-center justify-center gap-2 rounded-full bg-ink text-ivory py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-ink-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Save size={14} /> {isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}
