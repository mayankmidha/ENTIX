import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatInr } from './utils';

export type InvoiceSettings = {
  storeName: string;
  legalName: string;
  gstin: string;
  invoicePrefix: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  taxPercent: number;
  returnPolicy: string;
};

const fallbackInvoiceSettings: InvoiceSettings = {
  storeName: 'Entix Jewellery',
  legalName: 'Entix Jewellery',
  gstin: '',
  invoicePrefix: 'ENT',
  address: 'India',
  city: '',
  state: '',
  postalCode: '',
  taxPercent: 3,
  returnPolicy: 'Returns and exchanges are reviewed within 7 days of delivery.',
};

export async function generateGSTInvoice(order: any, settings: Partial<InvoiceSettings> = {}) {
  const invoiceSettings = { ...fallbackInvoiceSettings, ...settings };
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text(invoiceSettings.legalName.toUpperCase(), 14, 20);
  
  doc.setFontSize(10);
  doc.text(`GSTIN: ${invoiceSettings.gstin || 'Not provided'}`, 14, 28);
  doc.text(`Address: ${[invoiceSettings.address, invoiceSettings.city, invoiceSettings.state, invoiceSettings.postalCode].filter(Boolean).join(', ') || 'India'}`, 14, 33);
  
  // Invoice Details
  doc.setFontSize(12);
  doc.text('TAX INVOICE', 140, 20);
  doc.setFontSize(10);
  doc.text(`Invoice No: ${invoiceSettings.invoicePrefix}-${order.orderNumber}`, 140, 28);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 33);
  
  // Billing/Shipping
  doc.setFontSize(11);
  doc.text('Billed To:', 14, 50);
  doc.setFontSize(10);
  doc.text(order.shippingName, 14, 56);
  doc.text(order.shippingLine1, 14, 61);
  doc.text(`${order.shippingCity}, ${order.shippingState} ${order.shippingPostal}`, 14, 66);
  doc.text(`Phone: ${order.phone || order.shippingPhone || 'N/A'}`, 14, 71);

  // Table
  const tableData = order.items.map((item: any) => [
    item.title,
    item.sku,
    formatInr(item.priceInr),
    item.quantity,
    formatInr(item.priceInr * item.quantity)
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['Description', 'SKU', 'Unit Price', 'Qty', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [18, 15, 13] },
  });

  // Totals
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.text(`Subtotal: ${formatInr(order.subtotalInr)}`, 140, finalY);
  doc.text(`Shipping: ${order.shippingInr === 0 ? 'Complimentary' : formatInr(order.shippingInr)}`, 140, finalY + 5);
  doc.text(`GST (${invoiceSettings.taxPercent}%): ${formatInr(order.taxInr)}`, 140, finalY + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${formatInr(order.totalInr)}`, 140, finalY + 18);

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your patronage. This is a computer generated invoice.', 14, finalY + 40);
  doc.text(`Return Policy: ${invoiceSettings.returnPolicy.slice(0, 110)}`, 14, finalY + 45);

  return doc;
}
