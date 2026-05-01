'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success('Welcome to the Circle.');
        setEmail('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Something went wrong.');
      }
    } catch (error) {
      toast.error('Failed to join the Circle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h4 className="font-subhead text-[10px] uppercase tracking-widest text-ivory/30">— The Circle</h4>
      <p className="font-subhead text-[11px] text-ivory/50 uppercase leading-relaxed">
        Join our circle for early access to collection drops.
      </p>
      <form onSubmit={handleSubmit} className="relative group">
        <input 
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address" 
          disabled={loading}
          className="w-full bg-transparent border-b border-ivory/10 pb-3 font-sans text-[12px] focus:outline-none focus:border-champagne-500 transition-all placeholder:text-ivory/20 disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={loading}
          className="absolute right-0 bottom-3 font-subhead text-[10px] uppercase tracking-widest text-ivory/40 hover:text-ivory transition-colors disabled:opacity-50"
        >
          {loading ? 'Joining...' : 'Join'}
        </button>
      </form>
    </div>
  );
}
