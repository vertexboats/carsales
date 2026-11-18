import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Luggage,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatXaf, getLangText, translations } from '../../i18n/translations';
import { CalendarPicker } from '../common/CalendarPicker';
import { CtaTrio } from '../common/CtaTrio';
import { StatusBadge } from '../common/StatusBadge';
import { BrandLogoMark, VehicleVisual } from '../common/VehicleVisual';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const PickUpPage: React.FC<{ pickupId?: string }> = ({ pickupId }) => {
  const {
    lang,
    pickupVehicles,
    brands,
    dealership,
    navigatePublic,
    setPickupBookings,
    setPolicyModalSlug,
    addToast,
    waSettings,
  } = useApp();
  const t = translations[lang];

  const selectedVehicle = pickupId
    ? pickupVehicles.find((p) => p.id === pickupId)
    : undefined;

  const [date, setDate] = useState('2026-11-16');
  const [time, setTime] = useState('14:30');
  const [pickupPoint, setPickupPoint] = useState('Douala International Airport (DLA)');
  const [destination, setDestination] = useState('Akwa / Bonapriso, Douala');
  const [passengers, setPassengers] = useState(2);
  const [luggage, setLuggage] = useState(2);
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [waConsent, setWaConsent] = useState(true);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);

  if (!selectedVehicle) {
    return (
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3600]">
            <span className="live-dot" />
            <span>EXECUTIVE AIRPORT &amp; INTERCITY TRANSFERS</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#040401]">
            Airport &amp; Intercity Pick-up Transfers
          </h1>
          <p className="text-sm sm:text-base text-[#616161]">
            Fixed-price private transfers with vetted chauffeurs across Douala, Yaoundé, and Kribi.
          </p>
        </div>

        {/* Live Pick-up Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#ECECEC] text-xs text-[#616161]">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="font-bold text-[#040401]">
              Flight Tracking &amp; Chauffeur Dispatch Active (DLA &amp; NSI)
            </span>
          </div>
          <span className="text-[#9E9E9E] hidden sm:inline">
            Zero surge pricing · Guaranteed flight delay buffer included
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-7">
          {pickupVehicles
            .filter((v) => v.visible)
            .map((v) => {
              const brand = brands.find((b) => b.id === v.brandId);
              const waHref = `https://wa.me/${dealership.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                `Hello ${dealership.name}, I want to book the ${v.title} (${v.reference}) pick-up transfer at ${formatXaf(v.pricePerTripXaf)}.`
              )}`;
              return (
                <article
                  key={v.id}
                  onClick={() => navigatePublic({ page: 'pickup-detail', pickupId: v.id })}
                  className="group clay-card p-2 sm:p-3 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#FFF8F6] rounded-2xl overflow-hidden p-2">
                    <VehicleVisual
                      bodyType={String(v.properties.body_type || 'Sedan')}
                      colour={String(v.properties.colour || 'Silver')}
                      angle="front34"
                      title={v.title}
                      className="w-full h-full group-hover:scale-[1.05] transition-transform duration-500 rounded-xl"
                    />
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5">
                      <span className="glass-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#040401]">
                        <span className="live-dot" />
                        <span>Ready</span>
                      </span>
                      <StatusBadge status={v.status} className="!px-2 !py-0.5 !text-[10px] sm:!text-[11px]" />
                    </div>
                  </div>
                  <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between gap-2.5 sm:gap-4">
                    <div className="space-y-1.5 sm:space-y-2.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {brand && (
                            <BrandLogoMark
                              name={brand.name}
                              badgeText={brand.badgeText}
                              color={brand.logoColor}
                              size="xs"
                            />
                          )}
                          <span className="text-[11px] sm:text-xs font-semibold text-[#8290A3] truncate">
                            {brand?.name || 'Transfer'}
                          </span>
                        </div>
                        <span className="hidden sm:inline text-[11px] font-mono-num text-[#8290A3]">
                          {v.reference}
                        </span>
                      </div>

                      <h2 className="font-display font-bold text-[13px] sm:text-lg text-[#040401] leading-snug group-hover:text-[#FF3600] transition-colors line-clamp-1">
                        {v.title}
                      </h2>

                      <p className="text-[11px] sm:text-xs font-semibold text-[#FF3600] flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                        <span className="line-clamp-1">
                          {getLangText(lang, v.routeSummaryEn, v.routeSummaryFr)}
                        </span>
                      </p>

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-[#616161]">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3600] shrink-0" />
                          <span className="sm:hidden">{v.maxPassengers} pax</span>
                          <span className="hidden sm:inline">Up to {v.maxPassengers} passengers</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Luggage className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3600] shrink-0" />
                          <span>{v.maxLuggage}</span>
                          <span className="hidden sm:inline">bags</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-2.5 sm:pt-3.5 border-t border-[#ECECEC] flex items-center justify-between gap-1.5">
                      <div className="min-w-0">
                        <div className="font-display font-extrabold text-[13px] sm:text-xl text-[#040401] tabular-nums tracking-tight whitespace-nowrap">
                          {formatXaf(v.pricePerTripXaf)}
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-[#8290A3]">{t.common.perTrip}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Book via WhatsApp"
                          aria-label={`WhatsApp about ${v.title}`}
                          className="clay-pill w-8 h-8 sm:w-9 sm:h-9 bg-[#25D366]/12 text-[#16A34A] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                        <span className="clay-btn-dark inline-flex items-center justify-center w-8 h-8 sm:w-auto sm:h-9 sm:px-4 text-xs font-semibold gap-1 group-hover:!bg-[#FF3600] transition-colors">
                          <span className="hidden sm:inline">Book Pick-up</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
        </div>
      </div>
    );
  }

  const prefilledWa = `Hello Derico Motors, I want to book the ${selectedVehicle.title} (${selectedVehicle.reference}) on ${date} at ${time} from ${pickupPoint} to ${destination}.`;

  const handleBookPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyAccepted) {
      addToast({ type: 'warning', title: 'Please accept the Pick-up Policy to continue' });
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) return;
    const ref = `DM-PK-${Math.floor(4010 + Math.random() * 899)}`;
    setPickupBookings((prev) => [
      {
        id: `pb-${Date.now()}`,
        reference: ref,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || 'Not provided',
        pickupVehicleId: selectedVehicle.id,
        date,
        time,
        pickupPoint,
        destination,
        passengers,
        luggage,
        notes,
        driverId: null,
        policyAcceptedVersion: 'v1.8',
        policyAcceptedAt: '2026-11-13 10:55',
        totalXaf: selectedVehicle.pricePerTripXaf,
        status: 'Pending',
        paymentStatus: 'Unpaid',
        whatsappStatus: 'sent',
        createdAt: '2026-11-13 10:55',
      },
      ...prev,
    ]);
    setConfirmedRef(ref);
    addToast({
      type: 'success',
      title: 'Pick-up request submitted',
      description: `Reference ${ref} created.`,
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <button
        type="button"
        onClick={() => navigatePublic({ page: 'pickup' })}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#616161] hover:text-[#040401] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All pick-up vehicles</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="clay-card p-2 aspect-[16/10] bg-white overflow-hidden">
            <VehicleVisual
              bodyType={String(selectedVehicle.properties.body_type || 'Sedan')}
              colour={String(selectedVehicle.properties.colour || 'Midnight Blue')}
              angle="front34"
              title={selectedVehicle.title}
              className="w-full h-full rounded-2xl"
            />
          </div>

          <div className="clay-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono-num text-xs text-[#8290A3]">
                {selectedVehicle.reference}
              </span>
              <StatusBadge status={selectedVehicle.status} />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-[#040401]">
              {selectedVehicle.title}
            </h1>
            <p className="text-sm font-semibold text-[#FF3600] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>
                {getLangText(lang, selectedVehicle.routeSummaryEn, selectedVehicle.routeSummaryFr)}
              </span>
            </p>
            <div className="flex items-baseline gap-2 py-3.5 border-y border-[#ECECEC]">
              <span className="font-display font-extrabold text-2xl text-[#040401] tabular-nums">
                {formatXaf(selectedVehicle.pricePerTripXaf)}
              </span>
              <span className="text-sm text-[#8290A3]">fixed rate per trip</span>
            </div>
            <CtaTrio
              prefilledMessage={prefilledWa}
              onOpenForm={() =>
                document.getElementById('pickup-booking-form')?.scrollIntoView({ behavior: 'smooth' })
              }
              formLabel="Book transfer"
            />
          </div>
        </div>

        <div
          id="pickup-booking-form"
          className="lg:col-span-6 clay-card p-6 sm:p-7 space-y-5"
        >
          {confirmedRef ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#040401]">
                Transfer Request Received
              </h2>
              <p className="text-sm text-[#616161]">
                Reference <span className="font-mono-num font-bold text-[#FF3600]">{confirmedRef}</span>. We will assign your driver and confirm on WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setConfirmedRef(null)}
                className="clay-btn h-10 px-6 text-sm font-semibold cursor-pointer"
              >
                Book another transfer
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookPickup} className="space-y-4">
              <h2 className="font-display font-bold text-lg text-[#040401]">
                Schedule Pick-up Transfer
              </h2>

              <CalendarPicker
                mode="single"
                bookedDates={selectedVehicle.bookedDates}
                startDate={date}
                onChange={(d) => setDate(d)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Pick-up time (WAT) *
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="dm-input font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Passengers (max {selectedVehicle.maxPassengers})
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedVehicle.maxPassengers}
                    value={passengers}
                    onChange={(e) => setPassengers(Number(e.target.value))}
                    className="dm-input font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Luggage (max {selectedVehicle.maxLuggage})
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={selectedVehicle.maxLuggage}
                    value={luggage}
                    onChange={(e) => setLuggage(Number(e.target.value))}
                    className="dm-input font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Pick-up point *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupPoint}
                    onChange={(e) => setPickupPoint(e.target.value)}
                    className="dm-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="dm-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">Full name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="dm-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">WhatsApp phone *</label>
                  <input
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="dm-input font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="dm-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Flight number / notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. AF 958 landing 16:00"
                  className="dm-input"
                />
              </div>

              <div className="space-y-2.5">
                <label className="flex items-start gap-2.5 text-xs text-[#040401] cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                  />
                  <span>
                    I accept the{' '}
                    <button
                      type="button"
                      onClick={() => setPolicyModalSlug('pickup')}
                      className="text-[#FF3600] font-semibold underline cursor-pointer"
                    >
                      Derico Motors Pick-up Policy
                    </button>{' '}
                    (v1.8) *
                  </span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-[#8290A3] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={waConsent}
                    onChange={(e) => setWaConsent(e.target.checked)}
                    className="mt-0.5 rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                  />
                  <span>{getLangText(lang, waSettings.consentTextEn, waSettings.consentTextFr)}</span>
                </label>
              </div>

              <button
                type="submit"
                className="clay-btn w-full h-12 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Send pick-up request ({formatXaf(selectedVehicle.pricePerTripXaf)})</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
