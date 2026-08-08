import { Fingerling, BlogArticle, SiteSettings, OrderInquiry, Sale } from '../types';

export const defaultSiteSettings: SiteSettings = {
  id: "6a761e8b766d388f5d359488",
  farm_name: "Mesina Farms",
  hero_title: "Aquaculture Bio-Precision",
  hero_subtitle: "Scientifically bred, sustainably raised premium catfish fingerlings. From hatchery to harvest — engineered for vitality.",
  address: "Brgy. Cabugao, Ivisan, Capiz, Philippines",
  phone: "+63 962 527 9820",
  email: "support@mesina.farm",
  lat: 11.535766,
  lng: 122.652221,
  hero_image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png",
  logo_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/b90195dea_ChatGPTImageJul112026at01_54_57PM.png",
  about_image_url: "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg",
  about_images: [
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/05615daa2_fishpon.jpg",
    "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/8578c9fb0_generated_18cb20b1.png",
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg",
    "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/019d7bdf3_generated_95e4fe92.png",
    "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg"
  ],
  schedule: "Mon - Fri: 7:00 AM - 5:00 PM\nSaturday: By Appointment\nSunday: Closed"
};

export const defaultFingerlings: Fingerling[] = [
  {
    id: "6a761e8bdb8dd58c561a10cf",
    name: "Starter Fingerlings",
    size_label: "2-3 cm",
    stock_count: 50000,
    low_stock_threshold: 5000,
    sort_order: 1,
    description: "Newly hatched Clarias batrachus fingerlings, ideal for starting your own grow-out ponds. Highest quality, disease-free stock with proven genetics.",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/7bcb46f1c_generated_dc7ba010.png",
    price_tiers: [
      { min_qty: 1, max_qty: 499, price_per_unit: 3.5 },
      { min_qty: 500, max_qty: 4999, price_per_unit: 2.8 },
      { min_qty: 5000, max_qty: null, price_per_unit: 2.2 }
    ]
  },
  {
    id: "6a761e8bdb8dd58c561a10d0",
    name: "Standard Grow-out",
    size_label: "5-8 cm",
    stock_count: 18000,
    low_stock_threshold: 2000,
    sort_order: 2,
    description: "Healthy juvenile Clarias batrachus ready for grow-out phase. Acclimated to pond conditions with robust immune systems and rapid growth potential.",
    image_url: "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/6667e565e_fingerlings.jpg",
    price_tiers: [
      { min_qty: 1, max_qty: 499, price_per_unit: 5.5 },
      { min_qty: 500, max_qty: 2999, price_per_unit: 4.5 },
      { min_qty: 3000, max_qty: null, price_per_unit: 3.8 }
    ]
  },
  {
    id: "6a761e8bdb8dd58c561a10d1",
    name: "Advance Stocker",
    size_label: "10-15 cm",
    stock_count: 7500,
    low_stock_threshold: 1000,
    sort_order: 3,
    description: "Premium-grade Clarias batrachus at advanced growth stage. Excellent feed conversion ratio and rapid weight gain. Ready for final grow-out.",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/b00b4c562_generated_fb0c10ce.png",
    price_tiers: [
      { min_qty: 1, max_qty: 299, price_per_unit: 12.0 },
      { min_qty: 300, max_qty: 1999, price_per_unit: 10.0 },
      { min_qty: 2000, max_qty: null, price_per_unit: 8.5 }
    ]
  },
  {
    id: "6a761e8bdb8dd58c561a10d2",
    name: "Jumbo Stocker",
    size_label: "20-25 cm",
    stock_count: 1200,
    low_stock_threshold: 200,
    sort_order: 4,
    description: "Top-tier Clarias batrachus at jumbo size. Ideal for immediate harvest preparation or as premium breeding stock with exceptional genetics.",
    image_url: "https://base44.app/api/apps/6a761d1d3d52f761433ccbdd/files/mp/public/6a761d1d3d52f761433ccbdd/1ba83e32a_juvie.jpg",
    price_tiers: [
      { min_qty: 1, max_qty: 99, price_per_unit: 35.0 },
      { min_qty: 100, max_qty: 499, price_per_unit: 30.0 },
      { min_qty: 500, max_qty: null, price_per_unit: 25.0 }
    ]
  }
];

