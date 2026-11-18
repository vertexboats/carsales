import React, { useState } from 'react';
import {
  ArrowLeft,
  Car,
  CheckCircle2,
  Fuel,
  Gauge,
  MapPin,
  Maximize2,
  Settings2,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumberSpaced, formatXaf, getLangText, translations } from '../../i18n/translations';
import { PropertyGroup } from '../../types/derico';
import { CarCard } from '../common/CarCard';
import { CtaTrio } from '../common/CtaTrio';
import { PromoBadge, StatusBadge } from '../common/StatusBadge';
import { BrandLogoMark, VehicleVisual } from '../common/VehicleVisual';

const GROUPS_ORDER: PropertyGroup[] = [
  'General',
  'Engine and performance',
  'Body and interior',
  'Safety',
  'Features and comfort',
  'Commercial',
];

export const CarDetailPage: React.FC<{ carId: string }> = ({ carId }) => {
  const {
    lang,
    cars,
    brands,
    properties,
    navigatePublic,
    setViewingRequests,
    addToast,
    waSettings,
  } = useApp();
  const t = translations[lang];

  const car = cars.find((c) => c.id === carId) || cars[0];
  const brand = brands.find((b) => b.id === car.brandId);

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDate, setFormDate] = useState('2026-11-15');
  const [formMessage, setFormMessage] = useState('');
  const [waOptIn, setWaOptIn] = useState(true);

  const bodyType = String(car.properties.body_type || 'Sedan');
  const colour = String(car.properties.colour || 'Silver');
  const activePhoto = car.photos[activePhotoIdx] || car.photos[0];

  const prefilledWa = `Hello Derico Motors, I am interested in the ${car.title} (${car.reference}). Link: https://dericomotors.cm/cars/${car.reference}`;

  const similarCars = cars
    .filter(
      (c) =>
        c.id !== car.id &&
        c.visible &&
        c.status !== 'Draft' &&
        c.status !== 'Archived'
    )
    .slice(0, 3);

  const saleProperties = properties
    .filter((p) => p.appliesTo.includes('sale'))
    .sort((a, b) => a.order - b.order);

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;
    const ref = `DM-REQ-${Math.floor(1050 + Math.random() * 899)}`;
    setViewingRequests((prev) => [
      {
        id: `req-${Date.now()}`,
        reference: ref,
        clientName: formName.trim(),
        clientPhone: formPhone.trim(),
        clientEmail: formEmail.trim() || 'Not provided',
        carId: car.id,
        source: 'Form',
        preferredDate: formDate,
        message: formMessage.trim() || `Interested in ${car.title}`,
        whatsappOptIn: waOptIn,
        status: 'New',
        assignedTo: 'Unassigned',
        createdAt: '2026-11-13 10:45',
        notes: [],
      },
      ...prev,
    ]);
    setSubmittedRef(ref);
    addToast({
      type: 'success',
      title: 'Viewing request submitted',
      description: `Reference ${ref} created.`,
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-8 sm:py-10 space-y-10 sm:space-y-12">
      <div>
        <button
          type="button"
          onClick={() => navigatePublic({ page: 'buy' })}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#616161] hover:text-[#040401] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.backToList}</span>
        </button>
      </div>

      {/* Top Split: Photographic Gallery + Sticky Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-3.5">
          <div className="relative clay-card overflow-hidden aspect-[16/10] p-2 bg-white">
            <VehicleVisual
              bodyType={bodyType}
              colour={colour}
              angle={activePhoto?.angle || 'front34'}
              title={car.title}
              className="w-full h-full rounded-2xl"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="glass-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#040401]">
                <span className="live-dot" />
                <span>Live Stock</span>
              </span>
              <span className="glass-badge px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#040401]">
                120-Pt Inspected
              </span>
            </div>
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              className="absolute bottom-5 right-5 h-9 px-4 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white text-[#040401] border border-[#ECECEC] text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm cursor-pointer clay-pill"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand view</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {car.photos.map((ph, idx) => (
              <button
                key={ph.id}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`rounded-2xl overflow-hidden border-2 aspect-[4/3] cursor-pointer transition-all ${
                  idx === activePhotoIdx
                    ? 'border-[#FF3600] shadow-sm'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <VehicleVisual
                  bodyType={bodyType}
                  colour={colour}
                  angle={ph.angle}
                  title={ph.caption}
                  className="w-full h-full rounded-xl"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Purchase / Inquiry Module */}
        <div className="lg:col-span-5 clay-card p-6 sm:p-7 space-y-6 lg:sticky lg:top-24">
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {brand && (
                  <BrandLogoMark
                    name={brand.name}
                    badgeText={brand.badgeText}
                    color={brand.logoColor}
                    size="sm"
                  />
                )}
                <span className="text-xs font-semibold text-[#616161]">
                  {brand?.name}
                </span>
              </div>
              <span className="text-xs font-mono-num text-[#8290A3]">
                {t.common.reference}: {car.reference}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#040401]">
              {car.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={car.status} />
              {car.promoTag && <PromoBadge label={car.promoTag} />}
              {car.negotiable && (
                <span className="text-xs font-medium text-[#616161]">
                  · {t.common.negotiable}
                </span>
              )}
            </div>
          </div>

          <div className="py-4 border-y border-[#ECECEC]">
            {car.priceOnRequest ? (
              <div className="font-display font-extrabold text-2xl text-[#040401]">
                {t.common.priceOnRequest}
              </div>
            ) : (
              <div>
                {car.previousPriceXaf && car.previousPriceXaf > car.priceXaf && (
                  <div className="text-sm text-[#8290A3] line-through tabular-nums">
                    {formatXaf(car.previousPriceXaf)}
                  </div>
                )}
                <div className="font-display font-extrabold text-3xl text-[#040401] tabular-nums tracking-tight">
                  {formatXaf(car.priceXaf)}
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-[#F5F5F7] border border-[#ECECEC] text-[11px] text-[#616161]">
              <ShieldCheck className="w-4 h-4 text-[#FF3600] shrink-0" />
              <span>120-Point Mechanical Audit · CEMAC Customs Cleared · Immediate Handover</span>
            </div>
          </div>

          {/* Quick Key Highlights */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs">
            {[
              { label: 'Condition', val: car.properties.condition, Icon: ShieldCheck },
              { label: 'Transmission', val: car.properties.transmission, Icon: Settings2 },
              { label: 'Fuel type', val: car.properties.fuel_type, Icon: Fuel },
              {
                label: 'Mileage',
                val: car.properties.mileage
                  ? `${formatNumberSpaced(Number(car.properties.mileage))} km`
                  : undefined,
                Icon: Gauge,
              },
              { label: 'Location', val: car.properties.location, Icon: MapPin },
              { label: 'Body type', val: car.properties.body_type, Icon: Car },
            ].map(
              ({ label, val, Icon }) =>
                val && (
                  <div
                    key={label}
                    className="p-3 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] flex items-start gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#ECECEC] flex items-center justify-center text-[#FF3600] shrink-0 shadow-xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-[#8290A3]">{label}</div>
                      <div className="font-semibold text-[#040401] mt-0.5 tabular-nums truncate">
                        {String(val)}
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>

          <CtaTrio
            prefilledMessage={prefilledWa}
            onOpenForm={() => {
              setSubmittedRef(null);
              setRequestModalOpen(true);
            }}
            formLabel="Request viewing"
          />
        </div>
      </div>

      {/* Description & Technical Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="clay-card p-6 sm:p-7 space-y-3">
            <h2 className="font-display font-bold text-lg text-[#040401]">
              Vehicle Overview
            </h2>
            <p className="text-sm text-[#616161] leading-relaxed">
              {getLangText(lang, car.descriptionEn, car.descriptionFr)}
            </p>
          </div>

          <div className="clay-card p-6 sm:p-7 space-y-6">
            <h2 className="font-display font-bold text-lg text-[#040401]">
              Technical Specifications &amp; Features
            </h2>
            {GROUPS_ORDER.map((groupName) => {
              const groupProps = saleProperties.filter((p) => p.group === groupName);
              const populated = groupProps.filter(
                (p) => car.properties[p.key] !== undefined && car.properties[p.key] !== ''
              );
              if (populated.length === 0) return null;

              return (
                <div key={groupName} className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF3600]">
                    {groupName}
                  </h3>
                  <div className="divide-y divide-[#ECECEC] border-y border-[#ECECEC]">
                    {populated.map((prop) => {
                      const val = car.properties[prop.key];
                      let display = '';
                      if (typeof val === 'boolean') {
                        display = val ? t.common.yes : t.common.no;
                      } else if (Array.isArray(val)) {
                        display = val.join(', ');
                      } else if (typeof val === 'number') {
                        display = `${formatNumberSpaced(val)}${prop.unit ? ` ${prop.unit}` : ''}`;
                      } else {
                        display = String(val);
                      }

                      return (
                        <div
                          key={prop.id}
                          className="py-3 flex items-start justify-between gap-4 text-sm"
                        >
                          <span className="text-[#616161]">
                            {getLangText(lang, prop.name, prop.nameFr)}
                          </span>
                          <span className="font-medium text-[#040401] text-right tabular-nums">
                            {display}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Similar Cars */}
      {similarCars.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-[#ECECEC]">
          <h2 className="font-display font-extrabold text-2xl text-[#040401]">
            {t.common.similarCars}
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {similarCars.map((sc) => (
              <CarCard
                key={sc.id}
                car={sc}
                onSelect={(id) => navigatePublic({ page: 'car-detail', carId: id })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Zoom Lightbox Modal */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden relative shadow-2xl p-2 clay-card">
            <button
              type="button"
              onClick={() => setZoomOpen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 border border-[#ECECEC] flex items-center justify-center text-[#040401] cursor-pointer shadow-sm hover:bg-[#FFF3EE]"
            >
              <X className="w-5 h-5" />
            </button>
            <VehicleVisual
              bodyType={bodyType}
              colour={colour}
              angle={activePhoto?.angle || 'front34'}
              title={car.title}
              className="aspect-[16/10] w-full rounded-2xl"
            />
            <div className="px-6 py-4 border-t border-[#ECECEC] text-sm font-medium text-[#040401]">
              {car.title} — {activePhoto?.caption}
            </div>
          </div>
        </div>
      )}

      {/* Viewing / Quotation Request Modal */}
      {requestModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#ECECEC] shadow-2xl w-full max-w-lg overflow-hidden clay-card">
            <div className="px-6 py-4 border-b border-[#ECECEC] flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#040401]">
                  Request Viewing / Quotation
                </h3>
                <p className="text-xs text-[#616161]">
                  {car.title} · {car.reference}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRequestModalOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-[#FFF3EE] flex items-center justify-center cursor-pointer text-[#040401]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submittedRef ? (
              <div className="p-7 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-lg text-[#040401]">
                  Viewing Request Received
                </h4>
                <p className="text-sm text-[#616161]">
                  Reference <span className="font-mono-num font-bold text-[#040401]">{submittedRef}</span> has been logged. Our showroom advisor will confirm your appointment on WhatsApp shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="clay-btn h-10 px-6 text-sm font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Full name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Marie Ngo Bassa"
                      className="dm-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      WhatsApp phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+237 6XX XX XX XX"
                      className="dm-input font-mono-num"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="name@example.cm"
                      className="dm-input"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Preferred viewing date
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="dm-input font-mono-num"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Message / questions
                  </label>
                  <textarea
                    rows={3}
                    value={formMessage}
                    onChange={(e) => setFormMessage(e.target.value)}
                    placeholder="Ask about financing, inspection report, or test drive..."
                    className="w-full p-3.5 rounded-2xl border border-[#ECECEC] bg-white text-sm focus:outline-none focus:border-[#FF3600]"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-xs text-[#616161] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waOptIn}
                    onChange={(e) => setWaOptIn(e.target.checked)}
                    className="mt-0.5 rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                  />
                  <span>{getLangText(lang, waSettings.consentTextEn, waSettings.consentTextFr)}</span>
                </label>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="clay-pill h-10 px-5 text-sm font-semibold text-[#616161] cursor-pointer hover:text-[#040401]"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="clay-btn h-10 px-6 text-sm font-semibold cursor-pointer"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
