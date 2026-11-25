import React, { useState } from 'react';
import { Car } from 'lucide-react';
import {
  siBmw,
  siFord,
  siHonda,
  siHyundai,
  siKia,
  siMitsubishi,
  siNissan,
  siPeugeot,
  siRenault,
  siSuzuki,
  siToyota,
  siVolkswagen,
} from 'simple-icons';

import heroShowroomImg from '../../assets/images/hero_showroom_suv_1794576090905.jpg';
import corollaImg from '../../assets/images/car_toyota_corolla_1794576091175.jpg';
import rav4Img from '../../assets/images/car_toyota_rav4_1794576091615.jpg';
import tucsonImg from '../../assets/images/car_hyundai_tucson_1794576092503.jpg';
import hiluxImg from '../../assets/images/car_toyota_hilux_1794576092872.jpg';
import mercedesImg from '../../assets/images/car_mercedes_sedan_1794576093086.jpg';
import sportageImg from '../../assets/images/car_kia_sportage_1794576094053.jpg';
import pradoImg from '../../assets/images/car_prado_vip_1794576092877.jpg';
import interiorImg from '../../assets/images/car_interior_cockpit_1794576093859.jpg';
import minibusImg from '../../assets/images/car_shuttle_minibus_1794576094709.jpg';

export const HERO_SHOWROOM_IMAGE = heroShowroomImg;

export const VEHICLE_IMAGES = {
  corolla: corollaImg,
  rav4: rav4Img,
  tucson: tucsonImg,
  hilux: hiluxImg,
  mercedes: mercedesImg,
  sportage: sportageImg,
  prado: pradoImg,
  interior: interiorImg,
  minibus: minibusImg,
  showroom: heroShowroomImg,
};

const IMAGE_MAP = VEHICLE_IMAGES;

export function resolveVehicleImage(
  title = '',
  bodyType = 'Sedan',
  colour = '',
  angle: 'front34' | 'side' | 'rear34' | 'interior' = 'front34',
  customUrl?: string
): string {
  if (customUrl) return customUrl;
  if (angle === 'interior') return IMAGE_MAP.interior;

  const t = title.toLowerCase();
  const b = bodyType.toLowerCase();
  const c = colour.toLowerCase();

  if (t.includes('hilux') || t.includes('ranger') || b === 'pickup' || b === 'truck') {
    return IMAGE_MAP.hilux;
  }
  if (t.includes('hiace') || t.includes('h1') || t.includes('shuttle') || b === 'minibus' || b === 'van') {
    return IMAGE_MAP.minibus;
  }
  if (t.includes('prado') || t.includes('lexus') || t.includes('land cruiser')) {
    return IMAGE_MAP.prado;
  }
  if (t.includes('sportage') || c.includes('ruby red')) {
    return IMAGE_MAP.sportage;
  }
  if (t.includes('tucson')) {
    return IMAGE_MAP.tucson;
  }
  if (t.includes('mercedes') || t.includes('c200') || t.includes('executive transfer')) {
    return IMAGE_MAP.mercedes;
  }
  if (t.includes('rav4') || t.includes('qashqai')) {
    return IMAGE_MAP.rav4;
  }
  if (t.includes('corolla') || t.includes('camry') || t.includes('yaris')) {
    return IMAGE_MAP.corolla;
  }

  if (b === 'suv') {
    if (c.includes('white')) return IMAGE_MAP.tucson;
    if (c.includes('black')) return IMAGE_MAP.prado;
    if (c.includes('red')) return IMAGE_MAP.sportage;
    return IMAGE_MAP.rav4;
  }

  if (c.includes('black')) return IMAGE_MAP.mercedes;
  return IMAGE_MAP.corolla;
}

const SIMPLE_BRAND_ICONS: Record<string, { path: string; hex: string }> = {
  toyota: siToyota,
  hyundai: siHyundai,
  kia: siKia,
  nissan: siNissan,
  peugeot: siPeugeot,
  honda: siHonda,
  ford: siFord,
  volkswagen: siVolkswagen,
  vw: siVolkswagen,
  mitsubishi: siMitsubishi,
  suzuki: siSuzuki,
  renault: siRenault,
  bmw: siBmw,
};

