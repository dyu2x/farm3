import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Fish, Droplets, ShieldCheck, Activity, MapPin, Phone } from 'lucide-react';
import { Fingerling, BlogArticle, SiteSettings } from '../types';
import { FingerlingCard } from '../components/FingerlingCard';
import { OrderCalculator } from '../components/OrderCalculator';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { AboutSlideshow } from '../components/AboutSlideshow';

interface HomeProps {
  fingerlings: Fingerling[];
  articles: BlogArticle[];
  settings: SiteSettings;
}

export const Home: React.FC<HomeProps> = ({ fingerlings, articles, settings }) => {
  const featuredArticles = articles.slice(0, 3);

  const stats = [
    { icon: Fish, label: 'Fingerling Stages', value: '4+' },
    { icon: Droplets, label: 'Water Quality', value: '98%' },
    { icon: ShieldCheck, label: 'Survival Rate', value: '95%' },
    { icon: Activity, label: 'Annual Output', value: '500K+' }
  ];

  return (
    <div className="overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={settings.hero_image_url}
            alt="Clarias batrachus hatchery"
            className="w-full h-full"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 to-transparent" />
        </div>

        {/* Ambient floating dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2.5 h-2.5 rounded-full bg-primary/25 animate-float"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${5 + i}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-xs sm:text-sm border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
            <span className="text-muted-foreground font-medium">Clarias batrachus Hatchery & Grower</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="hydro-text">{settings.hero_title}</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {settings.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:scale-105"
            >
              <span>View Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/order-inquiry"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl glass font-semibold text-foreground hover:ring-2 hover:ring-primary/40 transition-all hover:scale-105"
            >
              Place Order Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-12 border-y border-border/40 bg-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-6 text-center hover:ring-2 hover:ring-primary/30 transition-all"
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-extrabold hydro-text">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GROWTH-STAGE CATALOG GRID */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
              Growth-Stage Catalog
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-foreground">
              Premium Fingerling Stages
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Each Clarias batrachus growth stage is meticulously cultivated with scientific precision — from starter fingerlings to jumbo stockers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fingerlings.map((f, i) => (
              <FingerlingCard key={f.id} fingerling={f} index={i} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* INSTANT CALCULATOR SECTION */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
              Instant Quote
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-foreground">
              Calculate Your Order
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Select a fingerling stage and quantity to instantly see volume-based tier pricing and your total cost.
            </p>
          </div>

          <OrderCalculator fingerlings={fingerlings} />
        </div>
      </section>

      {/* ABOUT MESINA FARMS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AboutSlideshow
              images={settings.about_images && settings.about_images.length > 0 ? settings.about_images : [settings.about_image_url]}
              title={settings.farm_name}
            />

            <div className="space-y-6">
              <div className="text-xs uppercase tracking-widest text-primary font-bold">
                About Mesina Farms
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                The Science of Living Inventory
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                At Mesina Farms, we transform traditional catfish aquaculture into a high-performance biological science. Our Clarias batrachus are raised in pristine, oxygen-rich environments with continuous water quality monitoring.
              </p>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                From delicate starter fingerlings to robust jumbo stockers, every growth stage is managed with precision to ensure optimal health, rapid growth, and exceptional survival rates.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {[
                  { icon: Droplets, label: 'Pristine Water Systems' },
                  { icon: ShieldCheck, label: 'Bio-Secure Facilities' },
                  { icon: Fish, label: 'Pure Clarias batrachus' },
                  { icon: Activity, label: 'Data-Driven Growth' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
                    <item.icon className="w-4 h-4 text-primary shrink-0" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLES */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-widest text-primary font-bold mb-2">
              Bio-Care Knowledge Base
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-foreground">
              Featured Fish Care Articles
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map(article => (
              <Link
                key={article.id}
                to="/fish-care"
                className="block glass-card rounded-3xl overflow-hidden group hover:ring-2 hover:ring-primary/40 transition-all duration-300"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <ImageWithFallback
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary/80 text-primary-foreground text-xs font-semibold">
                    {article.category}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base sm:text-lg line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="pt-2 text-xs text-muted-foreground font-medium flex items-center justify-between">
                    <span>{article.read_time}</span>
                    <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATION CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card rounded-3xl p-8 sm:p-12 border border-border/60 shadow-2xl space-y-4">
            <MapPin className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">Visit Our Hatchery</h2>
            <p className="text-muted-foreground text-sm sm:text-base">{settings.address}</p>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> {settings.phone}
            </p>
            <div className="pt-4">
              <Link
                to="/location"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 hover:scale-105"
              >
                <span>Get Directions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
