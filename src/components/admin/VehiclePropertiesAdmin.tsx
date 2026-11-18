import React, { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Edit2,
  Eye,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  AppliesTo,
  FilterStyle,
  PropertyGroup,
  PropertyInputType,
  VehicleProperty,
} from '../../types/derico';

const PROPERTY_GROUPS: PropertyGroup[] = [
  'General',
  'Engine and performance',
  'Body and interior',
  'Safety',
  'Features and comfort',
  'Commercial',
];

const INPUT_TYPES: { value: PropertyInputType; label: string }[] = [
  { value: 'single_select', label: 'Single select (dropdown)' },
  { value: 'multi_select', label: 'Multi select (checkboxes)' },
  { value: 'number', label: 'Number' },
  { value: 'number_range', label: 'Number range' },
  { value: 'yes_no', label: 'Yes / No' },
  { value: 'short_text', label: 'Short text' },
  { value: 'colour', label: 'Colour' },
];

export const VehiclePropertiesAdmin: React.FC = () => {
  const { properties, setProperties, openConfirm, addToast } = useApp();

  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingProp, setEditingProp] = useState<VehicleProperty | null>(null);

  // Drawer form state
  const [name, setName] = useState('');
  const [nameFr, setNameFr] = useState('');
  const [group, setGroup] = useState<PropertyGroup>('Features and comfort');
  const [inputType, setInputType] = useState<PropertyInputType>('single_select');
  const [options, setOptions] = useState<string[]>(['Panoramic', 'Standard', 'None']);
  const [newOptionText, setNewOptionText] = useState('');
  const [unit, setUnit] = useState('');
  const [showAsFilter, setShowAsFilter] = useState(true);
  const [filterStyle, setFilterStyle] = useState<FilterStyle>('checkbox');
  const [required, setRequired] = useState(false);
  const [showOnCard, setShowOnCard] = useState(false);
  const [appliesTo, setAppliesTo] = useState<AppliesTo[]>(['sale']);

  const sortedProps = useMemo(
    () => [...properties].sort((a, b) => a.order - b.order),
    [properties]
  );

  const openAddDrawer = () => {
    setEditingProp(null);
    setName('');
    setNameFr('');
    setGroup('Features and comfort');
    setInputType('single_select');
    setOptions(['Panoramic', 'Standard', 'None']);
    setUnit('');
    setShowAsFilter(true);
    setFilterStyle('checkbox');
    setRequired(false);
    setShowOnCard(false);
    setAppliesTo(['sale']);
    setDrawerOpen(true);
  };

  const openEditDrawer = (p: VehicleProperty) => {
    setEditingProp(p);
    setName(p.name);
    setNameFr(p.nameFr);
    setGroup(p.group);
    setInputType(p.inputType);
    setOptions(p.options || []);
    setUnit(p.unit || '');
    setShowAsFilter(p.showAsFilter);
    setFilterStyle(p.filterStyle);
    setRequired(p.required);
    setShowOnCard(p.showOnCard);
    setAppliesTo(p.appliesTo);
    setDrawerOpen(true);
  };

  const addOptionChip = () => {
    if (!newOptionText.trim()) return;
    if (!options.includes(newOptionText.trim())) {
      setOptions((prev) => [...prev, newOptionText.trim()]);
    }
    setNewOptionText('');
  };

  const toggleAppliesTo = (target: AppliesTo) => {
    setAppliesTo((prev) =>
      prev.includes(target) ? prev.filter((x) => x !== target) : [...prev, target]
    );
  };

  const saveProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const key =
      editingProp?.key ||
      name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');

    const needsOptions =
      inputType === 'single_select' || inputType === 'multi_select' || inputType === 'colour';

    if (editingProp) {
      setProperties((prev) =>
        prev.map((p) =>
          p.id === editingProp.id
            ? {
                ...p,
                name: name.trim(),
                nameFr: nameFr.trim() || name.trim(),
                group,
                inputType,
                options: needsOptions ? options : undefined,
                unit: unit.trim() || undefined,
                showAsFilter,
                filterStyle,
                required,
                showOnCard,
                appliesTo: appliesTo.length ? appliesTo : ['sale'],
              }
            : p
        )
      );
      addToast({
        type: 'success',
        title: `Updated property "${name.trim()}"`,
        description: 'Add Car form and Buy Cars filters updated immediately.',
      });
    } else {
      const newProp: VehicleProperty = {
        id: `prop-${Date.now()}`,
        key,
        name: name.trim(),
        nameFr: nameFr.trim() || name.trim(),
        group,
        inputType,
        options: needsOptions ? options : undefined,
        unit: unit.trim() || undefined,
        showAsFilter,
        filterStyle,
        required,
        showOnCard,
        appliesTo: appliesTo.length ? appliesTo : ['sale'],
        order: properties.length + 1,
      };
      setProperties((prev) => [...prev, newProp]);
      addToast({
        type: 'success',
        title: `Created property "${newProp.name}"`,
        description: 'Now active on the Add Car form and public Buy Cars filters.',
      });
    }
    setDrawerOpen(false);
  };

  const moveProperty = (id: string, dir: -1 | 1) => {
    const idx = sortedProps.findIndex((p) => p.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sortedProps.length) return;
    const copy = [...sortedProps];
    const [moved] = copy.splice(idx, 1);
    copy.splice(swapIdx, 0, moved);
    setProperties(copy.map((p, i) => ({ ...p, order: i + 1 })));
  };

  const toggleFlag = (id: string, field: 'showAsFilter' | 'required' | 'showOnCard') => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: !p[field] } : p))
    );
  };

  return (
    <div className="space-y-6">
      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-4.5 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-4 h-4 text-[#8290A3] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties (e.g. Fuel type, Sunroof)..."
            className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
          />
        </div>
        <button
          type="button"
          onClick={openAddDrawer}
          className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] hover:bg-[#E03000] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add property</span>
        </button>
      </div>

      {/* Grouped Property Sections */}
      <div className="space-y-4">
        {PROPERTY_GROUPS.map((grp) => {
          const groupItems = sortedProps.filter(
            (p) =>
              p.group === grp &&
              p.name.toLowerCase().includes(search.toLowerCase())
          );
          if (groupItems.length === 0) return null;
          const isCollapsed = collapsed[grp];

          return (
            <div
              key={grp}
              className="clay-card bg-white rounded-2xl border border-[#ECECEC] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setCollapsed((prev) => ({ ...prev, [grp]: !prev[grp] }))}
                className="w-full px-5 py-4 bg-[#FAF9F5] border-b border-[#ECECEC] flex items-center justify-between cursor-pointer hover:bg-[#FFF8F6] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-sm text-[#040401]">
                    {grp}
                  </span>
                  <span className="clay-pill px-2 py-0.5 rounded-full bg-[#ECECEC] text-xs text-[#616161] tabular-nums font-medium">
                    {groupItems.length}
                  </span>
                </div>
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-[#616161]" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-[#616161]" />
                )}
              </button>

              {!isCollapsed && (
                <div className="divide-y divide-[#ECECEC]">
                  {groupItems.map((prop) => (
                    <div
                      key={prop.id}
                      className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#FFF8F6] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => moveProperty(prop.id, -1)}
                            className="text-[#8290A3] hover:text-[#040401] cursor-pointer p-0.5"
                            aria-label="Move up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveProperty(prop.id, 1)}
                            className="text-[#8290A3] hover:text-[#040401] cursor-pointer p-0.5"
                            aria-label="Move down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#040401]">
                              {prop.name}
                            </span>
                            <span className="clay-pill px-2 py-0.5 rounded-full bg-[#FFF3EE] text-[#FF3600] text-[11px] font-semibold">
                              {prop.inputType.replace('_', ' ')}
                            </span>
                            {prop.unit && (
                              <span className="text-[11px] font-mono-num text-[#8290A3]">
                                ({prop.unit})
                              </span>
                            )}
                          </div>
                          {prop.options && prop.options.length > 0 && (
                            <div className="text-[11px] text-[#616161] mt-0.5 line-clamp-1">
                              Options: {prop.options.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prop.showAsFilter}
                            onChange={() => toggleFlag(prop.id, 'showAsFilter')}
                            className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                          />
                          <span className="text-[#040401] font-medium">Filter</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prop.required}
                            onChange={() => toggleFlag(prop.id, 'required')}
                            className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                          />
                          <span className="text-[#616161]">Required</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={prop.showOnCard}
                            onChange={() => toggleFlag(prop.id, 'showOnCard')}
                            className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                          />
                          <span className="text-[#616161]">On card</span>
                        </label>

                        <div className="flex items-center gap-1 pl-2 border-l border-[#ECECEC]">
                          <button
                            type="button"
                            onClick={() => openEditDrawer(prop)}
                            className="p-1.5 rounded-lg hover:bg-white text-[#616161] hover:text-[#040401] cursor-pointer transition-colors"
                            title="Edit property"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!prop.isCore && (
                            <button
                              type="button"
                              onClick={() =>
                                openConfirm({
                                  title: `Delete "${prop.name}"?`,
                                  message:
                                    'This removes the property from the Add Car form and public Buy Cars filters.',
                                  confirmLabel: 'Delete property',
                                  destructive: true,
                                  onConfirm: () => {
                                    setProperties((prev) =>
                                      prev.filter((x) => x.id !== prop.id)
                                    );
                                    addToast({
                                      type: 'success',
                                      title: `Deleted property "${prop.name}"`,
                                    });
                                  },
                                })
                              }
                              className="p-1.5 rounded-lg hover:bg-red-50 text-[#DC2626] cursor-pointer transition-colors"
                              title="Delete property"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Property Drawer with Live Preview Panel */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-3xl h-full flex flex-col shadow-2xl">
            <div className="px-6 py-4.5 border-b border-[#ECECEC] flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-[#040401]">
                  {editingProp ? `Edit Property: ${editingProp.name}` : 'Add Vehicle Property'}
                </h3>
                <p className="text-xs text-[#616161]">
                  Brand-independent attribute shared across inventory forms and public filters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-xl hover:bg-[#FAF9F5] flex items-center justify-center cursor-pointer text-[#616161] hover:text-[#040401]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={saveProperty}
              className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#ECECEC]"
            >
              {/* Left Config Fields */}
              <div className="md:col-span-7 p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Property name (EN) *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sunroof type"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Property name (FR)
                    </label>
                    <input
                      type="text"
                      value={nameFr}
                      onChange={(e) => setNameFr(e.target.value)}
                      placeholder="e.g. Type de toit ouvrant"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Group
                    </label>
                    <select
                      value={group}
                      onChange={(e) => setGroup(e.target.value as PropertyGroup)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    >
                      {PROPERTY_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Input type
                    </label>
                    <select
                      value={inputType}
                      onChange={(e) => setInputType(e.target.value as PropertyInputType)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    >
                      {INPUT_TYPES.map((it) => (
                        <option key={it.value} value={it.value}>
                          {it.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(inputType === 'single_select' ||
                  inputType === 'multi_select' ||
                  inputType === 'colour') && (
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Options (add or remove chips)
                    </label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {options.map((opt) => (
                        <span
                          key={opt}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFF3EE] text-[#FF3600] text-xs font-medium"
                        >
                          <span>{opt}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setOptions((prev) => prev.filter((x) => x !== opt))
                            }
                            className="hover:text-[#DC2626] cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newOptionText}
                        onChange={(e) => setNewOptionText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addOptionChip();
                          }
                        }}
                        placeholder="Add option (e.g. Panoramic)..."
                        className="flex-1 h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs focus:outline-none focus:border-[#FF3600]"
                      />
                      <button
                        type="button"
                        onClick={addOptionChip}
                        className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold text-[#FF3600] cursor-pointer hover:bg-[#FFF8F6]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {(inputType === 'number' || inputType === 'number_range') && (
                  <div>
                    <label className="block text-xs font-semibold text-[#040401] mb-1.5">
                      Unit (e.g. km, cc, hp, seats)
                    </label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    />
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#ECECEC] space-y-2.5">
                  <label className="flex items-center justify-between text-xs font-semibold text-[#040401] cursor-pointer">
                    <span>Show as public filter</span>
                    <input
                      type="checkbox"
                      checked={showAsFilter}
                      onChange={(e) => setShowAsFilter(e.target.checked)}
                      className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                    />
                  </label>

                  {showAsFilter && (
                    <div className="pt-1">
                      <label className="block text-[11px] font-medium text-[#616161] mb-1">
                        Public filter style
                      </label>
                      <select
                        value={filterStyle}
                        onChange={(e) => setFilterStyle(e.target.value as FilterStyle)}
                        className="w-full h-9 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                      >
                        <option value="checkbox">Checkbox list</option>
                        <option value="dropdown">Dropdown</option>
                        <option value="slider">Slider / Range</option>
                        <option value="toggle">Toggle</option>
                      </select>
                    </div>
                  )}

                  <label className="flex items-center justify-between text-xs font-medium text-[#040401] cursor-pointer pt-1">
                    <span>Required when adding a car</span>
                    <input
                      type="checkbox"
                      checked={required}
                      onChange={(e) => setRequired(e.target.checked)}
                      className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-medium text-[#040401] cursor-pointer">
                    <span>Show on car card (max 3)</span>
                    <input
                      type="checkbox"
                      checked={showOnCard}
                      onChange={(e) => setShowOnCard(e.target.checked)}
                      className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                    />
                  </label>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#040401] mb-2">Applies to</div>
                  <div className="flex flex-wrap gap-3.5 text-xs text-[#616161]">
                    {[
                      { id: 'sale' as const, label: 'Cars for sale' },
                      { id: 'rental' as const, label: 'Rental cars' },
                      { id: 'pickup' as const, label: 'Pick-up vehicles' },
                    ].map((ap) => (
                      <label key={ap.id} className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={appliesTo.includes(ap.id)}
                          onChange={() => toggleAppliesTo(ap.id)}
                          className="rounded border-[#ECECEC] text-[#FF3600] focus:ring-[#FF3600]"
                        />
                        <span>{ap.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold cursor-pointer hover:bg-[#FAF9F5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] hover:bg-[#E03000] text-white text-xs font-semibold cursor-pointer"
                  >
                    Save Property
                  </button>
                </div>
              </div>

              {/* Right Live Preview Panel */}
              <div className="md:col-span-5 bg-[#FAF9F5] p-6 space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#FF3600]">
                  <Eye className="w-4 h-4" />
                  <span>Live Preview</span>
                </div>

                {/* 1. Public Buy Cars Filter Preview */}
                <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-4.5 space-y-2.5">
                  <div className="text-[11px] font-semibold text-[#8290A3] uppercase tracking-wider">
                    On Public Buy Cars Filter
                  </div>
                  {!showAsFilter ? (
                    <div className="text-xs text-[#8290A3] italic">
                      Hidden from public filters
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="text-xs font-semibold text-[#040401]">
                        {name || 'Property Name'}
                      </div>
                      {inputType === 'yes_no' || filterStyle === 'toggle' ? (
                        <label className="flex items-center gap-2 text-xs text-[#616161]">
                          <input type="checkbox" readOnly className="rounded border-[#ECECEC] text-[#FF3600]" />
                          <span>Yes / Included only</span>
                        </label>
                      ) : filterStyle === 'dropdown' ? (
                        <select className="w-full h-9 px-3 rounded-xl border border-[#ECECEC] text-xs bg-white text-[#040401]">
                          <option>Any</option>
                          {options.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      ) : inputType === 'number' || inputType === 'number_range' || filterStyle === 'slider' ? (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            readOnly
                            placeholder="Min"
                            className="h-8 px-2.5 rounded-lg border border-[#ECECEC] text-xs bg-[#FAF9F5]"
                          />
                          <input
                            type="text"
                            readOnly
                            placeholder="Max"
                            className="h-8 px-2.5 rounded-lg border border-[#ECECEC] text-xs bg-[#FAF9F5]"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {options.map((o) => (
                            <label key={o} className="flex items-center gap-2 text-xs text-[#616161]">
                              <input type="checkbox" readOnly className="rounded border-[#ECECEC] text-[#FF3600]" />
                              <span>{o}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Add Car Form Field Preview */}
                <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] p-4.5 space-y-2">
                  <div className="text-[11px] font-semibold text-[#8290A3] uppercase tracking-wider">
                    On Admin Add Car Form
                  </div>
                  <label className="block text-xs font-semibold text-[#040401]">
                    {name || 'Property Name'} {required && <span className="text-[#DC2626]">*</span>}
                  </label>
                  {inputType === 'single_select' || inputType === 'colour' ? (
                    <select className="w-full h-9 px-3 rounded-xl border border-[#ECECEC] text-xs bg-white text-[#040401]">
                      {options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : inputType === 'multi_select' ? (
                    <div className="flex flex-wrap gap-2">
                      {options.map((o) => (
                        <label key={o} className="inline-flex items-center gap-1 text-xs text-[#616161]">
                          <input type="checkbox" readOnly className="rounded border-[#ECECEC] text-[#FF3600]" />
                          <span>{o}</span>
                        </label>
                      ))}
                    </div>
                  ) : inputType === 'yes_no' ? (
                    <div className="flex gap-3 text-xs text-[#040401]">
                      <label className="inline-flex items-center gap-1">
                        <input type="radio" name="prev_yn" defaultChecked className="text-[#FF3600]" /> Yes
                      </label>
                      <label className="inline-flex items-center gap-1">
                        <input type="radio" name="prev_yn" className="text-[#FF3600]" /> No
                      </label>
                    </div>
                  ) : (
                    <input
                      type={inputType === 'number' ? 'number' : 'text'}
                      readOnly
                      placeholder={unit ? `Enter value (${unit})` : 'Enter value...'}
                      className="w-full h-9 px-3 rounded-xl border border-[#ECECEC] text-xs bg-white text-[#040401]"
                    />
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
