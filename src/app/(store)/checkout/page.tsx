'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ShoppingBag, ShieldCheck, 
  Truck, Ticket, Info, Loader2, AlertCircle
} from 'lucide-react';
import { formatInr, cn } from '@/lib/utils';
import { useCart } from '@/stores/cart-store';
import { useScript } from '@/lib/hooks/use-script';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal: getSubtotal, clear } = useCart();
  const razorpayStatus = useScript('https://checkout.razorpay.com/v1/checkout.js');
  const hasPublicRazorpayKey = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>(hasPublicRazorpayKey ? 'razorpay' : 'cod');
  const [discountCode, setDiscountCode] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [isValidatingDiscount, setIsValidatingDiscount] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const subtotal = getSubtotal();
  
  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percentage') {
      discountAmount = Math.round((subtotal * appliedDiscount.value) / 100);
    } else if (appliedDiscount.type === 'fixed_amount') {
      discountAmount = appliedDiscount.value;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const baseShipping = discountedSubtotal > 10000 ? 0 : 500;
  const shipping = appliedDiscount?.type === 'free_shipping' ? 0 : baseShipping;
  
  // GST 18% breakdown (assuming inclusive for luxury positioning, but calculating for display)
  const tax = Math.round(discountedSubtotal * 0.18); 
  const total = discountedSubtotal + shipping;
  const canUseRazorpay = hasPublicRazorpayKey && razorpayStatus === 'ready';

  const handleApplyDiscount = async () => {
    if (!discountCode) return;
    setIsValidatingDiscount(true);
    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: discountCode, subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedDiscount(data);
        toast.success(`Discount applied: ${data.title}`);
      } else {
        toast.error(data.message || 'Invalid discount code');
      }
    } catch (error) {
      toast.error('Failed to validate discount');
    } finally {
      setIsValidatingDiscount(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-ivory p-6">
         <div className="mb-8 flex h-20 w-20 items-center justify-center border border-ink/8 bg-white text-ink/12">
            <ShoppingBag size={40} />
         </div>
         <h1 className="font-display text-4xl text-ink text-center">Your bag is empty.</h1>
         <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-ink/40">Choose a piece before checkout</p>
         <Link href="/collections/all" className="mt-10 bg-ink px-10 py-5 font-mono text-[11px] uppercase tracking-widest text-ivory shadow-xl transition-all hover:bg-ink-2">Explore Collection</Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      if (paymentMethod === 'razorpay' && !canUseRazorpay) {
        throw new Error('Razorpay is not configured yet. Switch to cash on delivery or add gateway keys.');
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customerInfo,
          paymentMethod,
          discountCode,
          giftWrap,
          giftMessage
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Checkout failed');

      if (paymentMethod === 'cod') {
        clear();
        router.push(`/checkout/success?orderId=${data.orderId}`);
        return;
      }

      // Razorpay Flow
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.total * 100,
        currency: data.currency,
        name: "Entix Jewellery",
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderNumber: data.orderNumber,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clear();
            router.push(`/checkout/success?orderId=${data.orderId}`);
          } else {
            toast.error(verifyData.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        theme: {
          color: "#120f0d",
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay checkout is unavailable right now');
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory px-6 py-20 lg:px-12">
      <div className="max-w-[1440px] mx-auto grid lg:grid-cols-[1fr_450px] gap-20">
        
        {/* Left Column: Customer Details & Payment */}
        <div>
          <Link href="/cart" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ink/40 hover:text-ink transition-colors mb-12">
            <ChevronLeft size={12} /> Return to Bag
          </Link>

          <div className="space-y-12">
            {/* Step 1: Shipping */}
            <section className={cn("transition-all duration-500", step > 1 && "opacity-50 pointer-events-none")}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-[32px] font-medium tracking-normal text-ink">Shipping Information</h2>
                <div className="flex h-8 w-8 items-center justify-center bg-ink font-mono text-[12px] text-ivory">1</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Email for updates</label>
                   <input 
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" placeholder="name@example.com" 
                  />
                </div>
                <div>
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">First Name</label>
                   <input 
                    required
                    value={customerInfo.firstName}
                    onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" 
                  />
                </div>
                <div>
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Last Name</label>
                   <input 
                    required
                    value={customerInfo.lastName}
                    onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" 
                  />
                </div>
                <div className="sm:col-span-2">
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Detailed Address</label>
                   <input 
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" placeholder="House/Flat No., Building Name, Street" 
                  />
                </div>
                <div>
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">City</label>
                   <input 
                    required
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" 
                  />
                </div>
                <div>
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">State</label>
                   <input 
                    required
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" 
                    placeholder="e.g. Haryana"
                  />
                </div>
                <div>
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Postal Code</label>
                   <input 
                    required
                    value={customerInfo.postalCode}
                    onChange={(e) => setCustomerInfo({...customerInfo, postalCode: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" 
                  />
                </div>
                <div>
                   <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/40 mb-2">Phone</label>
                   <input 
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                    className="w-full border border-ink/10 bg-white px-6 py-4 font-mono text-[13px] transition-all focus:border-ink focus:outline-none" 
                    placeholder="+91"
                  />
                </div>
              </div>

              {step === 1 && (
                <button 
                  onClick={() => {
                    if (!customerInfo.email || !customerInfo.firstName || !customerInfo.lastName || !customerInfo.address || !customerInfo.city || !customerInfo.state || !customerInfo.postalCode || !customerInfo.phone) {
                      return toast.error('Please complete all dispatch details');
                    }
                    setStep(2);
                  }}
                  className="mt-10 w-full bg-ink py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory shadow-xl transition-all hover:bg-ink-2 active:scale-[0.98]"
                >
                  Continue to payment
                </button>
              )}
            </section>

            {/* Step 2: Payment */}
            <section className={cn("transition-all duration-500", step < 2 && "opacity-20 pointer-events-none")}>
               <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-[32px] font-medium tracking-normal text-ink">Payment Method</h2>
                <div className={cn("flex h-8 w-8 items-center justify-center font-mono text-[12px]", step === 2 ? "bg-ink text-ivory" : "bg-ink/5 text-ink/20")}>2</div>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => {
                    if (hasPublicRazorpayKey) setPaymentMethod('razorpay');
                  }}
                  className={cn(
                    "group flex cursor-pointer items-center justify-between border p-8 transition-all",
                    paymentMethod === 'razorpay' ? "border-ink bg-white shadow-luxe" : "border-ink/5 bg-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0",
                    !hasPublicRazorpayKey && "cursor-not-allowed opacity-40 grayscale"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-6 w-6 items-center justify-center border-2 border-ink">
                       {paymentMethod === 'razorpay' && <div className="h-3 w-3 bg-ink animate-in zoom-in" />}
                    </div>
                    <div>
                       <div className="font-display text-[20px] font-medium text-ink">Secure Gateway</div>
                       <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">
                         {hasPublicRazorpayKey ? 'Cards · UPI · Netbanking · EMI' : 'Add Razorpay keys to enable online payments'}
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={18} className="text-jade" />
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('cod')}
                  className={cn(
                    "group flex cursor-pointer items-center justify-between border p-8 transition-all",
                    paymentMethod === 'cod' ? "border-ink bg-white shadow-luxe" : "border-ink/5 bg-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className="flex h-6 w-6 items-center justify-center border-2 border-ink">
                       {paymentMethod === 'cod' && <div className="h-3 w-3 bg-ink animate-in zoom-in" />}
                    </div>
                    <div>
                       <div className="font-display text-[20px] font-medium text-ink">Cash on Delivery</div>
                       <div className="font-mono text-[10px] uppercase tracking-widest text-ink/40 mt-1">Available for selections under ₹1,00,000</div>
                    </div>
                  </div>
                  <Truck size={20} className="text-ink/20" />
                </div>
              </div>

              {step === 2 && (
                <button 
                  disabled={isProcessing || (paymentMethod === 'razorpay' && !canUseRazorpay)}
                  onClick={handleCheckout}
                  className="mt-10 flex w-full items-center justify-center gap-3 bg-ink py-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ivory shadow-xl transition-all hover:bg-ink-2 active:scale-[0.98] disabled:opacity-50"
                >
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : (
                    <>Place order · {formatInr(total)}</>
                  )}
                </button>
              )}

              {paymentMethod === 'razorpay' && razorpayStatus === 'error' && (
                <div className="mt-4 flex items-center gap-2 text-oxblood font-mono text-[10px] uppercase tracking-widest justify-center">
                  <AlertCircle size={14} /> Gateway Connectivity Issue
                </div>
              )}
            </section>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="relative lg:sticky lg:top-32 h-fit">
          <div className="border border-ink/8 bg-white p-8 shadow-luxe lg:p-10">
            <h2 className="mb-8 font-display text-[24px] font-medium tracking-normal text-ink">Selection Summary</h2>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-5 group">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-ink/5 bg-ivory-2">
                    <img src={item.imageUrl || ''} className="h-full w-full object-cover grayscale transition-all group-hover:grayscale-0" alt="" />
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-ink font-mono text-[10px] text-ivory">{item.quantity}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-[16px] font-medium text-ink">{item.title}</h3>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-ink/40 mt-1">Entix Piece</div>
                  </div>
                  <div className="ml-auto font-mono text-[13px] text-ink">{formatInr(item.priceInr * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-10 border-t border-ink/5 space-y-8">
              {/* Gift Options */}
              <div className="space-y-4">
                <div 
                  onClick={() => setGiftWrap(!giftWrap)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                   <div className={cn("flex h-5 w-5 items-center justify-center border border-ink/10 transition-colors", giftWrap ? "bg-ink border-ink" : "bg-white")}>
                      {giftWrap && <div className="h-2 w-2 bg-ivory" />}
                   </div>
                   <span className="font-mono text-[10px] uppercase tracking-widest text-ink/60 group-hover:text-ink transition-colors">Request Gift Wrapping (Complimentary)</span>
                </div>
                {giftWrap && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                    <label className="block font-mono text-[9px] uppercase tracking-widest text-ink/30 mb-2 ml-8">Gift Message</label>
                    <textarea 
                      value={giftMessage}
                      onChange={(e) => setGiftMessage(e.target.value)}
                      className="h-24 w-full border border-ink/5 bg-ivory-2 p-4 font-mono text-[11px] italic transition-all placeholder:text-ink/20 focus:border-ink focus:outline-none" 
                      placeholder="Write a note for the recipient..."
                    />
                  </div>
                )}
              </div>

              {/* Discount Flow */}
              <div className="relative group pt-4 border-t border-ink/5">
                <Ticket size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-ink transition-colors" />
                <input 
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Promo code"
                  className="w-full border border-ink/5 bg-ivory-2 py-4 pl-12 pr-24 font-mono text-[11px] uppercase tracking-widest transition-all focus:border-ink focus:outline-none" 
                />
                <button 
                  onClick={handleApplyDiscount}
                  disabled={isValidatingDiscount || !discountCode}
                  className="absolute bottom-2 right-2 top-1.5 bg-ink/5 px-6 font-mono text-[10px] uppercase tracking-widest transition-all hover:bg-ink hover:text-ivory disabled:opacity-50"
                >
                  {isValidatingDiscount ? <Loader2 size={12} className="animate-spin" /> : 'Apply'}
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>Subtotal</span>
                  <span>{formatInr(subtotal)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-jade">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span>-{formatInr(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>Shipping</span>
                  <span className={cn(shipping === 0 && "text-jade")}>{shipping === 0 ? 'Complimentary' : formatInr(shipping)}</span>
                </div>
                <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-ink/40">
                  <span>GST (18% breakdown)</span>
                  <span>{formatInr(tax)}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-ink/10 flex justify-between items-end">
                <div>
                  <div className="font-display text-[26px] font-medium text-ink">Total</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/30">India · secure checkout</div>
                </div>
                <div className="font-display text-[32px] font-medium tracking-normal text-ink">{formatInr(total)}</div>
              </div>
            </div>

            <div className="mt-10 flex items-center gap-3 bg-jade/5 p-4 text-jade/70 italic">
               <Info size={14} />
               <p className="text-[12px] leading-snug">Every Entix order includes complimentary lifetime re-polish service.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