export const defaultArticles: BlogArticle[] = [
  {
    id: "6a761e8b2f63ade9591752cf",
    title: "Essential Water Quality Parameters for Clarias batrachus",
    excerpt: "Understanding temperature, pH, and dissolved oxygen is critical for healthy catfish. Learn the optimal ranges and how to maintain them.",
    category: "Water Quality",
    author: "Mesina Farms",
    published_date: "2026-07-15",
    read_time: "5 min read",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/aa6a39100_generated_c37d0ca2.png",
    featured: true,
    content: `## Why Water Quality Matters

Water quality is the foundation of successful Clarias batrachus aquaculture. Poor water conditions lead to stress, disease, and mortality.

### Key Parameters

**Temperature:** 24-30°C is optimal. Below 24°C slows metabolism; above 32°C causes stress.

**pH:** 6.5-9.0 is ideal. Acidic water below 6.5 affects nutrient absorption.

**Dissolved Oxygen:** Above 5 mg/L is required. Below 3 mg/L risks mass mortality.

### Monitoring Tips

- Test water daily during first month of stocking
- Use aerators during hot weather
- Perform partial water changes weekly
- Monitor ammonia and nitrite levels regularly`
  },
  {
    id: "6a761e8b2f63ade9591752d0",
    title: "Setting Up Your Catfish Hatchery Tank System",
    excerpt: "A complete guide to designing and building an efficient Clarias batrachus hatchery from tank selection to filtration.",
    category: "Hatchery Setup",
    author: "Mesina Farms",
    published_date: "2026-07-20",
    read_time: "7 min read",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/019d7bdf3_generated_95e4fe92.png",
    featured: false,
    content: `## Planning Your Hatchery

A well-designed hatchery system is essential for raising healthy Clarias batrachus fingerlings.

### Tank Selection

Choose tanks made from food-grade materials. Circular tanks are preferred for better water circulation and waste removal.

### Filtration System

Install a biofilter to maintain water quality. Mechanical filters remove solid waste, while biological filters process harmful ammonia into less toxic compounds.

### Aeration

Proper aeration ensures adequate dissolved oxygen. Use air stones or paddle wheel aerators depending on tank size and stocking density.`
  },
  {
    id: "6a761e8b2f63ade9591752d1",
    title: "Fingerling Care: First 30 Days After Stocking",
    excerpt: "The critical first month determines survival rates. Follow this step-by-step guide to ensure your fingerlings thrive.",
    category: "Fingerling Care",
    author: "Mesina Farms",
    published_date: "2026-07-25",
    read_time: "6 min read",
    image_url: "https://media.base44.com/images/public/6a761d1d3d52f761433ccbdd/a09c7d64d_generated_719509ff.png",
    featured: false,
    content: `## The Critical First Month

The first 30 days after stocking are crucial for Clarias batrachus fingerling survival and growth.

### Day 1-7: Acclimation

Gradually acclimate fingerlings to pond water temperature. Avoid sudden temperature changes which can cause shock.

### Day 8-14: Feeding

Begin feeding high-protein starter feed. Feed small amounts 4-5 times daily to prevent overfeeding and water pollution.

### Day 15-21: Health Monitoring

Watch for signs of disease such as erratic swimming or lesions. Remove any sick fish immediately to prevent spreading.

### Day 22-30: Growth Assessment

Monitor growth rates and adjust feeding based on consumption patterns. Healthy fingerlings should show steady weight gain.`
  }
];

export const defaultOrderInquiries: OrderInquiry[] = [
  {
    id: "ord-1",
    customer_name: "Ramon Santos",
    email: "ramon.santos@aquacapiz.com",
    phone: "+63 917 123 4567",
    fingerling_name: "Starter Fingerlings",
    quantity: 10000,
    message: "Requesting delivery to Roxas City pond facility by end of week.",
    status: "confirmed",
    created_date: "2026-08-05T10:30:00Z"
  },
  {
    id: "ord-2",
    customer_name: "Maria Cruz",
    email: "m.cruz@visayasfarms.ph",
    phone: "+63 920 987 6543",
    fingerling_name: "Standard Grow-out",
    quantity: 5000,
    message: "Inquiring about bulk discount and transport aeration bags.",
    status: "pending",
    created_date: "2026-08-06T14:15:00Z"
  }
];

export const defaultSales: Sale[] = [
  {
    id: "sale-1",
    customer_name: "Ramon Santos",
    fingerling_name: "Starter Fingerlings",
    quantity: 10000,
    total_amount: 22000,
    sale_date: "2026-08-05"
  },
  {
    id: "sale-2",
    customer_name: "Panay Fishponds Inc.",
    fingerling_name: "Advance Stocker",
    quantity: 3000,
    total_amount: 25500,
    sale_date: "2026-08-03"
  }
];
