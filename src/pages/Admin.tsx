import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Image as ImageIcon,
  ShoppingBag,
  TrendingUp,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Fingerling, SiteSettings, OrderInquiry, Sale } from '../types';

interface AdminProps {
  fingerlings: Fingerling[];
  settings: SiteSettings;
  inquiries: OrderInquiry[];
  sales: Sale[];
  onUpdateFingerling: (fingerling: Fingerling) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
  onUpdateInquiryStatus: (id: string, status: OrderInquiry['status']) => void;
}

export const Admin: React.FC<AdminProps> = ({
  fingerlings,
  settings,
  inquiries,
  sales,
  onUpdateFingerling,
  onUpdateSettings,
  onUpdateInquiryStatus
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [editingFingerling, setEditingFingerling] = useState<Fingerling | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);

  const totalStock = fingerlings.reduce((acc, f) => acc + f.stock_count, 0);
  const pendingOrders = inquiries.filter(i => i.status === 'pending').length;
  const totalRevenue = sales.reduce((acc, s) => acc + s.total_amount, 0);

  const handleSaveFingerling = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFingerling) {
      onUpdateFingerling(editingFingerling);
      setEditingFingerling(null);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory & Pricing', icon: Package },
    { id: 'images', label: 'Image Manager', icon: ImageIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage hatchery inventory, pricing tiers, order inquiries, and site configuration.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-4 mb-8 border-b border-border/40 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'glass text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card rounded-3xl p-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Total Fingerling Stock</div>
                <div className="text-3xl font-extrabold text-primary">{totalStock.toLocaleString()}</div>
                <div className="text-[11px] text-emerald-500 font-medium">Across {fingerlings.length} stages</div>
              </div>

              <div className="glass-card rounded-3xl p-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Pending Inquiries</div>
                <div className="text-3xl font-extrabold text-amber-500">{pendingOrders}</div>
                <div className="text-[11px] text-muted-foreground">Awaiting response</div>
              </div>

              <div className="glass-card rounded-3xl p-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Recorded Revenue</div>
                <div className="text-3xl font-extrabold text-emerald-500">₱{totalRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-muted-foreground">{sales.length} completed sales</div>
              </div>

              <div className="glass-card rounded-3xl p-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Hatchery Status</div>
                <div className="text-3xl font-extrabold text-accent">Active</div>
                <div className="text-[11px] text-muted-foreground">Ivisan, Capiz Facility</div>
              </div>
            </div>

            {/* Recent Inquiries List */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-lg text-foreground">Recent Order Inquiries</h3>
              <div className="divide-y divide-border/40">
                {inquiries.map(inq => (
                  <div key={inq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm">
                    <div>
                      <div className="font-bold text-foreground">{inq.customer_name}</div>
                      <div className="text-muted-foreground">{inq.fingerling_name} • {inq.quantity?.toLocaleString()} pcs</div>
                      <div className="text-[11px] text-muted-foreground">{inq.email} | {inq.phone}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                        inq.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500' :
                        inq.status === 'completed' ? 'bg-blue-500/20 text-blue-500' :
                        inq.status === 'pending' ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY & PRICING */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {fingerlings.map(f => (
                <div key={f.id} className="glass-card rounded-3xl p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{f.name}</h3>
                      <p className="text-xs text-primary font-semibold">{f.size_label}</p>
                    </div>
                    <button
                      onClick={() => setEditingFingerling(f)}
                      className="p-2 rounded-xl glass hover:bg-muted text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{f.description}</p>

                  <div className="flex justify-between items-center text-xs bg-muted/40 p-3 rounded-2xl">
                    <span>Stock Count: <strong className="text-foreground">{f.stock_count.toLocaleString()} pcs</strong></span>
                    <span>Low Stock Threshold: <strong className="text-amber-500">{f.low_stock_threshold.toLocaleString()} pcs</strong></span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="font-semibold text-muted-foreground uppercase text-[10px]">Tier Prices</div>
                    {f.price_tiers.map((t, i) => (
                      <div key={i} className="flex justify-between text-muted-foreground">
                        <span>{t.max_qty ? `${t.min_qty} - ${t.max_qty} pcs` : `${t.min_qty}+ pcs`}:</span>
                        <span className="font-bold text-primary">₱{t.price_per_unit.toFixed(2)} / pc</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Modal */}
            {editingFingerling && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditingFingerling(null)} />
                <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl z-10 space-y-4 animate-scale-in max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold text-foreground">Edit Fingerling: {editingFingerling.name}</h3>
                  <form onSubmit={handleSaveFingerling} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-muted-foreground font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={editingFingerling.name}
                        onChange={e => setEditingFingerling({ ...editingFingerling, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-muted border border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground font-medium mb-1">Size Label</label>
                      <input
                        type="text"
                        value={editingFingerling.size_label}
                        onChange={e => setEditingFingerling({ ...editingFingerling, size_label: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-muted border border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground font-medium mb-1">Stock Count</label>
                      <input
                        type="number"
                        value={editingFingerling.stock_count}
                        onChange={e => setEditingFingerling({ ...editingFingerling, stock_count: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 rounded-xl bg-muted border border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-muted-foreground font-medium mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingFingerling.image_url}
                        onChange={e => setEditingFingerling({ ...editingFingerling, image_url: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-muted border border-border"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingFingerling(null)}
                        className="flex-1 py-2.5 rounded-xl glass font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: IMAGE MANAGER */}
        {activeTab === 'images' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-foreground">Hatchery Image Assets</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Hero Banner</label>
                <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border/50">
                  <img src={settings.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">Farm Logo</label>
                <div className="aspect-square w-24 rounded-2xl overflow-hidden border border-border/50">
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground">About Image</label>
                <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border/50">
                  <img src={settings.about_image_url} alt="About" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Inquiries & Orders</h3>
            <div className="space-y-4">
              {inquiries.map(inq => (
                <div key={inq.id} className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-foreground">{inq.customer_name}</span> ({inq.email} | {inq.phone})
                    </div>
                    <div className="flex gap-2">
                      {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(st => (
                        <button
                          key={st}
                          onClick={() => onUpdateInquiryStatus(inq.id, st)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${
                            inq.status === st ? 'bg-primary text-primary-foreground' : 'glass text-muted-foreground'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Item: <strong className="text-foreground">{inq.fingerling_name}</strong> • Quantity: <strong className="text-foreground">{inq.quantity?.toLocaleString()} pcs</strong>
                  </div>
                  {inq.message && <p className="text-xs italic text-muted-foreground bg-card/40 p-3 rounded-xl">"{inq.message}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SALES ANALYTICS */}
        {activeTab === 'sales' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-bold text-foreground">Completed Sales Log</h3>
            <div className="space-y-3">
              {sales.map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-muted/30 border border-border/40 flex justify-between items-center text-xs sm:text-sm">
                  <div>
                    <div className="font-bold text-foreground">{s.customer_name}</div>
                    <div className="text-muted-foreground">{s.fingerling_name} • {s.quantity.toLocaleString()} pcs</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-500">₱{s.total_amount.toLocaleString()}</div>
                    <div className="text-[11px] text-muted-foreground">{s.sale_date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl">
            <h3 className="text-xl font-bold text-foreground">Site & Farm Settings</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Farm Name</label>
                <input
                  type="text"
                  value={settingsForm.farm_name}
                  onChange={e => setSettingsForm({ ...settingsForm, farm_name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-muted border border-border"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Hero Title</label>
                <input
                  type="text"
                  value={settingsForm.hero_title}
                  onChange={e => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                  className="w-full p-3 rounded-xl bg-muted border border-border"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full p-3 rounded-xl bg-muted border border-border"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-muted border border-border"
                />
              </div>
              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full p-3 rounded-xl bg-muted border border-border"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg"
              >
                Save Site Settings
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
