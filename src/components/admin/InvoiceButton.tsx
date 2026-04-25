'use client';
import { generateGSTInvoice } from '@/lib/invoice';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';

export function InvoiceButton({ order }: { order: any }) {
  const handleDownload = async () => {
    try {
      const settingsResponse = await fetch('/api/admin/invoice-settings');
      const settings = settingsResponse.ok ? await settingsResponse.json() : {};
      const doc = await generateGSTInvoice(order, settings);
      doc.save(`INV-${order.orderNumber}.pdf`);
      toast.success('Invoice generated');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-ink hover:bg-ivory-2 transition-colors shadow-sm"
    >
      <FileText size={14} /> Print Tax Invoice
    </button>
  );
}
