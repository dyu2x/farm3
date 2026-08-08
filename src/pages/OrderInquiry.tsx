import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, Send, Calculator, Info, ArrowLeft, Fish } from 'lucide-react';
import { Fingerling, OrderInquiry as OrderInquiryType } from '../types';

interface OrderInquiryProps {
  fingerlings: Fingerling[];
  onAddInquiry?: (inquiry: Omit<OrderInquiryType, 'id' | 'created_date'>) => void;
}

export const OrderInquiry: React.FC<OrderInquiryProps> = ({ fingerlings, onAddInquiry }) => {
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    fingerling_name: searchParams.get('fingerling') || fingerlings[0]?.name || '',
    quantity: searchParams.get('quantity') || '1000',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fParam = searchParams.get('fingerling');
    const qParam = searchParams.get('quantity');
    if (fParam) {
      setFormData(prev => ({
        ...prev,
        fingerling_name: fParam,
        ...(qParam ? { quantity: qParam } : {})
      }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const activeFingerling = fingerlings.find(
    f => f.name.toLowerCase() === formData.fingerling_name.toLowerCase()
  ) || fingerlings[0];

  const qty = parseInt(formData.quantity, 10) || 0;
  const tiers = activeFingerling?.price_tiers || [];

  const getActiveTierPrice = () => {
    if (qty <= 0 || tiers.length === 0) return 0;
    const activeTier = tiers.find(t => qty >= t.min_qty && (!t.max_qty || qty <= t.max_qty));
    if (activeTier) return activeTier.price_per_unit;
    const highestTier = tiers[tiers.length - 1];
    return highestTier ? highestTier.price_per_unit : 0;
  };

  const unitPrice = getActiveTierPrice();
  const estimatedTotal = unitPrice * qty;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      if (onAddInquiry) {
        onAddInquiry({
          customer_name: formData.customer_name,
          email: formData.email,
          phone: formData.phone,
          fingerling_name: formData.fingerling_name,
          quantity: qty || null,
          message: formData.message,
          status: 'pending'
        });
      }
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] pt-28 pb-20 flex items-center justify-center px-4">
        <div className="glass-card rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-2xl border border-border/80 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto text-accent animate-pulse-glow">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Inquiry Submitted!</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Thank you for your interest in Mesina Farms. Our aquaculture team will contact you at{' '}
              <span className="text-primary font-bold">{formData.email}</span> or{' '}
              <span className="text-primary font-bold">{formData.phone}</span> regarding your order inquiry.
            </p>
          </div>

          <div className="bg-muted/40 p-4 rounded-2xl border border-border/40 text-left text-xs space-y-2">
            <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
              Inquiry Summary
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fingerling:</span>
              <span className="font-bold text-foreground">{formData.fingerling_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-bold text-foreground">{qty.toLocaleString()} pcs</span>
            </div>
            {estimatedTotal > 0 && (
              <div className="flex justify-between pt-2 border-t border-border/30 font-bold text-primary">
                <span>Estimated Cost:</span>
                <span>₱{estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData(prev => ({ ...prev, message: '' }));
              }}
              className="flex-1 py-3 rounded-xl glass font-semibold text-xs sm:text-sm text-foreground hover:bg-muted"
            >
              Submit Another Inquiry
            </button>
            <Link
              to="/"
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* HEADER BANNER */}
      <section className="py-12 text-center bg-card/20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
            Place an Order Inquiry
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Submit your requirements and our aquaculture team will respond with availability, logistics, and bulk pricing.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-8 border border-border/60 shadow-2xl space-y-6">
            <div className="border-b border-border/40 pb-4">
              <h2 className="text-xl font-bold text-foreground">Customer & Order Details</h2>
              <p className="text-xs text-muted-foreground">Fill out the fields below to request a formal quotation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="juan@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone / Hotline *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+63 900 000 0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Fingerling Stage *
                  </label>
                  <select
                    name="fingerling_name"
                    required
                    value={formData.fingerling_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  >
                    {fingerlings.map(f => (
                      <option key={f.id} value={f.name}>
                        {f.name} ({f.size_label})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Quantity (pcs) *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Special Instructions / Delivery Location
                </label>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Mention delivery target location (e.g., Roxas City, Capiz) or oxygen bag packaging preference..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/25 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          </div>

          {/* Live Quote Summary Sidebar */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-border/60 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                <Calculator className="w-5 h-5 text-primary" /> Live Estimate
              </h3>
              <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                <Fish className="w-3.5 h-3.5" /> Direct Hatchery
              </span>
            </div>

            {activeFingerling ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xl font-bold text-foreground">{activeFingerling.name}</div>
                  <div className="text-xs text-muted-foreground">{activeFingerling.size_label} Size Stage</div>
                </div>

                <div className="bg-muted/40 p-4 rounded-2xl space-y-3 text-xs border border-border/40">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Quantity:</span>
                    <span className="font-bold text-foreground">{qty.toLocaleString()} pcs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier Rate:</span>
                    <span className="font-bold text-primary">₱{unitPrice.toFixed(2)} / pc</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/30">
                    <span className="text-muted-foreground">Stock Available:</span>
                    <span className="font-semibold text-emerald-500">
                      {activeFingerling.stock_count.toLocaleString()} pcs
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/40">
                  <div className="text-xs text-muted-foreground mb-1">Estimated Total Quote</div>
                  <div className="text-3xl font-extrabold hydro-text">
                    ₱{estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold text-foreground flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-primary" /> Delivery & Transport
                  </div>
                  <p>
                    Fingerlings are transported in oxygenated double-layer plastic bags to ensure 98%+ survival upon arrival.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Select a fingerling to view instant estimate.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
