import React, { useState } from 'react';
import {
  ArrowRight,
  Car,
  ChevronDown,
  ChevronUp,
  Clock,
  Lock,
  MapPin,
  Menu,
  Phone,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getLangText, translations } from '../../i18n/translations';
import { DericoLogo } from '../common/DericoLogo';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    lang,
    setLang,
    publicRoute,
    navigatePublic,
    setMode,
    services,
    policies,
    dealership,
    addToast,
  } = useApp();
  const t = translations[lang];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileShowroom, setMobileShowroom] = useState<'douala' | 'yaounde'>('douala');
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobilePoliciesOpen, setMobilePoliciesOpen] = useState(false);

  const visibleServices = services.filter((s) => s.visible).sort((a, b) => a.order - b.order);

  const waGeneralHref = `https://wa.me/${dealership.whatsappNumber.replace(
    /\D/g,
    ''
  )}?text=${encodeURIComponent(
    lang === 'fr'
      ? 'Bonjour Derico Motors, je souhaite avoir plus d’informations sur vos véhicules et services.'
      : 'Hello Derico Motors, I would like information about your vehicles and services.'
  )}`;

  const isBuy = publicRoute.page === 'buy' || publicRoute.page === 'car-detail';
  const isRent = publicRoute.page === 'rent' || publicRoute.page === 'rent-detail';
  const isPickup = publicRoute.page === 'pickup' || publicRoute.page === 'pickup-detail';
  const isServices = publicRoute.page === 'services';
  const isContact = publicRoute.page === 'contact';

  const navLinkClass = (active: boolean) =>
    `relative whitespace-nowrap shrink-0 py-2 text-sm font-medium cursor-pointer transition-colors ${active
      ? 'text-[#040401] font-bold after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[#FF3600]'
      : 'text-[#616161] hover:text-[#040401]'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFB]">
      {/* ============================================================== */}
      {/* 1. Top Utility Bar (Mobile + Desktop variants)                */}
      {/* ============================================================== */}
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-[#040401] text-white px-3.5 sm:px-6 py-1.5 flex items-center justify-between text-[11px] border-b border-white/10">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse shrink-0" />
          <span className="truncate">Douala • Yaoundé | WAT</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${dealership.phonePrimary.replace(/\s+/g, '')}`}
            className="flex items-center gap-1 text-slate-200 hover:text-[#FF3600] font-mono-num font-semibold transition-colors"
          >
            <Phone className="w-3 h-3 text-[#FF3600]" />
            <span>{dealership.phonePrimary}</span>
          </a>
          <span className="text-white/20">|</span>
          <div className="flex items-center p-0.5 rounded-full bg-white/10 border border-white/15">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full cursor-pointer transition-all ${lang === 'en' ? 'bg-[#FF3600] text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('fr')}
              className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full cursor-pointer transition-all ${lang === 'fr' ? 'bg-[#FF3600] text-white' : 'text-slate-400 hover:text-white'
                }`}
            >
              FR
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden lg:flex bg-[#040401] text-white px-6 py-2 border-b border-white/10 text-xs">
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 text-slate-300 font-medium">
            <span className="inline-flex items-center gap-1.5 text-slate-200">
              <span className="live-dot" />
              <strong className="text-white font-bold">Showrooms Open:</strong> Douala (Bonapriso) &amp; Yaoundé (Bastos)
            </span>
            <span className="text-white/20">•</span>
            <span className="text-slate-400">120-Point Inspected Inventory · CEMAC Customs Cleared</span>
          </div>
          <div className="flex items-center gap-5 text-slate-300">
            <span className="text-slate-400 text-[11px]">
              Showroom Hours: <strong className="text-slate-200 font-semibold">Mon – Sat: 08:00 – 18:00 (WAT)</strong>
            </span>
            <span className="text-white/20">|</span>
            <a
              href={`tel:${dealership.phonePrimary.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 text-white hover:text-[#FF3600] font-mono-num font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF3600]" />
              <span>{dealership.phonePrimary}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. Main Sticky Header (Desktop + Mobile)                      */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#ECECEC]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-[68px] sm:h-[72px] flex items-center justify-between gap-4">
          {/* Brand Mark: Official Derico Motors Crest + Stacked Wordmark */}
          <button
            type="button"
            onClick={() => navigatePublic({ page: 'home' })}
            className="flex items-center text-left cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <DericoLogo variant="light" size="md" />
          </button>

          {/* Desktop Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button
              type="button"
              onClick={() => navigatePublic({ page: 'buy' })}
              className={navLinkClass(isBuy)}
            >
              {t.nav.buy}
            </button>
            <button
              type="button"
              onClick={() => navigatePublic({ page: 'rent' })}
              className={navLinkClass(isRent)}
            >
              {t.nav.rent}
            </button>
            <button
              type="button"
              onClick={() => navigatePublic({ page: 'pickup' })}
              className={navLinkClass(isPickup)}
            >
              {t.nav.pickup}
            </button>

            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => navigatePublic({ page: 'services' })}
                className={`inline-flex items-center gap-1 ${navLinkClass(isServices)}`}
              >
                <span>{t.nav.services}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9E9E9E]" />
              </button>
              {servicesDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-80 z-50">
                  <div className="bg-white rounded-2xl border border-[#ECECEC] shadow-2xl p-2.5 clay-card">
                    {visibleServices.map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setServicesDropdownOpen(false);
                          navigatePublic({ page: 'services', serviceSlug: srv.slug });
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-[#FFF3EE] transition-colors cursor-pointer group/srv"
                      >
                        <div className="text-xs font-bold text-[#040401] group-hover/srv:text-[#FF3600] transition-colors">
                          {getLangText(lang, srv.titleEn, srv.titleFr)}
                        </div>
                        <div className="text-[11px] text-[#616161] line-clamp-1 mt-0.5">
                          {getLangText(lang, srv.summaryEn, srv.summaryFr)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => navigatePublic({ page: 'contact' })}
              className={navLinkClass(isContact)}
            >
              {t.nav.contact}
            </button>
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <div className="flex items-center p-1 rounded-full bg-[#F5F5F7] border border-[#ECECEC] clay-pill">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-all ${lang === 'en' ? 'bg-[#040401] text-white shadow-xs' : 'text-[#616161] hover:text-[#040401]'
                  }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('fr')}
                className={`px-3 py-1 text-[11px] font-bold rounded-full cursor-pointer transition-all ${lang === 'fr' ? 'bg-[#040401] text-white shadow-xs' : 'text-[#616161] hover:text-[#040401]'
                  }`}
              >
                FR
              </button>
            </div>

            <a
              href={waGeneralHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold shadow-xs whitespace-nowrap shrink-0 transition-all clay-pill"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp us</span>
            </a>

            <button
              type="button"
              onClick={() => navigatePublic({ page: 'contact' })}
              className="inline-flex items-center h-10 px-5 rounded-full clay-btn text-white text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.getQuote}
            </button>
          </div>

          {/* Mobile Right Action Cluster */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={waGeneralHref}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-3 rounded-full bg-[#25D366] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs clay-pill"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="w-10 h-10 rounded-xl border border-[#ECECEC] bg-white flex items-center justify-center text-[#040401] cursor-pointer shadow-xs active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#FF3600]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile App Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#ECECEC] bg-white px-4 py-5 space-y-3 shadow-2xl max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: t.nav.buy, desc: 'Inspected vehicles', route: { page: 'buy' as const }, icon: '🚗' },
                { label: t.nav.rent, desc: 'Self or chauffeur', route: { page: 'rent' as const }, icon: '🔑' },
                { label: t.nav.pickup, desc: 'Airport transfers', route: { page: 'pickup' as const }, icon: '🚖' },
                { label: t.nav.services, desc: 'Custom & corporate', route: { page: 'services' as const }, icon: '🛠️' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    navigatePublic(item.route);
                    setMobileMenuOpen(false);
                  }}
                  className="p-3 text-left rounded-xl border border-[#ECECEC] bg-[#FAF9F5] hover:border-[#FF3600]/40 transition-all cursor-pointer"
                >
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs font-bold text-[#040401]">{item.label}</div>
                  <div className="text-[10px] text-[#616161] line-clamp-1">{item.desc}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                navigatePublic({ page: 'contact' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-left p-3 rounded-xl border border-[#ECECEC] bg-white flex items-center justify-between text-xs font-bold text-[#040401]"
            >
              <span>{t.nav.contact} &amp; Showrooms</span>
              <ArrowRight className="w-4 h-4 text-[#FF3600]" />
            </button>

            <div className="pt-2 border-t border-[#ECECEC] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigatePublic({ page: 'contact' });
                }}
                className="w-full h-11 rounded-xl clay-btn text-white text-xs font-bold flex items-center justify-center gap-2"
              >
                <span>{t.nav.getQuote}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>

      {/* ============================================================== */}
      {/* 3. Mobile Footer (100% Mobile Site Layout)                    */}
      {/* ============================================================== */}
      <footer className="md:hidden bg-[#040401] text-slate-300 mt-12 pb-28 pt-8 px-4 relative overflow-hidden">
        <div className="space-y-6">
          {/* Mobile Brand Identity */}
          <div className="flex items-center justify-between border-b border-white/10 pb-5">
            <DericoLogo variant="dark" size="sm" />
            <span className="clay-pill px-2.5 py-1 rounded-full bg-white/10 text-[10px] font-semibold text-slate-300 border border-white/10">
              Douala • Yaoundé
            </span>
          </div>

          {/* Mobile Showroom Selector Card */}
          <div className="clay-card bg-[#11110E] border border-white/15 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Showroom Desk</span>
              <span className="text-[#FF3600]">WAT (UTC+1)</span>
            </div>

            {/* Showroom Toggle Buttons */}
            <div className="grid grid-cols-2 p-1 bg-white/5 rounded-xl border border-white/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMobileShowroom('douala')}
                className={`py-2 rounded-lg transition-all ${mobileShowroom === 'douala' ? 'bg-[#FF3600] text-white shadow-xs' : 'text-slate-400'
                  }`}
              >
                Douala
              </button>
              <button
                type="button"
                onClick={() => setMobileShowroom('yaounde')}
                className={`py-2 rounded-lg transition-all ${mobileShowroom === 'yaounde' ? 'bg-[#FF3600] text-white shadow-xs' : 'text-slate-400'
                  }`}
              >
                Yaoundé
              </button>
            </div>

            {/* Active Showroom Info */}
            <div className="text-xs space-y-1.5 pt-1">
              <div className="flex items-start gap-2 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-[#FF3600] shrink-0 mt-0.5" />
                <span>
                  {mobileShowroom === 'douala' ? dealership.addressDouala : dealership.addressYaounde}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{dealership.openingHours}</span>
              </div>
            </div>

            {/* 1-Tap Contact Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${dealership.phonePrimary.replace(/\s+/g, '')}`}
                className="h-9 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
              >
                <Phone className="w-3 h-3 text-[#FF3600]" />
                <span>Call Desk</span>
              </a>
              <a
                href={waGeneralHref}
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 rounded-xl bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <WhatsAppIcon className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Mobile Accordions for Deep Links */}
          <div className="space-y-2 text-xs">
            {/* Accordion 1: Mobility Services */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
              <button
                type="button"
                onClick={() => setMobileServicesOpen((v) => !v)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-white cursor-pointer"
              >
                <span>Mobility Services ({visibleServices.length})</span>
                {mobileServicesOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#FF3600]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {mobileServicesOpen && (
                <div className="px-4 pb-3 space-y-2 border-t border-white/10 pt-2">
                  {visibleServices.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => navigatePublic({ page: 'services', serviceSlug: srv.slug })}
                      className="w-full text-left py-1 text-slate-300 hover:text-[#FF3600] flex items-center justify-between cursor-pointer"
                    >
                      <span>{getLangText(lang, srv.titleEn, srv.titleFr)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion 2: Dealership Policies & Legal */}
            <div className="border border-white/10 rounded-xl overflow-hidden bg-white/5">
              <button
                type="button"
                onClick={() => setMobilePoliciesOpen((v) => !v)}
                className="w-full px-4 py-3 flex items-center justify-between text-left font-bold text-white cursor-pointer"
              >
                <span>Policies &amp; Legal ({policies.length})</span>
                {mobilePoliciesOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#FF3600]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>
              {mobilePoliciesOpen && (
                <div className="px-4 pb-3 space-y-2 border-t border-white/10 pt-2">
                  {policies.map((pol) => (
                    <button
                      key={pol.id}
                      type="button"
                      onClick={() => navigatePublic({ page: 'policies', policySlug: pol.slug })}
                      className="w-full text-left py-1 text-slate-300 hover:text-[#FF3600] flex items-center justify-between cursor-pointer"
                    >
                      <span>{getLangText(lang, pol.titleEn, pol.titleFr)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Utility Row */}
          <div className="pt-2 border-t border-white/10 space-y-3 text-center text-[11px] text-slate-400">
            <div className="flex items-center justify-between">
              <div className="text-slate-400 text-left text-[11px]">
                Transparent pricing in XAF (FCFA)
              </div>

              <div className="flex items-center p-0.5 rounded-full bg-white/10 border border-white/15">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${lang === 'en' ? 'bg-[#FF3600] text-white' : 'text-slate-400'
                    }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('fr')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${lang === 'fr' ? 'bg-[#FF3600] text-white' : 'text-slate-400'
                    }`}
                >
                  FR
                </button>
              </div>
            </div>

            <div className="text-slate-500 text-[10px]">
              <span
                onClick={() => setMode('admin')}
                className="cursor-default select-none hover:text-slate-400 transition-colors"
                title="Derico Motors SARL"
              >
                ©
              </span>{' '}
              2026 Derico Motors SARL · Cameroon (WAT)
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* 4. Desktop Editorial Footer (visible on desktop only)         */}
      {/* ============================================================== */}
      <footer
        className="hidden md:block bg-[#040401] text-slate-300 mt-20 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/novaride/footer-bg.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative z-10">
          <div className="space-y-4">
            <DericoLogo variant="dark" size="md" />
            <p className="text-xs text-slate-300/80 leading-relaxed">
              Modern digital car dealership serving Douala, Yaoundé, and nationwide Cameroon. Inspected sales, flexible rentals, and airport transfers in XAF.
            </p>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider text-xs">
              Mobility Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => navigatePublic({ page: 'buy' })}
                  className="hover:text-[#FF3600] cursor-pointer transition-colors"
                >
                  {t.nav.buy}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePublic({ page: 'rent' })}
                  className="hover:text-[#FF3600] cursor-pointer transition-colors"
                >
                  {t.nav.rent}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePublic({ page: 'pickup' })}
                  className="hover:text-[#FF3600] cursor-pointer transition-colors"
                >
                  {t.nav.pickup}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePublic({ page: 'services' })}
                  className="hover:text-[#FF3600] cursor-pointer transition-colors"
                >
                  {t.nav.services}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => navigatePublic({ page: 'contact' })}
                  className="hover:text-[#FF3600] cursor-pointer transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider text-xs">
              Legal &amp; Policies
            </h4>
            <ul className="space-y-2.5 text-xs">
              {policies.map((pol) => (
                <li key={pol.id}>
                  <button
                    type="button"
                    onClick={() => navigatePublic({ page: 'policies', policySlug: pol.slug })}
                    className="hover:text-[#FF3600] text-left cursor-pointer transition-colors"
                  >
                    {getLangText(lang, pol.titleEn, pol.titleFr)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5 text-xs">
            <h4 className="font-display font-bold text-sm text-white mb-4 uppercase tracking-wider text-xs">
              Showrooms &amp; Desk
            </h4>
            <p className="text-slate-300/80">{dealership.addressDouala}</p>
            <p className="text-slate-300/80">{dealership.addressYaounde}</p>
            <p className="font-mono-num text-white font-bold pt-1 text-sm">{dealership.phonePrimary}</p>
            <p className="text-slate-300/80">{dealership.email}</p>
            <p className="text-slate-400">{dealership.openingHours}</p>
          </div>
        </div>

        <div className="border-t border-white/10 relative z-10">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>
              <span
                onClick={() => setMode('admin')}
                className="cursor-default select-none hover:text-slate-300 transition-colors"
                title="Derico Motors SARL"
              >
                ©
              </span>{' '}
              2026 Derico Motors SARL. Transparent pricing in XAF (FCFA).
            </span>
            <span>Time zone: {dealership.timezone}</span>
          </div>
        </div>
      </footer>

      {/* Desktop Floating WhatsApp Button */}
      <a
        href={waGeneralHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Derico Motors on WhatsApp"
        className="hidden md:flex fixed bottom-6 right-6 z-40 h-12 px-5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xl items-center gap-2 text-xs font-semibold transition-all hover:-translate-y-0.5 clay-pill"
      >
        <WhatsAppIcon className="w-4 h-4" />
        <span>WhatsApp Desk</span>
      </a>

      {/* Mobile Sticky Bottom Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECECEC] px-3 py-2 grid grid-cols-2 gap-2.5 shadow-lg">
        <a
          href={`tel:${dealership.phonePrimary.replace(/\s+/g, '')}`}
          onClick={() =>
            addToast({ type: 'info', title: `Dialing ${dealership.phonePrimary}` })
          }
          className="h-11 rounded-full border border-[#ECECEC] bg-white text-[#040401] text-xs font-semibold flex items-center justify-center gap-2 clay-pill"
        >
          <Phone className="w-4 h-4 text-[#FF3600]" />
          <span>{t.common.call}</span>
        </a>
        <a
          href={waGeneralHref}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 rounded-full bg-[#25D366] text-white text-xs font-semibold flex items-center justify-center gap-2 clay-pill"
        >
          <WhatsAppIcon className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </div>
  );
};
