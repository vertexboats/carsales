import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumberSpaced, getLangText, translations } from '../../i18n/translations';
import { CarCard } from '../common/CarCard';
import { BrandLogoMark } from '../common/VehicleVisual';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

interface BuyCarsPageProps {
  brandSlug?: string;
}

export const BuyCarsPage: React.FC<BuyCarsPageProps> = ({ brandSlug }) => {
  const {
    lang,
    brands,
    models,
    properties,
    cars,
    navigatePublic,
    dealership,
    heroQuickFilter,
    setHeroQuickFilter,
  } = useApp();
  const t = translations[lang];

  const visibleBrands = useMemo(
    () => brands.filter((b) => b.visible).sort((a, b) => a.order - b.order),
    [brands]
  );

  const scopedBrand = brandSlug
    ? visibleBrands.find((b) => b.slug === brandSlug)
    : undefined;

  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>(
    scopedBrand ? [scopedBrand.id] : []
  );
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'mileage'>('newest');
  const [maxPriceXaf, setMaxPriceXaf] = useState<number>(30000000);
  const [dynamicFilters, setDynamicFilters] = useState<
    Record<string, string[] | boolean | { min?: number; max?: number }>
  >({});
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (scopedBrand) {
      setSelectedBrandIds([scopedBrand.id]);
      setSelectedModelId('');
    } else if (!brandSlug) {
      setSelectedBrandIds([]);
      setSelectedModelId('');
    }
  }, [brandSlug, scopedBrand?.id]);

  useEffect(() => {
    if (heroQuickFilter) {
      if (heroQuickFilter.brandId) setSelectedBrandIds([heroQuickFilter.brandId]);
      if (heroQuickFilter.bodyType) {
        setDynamicFilters((prev) => ({ ...prev, body_type: [heroQuickFilter.bodyType!] }));
      }
      if (heroQuickFilter.maxPrice) setMaxPriceXaf(heroQuickFilter.maxPrice);
      setHeroQuickFilter(null);
    }
  }, [heroQuickFilter]);

  const filterableProperties = useMemo(
    () =>
      properties
        .filter((p) => p.showAsFilter && p.appliesTo.includes('sale'))
        .sort((a, b) => a.order - b.order),
    [properties]
  );

  const availableModels = useMemo(() => {
    if (selectedBrandIds.length === 0) return [];
    return models.filter((m) => m.visible && selectedBrandIds.includes(m.brandId));
  }, [models, selectedBrandIds]);

  const toggleMultiOption = (propKey: string, opt: string) => {
    setDynamicFilters((prev) => {
      const current = Array.isArray(prev[propKey]) ? (prev[propKey] as string[]) : [];
      const next = current.includes(opt)
        ? current.filter((v) => v !== opt)
        : [...current, opt];
      return { ...prev, [propKey]: next };
    });
  };

  const setToggleFilter = (propKey: string, val: boolean) => {
    setDynamicFilters((prev) => ({ ...prev, [propKey]: val }));
  };

  const setRangeFilter = (propKey: string, bound: 'min' | 'max', val: string) => {
    setDynamicFilters((prev) => {
      const cur =
        typeof prev[propKey] === 'object' && !Array.isArray(prev[propKey])
          ? (prev[propKey] as { min?: number; max?: number })
          : {};
      return {
        ...prev,
        [propKey]: {
          ...cur,
          [bound]: val === '' ? undefined : Number(val),
        },
      };
    });
  };

  const clearAllFilters = () => {
    setSelectedBrandIds(scopedBrand ? [scopedBrand.id] : []);
    setSelectedModelId('');
    setSearchQuery('');
    setMaxPriceXaf(30000000);
    setDynamicFilters({});
  };

  const filteredCars = useMemo(() => {
    const base = cars.filter(
      (c) => c.visible && c.status !== 'Draft' && c.status !== 'Archived'
    );

    const matched = base.filter((car) => {
      if (selectedBrandIds.length > 0 && !selectedBrandIds.includes(car.brandId)) {
        return false;
      }
      if (selectedModelId && car.modelId !== selectedModelId) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !car.title.toLowerCase().includes(q) &&
          !car.reference.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (!car.priceOnRequest && car.priceXaf > maxPriceXaf) {
        return false;
      }

      for (const prop of filterableProperties) {
        const filterVal = dynamicFilters[prop.key];
        if (filterVal === undefined) continue;

        const carVal = car.properties[prop.key];

        if (Array.isArray(filterVal) && filterVal.length > 0) {
          if (Array.isArray(carVal)) {
            if (!filterVal.every((needed) => carVal.includes(needed))) return false;
          } else {
            if (!filterVal.includes(String(carVal ?? ''))) return false;
          }
        } else if (typeof filterVal === 'boolean' && filterVal) {
          if (!carVal) return false;
        } else if (
          typeof filterVal === 'object' &&
          !Array.isArray(filterVal) &&
          (filterVal.min !== undefined || filterVal.max !== undefined)
        ) {
          const num = Number(carVal);
          if (Number.isNaN(num)) return false;
          if (filterVal.min !== undefined && num < filterVal.min) return false;
          if (filterVal.max !== undefined && num > filterVal.max) return false;
        }
      }

      return true;
    });

    return [...matched].sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceXaf - b.priceXaf;
      if (sortBy === 'price_desc') return b.priceXaf - a.priceXaf;
      if (sortBy === 'mileage') {
        return Number(a.properties.mileage || 0) - Number(b.properties.mileage || 0);
      }
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [
    cars,
    selectedBrandIds,
    selectedModelId,
    searchQuery,
    maxPriceXaf,
    dynamicFilters,
    filterableProperties,
    sortBy,
  ]);

  const activeChips: { label: string; onRemove: () => void }[] = [];
  if (!scopedBrand && selectedBrandIds.length > 0) {
    selectedBrandIds.forEach((bid) => {
      const b = visibleBrands.find((x) => x.id === bid);
      if (b) {
        activeChips.push({
          label: `Brand: ${b.name}`,
          onRemove: () =>
            setSelectedBrandIds((prev) => prev.filter((x) => x !== bid)),
        });
      }
    });
  }
  if (selectedModelId) {
    const m = models.find((x) => x.id === selectedModelId);
    if (m) {
      activeChips.push({
        label: `Model: ${m.name}`,
        onRemove: () => setSelectedModelId(''),
      });
    }
  }
  if (maxPriceXaf < 30000000) {
    activeChips.push({
      label: `Max ${formatNumberSpaced(maxPriceXaf)} XAF`,
      onRemove: () => setMaxPriceXaf(30000000),
    });
  }
  filterableProperties.forEach((prop) => {
    const val = dynamicFilters[prop.key];
    if (Array.isArray(val) && val.length > 0) {
      val.forEach((opt) =>
        activeChips.push({
          label: `${prop.name}: ${opt}`,
          onRemove: () => toggleMultiOption(prop.key, opt),
        })
      );
    } else if (val === true) {
      activeChips.push({
        label: `${prop.name}: Yes`,
        onRemove: () => setToggleFilter(prop.key, false),
      });
    } else if (
      val &&
      typeof val === 'object' &&
      !Array.isArray(val) &&
      (val.min !== undefined || val.max !== undefined)
    ) {
      activeChips.push({
        label: `${prop.name}: ${val.min ?? 'Any'}–${val.max ?? 'Any'}`,
        onRemove: () =>
          setDynamicFilters((prev) => {
            const next = { ...prev };
            delete next[prop.key];
            return next;
          }),
      });
    }
  });

  const renderFilterControls = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-sm text-[#040401]">{t.buy.filters}</h3>
        <button
          type="button"
          onClick={clearAllFilters}
          className="text-xs font-semibold text-[#FF3600] hover:text-[#E02F00] inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t.buy.clearAll}</span>
        </button>
      </div>

      {/* Brand multi-select */}
      <div className="border-t border-[#ECECEC] pt-4">
        <div className="text-xs font-semibold text-[#040401] mb-2.5">Brand</div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {visibleBrands.map((b) => (
            <label key={b.id} className="flex items-center gap-2.5 text-xs text-[#616161] hover:text-[#040401] cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrandIds.includes(b.id)}
                onChange={() => {
                  setSelectedBrandIds((prev) =>
                    prev.includes(b.id) ? prev.filter((x) => x !== b.id) : [...prev, b.id]
                  );
                  setSelectedModelId('');
                }}
                className="w-4 h-4 rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
              />
              <span>{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dependent Model Dropdown */}
      {availableModels.length > 0 && (
        <div className="border-t border-[#ECECEC] pt-4">
          <label className="block text-xs font-semibold text-[#040401] mb-2">Model</label>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
          >
            <option value="">All models</option>
            {availableModels.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range Slider */}
      <div className="border-t border-[#ECECEC] pt-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-[#040401]">Max Price (XAF)</span>
          <span className="font-mono-num font-bold text-[#FF3600]">
            {formatNumberSpaced(maxPriceXaf)}
          </span>
        </div>
        <input
          type="range"
          min={5000000}
          max={30000000}
          step={500000}
          value={maxPriceXaf}
          onChange={(e) => setMaxPriceXaf(Number(e.target.value))}
          className="w-full accent-[#FF3600] cursor-pointer"
        />
      </div>

      {/* Dynamic Filters Driven by Vehicle Properties Library */}
      {filterableProperties.map((prop) => {
        const isCollapsed = collapsedGroups[prop.id];
        return (
          <div key={prop.id} className="border-t border-[#ECECEC] pt-4">
            <button
              type="button"
              onClick={() =>
                setCollapsedGroups((prev) => ({ ...prev, [prop.id]: !prev[prop.id] }))
              }
              className="w-full flex items-center justify-between text-xs font-semibold text-[#040401] mb-2.5 cursor-pointer"
            >
              <span>{getLangText(lang, prop.name, prop.nameFr)}</span>
              {isCollapsed ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#8290A3]" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5 text-[#8290A3]" />
              )}
            </button>

            {!isCollapsed && (
              <div>
                {prop.inputType === 'yes_no' ? (
                  <label className="flex items-center gap-2.5 text-xs text-[#616161] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(dynamicFilters[prop.key])}
                      onChange={(e) => setToggleFilter(prop.key, e.target.checked)}
                      className="w-4 h-4 rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                    />
                    <span>Yes / Included only</span>
                  </label>
                ) : prop.inputType === 'number' || prop.inputType === 'number_range' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder={prop.key === 'year' ? 'Min 2015' : 'Min'}
                      value={
                        typeof dynamicFilters[prop.key] === 'object' &&
                        !Array.isArray(dynamicFilters[prop.key])
                          ? (dynamicFilters[prop.key] as { min?: number }).min ?? ''
                          : ''
                      }
                      onChange={(e) => setRangeFilter(prop.key, 'min', e.target.value)}
                      className="h-9 px-2.5 rounded-xl border border-[#ECECEC] bg-white text-xs font-mono-num focus:outline-none focus:border-[#FF3600]"
                    />
                    <input
                      type="number"
                      placeholder={prop.key === 'year' ? 'Max 2026' : 'Max'}
                      value={
                        typeof dynamicFilters[prop.key] === 'object' &&
                        !Array.isArray(dynamicFilters[prop.key])
                          ? (dynamicFilters[prop.key] as { max?: number }).max ?? ''
                          : ''
                      }
                      onChange={(e) => setRangeFilter(prop.key, 'max', e.target.value)}
                      className="h-9 px-2.5 rounded-xl border border-[#ECECEC] bg-white text-xs font-mono-num focus:outline-none focus:border-[#FF3600]"
                    />
                  </div>
                ) : prop.filterStyle === 'dropdown' && prop.options ? (
                  <select
                    value={
                      Array.isArray(dynamicFilters[prop.key])
                        ? (dynamicFilters[prop.key] as string[])[0] || ''
                        : ''
                    }
                    onChange={(e) =>
                      setDynamicFilters((prev) => ({
                        ...prev,
                        [prop.key]: e.target.value ? [e.target.value] : [],
                      }))
                    }
                    className="w-full h-10 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                  >
                    <option value="">Any</option>
                    {prop.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {(prop.options || []).map((opt) => {
                      const selected =
                        Array.isArray(dynamicFilters[prop.key]) &&
                        (dynamicFilters[prop.key] as string[]).includes(opt);
                      return (
                        <label
                          key={opt}
                          className="flex items-center gap-2.5 text-xs text-[#616161] hover:text-[#040401] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleMultiOption(prop.key, opt)}
                            className="w-4 h-4 rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const emptyWaHref = `https://wa.me/${dealership.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hello Derico Motors, I am looking for a car matching: ${
      activeChips.map((c) => c.label).join(', ') || searchQuery || 'Custom request'
    }.`
  )}`;

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
      {/* Header or Scoped Brand Banner */}
      {scopedBrand ? (
        <div className="clay-card p-6 sm:p-7 space-y-5 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <BrandLogoMark
                name={scopedBrand.name}
                badgeText={scopedBrand.badgeText}
                color={scopedBrand.logoColor}
                size="lg"
              />
              <div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#040401]">
                  {scopedBrand.name} Vehicles for Sale
                </h1>
                <p className="text-sm text-[#616161] mt-1">
                  {getLangText(lang, scopedBrand.description, scopedBrand.descriptionFr)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigatePublic({ page: 'buy' })}
              className="h-9 px-4 rounded-full border border-[#ECECEC] text-xs font-bold text-[#040401] hover:bg-[#FFF3EE] hover:text-[#FF3600] cursor-pointer transition-colors clay-pill"
            >
              View all brands
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#ECECEC]">
            <button
              type="button"
              onClick={() => setSelectedModelId('')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all clay-pill ${
                selectedModelId === ''
                  ? 'bg-[#040401] text-white'
                  : 'bg-[#F5F5F7] text-[#616161] hover:text-[#040401]'
              }`}
            >
              All {scopedBrand.name}
            </button>
            {models
              .filter((m) => m.brandId === scopedBrand.id && m.visible)
              .map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() =>
                    setSelectedModelId((prev) => (prev === m.id ? '' : m.id))
                  }
                  className={`px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all clay-pill ${
                    selectedModelId === m.id
                      ? 'bg-[#FF3600] text-white'
                      : 'bg-[#F5F5F7] text-[#616161] hover:text-[#040401]'
                  }`}
                >
                  {m.name}
                </button>
              ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3600] mb-1">
              <span>EXPLORE SHOWROOM STOCK</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#040401]">
              {t.buy.title}
            </h1>
            <p className="text-sm sm:text-base text-[#616161] mt-1.5">{t.buy.subtitle}</p>
          </div>

          {/* Top Shop by Brand Strip */}
          <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-9 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSelectedBrandIds([])}
              className={`rounded-2xl border p-2.5 sm:p-3.5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 sm:gap-2 ${
                selectedBrandIds.length === 0
                  ? 'bg-[#040401] border-[#040401] text-white shadow-sm clay-pill'
                  : 'clay-card text-[#616161] hover:border-[#FF3600]/40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  selectedBrandIds.length === 0 ? 'bg-white/15 text-white' : 'bg-[#F5F5F7] text-[#040401]'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold line-clamp-1">{t.buy.allBrands}</span>
            </button>

            {visibleBrands.map((b) => {
              const count =
                cars.filter(
                  (c) =>
                    c.brandId === b.id &&
                    c.visible &&
                    c.status !== 'Draft' &&
                    c.status !== 'Archived'
                ).length + (b.catalogCountOffset || 0);
              const isSelected = selectedBrandIds.includes(b.id);
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => navigatePublic({ page: 'buy', brandSlug: b.slug })}
                  className={`clay-card p-2.5 sm:p-3.5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FFF3EE] !border-[#FF3600]'
                      : 'hover:border-[#FF3600]/40'
                  }`}
                >
                  <BrandLogoMark
                    name={b.name}
                    badgeText={b.badgeText}
                    color={b.logoColor}
                    size="sm"
                  />
                  <div className="text-[11px] sm:text-xs font-bold text-[#040401] line-clamp-1">{b.name}</div>
                  <div className="hidden sm:block text-[11px] text-[#8E8E93] tabular-nums">{count} cars</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Split: Left Filter Panel + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        <aside className="hidden lg:block lg:col-span-3 clay-card p-5 sticky top-24 bg-white">
          {renderFilterControls()}
        </aside>

        <div className="lg:col-span-9 space-y-5">
          {/* Search + Sort Toolbar */}
          <div className="clay-card p-3.5 flex flex-wrap items-center justify-between gap-3 bg-white">
            <div className="flex items-center gap-2.5 flex-1 min-w-[220px]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search model or reference (e.g. Corolla, DM-S-0101)..."
                  className="dm-input !pl-10"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden h-11 px-4 rounded-xl border border-[#ECECEC] bg-white text-xs font-bold text-[#040401] inline-flex items-center gap-1.5 shrink-0 cursor-pointer clay-pill"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#FF3600]" />
                <span>{t.buy.filters}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-medium text-[#616161] tabular-nums">
                <strong className="text-[#040401]">{filteredCars.length}</strong> {t.buy.resultsCount}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="dm-input !w-auto !h-10 text-xs font-bold"
              >
                <option value="newest">{t.buy.sortNewest}</option>
                <option value="price_asc">{t.buy.sortPriceAsc}</option>
                <option value="price_desc">{t.buy.sortPriceDesc}</option>
                <option value="mileage">{t.buy.sortMileage}</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.onRemove}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF3EE] border border-[#FF3600]/30 text-xs font-bold text-[#FF3600] cursor-pointer hover:bg-[#FFE6DC] clay-pill transition-colors"
                >
                  <span>{chip.label}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-semibold text-[#616161] hover:text-[#FF3600] underline ml-1 cursor-pointer transition-colors"
              >
                {t.buy.clearAll}
              </button>
            </div>
          )}

          {/* Live Inventory Status Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-xl bg-[#F5F5F7] border border-[#ECECEC] text-[11px] text-[#616161]">
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="font-semibold text-[#040401]">
                Showing {filteredCars.length} verified vehicles in Douala & Yaoundé bonded stock
              </span>
            </div>
            <span className="hidden sm:inline-block text-[#9E9E9E]">
              120-Point Mechanical Audit · CEMAC Customs Documents Verified
            </span>
          </div>

          {/* Results Grid or Empty State */}
          {filteredCars.length === 0 ? (
            <div className="clay-card p-10 sm:p-14 text-center space-y-4 bg-white">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF3EE] text-[#FF3600] flex items-center justify-center mx-auto shadow-xs">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#040401]">
                {t.buy.emptyTitle}
              </h3>
              <p className="text-sm text-[#616161] max-w-md mx-auto">
                {t.buy.emptySub}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={emptyWaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-11 px-6 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-sm font-bold inline-flex items-center gap-2 clay-pill"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>{t.buy.requestSourcing}</span>
                </a>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="h-11 px-6 rounded-full border border-[#ECECEC] bg-[#F5F5F7] hover:bg-white text-sm font-bold text-[#040401] cursor-pointer transition-colors clay-pill"
                >
                  {t.buy.clearAll}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  onSelect={(id) => navigatePublic({ page: 'car-detail', carId: id })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[#040401]/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-xs h-full flex flex-col shadow-2xl">
            <div className="px-5 py-4 border-b border-[#ECECEC] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF3600]" />
                <span className="font-display font-bold text-base text-[#040401]">
                  {t.buy.filters}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#ECECEC] flex items-center justify-center text-[#040401] cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">{renderFilterControls()}</div>
            <div className="p-4 border-t border-[#ECECEC] bg-white">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full h-11 rounded-full clay-btn text-white text-sm font-bold cursor-pointer"
              >
                Show {filteredCars.length} vehicles
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
