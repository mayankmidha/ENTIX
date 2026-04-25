/**
 * Entix Jewellery Notification Utility
 * Handles WhatsApp and SMS notifications for order status updates.
 * Structured for Twilio / WATI / MSG91 integration.
 */

interface OrderNotification {
  orderId: string;
  customerName: string;
  phone: string;
  amount: number;
}

export const notifications = {
  /**
   * Sends an order confirmation via WhatsApp and SMS
   */
  async sendOrderConfirmation({ orderId, customerName, phone, amount }: OrderNotification) {
    const message = `Namaste ${customerName}, your Entix Jewellery order #${orderId} for ₹${amount} is confirmed. Our studio is now preparing your piece. Track your heirloom here: https://entix.jewellery/orders/${orderId}`;

    console.log('--- NOTIFICATION LOG ---');
    console.log(`To: ${phone}`);
    console.log(`Channel: WhatsApp/SMS`);
    console.log(`Message: ${message}`);
    console.log('-------------------------');

    // Integration points for production:
    // 1. Twilio: client.messages.create({ body: message, from: '...', to: phone })
    // 2. WATI: fetch('https://api.wati.io/...', { method: 'POST', body: JSON.stringify({ phone, message }) })
    
    return true;
  },

  /**
   * Sends a shipping update notification
   */
  async sendShippingUpdate({ orderId, customerName, phone, trackingNumber }: OrderNotification & { trackingNumber: string }) {
    const message = `Exquisite news, ${customerName}! Your Entix order #${orderId} has left our studio. Tracking: ${trackingNumber}. View status: https://entix.jewellery/track/${trackingNumber}`;

    console.log('--- SHIPPING NOTIFICATION ---');
    console.log(`To: ${phone}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------');

    return true;
  }
};
