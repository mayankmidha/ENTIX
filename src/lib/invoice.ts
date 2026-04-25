import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatInr } from './utils';

export async function generateGSTInvoice(order: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.text('ENTIX JEWELLERY', 14, 20);
  
  doc.setFontSize(10);
  doc.text('GSTIN: 08ABCDE1234F1Z5', 14, 28);
  doc.text('Studio: Sector 52, Gurgaon, Haryana', 14, 33);
  
  // Invoice Details
  doc.setFontSize(12);
  doc.text('TAX INVOICE', 140, 20);
  doc.setFontSize(10);
  doc.text(`Invoice No: INV-${order.orderNumber}`, 140, 28);
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
  doc.text(`GST (18%): ${formatInr(order.taxInr)}`, 140, finalY + 10);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${formatInr(order.totalInr)}`, 140, finalY + 18);

  // Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your patronage. This is a computer generated invoice.', 14, finalY + 40);
  doc.text('Return Policy: 7 days from delivery. Lifetime re-polish complimentary.', 14, finalY + 45);

  return doc;
}
