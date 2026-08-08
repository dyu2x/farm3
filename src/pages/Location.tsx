import React, { useState } from 'react';
import { MapPin, Phone, Mail, Navigation, Clock, ExternalLink, Compass, ShieldAlert } from 'lucide-react';
import { SiteSettings } from '../types';

interface LocationProps {
  settings: SiteSettings;
}

export const Location: React.FC<LocationProps> = ({ settings }) => {
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const lat = settings.lat || 11.535766;
  const lng = settings.lng || 122.652221;
  const address = settings.address || 'Brgy. Cabugao, Ivisan, Capiz, Philippines';
  const phone = settings.phone || '+63 962 527 9820';
  const email = settings.email || 'support@mesina.farm';

  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const defaultNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const appleNavUrl = `https://maps.apple.com/?daddr=${lat},${lng}`;

  const handleUseMyLocation = () => {
    setLocating(true);
    setErrorMsg('');

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLoc({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocating(false);
      },
      err => {
        setErrorMsg('Unable to access location. Please enable location permissions in your browser settings.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const activeNavUrl = userLoc
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lng}&destination=${lat},${lng}`
    : defaultNavUrl;

  return (
    <div className="min-h-screen pt-28 pb-20">
      {/* HEADER BANNER */}
      <section className="py-12 text-center bg-card/20 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
            Farm Finder
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-foreground">
            Hatchery Location
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Visit Mesina Farms in Ivisan, Capiz for fingerling inspections, logistics pickup, and technical consultations.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* CONTACT INFO GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-3xl p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Farm Address</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{address}</p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Contact Hotline</h3>
            <p className="text-xs text-muted-foreground">
              <a href={`tel:${phone}`} className="hover:text-primary transition-colors font-medium">
                {phone}
              </a>
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Support Email</h3>
            <p className="text-xs text-muted-foreground">
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors font-medium">
                {email}
              </a>
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3">
            <div className="p-3 rounded-2xl bg-primary/20 text-primary w-fit">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-foreground">Visiting Hours</h3>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {settings.schedule || "Mon - Fri: 7:00 AM - 5:00 PM\nSaturday: By Appointment\nSunday: Closed"}
            </p>
          </div>
        </div>

        {/* MAP & GEOLOCATION SECTION */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Map Frame */}
          <div className="lg:col-span-8 glass-card rounded-3xl overflow-hidden border border-border/60 shadow-2xl relative min-h-[400px]">
            <iframe
              src={mapEmbedUrl}
              title="Mesina Farms Location"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[450px]"
            />
          </div>

          {/* Navigation Controls */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" /> Route Navigator
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Generate optimized turn-by-turn navigation directions directly to our hatchery entrance.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {userLoc && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs">
                ✓ Location acquired! Click below for customized route.
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleUseMyLocation}
                disabled={locating}
                className="w-full py-3 px-4 rounded-2xl glass font-semibold text-xs sm:text-sm text-foreground hover:ring-2 hover:ring-primary/40 transition-all flex items-center justify-center gap-2"
              >
                <Navigation className={`w-4 h-4 text-primary ${locating ? 'animate-spin' : ''}`} />
                <span>{locating ? 'Locating Your Position...' : 'Use My Current Location'}</span>
              </button>

              <a
                href={activeNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/25"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href={appleNavUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-2xl glass font-medium text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex items-center justify-center gap-2"
              >
                <span>Open in Apple Maps</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
