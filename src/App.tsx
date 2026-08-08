import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { FishCare } from './pages/FishCare';
import { Location } from './pages/Location';
import { OrderInquiry } from './pages/OrderInquiry';
import { Admin } from './pages/Admin';
import { NotFound } from './pages/NotFound';
import {
  defaultSiteSettings,
  defaultFingerlings,
  defaultArticles,
  defaultOrderInquiries,
  defaultSales
} from './data/initialData';
import { Fingerling, SiteSettings, OrderInquiry as OrderInquiryType, Sale } from './types';

// Scroll to top helper on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  // Fingerlings State
  const [fingerlings, setFingerlings] = useState<Fingerling[]>(() => {
    const saved = localStorage.getItem('mesina_fingerlings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultFingerlings;
  });

  // Settings State
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('mesina_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultSiteSettings;
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<OrderInquiryType[]>(() => {
    const saved = localStorage.getItem('mesina_inquiries');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultOrderInquiries;
  });

  // Sales State
  const [sales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('mesina_sales');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return defaultSales;
  });

  // Articles State
  const [articles] = useState(defaultArticles);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('mesina_fingerlings', JSON.stringify(fingerlings));
  }, [fingerlings]);

  useEffect(() => {
    localStorage.setItem('mesina_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mesina_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Handlers
  const handleUpdateFingerling = (updated: Fingerling) => {
    setFingerlings(prev => prev.map(f => (f.id === updated.id ? updated : f)));
  };

  const handleUpdateSettings = (updated: SiteSettings) => {
    setSettings(updated);
  };

  const handleAddInquiry = (newInquiry: Omit<OrderInquiryType, 'id' | 'created_date'>) => {
    const fullInquiry: OrderInquiryType = {
      ...newInquiry,
      id: `ord-${Date.now()}`,
      created_date: new Date().toISOString()
    };
    setInquiries(prev => [fullInquiry, ...prev]);
  };

  const handleUpdateInquiryStatus = (id: string, status: OrderInquiryType['status']) => {
    setInquiries(prev =>
      prev.map(inq => (inq.id === id ? { ...inq, status } : inq))
    );
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
          <Navbar settings={settings} />

          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    fingerlings={fingerlings}
                    articles={articles}
                    settings={settings}
                  />
                }
              />
              <Route
                path="/catalog"
                element={<Catalog fingerlings={fingerlings} />}
              />
              <Route
                path="/fish-care"
                element={<FishCare articles={articles} />}
              />
              <Route
                path="/location"
                element={<Location settings={settings} />}
              />
              <Route
                path="/order-inquiry"
                element={
                  <OrderInquiry
                    fingerlings={fingerlings}
                    onAddInquiry={handleAddInquiry}
                  />
                }
              />
              <Route
                path="/connect/admin"
                element={
                  <Admin
                    fingerlings={fingerlings}
                    settings={settings}
                    inquiries={inquiries}
                    sales={sales}
                    onUpdateFingerling={handleUpdateFingerling}
                    onUpdateSettings={handleUpdateSettings}
                    onUpdateInquiryStatus={handleUpdateInquiryStatus}
                  />
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer settings={settings} />
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}
