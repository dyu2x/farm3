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
  Upload,
  Check,
  Star,
  Search,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Fingerling, PriceTier, SiteSettings, OrderInquiry, Sale } from '../types';

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
  
  // Fingerling Editing State
  const [editingFingerling, setEditingFingerling] = useState<Fingerling | null>(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(settings);

  // Slideshow State
  const [newSlideUrl, setNewSlideUrl] = useState<string>('');

  // Inquiry Filter & Search State
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const [inquirySearch, setInquirySearch] = useState<string>('');

  // Toast message
  const [toastMsg, setToastMsg] = useState<string>('');

  const totalStock = fingerlings.reduce((acc, f) => acc + f.stock_count, 0);
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'pending').length;
  const confirmedInquiriesCount = inquiries.filter(i => i.status === 'confirmed').length;
  const completedInquiriesCount = inquiries.filter(i => i.status === 'completed').length;
  const totalRevenue = sales.reduce((acc, s) => acc + s.total_amount, 0);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Process File Upload to Data URL (Base64)
  const handleFileUpload = (file: File, callback: (dataUrl: string) => void) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        callback(e.target.result as string);
        showToast('Image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Fingerling Changes (including Price Tiers, Size, Stock, Image)
  const handleSaveFingerling = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFingerling) {
      onUpdateFingerling(editingFingerling);
      setEditingFingerling(null);
      showToast('Inventory & Pricing updated!');
    }
  };

  // Tier Editing Handlers inside Fingerling Modal
  const handleUpdateTier = (index: number, field: keyof PriceTier, value: any) => {
    if (!editingFingerling) return;
    const updatedTiers = [...editingFingerling.price_tiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: value
    };
    setEditingFingerling({
      ...editingFingerling,
      price_tiers: updatedTiers
    });
  };

  const handleAddPriceTier = () => {
    if (!editingFingerling) return;
    const lastTier = editingFingerling.price_tiers[editingFingerling.price_tiers.length - 1];
    const newMin = lastTier ? (lastTier.max_qty ? lastTier.max_qty + 1 : lastTier.min_qty + 1000) : 1;
    const newTier: PriceTier = {
      min_qty: newMin,
      max_qty: null,
      price_per_unit: lastTier ? Math.max(1, lastTier.price_per_unit - 0.5) : 3.0
    };
    setEditingFingerling({
      ...editingFingerling,
      price_tiers: [...editingFingerling.price_tiers, newTier]
    });
  };

  const handleRemovePriceTier = (index: number) => {
    if (!editingFingerling) return;
    if (editingFingerling.price_tiers.length <= 1) {
      alert('Each stage must have at least one pricing tier.');
      return;
    }
    const updatedTiers = editingFingerling.price_tiers.filter((_, i) => i !== index);
    setEditingFingerling({
      ...editingFingerling,
      price_tiers: updatedTiers
    });
  };

  // Save Farm Site Settings (Address, Phone, Email, Schedule, Titles)
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    showToast('Farm information & settings updated!');
  };

  // Slideshow Handlers
  const handleAddSlidePhoto = (photoUrl: string) => {
    if (!photoUrl.trim()) return;
    const currentSlides = settingsForm.about_images || [settingsForm.about_image_url];
    const updatedSlides = [...currentSlides, photoUrl.trim()];
    const updated = {
      ...settingsForm,
      about_images: updatedSlides,
      about_image_url: updatedSlides[0] || settingsForm.about_image_url
    };
    setSettingsForm(updated);
    onUpdateSettings(updated);
    setNewSlideUrl('');
    showToast('New photo added to About slideshow!');
  };

  const handleRemoveSlidePhoto = (index: number) => {
    const currentSlides = settingsForm.about_images || [settingsForm.about_image_url];
    if (currentSlides.length <= 1) {
      alert('You must keep at least one photo in the About slideshow.');
      return;
    }
    const updatedSlides = currentSlides.filter((_, idx) => idx !== index);
    const updated = {
      ...settingsForm,
      about_images: updatedSlides,
      about_image_url: updatedSlides[0]
    };
    setSettingsForm(updated);
    onUpdateSettings(updated);
    showToast('Slideshow photo removed.');
  };

  const handleSetPrimaryPhoto = (index: number) => {
    const currentSlides = settingsForm.about_images || [settingsForm.about_image_url];
    const selected = currentSlides[index];
    const updatedSlides = [selected, ...currentSlides.filter((_, idx) => idx !== index)];
    const updated = {
      ...settingsForm,
      about_images: updatedSlides,
      about_image_url: selected
    };
    setSettingsForm(updated);
    onUpdateSettings(updated);
    showToast('Primary cover photo set!');
  };

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
    const searchLower = inquirySearch.toLowerCase();
    const matchesSearch =
      !inquirySearch ||
      inq.customer_name.toLowerCase().includes(searchLower) ||
      inq.email.toLowerCase().includes(searchLower) ||
      inq.phone.toLowerCase().includes(searchLower) ||
      inq.fingerling_name.toLowerCase().includes(searchLower) ||
      (inq.message && inq.message.toLowerCase().includes(searchLower));
    return matchesStatus && matchesSearch;
  });

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory & Pricing', icon: Package },
    { id: 'inquiries', label: `Inquiries (${pendingInquiriesCount})`, icon: ShoppingBag },
    { id: 'images', label: 'Image Manager', icon: ImageIcon },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Farm Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-foreground">Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Manage inventory, pricing tiers, farm schedule, site image assets, and order inquiries.
            </p>
          </div>

          {toastMsg && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-bold animate-fade-in shadow-lg">
              <Check className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}
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
                <div className="text-xs font-semibold text-muted-foreground">Total Stock Count</div>
                <div className="text-3xl font-extrabold text-primary">{totalStock.toLocaleString()} pcs</div>
                <div className="text-[11px] text-emerald-500 font-medium">Across {fingerlings.length} size stages</div>
              </div>

              <div className="glass-card rounded-3xl p-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Pending Inquiries</div>
                <div className="text-3xl font-extrabold text-amber-500">{pendingInquiriesCount}</div>
                <div className="text-[11px] text-muted-foreground">Requires response</div>
              </div>

              <div className="glass-card rounded-3xl p-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Confirmed Orders</div>
                <div className="text-3xl font-extrabold text-emerald-500">{confirmedInquiriesCount + completedInquiriesCount}</div>
                <div className="text-[11px] text-muted-foreground">Active & Completed</div>
              </div>

              <div className="glass-card rounded-3xl p-6 space-y-2">
                <div className="text-xs font-semibold text-muted-foreground">Total Sales Revenue</div>
                <div className="text-3xl font-extrabold text-accent">₱{totalRevenue.toLocaleString()}</div>
                <div className="text-[11px] text-muted-foreground">{sales.length} logged sales</div>
              </div>
            </div>

            {/* Quick Farm Info Summary */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground">Current Farm Information</h3>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>Address</span>
                  </span>
                  <p className="font-medium text-foreground">{settings.address}</p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>Contact Number & Email</span>
                  </span>
                  <p className="font-medium text-foreground">{settings.phone}</p>
                  <p className="text-[11px] text-muted-foreground">{settings.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-muted/30 border border-border/40 space-y-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>Schedule / Hours</span>
                  </span>
                  <p className="font-medium text-foreground whitespace-pre-line">{settings.schedule || 'Mon - Fri: 7:00 AM - 5:00 PM\nSat: By Appointment\nSun: Closed'}</p>
                </div>
              </div>
            </div>

            {/* Recent Order Inquiries Preview */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-foreground">Recent Order Inquiries</h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View All ({inquiries.length}) →
                </button>
              </div>

              <div className="divide-y divide-border/40">
                {inquiries.slice(0, 5).map(inq => (
                  <div key={inq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                    <div>
                      <div className="font-bold text-foreground">{inq.customer_name}</div>
                      <div className="text-muted-foreground">{inq.fingerling_name} • {inq.quantity?.toLocaleString()} pcs</div>
                      <div className="text-[11px] text-muted-foreground">{inq.email} | {inq.phone}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                        inq.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' :
                        inq.status === 'completed' ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30' :
                        inq.status === 'pending' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-muted text-muted-foreground'
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
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Fingerling Inventory & Volume Pricing</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update sizes, stock levels, photos, and tier prices (₱ per unit based on quantity thresholds).
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {fingerlings.map(f => (
                <div key={f.id} className="glass-card rounded-3xl p-6 space-y-4 relative">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/60 shrink-0 bg-black/20">
                        <img src={f.image_url} alt={f.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{f.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                          {f.size_label}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditingFingerling({ ...f, price_tiers: [...f.price_tiers] })}
                      className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-md"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit & Prices</span>
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>

                  <div className="flex justify-between items-center text-xs bg-muted/40 p-3 rounded-2xl border border-border/40">
                    <span>Stock: <strong className="text-foreground">{f.stock_count.toLocaleString()} pcs</strong></span>
                    <span>Low Stock Alert: <strong className="text-amber-500">{f.low_stock_threshold.toLocaleString()} pcs</strong></span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
                      Volume Tier Prices (₱ / pc)
                    </div>
                    {f.price_tiers.map((t, i) => (
                      <div key={i} className="flex justify-between text-muted-foreground bg-card/60 px-3 py-1.5 rounded-xl border border-border/30">
                        <span>{t.max_qty ? `${t.min_qty.toLocaleString()} - ${t.max_qty.toLocaleString()} pcs` : `${t.min_qty.toLocaleString()}+ pcs`}:</span>
                        <span className="font-extrabold text-primary">₱{t.price_per_unit.toFixed(2)} / pc</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* EDIT FINGERLING & TIER PRICING MODAL */}
            {editingFingerling && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setEditingFingerling(null)} />
                <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 animate-scale-in max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4">
                    <h3 className="text-xl font-bold text-foreground">
                      Edit {editingFingerling.name}
                    </h3>
                    <button
                      onClick={() => setEditingFingerling(null)}
                      className="text-xs font-bold text-muted-foreground hover:text-foreground p-2 rounded-xl glass"
                    >
                      ✕ Close
                    </button>
                  </div>

                  <form onSubmit={handleSaveFingerling} className="space-y-5 text-xs sm:text-sm">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-muted-foreground font-semibold mb-1">Stage Name</label>
                        <input
                          type="text"
                          value={editingFingerling.name}
                          onChange={e => setEditingFingerling({ ...editingFingerling, name: e.target.value })}
                          className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-semibold mb-1">Size Label (e.g. 2-3 cm)</label>
                        <input
                          type="text"
                          value={editingFingerling.size_label}
                          onChange={e => setEditingFingerling({ ...editingFingerling, size_label: e.target.value })}
                          className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-muted-foreground font-semibold mb-1">Stock Count (pcs)</label>
                        <input
                          type="number"
                          value={editingFingerling.stock_count}
                          onChange={e => setEditingFingerling({ ...editingFingerling, stock_count: parseInt(e.target.value) || 0 })}
                          className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-semibold mb-1">Low Stock Threshold</label>
                        <input
                          type="number"
                          value={editingFingerling.low_stock_threshold}
                          onChange={e => setEditingFingerling({ ...editingFingerling, low_stock_threshold: parseInt(e.target.value) || 0 })}
                          className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-muted-foreground font-semibold mb-1">Description</label>
                      <textarea
                        value={editingFingerling.description}
                        onChange={e => setEditingFingerling({ ...editingFingerling, description: e.target.value })}
                        rows={2}
                        className="w-full p-3 rounded-xl bg-muted border border-border text-foreground text-xs leading-relaxed"
                      />
                    </div>

                    {/* Image Upload & Replacement */}
                    <div>
                      <label className="block text-muted-foreground font-semibold mb-1">Fingerling Photo</label>
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-2xl bg-muted/30 border border-border/40">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-border/60 shrink-0 bg-black/20">
                          <img src={editingFingerling.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-2 w-full">
                          <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:bg-primary/90 transition-all shadow-md">
                            <Upload className="w-4 h-4" />
                            <span>Upload New Photo File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, (url) => {
                                    setEditingFingerling({ ...editingFingerling, image_url: url });
                                  });
                                }
                              }}
                            />
                          </label>
                          <input
                            type="text"
                            placeholder="Or paste image URL"
                            value={editingFingerling.image_url}
                            onChange={e => setEditingFingerling({ ...editingFingerling, image_url: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-card border border-border text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Price Tiers Manager */}
                    <div className="space-y-3 pt-2 border-t border-border/40">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-foreground">Volume Pricing Tiers (₱)</h4>
                          <p className="text-[11px] text-muted-foreground">Set quantity minimums, maximums, and price per unit.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddPriceTier}
                          className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-primary hover:bg-muted flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Tier</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {editingFingerling.price_tiers.map((tier, idx) => (
                          <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-3 rounded-2xl bg-muted/40 border border-border/40 text-xs">
                            <div className="flex-1 min-w-[80px]">
                              <label className="text-[10px] text-muted-foreground block mb-0.5">Min Qty</label>
                              <input
                                type="number"
                                value={tier.min_qty}
                                onChange={e => handleUpdateTier(idx, 'min_qty', parseInt(e.target.value) || 0)}
                                className="w-full p-2 rounded-xl bg-card border border-border text-foreground font-medium"
                              />
                            </div>

                            <div className="flex-1 min-w-[80px]">
                              <label className="text-[10px] text-muted-foreground block mb-0.5">Max Qty (leave blank for unlimited)</label>
                              <input
                                type="number"
                                placeholder="Unlimited"
                                value={tier.max_qty !== null ? tier.max_qty : ''}
                                onChange={e => handleUpdateTier(idx, 'max_qty', e.target.value === '' ? null : parseInt(e.target.value))}
                                className="w-full p-2 rounded-xl bg-card border border-border text-foreground font-medium"
                              />
                            </div>

                            <div className="flex-1 min-w-[100px]">
                              <label className="text-[10px] text-muted-foreground block mb-0.5">Price / Unit (₱)</label>
                              <input
                                type="number"
                                step="0.01"
                                value={tier.price_per_unit}
                                onChange={e => handleUpdateTier(idx, 'price_per_unit', parseFloat(e.target.value) || 0)}
                                className="w-full p-2 rounded-xl bg-card border border-border font-bold text-primary"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemovePriceTier(idx)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all self-end mb-0.5"
                              title="Delete Tier"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingFingerling(null)}
                        className="flex-1 py-3 rounded-2xl glass font-bold text-muted-foreground hover:text-foreground"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-lg hover:bg-primary/90"
                      >
                        Save Fingerling & Prices
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INQUIRIES & ORDER TRACKING */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Order Inquiries & Customer Tracking</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Track buyer requests, update status (Pending, Confirmed, Completed, Cancelled), and view customer contact info.
                </p>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="glass-card rounded-3xl p-4 sm:p-6 space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by customer, email, phone..."
                    value={inquirySearch}
                    onChange={e => setInquirySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-muted/60 border border-border/40 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Filter Badges */}
                <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: `All (${inquiries.length})` },
                    { id: 'pending', label: `Pending (${pendingInquiriesCount})` },
                    { id: 'confirmed', label: `Confirmed (${confirmedInquiriesCount})` },
                    { id: 'completed', label: `Completed (${completedInquiriesCount})` },
                    { id: 'cancelled', label: `Cancelled` }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setInquiryStatusFilter(f.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        inquiryStatusFilter === f.id
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'glass text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inquiries Cards List */}
            <div className="space-y-4">
              {filteredInquiries.length === 0 ? (
                <div className="glass-card rounded-3xl p-12 text-center text-muted-foreground space-y-2">
                  <ShoppingBag className="w-8 h-8 mx-auto text-primary/60" />
                  <p className="font-semibold text-sm">No inquiries match the selected filter.</p>
                </div>
              ) : (
                filteredInquiries.map(inq => (
                  <div key={inq.id} className="glass-card rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-foreground">{inq.customer_name}</h3>
                          <span className="text-xs text-muted-foreground">({new Date(inq.created_date).toLocaleDateString()})</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-primary" /> {inq.email}</span>
                          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-primary" /> {inq.phone}</span>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-muted-foreground mr-1">Status:</span>
                        {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => {
                              onUpdateInquiryStatus(inq.id, st);
                              showToast(`Inquiry marked as ${st}`);
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition-all ${
                              inq.status === st
                                ? st === 'confirmed' ? 'bg-emerald-500 text-white shadow-md'
                                  : st === 'completed' ? 'bg-blue-500 text-white shadow-md'
                                  : st === 'pending' ? 'bg-amber-500 text-white shadow-md'
                                  : 'bg-rose-500 text-white shadow-md'
                                : 'glass text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                        <span className="text-muted-foreground font-medium">Requested Fingerling Stage</span>
                        <div className="font-bold text-sm text-foreground">{inq.fingerling_name}</div>
                        <div className="text-primary font-bold text-xs">{inq.quantity?.toLocaleString() || 'Custom'} pcs requested</div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/40 space-y-1">
                        <span className="text-muted-foreground font-medium">Customer Message / Inquiry Notes</span>
                        <p className="text-foreground italic leading-relaxed">
                          "{inq.message || 'No additional notes provided.'}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: IMAGE MANAGER */}
        {activeTab === 'images' && (
          <div className="space-y-8 animate-fade-in">
            {/* Core Site Image Assets */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-foreground">Core Site Image Assets</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload new images or paste URLs to update your hero header, farm logo, and main cover image.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {/* Hero Banner Upload */}
                <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">Hero Banner</label>
                    <span className="text-[10px] text-muted-foreground">Header background</span>
                  </div>
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border/60 bg-black/20">
                    <img src={settingsForm.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:bg-primary/90 transition-all shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload Hero Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => {
                              const updated = { ...settingsForm, hero_image_url: url };
                              setSettingsForm(updated);
                              onUpdateSettings(updated);
                            });
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={settingsForm.hero_image_url}
                      onChange={e => {
                        const updated = { ...settingsForm, hero_image_url: e.target.value };
                        setSettingsForm(updated);
                        onUpdateSettings(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-card border border-border text-[11px]"
                    />
                  </div>
                </div>

                {/* Farm Logo Upload */}
                <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">Farm Logo</label>
                    <span className="text-[10px] text-muted-foreground">Navbar & Footer</span>
                  </div>
                  <div className="aspect-square w-28 mx-auto rounded-full overflow-hidden border-2 border-primary/40 bg-black/20 p-1">
                    <img src={settingsForm.logo_url} alt="Logo" className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:bg-primary/90 transition-all shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => {
                              const updated = { ...settingsForm, logo_url: url };
                              setSettingsForm(updated);
                              onUpdateSettings(updated);
                            });
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Logo URL"
                      value={settingsForm.logo_url}
                      onChange={e => {
                        const updated = { ...settingsForm, logo_url: e.target.value };
                        setSettingsForm(updated);
                        onUpdateSettings(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-card border border-border text-[11px]"
                    />
                  </div>
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-3 p-4 rounded-2xl bg-muted/30 border border-border/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-foreground">Primary Cover</label>
                    <span className="text-[10px] text-muted-foreground">About section cover</span>
                  </div>
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-border/60 bg-black/20">
                    <img src={settingsForm.about_image_url} alt="About Cover" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2">
                    <label className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer hover:bg-primary/90 transition-all shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Upload Cover Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(file, (url) => {
                              const updated = { ...settingsForm, about_image_url: url };
                              setSettingsForm(updated);
                              onUpdateSettings(updated);
                            });
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Cover Image URL"
                      value={settingsForm.about_image_url}
                      onChange={e => {
                        const updated = { ...settingsForm, about_image_url: e.target.value };
                        setSettingsForm(updated);
                        onUpdateSettings(updated);
                      }}
                      className="w-full p-2 rounded-xl bg-card border border-border text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About Mesina Farms Slideshow Manager */}
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <span>About Mesina Farms Slideshow Photos</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload new images or paste links to add photos to the interactive gallery slideshow on the Home page.
                  </p>
                </div>

                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer hover:bg-primary/90 shadow-md transition-all self-start sm:self-auto">
                  <Upload className="w-4 h-4" />
                  <span>Upload New Photo to Slideshow</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => {
                          handleAddSlidePhoto(url);
                        });
                      }
                    }}
                  />
                </label>
              </div>

              {/* Add via URL input bar */}
              <div className="flex gap-2 bg-muted/40 p-2 rounded-2xl border border-border/40">
                <input
                  type="text"
                  placeholder="Or enter image URL (e.g. https://...)"
                  value={newSlideUrl}
                  onChange={e => setNewSlideUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-transparent text-xs text-foreground focus:outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => handleAddSlidePhoto(newSlideUrl)}
                  className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold hover:bg-muted transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>Add URL</span>
                </button>
              </div>

              {/* Slideshow Photo Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(settingsForm.about_images || [settingsForm.about_image_url]).map((photoUrl, idx) => {
                  const isCover = photoUrl === settingsForm.about_image_url || idx === 0;
                  return (
                    <div key={idx} className="group relative rounded-2xl overflow-hidden border border-border/60 bg-card shadow-lg flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden bg-black/20">
                        <img src={photoUrl} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                        
                        {isCover && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-current" />
                            Primary Cover
                          </span>
                        )}

                        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="p-3 bg-muted/30 flex items-center justify-between gap-2">
                        {!isCover ? (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryPhoto(idx)}
                            className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                          >
                            <Star className="w-3 h-3" />
                            Set as Cover
                          </button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground font-medium">Cover Photo</span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleRemoveSlidePhoto(idx)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-all"
                          title="Remove from Slideshow"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SALES LOG */}
        {activeTab === 'sales' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-foreground">Completed Sales Record</h3>
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

        {/* TAB 6: FARM SETTINGS & SCHEDULE */}
        {activeTab === 'settings' && (
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl animate-fade-in">
            <div>
              <h3 className="text-xl font-bold text-foreground">Modify Farm Information & Schedule</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Update farm schedule/visiting hours, address, contact phone, email, and farm branding details.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Farm Name</label>
                  <input
                    type="text"
                    value={settingsForm.farm_name}
                    onChange={e => setSettingsForm({ ...settingsForm, farm_name: e.target.value })}
                    className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={settingsForm.hero_title}
                    onChange={e => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Farm Address</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Contact Phone Number</label>
                  <input
                    type="text"
                    value={settingsForm.phone}
                    onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-semibold mb-1">Support Email Address</label>
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">
                  Visiting Schedule & Hours (Displayed on Location page & Footer)
                </label>
                <textarea
                  value={settingsForm.schedule || 'Mon - Fri: 7:00 AM - 5:00 PM\nSaturday: By Appointment\nSunday: Closed'}
                  onChange={e => setSettingsForm({ ...settingsForm, schedule: e.target.value })}
                  rows={4}
                  className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium leading-relaxed"
                  placeholder="e.g. Mon - Fri: 7:00 AM - 5:00 PM&#10;Saturday: By Appointment&#10;Sunday: Closed"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Tip: Put each schedule line on a new line.
                </p>
              </div>

              <div>
                <label className="block text-muted-foreground font-semibold mb-1">Hero Subtitle</label>
                <textarea
                  value={settingsForm.hero_subtitle}
                  onChange={e => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-muted border border-border text-foreground font-medium leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 px-8 rounded-2xl bg-primary text-primary-foreground font-extrabold shadow-lg hover:bg-primary/90 transition-all"
              >
                Save Farm Settings
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
