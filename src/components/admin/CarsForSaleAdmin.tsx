import React, { useMemo, useState } from 'react';
import {
  Copy,
  Download,
  Edit2,
  Grid,
  List,
  Plus,
  Receipt,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatXaf } from '../../i18n/translations';
import { CarForSale, CarStatus } from '../../types/derico';
import { PromoBadge, StatusBadge } from '../common/StatusBadge';
import { VehicleVisual } from '../common/VehicleVisual';

export const CarsForSaleAdmin: React.FC = () => {
  const {
    cars,
    setCars,
    brands,
    models,
    setAdminPage,
    setEditingCarId,
    setPreselectedReceiptCarId,
    updateCarStatus,
    openConfirm,
    addToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [importOpen, setImportOpen] = useState(false);

  const filteredCars = useMemo(() => {
    return cars.filter((c) => {
      if (filterBrand && c.brandId !== filterBrand) return false;
      if (filterStatus && c.status !== filterStatus) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !c.title.toLowerCase().includes(q) &&
          !c.reference.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [cars, filterBrand, filterStatus, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredCars.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCars.map((c) => c.id));
    }
  };

  const duplicateCar = (car: CarForSale) => {
    const copy: CarForSale = {
      ...car,
      id: `car-${Date.now()}`,
      reference: `DM-S-${Math.floor(110 + Math.random() * 889)}`,
      title: `${car.title} (Copy)`,
      status: 'Draft',
      views: 0,
      requestsCount: 0,
      updatedAt: '2026-11-13',
    };
    setCars((prev) => [copy, ...prev]);
    addToast({ type: 'success', title: `Duplicated as ${copy.reference}` });
  };

  const handleBulkAction = (action: 'publish' | 'unpublish' | 'delete') => {
    if (selectedIds.length === 0) return;
    if (action === 'delete') {
      openConfirm({
        title: `Delete ${selectedIds.length} car(s)?`,
        message: 'This action cannot be undone.',
        confirmLabel: 'Delete selected',
        destructive: true,
        onConfirm: () => {
          setCars((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
          setSelectedIds([]);
          addToast({ type: 'success', title: 'Selected cars deleted' });
        },
      });
      return;
    }
    setCars((prev) =>
      prev.map((c) =>
        selectedIds.includes(c.id)
          ? {
              ...c,
              visible: action === 'publish',
              status: action === 'publish' && c.status === 'Draft' ? 'Available' : c.status,
            }
          : c
      )
    );
    setSelectedIds([]);
    addToast({
      type: 'success',
      title: action === 'publish' ? 'Selected cars published' : 'Selected cars unpublished',
    });
  };

  const exportCsv = () => {
    const rows = [
      ['Reference', 'Title', 'Brand', 'Year', 'Price_XAF', 'Status', 'Views'].join(','),
      ...filteredCars.map((c) => {
        const b = brands.find((x) => x.id === c.brandId)?.name || '';
        return [
          c.reference,
          `"${c.title}"`,
          b,
          c.properties.year || '',
          c.priceXaf,
          c.status,
          c.views,
        ].join(',');
      }),
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'derico-motors-inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Exported inventory CSV' });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="clay-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 text-[#8290A3] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title or DM-S-..."
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-[#ECECEC] bg-[#FFF8F6] text-xs focus:outline-none focus:border-[#FF3600]"
            />
          </div>

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
          >
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-2.5 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
          >
            <option value="">All statuses</option>
            {(['Available', 'Reserved', 'Sold', 'Draft', 'Archived'] as CarStatus[]).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-0.5 rounded-xl bg-[#FFF8F6] border border-[#ECECEC]">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#FF3600] shadow-xs' : 'text-[#616161]'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#FF3600] shadow-xs' : 'text-[#616161]'
              }`}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="clay-pill h-9 px-3 text-xs font-semibold text-[#040401] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-[#FF3600]" />
            <span>Import CSV</span>
          </button>

          <button
            type="button"
            onClick={exportCsv}
            className="clay-pill h-9 px-3 text-xs font-semibold text-[#040401] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#FF3600]" />
            <span>Export</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingCarId(null);
              setAdminPage('car-form');
            }}
            className="clay-btn h-9 px-4 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add car</span>
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-[#FFF3EE] border border-[#FF3600]/25 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-semibold text-[#040401]">
            {selectedIds.length} vehicle(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkAction('publish')}
              className="clay-pill h-8 px-3 font-semibold text-[#040401] cursor-pointer"
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('unpublish')}
              className="clay-pill h-8 px-3 font-semibold text-[#040401] cursor-pointer"
            >
              Unpublish
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction('delete')}
              className="h-8 px-3 rounded-full bg-[#DC2626] text-white font-semibold cursor-pointer shadow-xs"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table or Grid */}
      {filteredCars.length === 0 ? (
        <div className="clay-card p-10 text-center space-y-3">
          <div className="text-sm font-semibold text-[#040401]">No cars match your filters</div>
          <button
            type="button"
            onClick={() => {
              setEditingCarId(null);
              setAdminPage('car-form');
            }}
            className="clay-btn h-10 px-5 text-xs font-semibold cursor-pointer"
          >
            Add your first car
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="clay-card overflow-hidden flex flex-col p-2"
            >
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-[#FFF8F6]">
                <VehicleVisual
                  bodyType={String(car.properties.body_type || 'Sedan')}
                  colour={String(car.properties.colour || 'Silver')}
                  title={car.title}
                  className="w-full h-full"
                />
                <div className="absolute top-2.5 left-2.5">
                  <StatusBadge status={car.status} />
                </div>
                {car.promoTag && (
                  <div className="absolute top-2.5 right-2.5">
                    <PromoBadge label={car.promoTag} />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="font-mono-num text-[11px] text-[#8290A3]">{car.reference}</div>
                  <div className="font-display font-bold text-sm text-[#040401] mt-0.5">
                    {car.title}
                  </div>
                  <div className="font-mono-num font-bold text-sm text-[#FF3600] mt-1">
                    {car.priceOnRequest ? 'Price on request' : formatXaf(car.priceXaf)}
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#ECECEC]">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCarId(car.id);
                      setAdminPage('car-form');
                    }}
                    className="text-xs font-semibold text-[#FF3600] hover:underline cursor-pointer"
                  >
                    Edit car
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedReceiptCarId(car.id);
                      setAdminPage('billing-receipts');
                    }}
                    className="text-xs font-semibold text-[#040401] hover:text-[#FF3600] cursor-pointer"
                  >
                    Mark sold &amp; receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="clay-card overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                <th className="py-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredCars.length > 0 && selectedIds.length === filteredCars.length
                    }
                    onChange={toggleAll}
                    className="rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                  />
                </th>
                <th className="py-3 px-3">Vehicle</th>
                <th className="py-3 px-3">Brand / Model</th>
                <th className="py-3 px-3">Year</th>
                <th className="py-3 px-3 text-right">Price (XAF)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Views / Req</th>
                <th className="py-3 px-3">Updated</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {filteredCars.map((car) => {
                const b = brands.find((x) => x.id === car.brandId);
                const m = models.find((x) => x.id === car.modelId);
                return (
                  <tr key={car.id} className="hover:bg-[#FFF8F6]/60 transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(car.id)}
                        onChange={() => toggleSelect(car.id)}
                        className="rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-xl overflow-hidden border border-[#ECECEC] shrink-0 bg-[#FFF8F6]">
                          <VehicleVisual
                            bodyType={String(car.properties.body_type || 'Sedan')}
                            colour={String(car.properties.colour || 'Silver')}
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-[#040401]">{car.title}</div>
                          <div className="font-mono-num text-[11px] text-[#8290A3]">
                            {car.reference}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#616161]">
                      {b?.name} · {m?.name}
                    </td>
                    <td className="py-3 px-3 font-mono-num text-[#040401]">
                      {String(car.properties.year || '—')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-num font-semibold text-[#040401]">
                      {car.priceOnRequest ? 'On request' : formatXaf(car.priceXaf)}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={car.status} />
                    </td>
                    <td className="py-3 px-3 text-right font-mono-num text-[#616161]">
                      {car.views} / {car.requestsCount}
                    </td>
                    <td className="py-3 px-3 font-mono-num text-[#8290A3]">{car.updatedAt}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCarId(car.id);
                            setAdminPage('car-form');
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#FFF3EE] text-[#FF3600] cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateCar(car)}
                          className="p-1.5 rounded-lg hover:bg-[#FFF8F6] text-[#616161] cursor-pointer"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateCarStatus(car.id, 'Reserved');
                            addToast({ type: 'info', title: `${car.reference} marked Reserved` });
                          }}
                          className="px-2.5 py-1 rounded-full bg-[#F59E0B]/12 text-[#92400E] text-[11px] font-medium cursor-pointer"
                          title="Mark Reserved"
                        >
                          Reserve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPreselectedReceiptCarId(car.id);
                            setAdminPage('billing-receipts');
                          }}
                          className="p-1.5 rounded-lg hover:bg-[#16A34A]/10 text-[#16A34A] cursor-pointer"
                          title="Mark Sold & Create Receipt"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            openConfirm({
                              title: `Delete ${car.title}?`,
                              message: 'This will remove the car from inventory.',
                              confirmLabel: 'Delete',
                              destructive: true,
                              onConfirm: () => {
                                setCars((prev) => prev.filter((x) => x.id !== car.id));
                                addToast({ type: 'success', title: `Deleted ${car.reference}` });
                              },
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-[#DC2626]/10 text-[#DC2626] cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {importOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card p-6 max-w-md w-full space-y-4">
            <h3 className="font-display font-bold text-base text-[#040401]">
              Import Inventory CSV
            </h3>
            <p className="text-xs text-[#616161]">
              Upload a CSV file matching Derico Motors columns (Brand, Model, Year, Price XAF, VIN).
            </p>
            <input type="file" accept=".csv" className="text-xs w-full" />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImportOpen(false)}
                className="clay-pill h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setImportOpen(false);
                  addToast({ type: 'success', title: 'CSV validation ready (prototype mode)' });
                }}
                className="clay-btn h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Simulate Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
