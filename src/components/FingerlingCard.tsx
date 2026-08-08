import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Fingerling } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface FingerlingCardProps {
  fingerling: Fingerling;
  index?: number;
}

export const FingerlingCard: React.FC<FingerlingCardProps> = ({ fingerling }) => {
  const [quantity, setQuantity] = useState<number>(1);

  const isLowStock = fingerling.stock_count <= fingerling.low_stock_threshold && fingerling.stock_count > 0;
  const isOutOfStock = fingerling.stock_count <= 0;

  const tiers = fingerling.price_tiers || [];

  const getTierInfo = () => {
    const qty = quantity || 0;
    if (qty <= 0 || tiers.length === 0) return null;
    const activeTier = tiers.find(t => qty >= t.min_qty && (!t.max_qty || qty <= t.max_qty));
    if (!activeTier) {
      // Fallback to highest tier if quantity exceeds all max_qty
      const highestTier = tiers[tiers.length - 1];
      return highestTier ? { price: Number(highestTier.price_per_unit), tier: highestTier } : null;
    }
    return { price: Number(activeTier.price_per_unit), tier: activeTier };
  };

  const currentTierInfo = getTierInfo();
  const unitPrice = currentTierInfo ? currentTierInfo.price : (tiers[0]?.price_per_unit || 0);
  const totalPrice = unitPrice * (quantity || 1);

  const handleQtyChange = (val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1) {
      setQuantity(1);
    } else {
      setQuantity(num);
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden flex flex-col group hover:ring-2 hover:ring-primary/40 transition-all duration-300">
      {/* Card Image Header */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={fingerling.image_url}
          alt={fingerling.name}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Size Badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
          {fingerling.size_label}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-medium backdrop-blur-md">
              <AlertTriangle className="w-3 h-3" /> Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 text-white text-xs font-medium backdrop-blur-md">
              <AlertTriangle className="w-3 h-3" /> Low Stock ({fingerling.stock_count.toLocaleString()})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-medium backdrop-blur-md">
              <CheckCircle2 className="w-3 h-3" /> {fingerling.stock_count.toLocaleString()} pcs
            </span>
          )}
        </div>

        {/* Name in Image Footer */}
        <div className="absolute bottom-3 left-4 right-4">
          <h3 className="text-xl font-bold text-white tracking-tight">{fingerling.name}</h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {fingerling.description}
        </p>

        {/* Tier Price Breakdown */}
        {tiers.length > 0 && (
          <div className="space-y-2 bg-muted/40 p-3 rounded-2xl border border-border/40 text-xs">
            <div className="text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
              Volume Pricing Tiers
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              {tiers.map((t, i) => {
                const isActive = currentTierInfo?.tier === t;
                return (
                  <div
                    key={i}
                    className={`py-1 px-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <div>{t.max_qty ? `${t.min_qty}-${t.max_qty}` : `${t.min_qty}+`}</div>
                    <div className="text-[11px]">₱{t.price_per_unit.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interactive Quantity & Price Display */}
        <div className="pt-2 border-t border-border/40 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground font-medium">Quantity</div>
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 100))}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                title="-100"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => handleQtyChange(e.target.value)}
                className="w-16 text-center text-xs font-bold bg-transparent focus:outline-none text-foreground"
              />
              <button
                type="button"
                onClick={() => setQuantity(prev => prev + 100)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                title="+100"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xs text-muted-foreground">Estimated Cost:</div>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">₱{totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-[10px] text-muted-foreground block">₱{unitPrice.toFixed(2)} / pc</span>
            </div>
          </div>
        </div>

        {/* Inquire Action Button */}
        <div className="mt-auto pt-2">
          <Link
            to={`/order-inquiry?fingerling=${encodeURIComponent(fingerling.name)}&quantity=${quantity}`}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all group/btn shadow-md hover:shadow-primary/25"
          >
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
