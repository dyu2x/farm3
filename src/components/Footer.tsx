import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Fish } from 'lucide-react';
import { SiteSettings } from '../types';
import { ImageWithFallback } from './ImageWithFallback';

interface FooterProps {
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  return (
    <footer className="bg-card/60 border-t border-border/50 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-primary/30">
                <ImageWithFallback
                  src={settings.logo_url}
                  alt={settings.farm_name}
                  className="w-full h-full"
                  fittingType="fill"
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight">
                Mesina <span className="text-primary">Farms</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium Clarias batrachus catfish hatchery and grower. Scientifically bred, sustainably raised fingerlings for aquaculture excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-primary transition-colors">
                  Fingerling Catalog
                </Link>
              </li>
              <li>
                <Link to="/fish-care" className="hover:text-primary transition-colors">
                  Fish Care & Guides
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-primary transition-colors">
                  Farm Location
                </Link>
              </li>
              <li>
                <Link to="/order-inquiry" className="hover:text-primary transition-colors">
                  Order Inquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Bio-Care & Hatchery */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
              Aquaculture Tech
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-primary shrink-0" />
                <span>Pure Clarias batrachus Strain</span>
              </li>
              <li className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-primary shrink-0" />
                <span>High FCR & Survival Rates</span>
              </li>
              <li className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-primary shrink-0" />
                <span>Oxygen-Rich Hatchery Flow</span>
              </li>
              <li className="flex items-center gap-2">
                <Fish className="w-4 h-4 text-primary shrink-0" />
                <span>Tiered Volume Pricing</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground">
              Farm Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-primary transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-primary transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {settings.farm_name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Powered by Bio-Precision Aquaculture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
