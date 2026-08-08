import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Package, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { Fingerling } from '../types';
import { FingerlingCard } from '../components/FingerlingCard';

interface CatalogProps {
  fingerlings: Fingerling[];
}

export const Catalog: React.FC<CatalogProps> = ({ fingerlings }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const filteredFingerlings = fingerlings.filter(f => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.size_label.toLowerCase().includes(q)
    );
  });

  const totalStock = fingerlings.reduce((acc, f) => acc + f.stock_count, 0);

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* HEADER BANNER */}
      <section className="py-12 text-center bg-card/20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Growth-Stage Catalog
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
            Fingerling Catalog
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Browse our premium Clarias batrachus growth stages with real-time stock availability and tiered pricing.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl glass border border-border/50">
              <Layers className="w-4 h-4 text-primary" />
              <span>{fingerlings.length} Growth Stages</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl glass border border-border/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{totalStock.toLocaleString()} Total Stock Available</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl glass border border-border/50">
              <Package className="w-4 h-4 text-accent" />
              <span>Direct Farm Hatchery Supply</span>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY SEARCH BAR */}
      <section className="sticky top-20 z-30 py-4 glass-nav border-b border-border/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, size (e.g. 2-3 cm), or stage..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 rounded-2xl bg-muted/60 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* CATALOG GRID */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredFingerlings.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-3xl p-8 max-w-md mx-auto">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No fingerling stages found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              No results matching "{searchQuery}". Try searching for standard terms like Starter, Grow-out, or Stocker.
            </p>
            <button
              onClick={handleClear}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
            >
              Reset Search Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFingerlings.map((f, i) => (
              <FingerlingCard key={f.id} fingerling={f} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
