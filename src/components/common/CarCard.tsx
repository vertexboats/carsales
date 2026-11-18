import React from 'react';
import { ArrowUpRight, CheckCircle2, Fuel, Gauge, MapPin, Settings2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumberSpaced, formatXaf } from '../../i18n/translations';
import { CarForSale } from '../../types/derico';
import { PromoBadge, StatusBadge } from './StatusBadge';
import { BrandLogoMark, VehicleVisual } from './VehicleVisual';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CarCardProps {
  car: CarForSale;
  onSelect: (carId: string) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onSelect }) => {
  const { brands, lang, dealership } = useApp();
  const brand = brands.find((b) => b.id === car.brandId);

  const colour = String(car.properties.colour || 'Silver');
  const bodyType = String(car.properties.body_type || 'Sedan');
  const year = car.properties.year ? String(car.properties.year) : '';
  const city = car.properties.location ? String(car.properties.location) : '';
  const mileage = car.properties.mileage ? Number(car.properties.mileage) : null;
  const transmission = car.properties.transmission ? String(car.properties.transmission) : '';
  const fuelType = car.properties.fuel_type ? String(car.properties.fuel_type) : '';

  const compactMileage =
    mileage !== null
      ? mileage >= 1000
        ? `${Math.round(mileage / 1000)}k km`
        : `${mileage} km`
      : null;

  const waMessage = encodeURIComponent(
    `Hello ${dealership.name}, I am interested in the ${car.title} (${car.reference}) listed at ${car.priceOnRequest ? 'Price on request' : formatXaf(car.priceXaf)
    }.`
  );
  const waHref = `https://wa.me/${dealership.whatsappNumber.replace(/\D/g, '')}?text=${waMessage}`;

  return (
    <article
      onClick={() => onSelect(car.id)}
      className="group clay-card p-3 sm:p-3.5 flex flex-col cursor-pointer overflow-hidden hover:border-[#FF3600]/40 transition-all duration-300"
    >
      {/* Photo Container with Novaride rounded frame */}
      <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden rounded-2xl bg-[#F4F4F6]">
        <VehicleVisual
          bodyType={bodyType}
          colour={colour}
          angle="front34"
          title={car.title}
          className="w-full h-full group-hover:scale-[1.06] transition-transform duration-500 ease-out"
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/35 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex items-center gap-1.5">
          <StatusBadge status={car.status} className="!px-2.5 !py-0.5 !text-[10px] sm:!text-[11px] clay-pill font-bold shadow-xs" />
          {car.status === 'Available' && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-white/90">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>Live Stock</span>
            </span>
          )}
        </div>
        {car.promoTag && (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
            <PromoBadge label={car.promoTag} />
          </div>
        )}

        {/* 120-pt Checked Badge in bottom corner */}
        <div className="absolute bottom-2 left-2 hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#040401] shadow-xs">
          <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
          <span>120-pt Checked</span>
        </div>
      </div>

      {/* Sleek Card Body */}
      <div className="pt-3 sm:pt-3.5 flex-1 flex flex-col justify-between gap-2.5 sm:gap-3">
        <div className="space-y-1.5 sm:space-y-2">
          {/* Manufacturer & City */}
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
              <span className="px-2 py-0.5 rounded-full bg-[#F5F5F7] border border-[#ECECEC] text-[10px] sm:text-[11px] font-semibold text-[#040401] truncate">
                {brand?.name || 'Vehicle'}
                {year ? ` · ${year}` : ''}
              </span>
            </div>
            {city && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#616161] shrink-0">
                <MapPin className="w-3 h-3 text-[#9E9E9E]" />
                {city}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-[13px] sm:text-[16px] text-[#040401] leading-snug group-hover:text-[#FF3600] transition-colors line-clamp-1">
            {car.title}
          </h3>

          {/* Real Icon Spec Row */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-[#616161]">
            {mileage !== null && (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Gauge className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9E9E9E] shrink-0" />
                <span className="sm:hidden">{compactMileage}</span>
                <span className="hidden sm:inline">{formatNumberSpaced(mileage)} km</span>
              </span>
            )}
            {transmission && (
              <span className="inline-flex items-center gap-1">
                <Settings2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#9E9E9E] shrink-0" />
                <span className="sm:hidden">{transmission === 'Automatic' ? 'Auto' : 'Manual'}</span>
                <span className="hidden sm:inline">{transmission}</span>
              </span>
            )}
            {fuelType && (
              <span className="hidden sm:inline-flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-[#9E9E9E] shrink-0" />
                <span>{fuelType}</span>
              </span>
            )}
          </div>
        </div>

        {/* Price + Action Bar */}
        <div className="pt-2.5 sm:pt-3 border-t border-[#ECECEC] flex items-center justify-between gap-1.5">
          <div className="min-w-0">
            {car.priceOnRequest ? (
              <span className="font-display font-bold text-xs sm:text-base text-[#040401]">
                {lang === 'fr' ? 'Prix sur demande' : 'Price on request'}
              </span>
            ) : (
              <div>
                {car.previousPriceXaf && car.previousPriceXaf > car.priceXaf && (
                  <div className="text-[10px] sm:text-[11px] text-[#9E9E9E] line-through tabular-nums truncate">
                    {formatXaf(car.previousPriceXaf)}
                  </div>
                )}
                <div className="font-display font-extrabold text-[14px] sm:text-[18px] text-[#040401] tabular-nums tracking-tight whitespace-nowrap">
                  {formatXaf(car.priceXaf)}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title="Inquire on WhatsApp"
              aria-label={`WhatsApp about ${car.title}`}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#25D366]/15 text-[#15803D] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all shadow-xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
            <span className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full clay-btn-dark hover:bg-[#FF3600] text-white transition-all shadow-xs group-hover:scale-105">
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:rotate-45" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
