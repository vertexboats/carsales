import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Edit2, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Driver, ServiceItem } from '../../types/derico';
import { StatusBadge } from '../common/StatusBadge';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const DriversAdmin: React.FC = () => {
  const { drivers, setDrivers, rentalBookings, pickupBookings, openComposer, addToast } = useApp();
  const [drawerDriver, setDrawerDriver] = useState<Driver | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const [dName, setDName] = useState('');
  const [dPhone, setDPhone] = useState('');
  const [dLicence, setDLicence] = useState('');
  const [dExpiry, setDExpiry] = useState('2027-06-01');
  const [dAddress, setDAddress] = useState('Douala');

  const getLicenceStatus = (expiry: string) => {
    const days = Math.round(
      (new Date(expiry).getTime() - new Date('2026-11-13').getTime()) / 86400000
    );
    if (days < 30) return { label: `Expires in ${days}d`, tone: 'error' as const };
    if (days < 60) return { label: `Expires in ${days}d`, tone: 'warning' as const };
    return { label: expiry, tone: 'success' as const };
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dName.trim() || !dPhone.trim()) return;
    const nd: Driver = {
      id: `drv-${Date.now()}`,
      name: dName.trim(),
      phone: dPhone.trim(),
      email: 'driver@dericomotors.cm',
      address: dAddress,
      licenceNumber: dLicence || 'CM-LT-2026-1002',
      licenceExpiry: dExpiry,
      idNumber: '12000192',
      emergencyContact: 'Operations Desk',
      notes: 'Added via admin portal.',
      status: 'Active',
    };
    setDrivers((prev) => [...prev, nd]);
    setAddOpen(false);
    setDName('');
    setDPhone('');
    addToast({ type: 'success', title: `Added driver ${nd.name}` });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] hover:bg-[#E03000] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add driver</span>
        </button>
      </div>

      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="border-b border-[#ECECEC] bg-[#FAF9F5] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                <th className="py-3.5 px-4">Driver</th>
                <th className="py-3.5 px-4">WhatsApp Phone</th>
                <th className="py-3.5 px-4">Licence No.</th>
                <th className="py-3.5 px-4">Licence Expiry</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {drivers.map((d) => {
                const lic = getLicenceStatus(d.licenceExpiry);
                const assignedRentals = rentalBookings.filter((b) => b.driverId === d.id);
                return (
                  <tr key={d.id} className="hover:bg-[#FFF8F6] transition-colors">
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => setDrawerDriver(d)}
                        className="font-semibold text-[#040401] hover:text-[#FF3600] cursor-pointer text-left transition-colors"
                      >
                        {d.name}
                      </button>
                      <div className="text-[11px] text-[#616161]">{d.address}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono-num text-[#040401]">{d.phone}</td>
                    <td className="py-3.5 px-4 font-mono-num text-[#616161]">{d.licenceNumber}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={lic.label} toneOverride={lic.tone} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() =>
                          openComposer({
                            recipientName: d.name,
                            recipientPhone: d.phone,
                            linkedRecord: assignedRentals[0]?.reference || 'JOB-DISPATCH',
                            defaultTemplateId: 'tpl-09',
                            variables: {
                              driver_name: d.name,
                              car: 'Assigned Fleet Vehicle',
                              date: assignedRentals[0]?.startDate || '2026-11-15',
                              time: '09:00',
                              client_name: assignedRentals[0]?.clientName || 'Client',
                            },
                          })
                        }
                        className="clay-btn h-8 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5" />
                        <span>Send job details</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {drawerDriver && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
            <div className="px-6 py-4.5 border-b border-[#ECECEC] flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#040401]">
                {drawerDriver.name}
              </h3>
              <button
                type="button"
                onClick={() => setDrawerDriver(null)}
                className="p-1.5 rounded-xl hover:bg-[#FAF9F5] text-[#616161] hover:text-[#040401] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="p-4.5 rounded-2xl bg-[#FAF9F5] border border-[#ECECEC] space-y-2">
                <div><strong className="text-[#040401]">Phone:</strong> <span className="font-mono-num text-[#040401]">{drawerDriver.phone}</span></div>
                <div><strong className="text-[#040401]">Licence:</strong> <span className="font-mono-num text-[#040401]">{drawerDriver.licenceNumber}</span> (Exp: {drawerDriver.licenceExpiry})</div>
                <div><strong className="text-[#040401]">ID / Passport:</strong> <span className="font-mono-num text-[#040401]">{drawerDriver.idNumber}</span></div>
                <div><strong className="text-[#040401]">Emergency Contact:</strong> <span className="text-[#040401]">{drawerDriver.emergencyContact}</span></div>
                <div className="pt-1.5 text-[#616161] border-t border-[#ECECEC]">{drawerDriver.notes}</div>
              </div>

              <div>
                <div className="font-semibold text-[#040401] mb-2.5">Assigned Trips</div>
                <div className="space-y-2">
                  {rentalBookings
                    .filter((b) => b.driverId === drawerDriver.id)
                    .map((b) => (
                      <div key={b.id} className="p-3 rounded-xl border border-[#ECECEC] bg-white hover:border-[#FF3600]/40 transition-colors">
                        <div className="font-mono-num font-semibold text-[#FF3600]">{b.reference}</div>
                        <div className="text-[#616161] mt-0.5">{b.clientName} · {b.startDate} → {b.endDate}</div>
                      </div>
                    ))}
                  {pickupBookings
                    .filter((p) => p.driverId === drawerDriver.id)
                    .map((p) => (
                      <div key={p.id} className="p-3 rounded-xl border border-[#ECECEC] bg-white hover:border-[#FF3600]/40 transition-colors">
                        <div className="font-mono-num font-semibold text-[#FF3600]">{p.reference}</div>
                        <div className="text-[#616161] mt-0.5">{p.clientName} · {p.date} {p.time}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {addOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAdd}
            className="clay-card bg-white rounded-2xl p-6 max-w-md w-full space-y-4 border border-[#ECECEC] shadow-2xl"
          >
            <h3 className="font-display font-bold text-base text-[#040401]">Add Driver</h3>
            <input
              type="text"
              required
              placeholder="Full name"
              value={dName}
              onChange={(e) => setDName(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
            />
            <input
              type="tel"
              required
              placeholder="WhatsApp phone (+237...)"
              value={dPhone}
              onChange={(e) => setDPhone(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
            />
            <input
              type="text"
              placeholder="Licence number"
              value={dLicence}
              onChange={(e) => setDLicence(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                type="date"
                value={dExpiry}
                onChange={(e) => setDExpiry(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs font-mono-num text-[#040401] focus:outline-none focus:border-[#FF3600]"
              />
              <input
                type="text"
                placeholder="City / Address"
                value={dAddress}
                onChange={(e) => setDAddress(e.target.value)}
                className="h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="clay-btn-white h-9 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold cursor-pointer hover:bg-[#FAF9F5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clay-btn h-9 px-5 rounded-xl bg-[#FF3600] text-white text-xs font-semibold cursor-pointer hover:bg-[#E03000]"
              >
                Save Driver
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const ServicesAdmin: React.FC = () => {
  const { services, setServices, addToast } = useApp();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const moveService = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= services.length) return;
    const reordered = [...services];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setServices(reordered.map((s, idx) => ({ ...s, order: idx + 1 })));
    addToast({ type: 'info', title: `Reordered "${moved.titleEn}"` });
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setServices((prev) =>
      prev.map((s) => (s.id === editingService.id ? editingService : s))
    );
    addToast({ type: 'success', title: `Saved changes to "${editingService.titleEn}"` });
    setEditingService(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-base text-[#040401]">
            Dealership Mobility Services
          </h2>
          <p className="text-xs text-[#616161]">
            Configure public landing pages, why-choose-us guarantees, and FAQs.
          </p>
        </div>
      </div>

      <div className="clay-card bg-white rounded-2xl border border-[#ECECEC] divide-y divide-[#ECECEC] overflow-hidden">
        {services.map((s, index) => (
          <div key={s.id} className="p-4.5 flex flex-wrap items-center justify-between gap-4 hover:bg-[#FAF9F5] transition-colors">
            <div className="flex items-start gap-3.5 max-w-2xl">
              <div className="flex flex-col gap-1 pt-0.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveService(index, 'up')}
                  className="p-1 rounded-lg hover:bg-white text-[#616161] hover:text-[#040401] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === services.length - 1}
                  onClick={() => moveService(index, 'down')}
                  className="p-1 rounded-lg hover:bg-white text-[#616161] hover:text-[#040401] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm text-[#040401]">{s.titleEn}</span>
                  <span className="text-[11px] font-mono-num text-[#FF3600]">/{s.slug}</span>
                  {!s.visible && (
                    <span className="clay-pill px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#ECECEC] text-[#616161]">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#616161]">{s.summaryEn}</p>
                <div className="text-[11px] text-[#8290A3] flex items-center gap-3">
                  <span>{s.whyChooseUs.length} highlights</span>
                  <span>·</span>
                  <span>{s.faqs.length} FAQs</span>
                  <span>·</span>
                  <span>CTA: {s.ctaType} ({s.ctaLabelEn})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingService(JSON.parse(JSON.stringify(s)))}
                className="clay-btn-white h-9 px-3.5 rounded-xl border border-[#ECECEC] bg-white hover:bg-[#FFF8F6] text-xs font-semibold text-[#040401] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#FF3600]" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setServices((prev) =>
                    prev.map((x) => (x.id === s.id ? { ...x, visible: !x.visible } : x))
                  );
                  addToast({
                    type: 'info',
                    title: `${s.titleEn} is now ${s.visible ? 'hidden' : 'visible'}`,
                  });
                }}
                className={`clay-pill h-9 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  s.visible
                    ? 'border-[#16A34A]/30 bg-[#16A34A]/10 text-[#15803D]'
                    : 'border-[#ECECEC] bg-[#FAF9F5] text-[#616161]'
                }`}
              >
                {s.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{s.visible ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Edit Modal / Drawer */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full flex flex-col shadow-2xl">
            <div className="px-6 py-4.5 border-b border-[#ECECEC] flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-display font-bold text-base text-[#040401]">
                  Edit Service: {editingService.titleEn}
                </h3>
                <span className="text-xs text-[#FF3600] font-mono-num">Slug: /{editingService.slug}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-xl hover:bg-[#FAF9F5] text-[#616161] hover:text-[#040401] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Titles & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#040401] mb-1.5">Title (EN)</label>
                  <input
                    type="text"
                    required
                    value={editingService.titleEn}
                    onChange={(e) =>
                      setEditingService({ ...editingService, titleEn: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#040401] mb-1.5">Title (FR)</label>
                  <input
                    type="text"
                    required
                    value={editingService.titleFr}
                    onChange={(e) =>
                      setEditingService({ ...editingService, titleFr: e.target.value })
                    }
                    className="w-full h-10 px-3.5 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                  />
                </div>
              </div>

              {/* Summaries */}
              <div className="space-y-3.5">
                <div>
                  <label className="block font-semibold text-[#040401] mb-1.5">Short Summary (EN)</label>
                  <textarea
                    rows={2}
                    value={editingService.summaryEn}
                    onChange={(e) =>
                      setEditingService({ ...editingService, summaryEn: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#040401] mb-1.5">Short Summary (FR)</label>
                  <textarea
                    rows={2}
                    value={editingService.summaryFr}
                    onChange={(e) =>
                      setEditingService({ ...editingService, summaryFr: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-[#ECECEC] text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                  />
                </div>
              </div>

              {/* Rich Descriptions */}
              <div className="space-y-3.5">
                <div>
                  <label className="block font-semibold text-[#040401] mb-1.5">Full Description (EN)</label>
                  <textarea
                    rows={4}
                    value={editingService.descriptionEn}
                    onChange={(e) =>
                      setEditingService({ ...editingService, descriptionEn: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-[#ECECEC] text-xs text-[#040401] font-mono focus:outline-none focus:border-[#FF3600]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#040401] mb-1.5">Full Description (FR)</label>
                  <textarea
                    rows={4}
                    value={editingService.descriptionFr}
                    onChange={(e) =>
                      setEditingService({ ...editingService, descriptionFr: e.target.value })
                    }
                    className="w-full p-3 rounded-xl border border-[#ECECEC] text-xs text-[#040401] font-mono focus:outline-none focus:border-[#FF3600]"
                  />
                </div>
              </div>

              {/* CTA Settings */}
              <div className="p-4.5 rounded-2xl bg-[#FAF9F5] border border-[#ECECEC] space-y-3">
                <span className="font-semibold text-[#040401] block">CTA Button Configuration</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-[#616161] mb-1">CTA Action</label>
                    <select
                      value={editingService.ctaType}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          ctaType: e.target.value as 'WhatsApp' | 'Form' | 'Call',
                        })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    >
                      <option value="WhatsApp">WhatsApp Message</option>
                      <option value="Form">Open Request Form</option>
                      <option value="Call">Direct Phone Call</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-[#616161] mb-1">Button Label (EN)</label>
                    <input
                      type="text"
                      value={editingService.ctaLabelEn}
                      onChange={(e) =>
                        setEditingService({ ...editingService, ctaLabelEn: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-[#616161] mb-1">Button Label (FR)</label>
                    <input
                      type="text"
                      value={editingService.ctaLabelFr}
                      onChange={(e) =>
                        setEditingService({ ...editingService, ctaLabelFr: e.target.value })
                      }
                      className="w-full h-10 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                    />
                  </div>
                </div>
              </div>

              {/* Why Choose Us Repeater */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#040401]">Why Choose Us Points</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService({
                        ...editingService,
                        whyChooseUs: [
                          ...editingService.whyChooseUs,
                          {
                            icon: 'Shield',
                            titleEn: 'New Guarantee',
                            titleFr: 'Nouvelle Garantie',
                            textEn: 'Description of key feature or guarantee.',
                            textFr: 'Description de la garantie.',
                          },
                        ],
                      })
                    }
                    className="text-xs font-semibold text-[#FF3600] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add point</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editingService.whyChooseUs.map((pt, pIdx) => (
                    <div
                      key={pIdx}
                      className="p-3.5 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] space-y-2 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#040401]">Point #{pIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingService({
                              ...editingService,
                              whyChooseUs: editingService.whyChooseUs.filter((_, i) => i !== pIdx),
                            })
                          }
                          className="text-[#DC2626] hover:bg-red-50 p-1 rounded-lg cursor-pointer"
                          title="Remove point"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Heading (EN)"
                          value={pt.titleEn}
                          onChange={(e) => {
                            const updated = [...editingService.whyChooseUs];
                            updated[pIdx].titleEn = e.target.value;
                            setEditingService({ ...editingService, whyChooseUs: updated });
                          }}
                          className="h-9 px-3 rounded-lg border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                        />
                        <input
                          type="text"
                          placeholder="Heading (FR)"
                          value={pt.titleFr}
                          onChange={(e) => {
                            const updated = [...editingService.whyChooseUs];
                            updated[pIdx].titleFr = e.target.value;
                            setEditingService({ ...editingService, whyChooseUs: updated });
                          }}
                          className="h-9 px-3 rounded-lg border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Short text (EN)"
                        value={pt.textEn}
                        onChange={(e) => {
                          const updated = [...editingService.whyChooseUs];
                          updated[pIdx].textEn = e.target.value;
                          setEditingService({ ...editingService, whyChooseUs: updated });
                        }}
                        className="w-full h-9 px-3 rounded-lg border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs Repeater */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#040401]">Frequently Asked Questions (FAQs)</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingService({
                        ...editingService,
                        faqs: [
                          ...editingService.faqs,
                          {
                            qEn: 'Frequently asked question?',
                            qFr: 'Question fréquemment posée ?',
                            aEn: 'Helpful answer for prospective clients.',
                            aFr: 'Réponse utile pour les clients.',
                          },
                        ],
                      })
                    }
                    className="text-xs font-semibold text-[#FF3600] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {editingService.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-3.5 rounded-xl border border-[#ECECEC] bg-[#FAF9F5] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#040401]">FAQ #{fIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingService({
                              ...editingService,
                              faqs: editingService.faqs.filter((_, i) => i !== fIdx),
                            })
                          }
                          className="text-[#DC2626] hover:bg-red-50 p-1 rounded-lg cursor-pointer"
                          title="Remove FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Question (EN)"
                        value={faq.qEn}
                        onChange={(e) => {
                          const updated = [...editingService.faqs];
                          updated[fIdx].qEn = e.target.value;
                          setEditingService({ ...editingService, faqs: updated });
                        }}
                        className="w-full h-9 px-3 rounded-lg border border-[#ECECEC] bg-white text-xs font-medium text-[#040401] focus:outline-none focus:border-[#FF3600]"
                      />
                      <textarea
                        rows={2}
                        placeholder="Answer (EN)"
                        value={faq.aEn}
                        onChange={(e) => {
                          const updated = [...editingService.faqs];
                          updated[fIdx].aEn = e.target.value;
                          setEditingService({ ...editingService, faqs: updated });
                        }}
                        className="w-full p-2.5 rounded-lg border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#ECECEC] flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="clay-btn-white h-10 px-4 rounded-xl border border-[#ECECEC] text-xs font-semibold cursor-pointer hover:bg-[#FAF9F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn h-10 px-5 rounded-xl bg-[#FF3600] hover:bg-[#E03000] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
