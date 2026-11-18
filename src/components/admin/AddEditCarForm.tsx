import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Copy,
  Eye,
  Plus,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatXaf } from '../../i18n/translations';
import {
  CarForSale,
  CarPhoto,
  CarStatus,
  PromoTag,
  PropertyGroup,
  PropertyValue,
} from '../../types/derico';
import { StatusBadge } from '../common/StatusBadge';
import { VehicleVisual } from '../common/VehicleVisual';

const GROUPS_ORDER: PropertyGroup[] = [
  'General',
  'Engine and performance',
  'Body and interior',
  'Safety',
  'Features and comfort',
  'Commercial',
];

export const AddEditCarForm: React.FC = () => {
  const {
    cars,
    setCars,
    brands,
    models,
    properties,
    editingCarId,
    setAdminPage,
    addToast,
  } = useApp();

  const existing = editingCarId ? cars.find((c) => c.id === editingCarId) : undefined;

  const [activeTab, setActiveTab] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [brandId, setBrandId] = useState<string>(existing?.brandId || brands[0]?.id || '');
  const [modelId, setModelId] = useState<string>(
    existing?.modelId ||
      models.find((m) => m.brandId === (existing?.brandId || brands[0]?.id))?.id ||
      ''
  );
  const [trim, setTrim] = useState(existing?.trim || '');
  const [title, setTitle] = useState(existing?.title || '');
  const [reference, setReference] = useState(
    existing?.reference || `DM-S-0${Math.floor(110 + Math.random() * 880)}`
  );
  const [chassisVin, setChassisVin] = useState(existing?.chassisVin || '');
  const [propValues, setPropValues] = useState<Record<string, PropertyValue>>(
    existing?.properties || {
      condition: 'Foreign used (Tokunbo)',
      year: 2021,
      mileage: 35000,
      colour: 'Silver',
      location: 'Douala',
      fuel_type: 'Petrol',
      transmission: 'Automatic',
      body_type: 'SUV',
      seats: 5,
      features: ['Air conditioning', 'Reverse camera'],
    }
  );
  const [photos, setPhotos] = useState<CarPhoto[]>(
    existing?.photos || [
      { id: 'p1', angle: 'front34', caption: 'Front 3/4 Exterior', isCover: true },
      { id: 'p2', angle: 'side', caption: 'Side Profile', isCover: false },
      { id: 'p3', angle: 'interior', caption: 'Interior & Dashboard', isCover: false },
    ]
  );
  const [descLang, setDescLang] = useState<'en' | 'fr'>('en');
  const [descriptionEn, setDescriptionEn] = useState(
    existing?.descriptionEn ||
      'Inspected vehicle ready for immediate viewing at our Douala showroom.'
  );
  const [descriptionFr, setDescriptionFr] = useState(
    existing?.descriptionFr ||
      'Véhicule inspecté disponible immédiatement dans notre showroom de Douala.'
  );
  const [priceXaf, setPriceXaf] = useState<number>(existing?.priceXaf || 16500000);
  const [negotiable, setNegotiable] = useState<boolean>(existing?.negotiable ?? true);
  const [priceOnRequest, setPriceOnRequest] = useState<boolean>(existing?.priceOnRequest ?? false);
  const [promoTag, setPromoTag] = useState<PromoTag>(existing?.promoTag || null);
  const [status, setStatus] = useState<CarStatus>(existing?.status || 'Available');
  const [visible, setVisible] = useState<boolean>(existing?.visible ?? true);
  const [featured, setFeatured] = useState<boolean>(existing?.featured ?? false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const brandModels = useMemo(
    () => models.filter((m) => m.brandId === brandId),
    [models, brandId]
  );

  const saleProperties = useMemo(
    () =>
      properties
        .filter((p) => p.appliesTo.includes('sale'))
        .sort((a, b) => a.order - b.order),
    [properties]
  );

  const autoSuggestTitle = () => {
    const bName = brands.find((b) => b.id === brandId)?.name || '';
    const mName = models.find((m) => m.id === modelId)?.name || '';
    const yr = propValues.year || '2021';
    const trans = propValues.transmission || '';
    setTitle(`${yr} ${bName} ${mName} ${trim} ${trans}`.replace(/\s+/g, ' ').trim());
  };

  const copyFromCar = (sourceCarId: string) => {
    const src = cars.find((c) => c.id === sourceCarId);
    if (!src) return;
    setPropValues({ ...src.properties });
    addToast({ type: 'info', title: `Copied properties from ${src.title}` });
  };

  const setPropVal = (key: string, val: PropertyValue) => {
    setPropValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (publishMode: 'draft' | 'publish') => {
    const finalTitle =
      title.trim() ||
      `${propValues.year || 2021} ${brands.find((b) => b.id === brandId)?.name || ''} ${
        models.find((m) => m.id === modelId)?.name || 'Vehicle'
      }`.trim();

    const payload: CarForSale = {
      id: existing?.id || `car-${Date.now()}`,
      reference: reference.trim() || 'DM-S-0199',
      brandId,
      modelId,
      trim,
      title: finalTitle,
      chassisVin: chassisVin || 'JTHB21BA202099412',
      priceXaf,
      negotiable,
      priceOnRequest,
      promoTag,
      status: publishMode === 'draft' ? 'Draft' : status === 'Draft' ? 'Available' : status,
      visible: publishMode === 'draft' ? false : visible,
      featured,
      views: existing?.views || 1,
      requestsCount: existing?.requestsCount || 0,
      updatedAt: '2026-11-13',
      descriptionEn,
      descriptionFr,
      photos,
      properties: propValues,
    };

    if (existing) {
      setCars((prev) => prev.map((c) => (c.id === existing.id ? payload : c)));
      addToast({ type: 'success', title: `Updated ${payload.title}` });
    } else {
      setCars((prev) => [payload, ...prev]);
      addToast({
        type: 'success',
        title: publishMode === 'publish' ? `Published ${payload.title}` : `Saved draft ${payload.title}`,
      });
    }
    setAdminPage('cars');
  };

  const tabs = [
    { id: 1 as const, label: '1. Basic info' },
    { id: 2 as const, label: '2. Properties' },
    { id: 3 as const, label: '3. Photos' },
    { id: 4 as const, label: '4. Description & pricing' },
    { id: 5 as const, label: '5. Publishing' },
  ];

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAdminPage('cars')}
          className="clay-btn-white inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#ECECEC] text-xs font-semibold text-[#616161] hover:text-[#040401] cursor-pointer hover:bg-[#FFF8F6]"
        >
          <ArrowLeft className="w-4 h-4 text-[#FF3600]" />
          <span>Back to Cars for sale</span>
        </button>
      </div>

      {/* Stepper Tabs */}
      <div className="clay-dock bg-[#FAF9F5] rounded-2xl border border-[#ECECEC] p-1.5 flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-[#040401] text-white shadow-sm'
                : 'text-[#616161] hover:bg-white hover:text-[#040401]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-6 lg:p-8">
        {activeTab === 1 && (
          <div className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#040401]">Brand *</label>
                  <button
                    type="button"
                    onClick={() => setAdminPage('brands')}
                    className="text-[11px] font-semibold text-[#FF3600] hover:underline cursor-pointer"
                  >
                    + Manage brands
                  </button>
                </div>
                <select
                  value={brandId}
                  onChange={(e) => {
                    const nextB = e.target.value;
                    setBrandId(nextB);
                    const firstM = models.find((m) => m.brandId === nextB);
                    setModelId(firstM?.id || '');
                  }}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#040401]">Model *</label>
                  <button
                    type="button"
                    onClick={() => setAdminPage('brands')}
                    className="text-[11px] font-semibold text-[#FF3600] hover:underline cursor-pointer"
                  >
                    + Add model
                  </button>
                </div>
                <select
                  value={modelId}
                  onChange={(e) => setModelId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                >
                  <option value="">Select model...</option>
                  {brandModels.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Trim / Version (optional)
                </label>
                <input
                  type="text"
                  value={trim}
                  onChange={(e) => setTrim(e.target.value)}
                  placeholder="e.g. F-Sport, 1.8 LE, Limited"
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Reference number
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#040401]">Listing Title *</label>
                <button
                  type="button"
                  onClick={autoSuggestTitle}
                  className="text-[11px] font-semibold text-[#FF3600] hover:underline cursor-pointer"
                >
                  Auto-suggest title
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 2021 Lexus RX 350 Automatic"
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                Chassis / VIN number (Private — admin &amp; sales receipts only)
              </label>
              <input
                type="text"
                value={chassisVin}
                onChange={(e) => setChassisVin(e.target.value)}
                placeholder="17-character VIN"
                className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
              />
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#ECECEC]">
              <div>
                <h2 className="font-display font-bold text-base text-[#040401]">
                  Dynamic Vehicle Properties
                </h2>
                <p className="text-xs text-[#616161]">
                  Automatically generated from your Vehicle Properties library. Required fields marked *.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-[#FF3600]" />
                <select
                  onChange={(e) => {
                    if (e.target.value) copyFromCar(e.target.value);
                  }}
                  defaultValue=""
                  className="h-9 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                >
                  <option value="">Copy properties from another car...</option>
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.reference} — {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {GROUPS_ORDER.map((grp) => {
              const items = saleProperties.filter((p) => p.group === grp);
              if (items.length === 0) return null;
              return (
                <div key={grp} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#FF3600]">
                    {grp}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((prop) => {
                      const val = propValues[prop.key];
                      return (
                        <div key={prop.id} className="space-y-1.5">
                          <label className="block text-xs font-semibold text-[#040401]">
                            {prop.name}
                            {prop.unit ? ` (${prop.unit})` : ''}{' '}
                            {prop.required && <span className="text-[#DC2626]">*</span>}
                          </label>

                          {prop.inputType === 'single_select' || prop.inputType === 'colour' ? (
                            <select
                              value={String(val || '')}
                              onChange={(e) => setPropVal(prop.key, e.target.value)}
                              className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                            >
                              <option value="">Select...</option>
                              {(prop.options || []).map((o) => (
                                <option key={o} value={o}>
                                  {o}
                                </option>
                              ))}
                            </select>
                          ) : prop.inputType === 'multi_select' ? (
                            <div className="p-3 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] flex flex-wrap gap-2">
                              {(prop.options || []).map((o) => {
                                const arr = Array.isArray(val) ? val : [];
                                const checked = arr.includes(o);
                                return (
                                  <label
                                    key={o}
                                    className="inline-flex items-center gap-1.5 text-xs text-[#616161] cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => {
                                        const next = checked
                                          ? arr.filter((x) => x !== o)
                                          : [...arr, o];
                                        setPropVal(prop.key, next);
                                      }}
                                      className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                                    />
                                    <span>{o}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : prop.inputType === 'yes_no' ? (
                            <div className="flex items-center gap-4 h-10">
                              <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer text-[#040401]">
                                <input
                                  type="radio"
                                  name={`prop-${prop.id}`}
                                  checked={val === true}
                                  onChange={() => setPropVal(prop.key, true)}
                                  className="text-[#FF3600] focus:ring-[#FF3600]"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer text-[#040401]">
                                <input
                                  type="radio"
                                  name={`prop-${prop.id}`}
                                  checked={val === false || val === undefined}
                                  onChange={() => setPropVal(prop.key, false)}
                                  className="text-[#FF3600] focus:ring-[#FF3600]"
                                />
                                <span>No</span>
                              </label>
                            </div>
                          ) : (
                            <input
                              type={prop.inputType === 'number' ? 'number' : 'text'}
                              value={val === undefined ? '' : String(val)}
                              onChange={(e) =>
                                setPropVal(
                                  prop.key,
                                  prop.inputType === 'number'
                                    ? Number(e.target.value)
                                    : e.target.value
                                )
                              }
                              className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 3 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-base text-[#040401]">
                  Vehicle Photos
                </h2>
                <p className="text-xs text-[#616161]">
                  Add showroom angles, set the cover image, and caption each photo.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPhotos((prev) => [
                    ...prev,
                    {
                      id: `ph-${Date.now()}`,
                      angle: 'rear34',
                      caption: 'Rear 3/4 View',
                      isCover: false,
                    },
                  ])
                }
                className="clay-btn h-9 px-4 rounded-xl bg-[#040401] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[#1a1a16]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add angle photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {photos.map((ph) => (
                <div
                  key={ph.id}
                  className="clay-card rounded-2xl border border-[#ECECEC] overflow-hidden bg-[#FAF9F5]"
                >
                  <div className="aspect-[4/3] relative">
                    <VehicleVisual
                      bodyType={String(propValues.body_type || 'SUV')}
                      colour={String(propValues.colour || 'Silver')}
                      angle={ph.angle}
                      className="w-full h-full"
                    />
                    {ph.isCover && (
                      <span className="clay-pill absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#FF3600] text-white text-[10px] font-bold">
                        Cover
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 bg-white space-y-2.5 border-t border-[#ECECEC]">
                    <input
                      type="text"
                      value={ph.caption}
                      onChange={(e) =>
                        setPhotos((prev) =>
                          prev.map((x) =>
                            x.id === ph.id ? { ...x, caption: e.target.value } : x
                          )
                        )
                      }
                      className="w-full h-8 px-2.5 rounded-lg border border-[#ECECEC] text-xs focus:outline-none focus:border-[#FF3600]"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos((prev) =>
                            prev.map((x) => ({ ...x, isCover: x.id === ph.id }))
                          )
                        }
                        className="text-[11px] font-semibold text-[#FF3600] inline-flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set cover</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPhotos((prev) => prev.filter((x) => x.id !== ph.id))
                        }
                        className="text-[#DC2626] p-1 cursor-pointer hover:bg-red-50 rounded"
                        title="Delete angle"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <div className="space-y-5 max-w-3xl">
            <div className="clay-dock flex items-center gap-1.5 p-1 bg-[#FAF9F5] rounded-xl border border-[#ECECEC] w-fit">
              <button
                type="button"
                onClick={() => setDescLang('en')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  descLang === 'en' ? 'bg-[#040401] text-white shadow-sm' : 'text-[#616161] hover:text-[#040401]'
                }`}
              >
                English Description
              </button>
              <button
                type="button"
                onClick={() => setDescLang('fr')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  descLang === 'fr' ? 'bg-[#040401] text-white shadow-sm' : 'text-[#616161] hover:text-[#040401]'
                }`}
              >
                Description Française
              </button>
            </div>

            {descLang === 'en' ? (
              <textarea
                rows={4}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
              />
            ) : (
              <textarea
                rows={4}
                value={descriptionFr}
                onChange={(e) => setDescriptionFr(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#ECECEC]">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Price (XAF) *
                </label>
                <input
                  type="number"
                  disabled={priceOnRequest}
                  value={priceXaf}
                  onChange={(e) => setPriceXaf(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600] disabled:bg-[#FAF9F5]"
                />
                <div className="text-[11px] text-[#616161] mt-1 font-mono-num">
                  Formatted: {formatXaf(priceXaf)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Promotional Highlight (Automotive Red)
                </label>
                <select
                  value={promoTag || ''}
                  onChange={(e) =>
                    setPromoTag((e.target.value || null) as PromoTag)
                  }
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                >
                  <option value="">None (recommended)</option>
                  <option value="Price drop">Price drop</option>
                  <option value="Hot deal">Hot deal</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-5 text-xs font-medium text-[#040401] pt-1">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                />
                <span>Negotiable</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={priceOnRequest}
                  onChange={(e) => setPriceOnRequest(e.target.checked)}
                  className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                />
                <span>Price on request</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 5 && (
          <div className="space-y-5 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Inventory Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CarStatus)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                >
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="flex items-end">
                <StatusBadge status={status} />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#040401] cursor-pointer">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                />
                <span>Visible on public website</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs font-semibold text-[#040401] cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                />
                <span>Featured on Home page</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(true)}
                className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] hover:bg-[#FFF8F6] text-xs font-semibold text-[#040401] inline-flex items-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-[#FF3600]" />
                <span>Preview Public Car Page</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 left-0 lg:left-64 clay-dock bg-white/95 backdrop-blur-md border-t border-[#ECECEC] px-6 py-3.5 flex items-center justify-between gap-3 z-20">
        <button
          type="button"
          onClick={() => setAdminPage('cars')}
          className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold text-[#616161] hover:text-[#040401] cursor-pointer hover:bg-[#FFF8F6]"
        >
          Cancel
        </button>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSave('draft')}
            className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] bg-white hover:bg-[#FFF8F6] text-xs font-semibold text-[#040401] cursor-pointer"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => handleSave('publish')}
            className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] hover:bg-[#E03000] text-white text-xs font-semibold cursor-pointer"
          >
            Publish listing
          </button>
        </div>
      </div>

      {/* Public Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#ECECEC]">
            <div className="px-5 py-3.5 border-b border-[#ECECEC] flex items-center justify-between">
              <span className="font-display font-bold text-sm text-[#040401]">
                Public Card Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 cursor-pointer text-[#616161] hover:text-[#040401]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-[#ECECEC] bg-[#FAF9F5]">
                <VehicleVisual
                  bodyType={String(propValues.body_type || 'SUV')}
                  colour={String(propValues.colour || 'Silver')}
                  className="w-full h-full"
                />
              </div>
              <div className="font-display font-bold text-lg text-[#040401]">
                {title || 'Untitled Vehicle'}
              </div>
              <div className="font-display font-bold text-xl text-[#FF3600] tabular-nums">
                {priceOnRequest ? 'Price on request' : formatXaf(priceXaf)}
              </div>
              <p className="text-xs text-[#616161]">{descriptionEn}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
