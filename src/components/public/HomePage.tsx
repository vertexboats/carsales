import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgePercent,
  Car,
  CheckCircle2,
  KeyRound,
  LayoutGrid,
  MapPin,
  PlaneLanding,
  Search,
  ShieldCheck,
  Tag,
  Truck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLangText, translations } from '../../i18n/translations';
import { CarForSale } from '../../types/derico';
import { CarCard } from '../common/CarCard';
import { BrandLogoMark, HERO_SHOWROOM_IMAGE, VEHICLE_IMAGES } from '../common/VehicleVisual';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const HomePage: React.FC = () => {
  const {
    lang,
    brands,
    cars,
    services,
    dealership,
    navigatePublic,
    setHeroQuickFilter,
  } = useApp();
  const t = translations[lang];

  const [dockTab, setDockTab] = useState<'buy' | 'rent' | 'pickup'>('buy');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'SUV' | 'Sedan' | 'Pickup'>('all');
  const [quickBrand, setQuickBrand] = useState('');
  const [quickBody, setQuickBody] = useState('');
  const [quickMaxPrice, setQuickMaxPrice] = useState('');
  const [rentCity, setRentCity] = useState('Douala');
  const [pickupRoute, setPickupRoute] = useState('pk-01');

  const visibleBrands = brands
    .filter((b) => b.visible)
    .sort((a, b) => a.order - b.order);

  const liveFeaturedCars = useMemo<CarForSale[]>(() => {
    const activePool = cars.filter(
      (c) => c.visible && c.status !== 'Draft' && c.status !== 'Archived'
    );
    if (featuredFilter === 'all') {
      return activePool.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, 6);
    }
    return activePool
      .filter((c) => String(c.properties.body_type || '').toLowerCase() === featuredFilter.toLowerCase())
      .slice(0, 6);
  }, [cars, featuredFilter]);

  const visibleServices = services.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  const handleDockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dockTab === 'rent') {
      navigatePublic({ page: 'rent' });
      return;
    }
    if (dockTab === 'pickup') {
      navigatePublic({ page: 'pickup-detail', pickupId: pickupRoute });
      return;
    }
    setHeroQuickFilter({
      brandId: quickBrand || undefined,
      bodyType: quickBody || undefined,
      maxPrice: quickMaxPrice ? Number(quickMaxPrice) : undefined,
    });
    const matchedBrand = visibleBrands.find((b) => b.id === quickBrand);
    navigatePublic({ page: 'buy', brandSlug: matchedBrand?.slug });
  };

  const getBrandCarCount = (brandId: string, offset = 0) => {
    const live = cars.filter(
      (c) => c.brandId === brandId && c.visible && c.status !== 'Draft' && c.status !== 'Archived'
    ).length;
    return live + offset;
  };

  const waHref = `https://wa.me/${dealership.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hello Derico Motors, I would like assistance finding a vehicle.'
  )}`;

  const quickCategories = [
    {
      label: 'All Stock',
      icon: LayoutGrid,
      action: () => navigatePublic({ page: 'buy' }),
    },
    {
      label: 'SUVs & 4x4',
      icon: ShieldCheck,
      action: () => {
        setHeroQuickFilter({ bodyType: 'SUV' });
        navigatePublic({ page: 'buy' });
      },
    },
    {
      label: 'Sedans',
      icon: Car,
      action: () => {
        setHeroQuickFilter({ bodyType: 'Sedan' });
        navigatePublic({ page: 'buy' });
      },
    },
    {
      label: 'Pick-ups',
      icon: Truck,
      action: () => {
        setHeroQuickFilter({ bodyType: 'Pickup' });
        navigatePublic({ page: 'buy' });
      },
    },
    {
      label: 'Under 15M XAF',
      icon: BadgePercent,
      action: () => {
        setHeroQuickFilter({ maxPrice: 15000000 });
        navigatePublic({ page: 'buy' });
      },
    },
    {
      label: 'Rentals',
      icon: KeyRound,
      action: () => navigatePublic({ page: 'rent' }),
    },
    {
      label: 'Airport Pick-up',
      icon: PlaneLanding,
      action: () => navigatePublic({ page: 'pickup' }),
    },
  ];

  return (
    <div className="space-y-14 sm:space-y-20">
      {/* 1. Full-Bleed Photographic Hero + Tabbed Marketplace Search Dock */}
      <section className="relative">
        <div className="relative min-h-[480px] lg:min-h-[560px] flex items-center overflow-hidden bg-[#040401]">
          <img
            src={HERO_SHOWROOM_IMAGE}
            alt="Derico Motors Douala & Yaoundé Showroom"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-[#040401] via-[#040401]/85 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#040401] to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1280px] w-full mx-auto px-3 sm:px-6 pt-12 pb-24 lg:pt-16 lg:pb-32">
            <div className="max-w-2xl space-y-4 sm:space-y-6">
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight text-white text-balance">
                Looking to Drive the Best Vehicles in Cameroon?
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed">
                {t.hero.subheading}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  type="button"
                  onClick={() => navigatePublic({ page: 'buy' })}
                  className="h-12 px-7 rounded-full clay-btn text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{t.hero.ctaBuy}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-12 px-6 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-bold border border-white/20 inline-flex items-center gap-2 transition-all clay-pill"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>

              {/* Crisp Proof Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-300/90">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>120-Point Mechanical Audit</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>CEMAC Customs Clearance</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Transparent Drive-Away XAF</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elevated Tabbed Search Dock with Novaride 5% Claymorphic Styling */}
        <div className="relative z-20 max-w-[1280px] mx-auto px-3 sm:px-6 -mt-14 sm:-mt-16">
          <div className="clay-dock p-4 sm:p-6 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#ECECEC]">
              <div className="inline-flex items-center p-1 rounded-full bg-[#F5F5F7] border border-[#ECECEC] max-w-full overflow-x-auto clay-pill">
                {[
                  { id: 'buy' as const, label: t.hero.ctaBuy, icon: Car },
                  { id: 'rent' as const, label: t.hero.ctaRent, icon: KeyRound },
                  { id: 'pickup' as const, label: t.hero.ctaPickup, icon: PlaneLanding },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setDockTab(tab.id)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer transition-all whitespace-nowrap shrink-0 ${
                      dockTab === tab.id
                        ? 'bg-[#040401] text-white shadow-xs'
                        : 'text-[#616161] hover:text-[#040401]'
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-[#616161]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Verified stock · 120-point diagnostic checks · XAF currency</span>
              </span>
            </div>

            <form
              onSubmit={handleDockSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 items-end"
            >
              {dockTab === 'buy' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      Make / Brand
                    </label>
                    <select
                      value={quickBrand}
                      onChange={(e) => setQuickBrand(e.target.value)}
                      className="dm-input"
                    >
                      <option value="">{t.hero.searchBrand}</option>
                      {visibleBrands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      Body style
                    </label>
                    <select
                      value={quickBody}
                      onChange={(e) => setQuickBody(e.target.value)}
                      className="dm-input"
                    >
                      <option value="">{t.hero.searchBody}</option>
                      {['Sedan', 'SUV', 'Pickup', 'Hatchback', 'Minibus'].map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      Max budget (XAF)
                    </label>
                    <select
                      value={quickMaxPrice}
                      onChange={(e) => setQuickMaxPrice(e.target.value)}
                      className="dm-input"
                    >
                      <option value="">{t.hero.searchPrice}</option>
                      <option value="10000000">Up to 10 000 000 XAF</option>
                      <option value="15000000">Up to 15 000 000 XAF</option>
                      <option value="20000000">Up to 20 000 000 XAF</option>
                      <option value="30000000">Up to 30 000 000 XAF</option>
                    </select>
                  </div>
                </>
              )}

              {dockTab === 'rent' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      City / Hub
                    </label>
                    <select
                      value={rentCity}
                      onChange={(e) => setRentCity(e.target.value)}
                      className="dm-input"
                    >
                      <option value="Douala">Douala (Bonapriso / DLA)</option>
                      <option value="Yaoundé">Yaoundé (Bastos / NSI)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      Driving mode
                    </label>
                    <select className="dm-input" defaultValue="both">
                      <option value="both">Self-drive or With driver</option>
                      <option value="driver">With bilingual driver</option>
                      <option value="self">Self-drive only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      Vehicle class
                    </label>
                    <select className="dm-input" defaultValue="all">
                      <option value="all">Sedan, 4x4 Prado &amp; Minibus</option>
                      <option value="sedan">City Sedan (from 45 000 XAF/day)</option>
                      <option value="suv">Executive 4x4 SUV (95 000 XAF/day)</option>
                    </select>
                  </div>
                </>
              )}

              {dockTab === 'pickup' && (
                <>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      Transfer route
                    </label>
                    <select
                      value={pickupRoute}
                      onChange={(e) => setPickupRoute(e.target.value)}
                      className="dm-input"
                    >
                      <option value="pk-01">Douala Airport (DLA) → Akwa / Bonanjo / Bonapriso (15 000 XAF)</option>
                      <option value="pk-02">Douala ↔ Yaoundé Private Intercity Charter (120 000 XAF)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#040401] uppercase tracking-wider mb-1.5">
                      Transfer date
                    </label>
                    <input type="date" defaultValue="2026-11-16" className="dm-input font-mono-num" />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full h-11 px-5 rounded-full clay-btn text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>
                  {dockTab === 'buy'
                    ? t.hero.searchBtn
                    : dockTab === 'rent'
                    ? 'Check Rental Fleet'
                    : 'Schedule Transfer'}
                </span>
              </button>
            </form>

            {/* Quick Category Shortcut Strip */}
            <div className="mt-4 pt-3.5 border-t border-[#ECECEC] flex items-center gap-2 overflow-x-auto pb-0.5">
              {quickCategories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={cat.action}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F5F5F7] hover:bg-[#FFF3EE] border border-[#ECECEC] hover:border-[#FF3600]/40 text-xs font-bold text-[#616161] hover:text-[#FF3600] whitespace-nowrap shrink-0 cursor-pointer transition-colors clay-pill"
                >
                  <cat.icon className="w-3.5 h-3.5 text-[#FF3600]" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Brand Strip (Novaride Claymorphic Brand Grid) */}
      <section className="max-w-[1280px] mx-auto px-3 sm:px-6">
        <div className="flex items-end justify-between mb-5 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3600] mb-1">
              <span>MANUFACTURER DIRECTORY</span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-3xl text-[#040401]">
              {t.home.shopByBrand}
            </h2>
            <p className="text-xs sm:text-sm text-[#616161] mt-1">
              Browse inspected stock by manufacturer with verified customs clearance.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigatePublic({ page: 'buy' })}
            className="text-xs sm:text-sm font-bold text-[#FF3600] hover:text-[#E03000] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>{t.home.viewAllBrands}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3.5">
          {visibleBrands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => navigatePublic({ page: 'buy', brandSlug: brand.slug })}
              className="group clay-card p-2.5 sm:p-4 flex flex-col items-center text-center gap-2 cursor-pointer transition-all"
            >
              <BrandLogoMark
                name={brand.name}
                badgeText={brand.badgeText}
                color={brand.logoColor}
                size="md"
              />
              <div>
                <div className="text-[11px] sm:text-xs font-bold text-[#040401] group-hover:text-[#FF3600] transition-colors line-clamp-1">
                  {brand.name}
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#8E8E93] tabular-nums mt-0.5">
                  {getBrandCarCount(brand.id, brand.catalogCountOffset)} cars
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Featured Vehicles — Dynamic Live Showroom Stock */}
      <section className="max-w-[1280px] mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3600] mb-1">
              <span className="live-dot shrink-0" />
              <span>LIVE SHOWROOM STOCK</span>
            </div>
            <h2 className="font-display font-extrabold text-xl sm:text-3xl text-[#040401]">
              {t.home.featuredCars}
            </h2>
            <p className="text-xs sm:text-sm text-[#616161] mt-1">
              Hand-picked sedans, SUVs, and 4x4 pickups ready for showroom viewing in Douala and Yaoundé.
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all' as const, label: 'All Inventory' },
              { id: 'SUV' as const, label: 'SUVs & 4x4' },
              { id: 'Sedan' as const, label: 'Sedans' },
              { id: 'Pickup' as const, label: 'Pickups' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFeaturedFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                  featuredFilter === tab.id
                    ? 'bg-[#040401] text-white shadow-xs'
                    : 'bg-[#F5F5F7] text-[#616161] hover:text-[#040401] hover:bg-[#FFF3EE]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {liveFeaturedCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onSelect={(id) => navigatePublic({ page: 'car-detail', carId: id })}
            />
          ))}
        </div>
      </section>

      {/* 4. Three Photographic Mobility Pillars (Novaride 5% Claymorphic Cards) */}
      <section className="max-w-[1280px] mx-auto px-3 sm:px-6">
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3600] mb-1">
            <span>CORE MOBILITY SERVICES</span>
          </div>
          <h2 className="font-display font-extrabold text-xl sm:text-3xl text-[#040401]">
            {t.home.servicesTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#616161] mt-1">
            One trusted dealership for buying, renting, and executive airport transfers across Cameroon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              img: VEHICLE_IMAGES.mercedes,
              icon: Tag,
              kicker: 'Dealership Sales',
              title: 'Buy Inspected Vehicles',
              desc: 'Foreign-used (Tokunbo), locally used, and new cars with 120-point diagnostics and verified customs clearance.',
              cta: 'Browse cars for sale',
              route: { page: 'buy' as const },
            },
            {
              img: VEHICLE_IMAGES.prado,
              icon: KeyRound,
              kicker: 'Flexible Mobility',
              title: 'Daily & Corporate Rentals',
              desc: 'Transparent 24-hour rates in XAF with live calendar availability. Choose self-drive or a vetted bilingual chauffeur.',
              cta: 'View rental fleet',
              route: { page: 'rent' as const },
            },
            {
              img: VEHICLE_IMAGES.minibus,
              icon: PlaneLanding,
              kicker: 'Airport & Intercity',
              title: 'Fixed-Rate Pick-up Transfers',
              desc: 'Punctual meet-and-greet from Douala (DLA) and Nsimalen airports plus private Douala–Yaoundé charters.',
              cta: 'Book a transfer',
              route: { page: 'pickup' as const },
            },
          ].map((tile) => (
            <article
              key={tile.title}
              onClick={() => navigatePublic(tile.route)}
              className="group clay-card p-4 sm:p-5 flex flex-col justify-between gap-5 cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#F4F4F6] relative">
                <img
                  src={tile.img}
                  alt={tile.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-600"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#040401] shadow-xs">
                  {tile.kicker}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-lg text-[#040401] group-hover:text-[#FF3600] transition-colors">
                  {tile.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">{tile.desc}</p>
              </div>
              <div className="pt-2 border-t border-[#ECECEC] flex items-center justify-between">
                <span className="text-xs font-bold text-[#040401] group-hover:text-[#FF3600] transition-colors">
                  {tile.cta}
                </span>
                <span className="w-8 h-8 rounded-full clay-btn-dark hover:bg-[#FF3600] text-white flex items-center justify-center transition-all">
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Trust Standards & Client Proof (Novaride Warm Tinted Section) */}
      <section className="bg-[#FFF8F6] border-y border-[#ECECEC] py-16 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-3 sm:px-6 space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: '120-Point Technical Audit',
                desc: 'Every vehicle undergoes OBD-II engine diagnostics, suspension testing, and VIN verification prior to listing.',
              },
              {
                icon: CheckCircle2,
                title: 'Verified Customs & Title',
                desc: 'Complete CEMAC customs clearance documentation and fast carte grise registration in Douala or Yaoundé.',
              },
              {
                icon: WhatsAppIcon,
                title: 'Instant WhatsApp Desk',
                desc: 'Confirm showroom viewings, receive assigned driver contact details, and get PDF invoices directly on WhatsApp.',
              },
              {
                icon: MapPin,
                title: 'Douala & Yaoundé Hubs',
                desc: 'Physical showrooms in Bonapriso and Bastos with MTN MoMo, Orange Money, and bank transfer support.',
              },
            ].map((pt) => (
              <div key={pt.title} className="clay-card p-6 space-y-3.5 bg-white">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF3EE] text-[#FF3600] flex items-center justify-center clay-pill">
                  <pt.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base text-[#040401]">{pt.title}</h3>
                <p className="text-xs sm:text-sm text-[#616161] leading-relaxed">{pt.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-10 sm:pt-12 border-t border-[#ECECEC] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-display font-extrabold text-2xl text-[#040401]">
                {t.home.servicesPreviewTitle}
              </h2>
              <div className="divide-y divide-[#ECECEC] border-y border-[#ECECEC]">
                {visibleServices.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => navigatePublic({ page: 'services', serviceSlug: srv.slug })}
                    className="w-full py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FFF3EE] px-3 -mx-3 rounded-2xl transition-colors cursor-pointer group"
                  >
                    <div>
                      <div className="font-display font-bold text-sm text-[#040401] group-hover:text-[#FF3600] transition-colors">
                        {getLangText(lang, srv.titleEn, srv.titleFr)}
                      </div>
                      <div className="text-xs text-[#616161] mt-0.5 line-clamp-1">
                        {getLangText(lang, srv.summaryEn, srv.summaryFr)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8E8E93] group-hover:text-[#FF3600] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <h2 className="font-display font-extrabold text-2xl text-[#040401]">
                {t.home.testimonialsTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  {
                    initials: 'HE',
                    quote:
                      'We needed two 4x4 pickups for a regional field audit in less than 48 hours. Derico Motors confirmed driver assignments on WhatsApp within 15 minutes and delivered spotless Land Cruiser Prados.',
                    author: 'Hervé Essomba',
                    role: 'Operations Coordinator, AgroCam Douala',
                  },
                  {
                    initials: 'CN',
                    quote:
                      'Buying a foreign-used Corolla can feel risky, but their Bonapriso team shared the full diagnostic sheet and customs paperwork upfront. Zero surprises at registration.',
                    author: 'Clarisse Ngono',
                    role: 'Financial Analyst, Bonanjo',
                  },
                ].map((item) => (
                  <div
                    key={item.author}
                    className="clay-card p-6 flex flex-col justify-between gap-4 bg-white"
                  >
                    <p className="text-sm text-[#616161] italic leading-relaxed">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-3 border-t border-[#ECECEC]">
                      <div className="w-10 h-10 rounded-full bg-[#040401] text-white text-xs font-bold flex items-center justify-center shrink-0 clay-pill">
                        {item.initials}
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-[#040401]">{item.author}</div>
                        <div className="text-[#8E8E93]">{item.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Closing CTA Banner (Novaride .cta-box Style) */}
      <section className="max-w-[1280px] mx-auto px-3 sm:px-6">
        <div
          className="relative overflow-hidden rounded-[32px] bg-[#040401] text-white p-8 sm:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-2xl"
          style={{
            backgroundImage: 'url(/novaride/cta-box-bg.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            backgroundSize: 'cover',
          }}
        >
          <div className="space-y-4 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FF3600] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#FF3600] animate-ping"></span>
              <span>Direct Showroom Desk</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white text-balance leading-tight">
              {t.home.ctaBannerTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.home.ctaBannerSub}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 shrink-0 relative z-10">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-bold inline-flex items-center gap-2 transition-all shadow-lg clay-pill"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={() => navigatePublic({ page: 'buy' })}
              className="h-12 px-6 rounded-full clay-btn-white text-[#040401] text-sm font-bold cursor-pointer"
            >
              Browse Inventory
            </button>
          </div>

          <img
            src="/novaride/cta-car-img.png"
            alt="Derico Motors Luxury Vehicle"
            className="hidden lg:block absolute right-8 -bottom-6 max-h-[220px] object-contain pointer-events-none drop-shadow-2xl opacity-90"
          />
        </div>
      </section>
    </div>
  );
};
