import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calculator, Check, Info } from 'lucide-react';
import { Fingerling } from '../types';

interface OrderCalculatorProps {
  fingerlings: Fingerling[];
}

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({ fingerlings }) => {
  const availableFingerlings = fingerlings.filter(f => f.price_tiers && f.price_tiers.length > 0);
  
  const [selectedId, setSelectedId] = useState<string>(availableFingerlings[0]?.id || '');
  const activeFingerling = availableFingerlings.find(f => f.id === selectedId) || availableFingerlings[0];

  const defaultQty = activeFingerling?.price_tiers[0]?.min_qty || 1000;
  const [quantity, setQuantity] = useState<number>(defaultQty);

  if (!activeFingerling) return null;

  const tiers = activeFingerling.price_tiers || [];

  const getTierInfo = () => {
    const qty = quantity || 0;
    if (qty <= 0 || tiers.length === 0) return null;
    const activeTier = tiers.find(t => qty >= t.min_qty && (!t.max_qty || qty <= t.max_qty));
    if (!activeTier) {
      const highestTier = tiers[tiers.length - 1];
      return highestTier ? { price: Number(highestTier.price_per_unit), tier: highestTier } : null;
    }
    return { price: Number(activeTier.price_per_unit), tier: activeTier };
  };

  const currentTierInfo = getTierInfo();
  const unitPrice = currentTierInfo ? currentTierInfo.price : (tiers[0]?.price_per_unit || 0);
  const totalCost = unitPrice * (quantity || 0);

  const maxSliderValue = activeFingerling.stock_count ? Math.min(activeFingerling.stock_count, 20000) : 10000;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-border/60 shadow-2xl">
      {/* Fingerling Stage Selection Tabs */}
      <div className="mb-8">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          1. Select Fingerling Growth Stage
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {availableFingerlings.map(f => {
            const isSelected = f.id === activeFingerling.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedId(f.id);
                  const minQ = f.price_tiers[0]?.min_qty || 500;
                  setQuantity(minQ);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-primary text-foreground ring-2 ring-primary/40 shadow-lg'
                    : 'bg-card/40 border-border/50 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                <div className="font-bold text-sm sm:text-base">{f.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{f.size_label}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Quantity Controls & Slider */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                2. Enter Order Quantity
              </label>
              <span className="text-xs text-primary font-medium flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5" /> Volume discount applies
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-4 py-3.5 rounded-2xl bg-muted/60 border border-border text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">pcs</span>
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="100"
              max={maxSliderValue}
              step="100"
              value={Math.min(quantity, maxSliderValue)}
              onChange={e => setQuantity(parseInt(e.target.value))}
              className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
              <span>100 pcs</span>
              <span>{(maxSliderValue / 2).toLocaleString()} pcs</span>
              <span>{maxSliderValue.toLocaleString()} pcs</span>
            </div>
          </div>

          {/* Tier Table */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary" /> Volume Pricing Tiers for {activeFingerling.name}
            </h4>
            <div className="divide-y divide-border/40 rounded-2xl border border-border/50 overflow-hidden bg-card/20">
              {tiers.map((t, i) => {
                const isActive = currentTierInfo?.tier === t;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-3 text-xs transition-colors ${
                      isActive ? 'bg-primary/20 font-bold text-foreground' : 'text-muted-foreground hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isActive && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                      <span>
                        {t.max_qty ? `${t.min_qty.toLocaleString()} – ${t.max_qty.toLocaleString()} pcs` : `${t.min_qty.toLocaleString()}+ pcs`}
                      </span>
                    </div>
                    <div className="font-semibold text-primary">
                      ₱{t.price_per_unit.toFixed(2)} / pc
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Total Price Summary Box */}
        <div className="lg:col-span-5 bg-card/60 border border-border/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Estimated Total
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-primary hydro-text">
              ₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For {quantity.toLocaleString()} pcs of {activeFingerling.name} ({activeFingerling.size_label})
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/40 text-sm">
            <div className="flex justify-between pb-2 border-b border-border/30">
              <span className="text-muted-foreground">Unit Price:</span>
              <span className="font-semibold text-foreground">₱{unitPrice.toFixed(2)} / pc</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border/30">
              <span className="text-muted-foreground">Size Stage:</span>
              <span className="font-semibold text-foreground">{activeFingerling.size_label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Available Stock:</span>
              <span className="font-semibold text-emerald-500">{activeFingerling.stock_count.toLocaleString()} pcs</span>
            </div>
          </div>

          <Link
            to={`/order-inquiry?fingerling=${encodeURIComponent(activeFingerling.name)}&quantity=${quantity}`}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 group"
          >
            <span>Place Order Inquiry</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
