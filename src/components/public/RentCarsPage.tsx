import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Car,
  CheckCircle2,
  Fuel,
  MapPin,
  Settings2,
  ShieldCheck,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatXaf, getLangText, translations } from '../../i18n/translations';
import { CalendarPicker } from '../common/CalendarPicker';
import { CtaTrio } from '../common/CtaTrio';
import { StatusBadge } from '../common/StatusBadge';
import { BrandLogoMark, VehicleVisual } from '../common/VehicleVisual';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const RentCarsPage: React.FC<{ rentalId?: string }> = ({ rentalId }) => {
  const {
    lang,
    rentals,
    brands,
    dealership,
    navigatePublic,
    setRentalBookings,
    setPolicyModalSlug,
    addToast,
    waSettings,
  } = useApp();
  const t = translations[lang];

  const selectedRental = rentalId ? rentals.find((r) => r.id === rentalId) : undefined;

  const [withDriver, setWithDriver] = useState(true);
  const [startDate, setStartDate] = useState('2026-11-18');
  const [endDate, setEndDate] = useState('2026-11-19');
  const [pickupLoc, setPickupLoc] = useState('Douala International Airport (DLA)');
  const [returnLoc, setReturnLoc] = useState('Bonapriso Showroom, Douala');
  const [notes, setNotes] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [waConsent, setWaConsent] = useState(true);
  const [confirmedRef, setConfirmedRef] = useState<string | null>(null);
  const [activeAngle, setActiveAngle] = useState<'front34' | 'side' | 'interior' | 'rear34'>('front34');

  const daysCount = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const s = new Date(`${startDate}T00:00:00`);
    const e = new Date(`${endDate}T00:00:00`);
    const diff = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  }, [startDate, endDate]);

  if (!selectedRental) {
    const visibleRentals = rentals.filter((r) => r.visible);
    return (
      <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3600]">
            <span className="live-dot" />
            <span>PREMIUM MOBILITY &amp; FLEET HIRE</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#040401]">
            Rent a Vehicle in Cameroon
          </h1>
          <p className="text-sm sm:text-base text-[#616161]">
            24-hour transparent pricing in XAF. Self-drive or with a vetted bilingual Derico Motors chauffeur.
          </p>
        </div>

        {/* Live Availability Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#ECECEC] text-xs text-[#616161]">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="font-bold text-[#040401]">
              {visibleRentals.length} Fleet Vehicles Available for Immediate Booking
            </span>
          </div>
          <span className="text-[#9E9E9E] hidden sm:inline">
            Airport Meet &amp; Greet (DLA &amp; NSI) · Comprehensive Insurance Included
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {visibleRentals.map((r) => {
            const brand = brands.find((b) => b.id === r.brandId);
            const transmission = String(r.properties.transmission || 'Automatic');
            const city = r.properties.location ? String(r.properties.location) : '';
            const waHref = `https://wa.me/${dealership.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
              `Hello ${dealership.name}, I want to rent the ${r.title} (${r.reference}) at ${formatXaf(r.pricePerDayXaf)}/day.`
            )}`;

            return (
              <article
                key={r.id}
                onClick={() => navigatePublic({ page: 'rent-detail', rentalId: r.id })}
                className="group clay-card p-2 sm:p-3 overflow-hidden transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1.5"
              >
                <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#FFF8F6] rounded-2xl overflow-hidden p-2">
                  <VehicleVisual
                    bodyType={String(r.properties.body_type || 'Sedan')}
                    colour={String(r.properties.colour || 'Silver')}
                    angle="front34"
                    title={r.title}
                    className="w-full h-full group-hover:scale-[1.05] transition-transform duration-500 rounded-xl"
                  />
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5">
                    <span className="glass-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold text-[#040401]">
                      <span className="live-dot" />
                      <span>Available</span>
                    </span>
                    <StatusBadge status={r.status} className="!px-2 !py-0.5 !text-[10px] sm:!text-[11px]" />
                  </div>
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
                    <span className="glass-badge px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold text-[#040401]">
                      Self-Drive / Chauffeur
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5 sm:gap-3.5">
                  <div className="space-y-1.5 sm:space-y-2">
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
                          {brand?.name || 'Rental'}
                          {r.properties.year ? ` · ${String(r.properties.year)}` : ''}
                        </span>
                      </div>
                      {city && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#8290A3] shrink-0">
                          <MapPin className="w-3 h-3 text-[#FF3600]" />
                          {city}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display font-bold text-[14px] sm:text-[17px] text-[#040401] leading-snug group-hover:text-[#FF3600] transition-colors line-clamp-1">
                      {r.title}
                    </h2>

                    <p className="hidden sm:block text-xs text-[#616161] leading-relaxed line-clamp-2">
                      {getLangText(lang, r.shortDescriptionEn, r.shortDescriptionFr)}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-[#616161]">
                      <span className="inline-flex items-center gap-1">
                        <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3600] shrink-0" />
                        <span>{String(r.properties.seats || 5)}</span>
                        <span className="hidden sm:inline">seats</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Settings2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF3600] shrink-0" />
                        <span className="sm:hidden">{transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
                        <span className="hidden sm:inline">{transmission}</span>
                      </span>
                      {r.driverAvailable && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[#16A34A] font-medium">
                          <UserCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Driver option</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 sm:pt-3 border-t border-[#ECECEC] flex items-center justify-between gap-1.5">
                    <div className="min-w-0">
                      <div className="font-display font-extrabold text-[14px] sm:text-[18px] text-[#040401] tabular-nums tracking-tight whitespace-nowrap">
                        {formatXaf(r.pricePerDayXaf)}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-[#8290A3]">{t.common.perDay}</div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Book via WhatsApp"
                        aria-label={`WhatsApp about ${r.title}`}
                        className="clay-pill w-8 h-8 sm:w-9 sm:h-9 bg-[#25D366]/12 text-[#16A34A] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </a>
                      <span className="clay-btn-dark inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 group-hover:!bg-[#FF3600] transition-colors">
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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

  const brand = brands.find((b) => b.id === selectedRental.brandId);
  const dailyDriverFee = withDriver && selectedRental.driverAvailable ? selectedRental.driverDailyFeeXaf : 0;
  const totalXaf = daysCount * (selectedRental.pricePerDayXaf + dailyDriverFee);

  const prefilledWa = `Hello Derico Motors, I would like to rent the ${selectedRental.title} (${selectedRental.reference}) from ${startDate} to ${endDate} (${withDriver ? 'With driver' : 'Self-drive'}).`;

  const handleBookRental = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyAccepted) {
      addToast({ type: 'warning', title: 'Please accept the Rental Policy to proceed' });
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) return;
    const ref = `DM-RB-${Math.floor(3020 + Math.random() * 899)}`;
    setRentalBookings((prev) => [
      {
        id: `rb-${Date.now()}`,
        reference: ref,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail.trim() || 'Not provided',
        rentalCarId: selectedRental.id,
        startDate,
        endDate: endDate || startDate,
        withDriver,
        driverId: null,
        pickupLocation: pickupLoc,
        returnLocation: returnLoc,
        notes,
        policyAcceptedVersion: 'v2.4',
        policyAcceptedAt: '2026-11-13 10:50',
        totalXaf,
        status: 'Pending',
        paymentStatus: 'Unpaid',
        whatsappStatus: 'sent',
        createdAt: '2026-11-13 10:50',
      },
      ...prev,
    ]);
    setConfirmedRef(ref);
    addToast({
      type: 'success',
      title: 'Rental request submitted',
      description: `Reference ${ref} created. Confirmation sent to WhatsApp.`,
    });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-10 space-y-8">
      <button
        type="button"
        onClick={() => navigatePublic({ page: 'rent' })}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#616161] hover:text-[#040401] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>All rental vehicles</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="clay-card p-2 aspect-[16/10] bg-white overflow-hidden">
              <VehicleVisual
                bodyType={String(selectedRental.properties.body_type || 'Sedan')}
                colour={String(selectedRental.properties.colour || 'Silver')}
                angle={activeAngle}
                title={selectedRental.title}
                className="w-full h-full rounded-2xl"
              />
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {(['front34', 'side', 'interior', 'rear34'] as const).map((ang) => (
                <button
                  key={ang}
                  type="button"
                  onClick={() => setActiveAngle(ang)}
                  className={`rounded-2xl overflow-hidden border-2 aspect-[4/3] cursor-pointer transition-all ${
                    activeAngle === ang ? 'border-[#FF3600] shadow-sm' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <VehicleVisual
                    bodyType={String(selectedRental.properties.body_type || 'Sedan')}
                    colour={String(selectedRental.properties.colour || 'Silver')}
                    angle={ang}
                    title={selectedRental.title}
                    className="w-full h-full rounded-xl"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="clay-card p-6 space-y-4">
            <div className="flex items-center justify-between">
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
                  {brand?.name} · {selectedRental.reference}
                </span>
              </div>
              <StatusBadge status={selectedRental.status} />
            </div>

            <h1 className="font-display font-extrabold text-2xl text-[#040401]">
              {selectedRental.title}
            </h1>
            <p className="text-sm text-[#616161] leading-relaxed">
              {getLangText(lang, selectedRental.shortDescriptionEn, selectedRental.shortDescriptionFr)}
            </p>

            <div className="flex items-baseline gap-2 py-3.5 border-y border-[#ECECEC]">
              <span className="font-display font-extrabold text-2xl text-[#040401] tabular-nums">
                {formatXaf(selectedRental.pricePerDayXaf)}
              </span>
              <span className="text-sm text-[#8290A3]">per 24 hours</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {[
                { k: 'Seats', v: `${selectedRental.properties.seats || 5} seats`, Icon: Users },
                { k: 'Transmission', v: String(selectedRental.properties.transmission || 'Automatic'), Icon: Settings2 },
                { k: 'Fuel', v: String(selectedRental.properties.fuel_type || 'Petrol'), Icon: Fuel },
                { k: 'Location', v: String(selectedRental.properties.location || 'Douala'), Icon: MapPin },
                { k: 'Interior', v: String(selectedRental.properties.interior || 'Fabric'), Icon: Car },
                { k: 'Driver option', v: selectedRental.driverAvailable ? 'Available' : 'Self-drive only', Icon: UserCheck },
              ].map(({ k, v, Icon }) => (
                <div key={k} className="p-3 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] flex items-start gap-2">
                  <Icon className="w-4 h-4 text-[#FF3600] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="text-[11px] text-[#8290A3]">{k}</div>
                    <div className="font-semibold text-[#040401] mt-0.5 truncate">{v}</div>
                  </div>
                </div>
              ))}
            </div>

            <CtaTrio
              prefilledMessage={prefilledWa}
              onOpenForm={() => {
                document.getElementById('rental-booking-panel')?.scrollIntoView({ behavior: 'smooth' });
              }}
              formLabel="Jump to booking"
            />
          </div>
        </div>

        {/* Right: Interactive Booking Panel */}
        <div
          id="rental-booking-panel"
          className="lg:col-span-6 clay-card p-6 sm:p-7 space-y-5"
        >
          {confirmedRef ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-display font-bold text-xl text-[#040401]">
                Request received. We will confirm on WhatsApp.
              </h2>
              <p className="text-sm text-[#616161]">
                Booking reference:{' '}
                <span className="font-mono-num font-bold text-[#FF3600]">{confirmedRef}</span>
              </p>
              <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] text-left text-xs space-y-1.5 max-w-md mx-auto">
                <div><strong>Vehicle:</strong> {selectedRental.title}</div>
                <div><strong>Dates:</strong> {startDate} to {endDate} ({daysCount} day{daysCount > 1 ? 's' : ''})</div>
                <div><strong>Mode:</strong> {withDriver ? 'With Derico Motors Driver' : 'Self-drive'}</div>
                <div><strong>Estimated Total:</strong> {formatXaf(totalXaf)}</div>
              </div>
              <button
                type="button"
                onClick={() => setConfirmedRef(null)}
                className="clay-btn h-10 px-6 text-sm font-semibold cursor-pointer"
              >
                Make another booking
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookRental} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-[#040401]">
                  Book this Rental
                </h2>
                <span className="text-xs font-medium text-[#8290A3] inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF3600]" />
                  Live availability
                </span>
              </div>

              {/* 1. Self-drive vs With driver Toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-2">
                  1. Driving option
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-full bg-[#FFF3EE] border border-[#ECECEC]">
                  <button
                    type="button"
                    onClick={() => setWithDriver(false)}
                    className={`h-10 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      !withDriver ? 'clay-btn-white !text-[#040401]' : 'text-[#616161] hover:text-[#040401]'
                    }`}
                  >
                    Self-drive
                  </button>
                  <button
                    type="button"
                    disabled={!selectedRental.driverAvailable}
                    onClick={() => setWithDriver(true)}
                    className={`h-10 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                      withDriver ? 'clay-btn-dark' : 'text-[#616161] hover:text-[#040401]'
                    }`}
                  >
                    With driver (+{formatXaf(selectedRental.driverDailyFeeXaf)}/day)
                  </button>
                </div>
              </div>

              {/* 2. Calendar Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-2">
                  2. Select rental dates ({startDate} → {endDate})
                </label>
                <CalendarPicker
                  mode="range"
                  bookedRanges={selectedRental.bookedRanges}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(s, e) => {
                    setStartDate(s);
                    setEndDate(e || s);
                  }}
                />
              </div>

              {/* 3. Locations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Pick-up location *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupLoc}
                    onChange={(e) => setPickupLoc(e.target.value)}
                    className="dm-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                    Return location *
                  </label>
                  <input
                    type="text"
                    required
                    value={returnLoc}
                    onChange={(e) => setReturnLoc(e.target.value)}
                    className="dm-input"
                  />
                </div>
              </div>

              {/* 4. Client Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#040401] mb-1.5">Full name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Full name"
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
                    placeholder="Optional"
                    className="dm-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Flight number, child seat, or intercity travel..."
                  className="w-full p-3 rounded-2xl border border-[#ECECEC] bg-white text-sm focus:outline-none focus:border-[#FF3600]"
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
                      onClick={() => setPolicyModalSlug('rental')}
                      className="text-[#FF3600] font-semibold underline cursor-pointer"
                    >
                      Derico Motors Rental Policy
                    </button>{' '}
                    (v2.4) *
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

              <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>
                    Vehicle ({daysCount} day{daysCount > 1 ? 's' : ''} × {formatXaf(selectedRental.pricePerDayXaf)})
                  </span>
                  <span className="font-mono-num font-semibold text-[#040401]">
                    {formatXaf(daysCount * selectedRental.pricePerDayXaf)}
                  </span>
                </div>
                {withDriver && (
                  <div className="flex justify-between">
                    <span>
                      Chauffeur ({daysCount} day{daysCount > 1 ? 's' : ''} × {formatXaf(selectedRental.driverDailyFeeXaf)})
                    </span>
                    <span className="font-mono-num font-semibold text-[#040401]">
                      {formatXaf(daysCount * selectedRental.driverDailyFeeXaf)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#ECECEC] flex justify-between items-center text-sm font-display font-bold text-[#040401]">
                  <span>Estimated Total (info only)</span>
                  <span className="font-mono-num text-[#FF3600]">{formatXaf(totalXaf)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="clay-btn w-full h-12 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Send booking request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
