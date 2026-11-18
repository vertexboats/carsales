import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUGGESTED_BRAND_NAMES } from '../../data/seedData';
import { Brand, VehicleBodyStyle, VehicleModel } from '../../types/derico';
import { BrandLogoMark } from '../common/VehicleVisual';

const BODY_TYPES: VehicleBodyStyle[] = [
  'Sedan',
  'SUV',
  'Pickup',
  'Hatchback',
  'Minibus',
  'Van',
  'Coupe',
  'Truck',
];

const BRAND_COLORS = ['#040401', '#FF3600', '#1A1A16', '#2563EB', '#334155', '#16A34A'];

export const BrandsModelsAdmin: React.FC = () => {
  const { brands, setBrands, models, setModels, cars, openConfirm, addToast } = useApp();

  const sortedBrands = useMemo(
    () => [...brands].sort((a, b) => a.order - b.order),
    [brands]
  );

  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>(sortedBrands[0]?.id || '');
  const [quickModelName, setQuickModelName] = useState('');

  // Brand drawer state
  const [brandDrawerOpen, setBrandDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [bName, setBName] = useState('');
  const [bSlug, setBSlug] = useState('');
  const [bDesc, setBDesc] = useState('');
  const [bFeatured, setBFeatured] = useState(false);
  const [bVisible, setBVisible] = useState(true);
  const [bColor, setBColor] = useState('#040401');

  // Model modal state
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [mName, setMName] = useState('');
  const [mBody, setMBody] = useState<VehicleBodyStyle>('SUV');
  const [mYears, setMYears] = useState('2018 - 2025');

  const filteredBrands = sortedBrands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const selectedBrand = sortedBrands.find((b) => b.id === selectedBrandId) || sortedBrands[0];
  const brandModels = useMemo(
    () =>
      models
        .filter((m) => m.brandId === selectedBrand?.id)
        .sort((a, b) => a.order - b.order),
    [models, selectedBrand?.id]
  );

  const getCarCountForBrand = (brandId: string) =>
    cars.filter((c) => c.brandId === brandId).length;

  const getCarCountForModel = (modelId: string) =>
    cars.filter((c) => c.modelId === modelId).length;

  const openAddBrand = (prefillName = '') => {
    setEditingBrand(null);
    setBName(prefillName);
    setBSlug(prefillName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    setBDesc(prefillName ? `Inspected ${prefillName} vehicles available in Cameroon.` : '');
    setBFeatured(true);
    setBVisible(true);
    setBColor(BRAND_COLORS[brands.length % BRAND_COLORS.length]);
    setBrandDrawerOpen(true);
  };

  const openEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBName(brand.name);
    setBSlug(brand.slug);
    setBDesc(brand.description);
    setBFeatured(brand.featured);
    setBVisible(brand.visible);
    setBColor(brand.logoColor);
    setBrandDrawerOpen(true);
  };

  const saveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bName.trim()) return;
    const slug =
      bSlug.trim() || bName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const badge = bName
      .trim()
      .split(/[\s-]+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    if (editingBrand) {
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? {
                ...b,
                name: bName.trim(),
                slug,
                description: bDesc.trim(),
                featured: bFeatured,
                visible: bVisible,
                logoColor: bColor,
                badgeText: badge,
              }
            : b
        )
      );
      addToast({ type: 'success', title: `Updated brand "${bName.trim()}"` });
    } else {
      const newBrand: Brand = {
        id: `br-${Date.now()}`,
        name: bName.trim(),
        slug,
        description: bDesc.trim() || `Quality ${bName.trim()} vehicles in Cameroon.`,
        featured: bFeatured,
        visible: bVisible,
        order: brands.length + 1,
        logoColor: bColor,
        badgeText: badge,
        catalogCountOffset: 0,
      };
      setBrands((prev) => [...prev, newBrand]);
      setSelectedBrandId(newBrand.id);
      addToast({ type: 'success', title: `Added brand "${newBrand.name}"` });
    }
    setBrandDrawerOpen(false);
  };

  const handleQuickSuggestedBrand = (name: string) => {
    const exists = brands.some((b) => b.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      const existing = brands.find((b) => b.name.toLowerCase() === name.toLowerCase());
      if (existing) setSelectedBrandId(existing.id);
      addToast({ type: 'info', title: `${name} is already in your brands list` });
      return;
    }
    const newBrand: Brand = {
      id: `br-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `Inspected ${name} vehicles available through Derico Motors.`,
      featured: true,
      visible: true,
      order: brands.length + 1,
      logoColor: BRAND_COLORS[brands.length % BRAND_COLORS.length],
      badgeText: name.slice(0, 2).toUpperCase(),
      catalogCountOffset: 0,
    };
    setBrands((prev) => [...prev, newBrand]);
    setSelectedBrandId(newBrand.id);
    addToast({ type: 'success', title: `Added "${name}" to brands` });
  };

  const handleDeleteBrand = (brand: Brand) => {
    const count = getCarCountForBrand(brand.id);
    if (count > 0) {
      openConfirm({
        title: `Cannot delete ${brand.name}`,
        message: `${count} car(s) currently use this brand. Reassign or archive them in Cars for sale first.`,
        confirmLabel: 'Understood',
        destructive: false,
        onConfirm: () => {},
      });
      return;
    }
    openConfirm({
      title: `Delete ${brand.name}?`,
      message: `This will permanently remove ${brand.name} and its models.`,
      confirmLabel: 'Delete brand',
      destructive: true,
      onConfirm: () => {
        setBrands((prev) => prev.filter((b) => b.id !== brand.id));
        setModels((prev) => prev.filter((m) => m.brandId !== brand.id));
        addToast({ type: 'success', title: `Deleted ${brand.name}` });
      },
    });
  };

  const moveBrandOrder = (brandId: string, dir: -1 | 1) => {
    const idx = sortedBrands.findIndex((b) => b.id === brandId);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sortedBrands.length) return;
    const copy = [...sortedBrands];
    const [moved] = copy.splice(idx, 1);
    copy.splice(swapIdx, 0, moved);
    setBrands(copy.map((b, i) => ({ ...b, order: i + 1 })));
  };

  const handleQuickAddModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickModelName.trim() || !selectedBrand) return;
    const newModel: VehicleModel = {
      id: `md-${Date.now()}`,
      brandId: selectedBrand.id,
      name: quickModelName.trim(),
      defaultBodyType: 'SUV',
      yearsAvailable: '2018 - 2025',
      visible: true,
      order: brandModels.length + 1,
    };
    setModels((prev) => [...prev, newModel]);
    setQuickModelName('');
    addToast({ type: 'success', title: `Added model "${newModel.name}" to ${selectedBrand.name}` });
  };

  const saveModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mName.trim() || !selectedBrand) return;
    if (editingModel) {
      setModels((prev) =>
        prev.map((m) =>
          m.id === editingModel.id
            ? { ...m, name: mName.trim(), defaultBodyType: mBody, yearsAvailable: mYears }
            : m
        )
      );
      addToast({ type: 'success', title: `Updated model "${mName.trim()}"` });
    } else {
      const newModel: VehicleModel = {
        id: `md-${Date.now()}`,
        brandId: selectedBrand.id,
        name: mName.trim(),
        defaultBodyType: mBody,
        yearsAvailable: mYears,
        visible: true,
        order: brandModels.length + 1,
      };
      setModels((prev) => [...prev, newModel]);
      addToast({ type: 'success', title: `Added model "${newModel.name}"` });
    }
    setModelModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Suggested Brands One-Tap Bar */}
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-4.5 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#040401] mr-1">
          <Sparkles className="w-4 h-4 text-[#FF3600]" />
          Suggested brands (one-tap add):
        </span>
        {SUGGESTED_BRAND_NAMES.map((name) => {
          const already = brands.some((b) => b.name.toLowerCase() === name.toLowerCase());
          return (
            <button
              key={name}
              type="button"
              onClick={() => handleQuickSuggestedBrand(name)}
              className={`clay-pill px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                already
                  ? 'bg-[#ECECEC] text-[#616161]'
                  : 'bg-[#FFF3EE] text-[#FF3600] hover:bg-[#FF3600] hover:text-white'
              }`}
            >
              {already ? `✓ ${name}` : `+ ${name}`}
            </button>
          );
        })}
      </div>

      {/* Split Layout: Left Brands, Right Models */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Brands */}
        <div className="lg:col-span-5 clay-card bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
          <div className="p-4 border-b border-[#ECECEC] flex items-center justify-between gap-2.5 bg-white">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8290A3] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Search brands..."
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
              />
            </div>
            <button
              type="button"
              onClick={() => openAddBrand()}
              className="clay-btn h-10 px-4 rounded-xl bg-[#FF3600] hover:bg-[#E03000] text-white text-xs font-semibold inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add brand</span>
            </button>
          </div>

          {filteredBrands.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#616161]">
              No brands yet. Add your first brand, for example Toyota.
            </div>
          ) : (
            <div className="divide-y divide-[#ECECEC]">
              {filteredBrands.map((b, idx) => {
                const isSelected = selectedBrand?.id === b.id;
                const carCount = getCarCountForBrand(b.id);
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBrandId(b.id)}
                    className={`p-3.5 flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      isSelected ? 'bg-[#FFF3EE]' : 'hover:bg-[#FAF9F5]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveBrandOrder(b.id, -1)}
                          className="text-[#8290A3] hover:text-[#040401] disabled:opacity-30 cursor-pointer p-0.5"
                          aria-label="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === filteredBrands.length - 1}
                          onClick={() => moveBrandOrder(b.id, 1)}
                          className="text-[#8290A3] hover:text-[#040401] disabled:opacity-30 cursor-pointer p-0.5"
                          aria-label="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                      <BrandLogoMark
                        name={b.name}
                        badgeText={b.badgeText}
                        color={b.logoColor}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#040401] truncate">{b.name}</div>
                        <div className="text-[11px] text-[#616161] tabular-nums">
                          {carCount} live car{carCount === 1 ? '' : 's'}
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setBrands((prev) =>
                            prev.map((x) => (x.id === b.id ? { ...x, featured: !x.featured } : x))
                          )
                        }
                        title="Featured on home"
                        className={`p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors ${
                          b.featured ? 'text-[#F59E0B]' : 'text-[#CBD5E1]'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setBrands((prev) =>
                            prev.map((x) => (x.id === b.id ? { ...x, visible: !x.visible } : x))
                          )
                        }
                        title={b.visible ? 'Visible on website' : 'Hidden on website'}
                        className={`p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors ${
                          b.visible ? 'text-[#16A34A]' : 'text-[#8290A3]'
                        }`}
                      >
                        {b.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditBrand(b)}
                        className="p-1.5 rounded-lg hover:bg-white text-[#616161] hover:text-[#040401] cursor-pointer transition-colors"
                        title="Edit brand"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBrand(b)}
                        className="p-1.5 rounded-lg hover:bg-white text-[#DC2626] cursor-pointer transition-colors"
                        title="Delete brand"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel: Models of Selected Brand */}
        <div className="lg:col-span-7 clay-card bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
          {selectedBrand ? (
            <>
              <div className="p-4.5 border-b border-[#ECECEC] flex flex-wrap items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-3">
                  <BrandLogoMark
                    name={selectedBrand.name}
                    badgeText={selectedBrand.badgeText}
                    color={selectedBrand.logoColor}
                    size="md"
                  />
                  <div>
                    <h2 className="font-display font-bold text-base text-[#040401]">
                      {selectedBrand.name} Models
                    </h2>
                    <p className="text-xs text-[#616161]">
                      Slug: <span className="font-mono-num text-[#FF3600]">/{selectedBrand.slug}</span> ·{' '}
                      {brandModels.length} model(s)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingModel(null);
                    setMName('');
                    setMBody('SUV');
                    setMYears('2018 - 2025');
                    setModelModalOpen(true);
                  }}
                  className="clay-btn h-9 px-4 rounded-xl bg-[#040401] hover:bg-[#1a1a16] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add model</span>
                </button>
              </div>

              {/* Inline quick-add */}
              <form
                onSubmit={handleQuickAddModel}
                className="px-4.5 py-3 bg-[#FAF9F5] border-b border-[#ECECEC] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={quickModelName}
                  onChange={(e) => setQuickModelName(e.target.value)}
                  placeholder={`Quick-add a ${selectedBrand.name} model (e.g. RX 350) and press Enter...`}
                  className="flex-1 h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
                <button
                  type="submit"
                  className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] bg-white hover:bg-[#FFF8F6] text-xs font-semibold text-[#FF3600] cursor-pointer"
                >
                  Quick add
                </button>
              </form>

              {brandModels.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#616161]">
                  No models yet for {selectedBrand.name}. Type a model name above and press Enter.
                </div>
              ) : (
                <div className="divide-y divide-[#ECECEC]">
                  {brandModels.map((m) => {
                    const count = getCarCountForModel(m.id);
                    return (
                      <div
                        key={m.id}
                        className="px-4.5 py-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF9F5] transition-colors"
                      >
                        <div>
                          <div className="text-sm font-semibold text-[#040401]">{m.name}</div>
                          <div className="text-xs text-[#616161]">
                            Default body: {m.defaultBodyType} · Years: {m.yearsAvailable} ·{' '}
                            <span className="tabular-nums font-semibold text-[#040401]">{count} car(s)</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setModels((prev) =>
                                prev.map((x) =>
                                  x.id === m.id ? { ...x, visible: !x.visible } : x
                                )
                              )
                            }
                            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                              m.visible ? 'text-[#16A34A] hover:bg-green-50' : 'text-[#8290A3] hover:bg-gray-100'
                            }`}
                            title={m.visible ? 'Visible' : 'Hidden'}
                          >
                            {m.visible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingModel(m);
                              setMName(m.name);
                              setMBody(m.defaultBodyType);
                              setMYears(m.yearsAvailable);
                              setModelModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#616161] hover:text-[#040401] hover:bg-white cursor-pointer transition-colors"
                            title="Edit model"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              openConfirm({
                                title: `Delete model ${m.name}?`,
                                message: 'This removes the model from this brand.',
                                confirmLabel: 'Delete',
                                destructive: true,
                                onConfirm: () => {
                                  setModels((prev) => prev.filter((x) => x.id !== m.id));
                                  addToast({ type: 'success', title: `Deleted ${m.name}` });
                                },
                              })
                            }
                            className="p-1.5 rounded-lg text-[#DC2626] hover:bg-red-50 cursor-pointer transition-colors"
                            title="Delete model"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-sm text-[#616161]">
              Select a brand on the left to manage its models.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Brand Drawer */}
      {brandDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="px-6 py-4.5 border-b border-[#ECECEC] flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#040401]">
                {editingBrand ? `Edit ${editingBrand.name}` : 'Add New Brand'}
              </h3>
              <button
                type="button"
                onClick={() => setBrandDrawerOpen(false)}
                className="w-9 h-9 rounded-xl hover:bg-[#FAF9F5] flex items-center justify-center cursor-pointer text-[#616161] hover:text-[#040401]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveBrand} className="p-6 flex-1 overflow-y-auto space-y-4.5">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Brand name *
                </label>
                <input
                  type="text"
                  required
                  value={bName}
                  onChange={(e) => {
                    const v = e.target.value;
                    setBName(v);
                    if (!editingBrand) {
                      setBSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                    }
                  }}
                  placeholder="e.g. Lexus"
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Slug (URL path)
                </label>
                <input
                  type="text"
                  value={bSlug}
                  onChange={(e) => setBSlug(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Brand Emblem Colour &amp; Preview
                </label>
                <div className="flex items-center gap-3">
                  <BrandLogoMark
                    name={bName || 'Brand'}
                    color={bColor}
                    size="lg"
                  />
                  <div className="flex items-center gap-2">
                    {BRAND_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setBColor(c)}
                        className={`w-7 h-7 rounded-xl cursor-pointer border-2 transition-transform ${
                          bColor === c ? 'border-[#FF3600] scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Short description (shown on brand page)
                </label>
                <textarea
                  rows={3}
                  value={bDesc}
                  onChange={(e) => setBDesc(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#040401] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bFeatured}
                    onChange={(e) => setBFeatured(e.target.checked)}
                    className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                  />
                  <span>Featured on home page</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-medium text-[#040401] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bVisible}
                    onChange={(e) => setBVisible(e.target.checked)}
                    className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                  />
                  <span>Visible on public website</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setBrandDrawerOpen(false)}
                  className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold cursor-pointer hover:bg-[#FAF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] text-white text-xs font-semibold cursor-pointer hover:bg-[#E03000]"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Model Modal */}
      {modelModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-base text-[#040401]">
              {editingModel ? `Edit ${editingModel.name}` : `Add Model to ${selectedBrand.name}`}
            </h3>
            <form onSubmit={saveModel} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Model name *
                </label>
                <input
                  type="text"
                  required
                  value={mName}
                  onChange={(e) => setMName(e.target.value)}
                  placeholder="e.g. RX 350"
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Default body type
                </label>
                <select
                  value={mBody}
                  onChange={(e) => setMBody(e.target.value as VehicleBodyStyle)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                >
                  {BODY_TYPES.map((bt) => (
                    <option key={bt} value={bt}>
                      {bt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                  Years available
                </label>
                <input
                  type="text"
                  value={mYears}
                  onChange={(e) => setMYears(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                />
              </div>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModelModalOpen(false)}
                  className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold cursor-pointer hover:bg-[#FAF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] text-white text-xs font-semibold cursor-pointer hover:bg-[#E03000]"
                >
                  Save Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