export const BrandLogoMark: React.FC<{
  name: string;
  badgeText?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}> = ({ name, badgeText, color = '#14213D', size = 'md' }) => {
  const boxSize =
    size === 'xs'
      ? 'w-5 h-5'
      : size === 'sm'
      ? 'w-7 h-7'
      : size === 'lg'
      ? 'w-12 h-12'
      : 'w-10 h-10';
  const iconSize =
    size === 'xs'
      ? 'w-3 h-3'
      : size === 'sm'
      ? 'w-4 h-4'
      : size === 'lg'
      ? 'w-6 h-6'
      : 'w-5 h-5';

  const normalized = name.toLowerCase().trim();
  const matchedSimple = Object.entries(SIMPLE_BRAND_ICONS).find(([key]) =>
    normalized.includes(key)
  )?.[1];

  const renderEmblem = () => {
    if (matchedSimple) {
      return (
        <svg viewBox="0 0 24 24" className={iconSize} fill="currentColor" aria-hidden="true">
          <path d={matchedSimple.path} />
        </svg>
      );
    }

    if (normalized.includes('mercedes')) {
      return (
        <svg viewBox="0 0 24 24" className={iconSize} fill="currentColor" aria-hidden="true">
          <path d="M12 1.5A10.5 10.5 0 1 0 22.5 12 10.51 10.51 0 0 0 12 1.5Zm0 1.7a8.8 8.8 0 0 1 8.75 7.93L13.1 11.4l-.1-7.85A8.7 8.7 0 0 1 12 3.2Zm-1 .06-.1 8.14-7.65-.27A8.8 8.8 0 0 1 11 3.26Zm-7.6 9.86 7.5 1.4-4.7 6.08A8.81 8.81 0 0 1 3.4 13.12Zm3.95 7.42 4.65-6.02 4.65 6.02a8.76 8.76 0 0 1-9.3 0Zm10.45-.94-4.7-6.08 7.5-1.4a8.81 8.81 0 0 1-2.8 7.48Z" />
        </svg>
      );
    }

    if (normalized.includes('lexus')) {
      return (
        <svg viewBox="0 0 24 24" className={iconSize} fill="currentColor" aria-hidden="true">
          <path d="M12 4C5.9 4 1.5 7.3 1.5 12S5.9 20 12 20s10.5-3.3 10.5-8S18.1 4 12 4Zm0 14.3c-4.9 0-8.6-2.7-8.6-6.3S7.1 5.7 12 5.7c1.6 0 3.1.3 4.4.8l-1.8 1.5A7.6 7.6 0 0 0 12 7.5c-3.7 0-6.5 2-6.5 4.5s2.8 4.5 6.5 4.5c2.9 0 5.3-1.2 6.1-3H9.7l3.5-5.7h2.2l-2.6 4.1h7.6c-.4 3.6-4.1 6.4-8.4 6.4Z" />
        </svg>
      );
    }

    const initials =
      badgeText ||
      name
        .split(/[\s-]+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return <span className="font-display font-bold text-[10px]">{initials}</span>;
  };

  return (
    <div
      className={`${boxSize} rounded-full flex items-center justify-center shrink-0 border border-[#E2E8F0] bg-white shadow-2xs`}
      style={{ color }}
      aria-hidden="true"
    >
      {renderEmblem()}
    </div>
  );
};

interface VehicleVisualProps {
  bodyType?: string;
  colour?: string;
  angle?: 'front34' | 'side' | 'rear34' | 'interior';
  title?: string;
  imageUrl?: string;
  className?: string;
}

export const VehicleVisual: React.FC<VehicleVisualProps> = ({
  bodyType = 'Sedan',
  colour = 'Silver',
  angle = 'front34',
  title = 'Vehicle',
  imageUrl,
  className = '',
}) => {
  const [errored, setErrored] = useState(false);
  const src = resolveVehicleImage(title, bodyType, colour, angle, imageUrl);

  const angleClass =
    angle === 'side'
      ? 'scale-110 object-[82%_60%]'
      : angle === 'rear34'
      ? 'scale-115 object-[18%_52%]'
      : 'object-center';

  if (errored) {
    return (
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#F1F5F9] via-[#E2E8F0] to-[#CBD5E1] flex flex-col items-center justify-center gap-2 text-[#475569] ${className}`}
        role="img"
        aria-label={`${title} ${colour} ${bodyType}`}
      >
        <Car className="w-10 h-10 text-[#14213D]/60" />
        <span className="text-xs font-medium text-[#14213D]/80 px-4 text-center line-clamp-1">
          {title}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-[#EEF2F6] ${className}`}>
      <img
        src={src}
        alt={`${title}${angle === 'interior' ? ' cabin interior' : ` (${colour} ${bodyType})`}`}
        referrerPolicy="no-referrer"
        loading="lazy"
        onError={() => setErrored(true)}
        className={`w-full h-full object-cover transition-transform duration-500 ${angleClass}`}
      />
    </div>
  );
};
