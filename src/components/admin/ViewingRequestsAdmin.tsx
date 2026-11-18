import React, { useState } from 'react';
import { Phone, Plus, Receipt, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RequestStatus, ViewingRequest } from '../../types/derico';
import { StatusBadge } from '../common/StatusBadge';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

const STATUS_FLOW: RequestStatus[] = [
  'New',
  'Contacted',
  'Viewing scheduled',
  'Completed',
  'Sold',
  'Cancelled',
];

export const ViewingRequestsAdmin: React.FC = () => {
  const {
    viewingRequests,
    setViewingRequests,
    cars,
    openComposer,
    setPreselectedReceiptCarId,
    setAdminPage,
    addToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedReq, setSelectedReq] = useState<ViewingRequest | null>(null);
  const [newNote, setNewNote] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [cName, setCName] = useState('');
  const [cPhone, setCPhone] = useState('');
  const [cCarId, setCCarId] = useState(cars[0]?.id || '');
  const [cSource, setCSource] = useState<'Form' | 'WhatsApp' | 'Call' | 'Walk-in'>('Walk-in');
  const [cDate, setCDate] = useState('2026-11-15');

  const filtered = viewingRequests.filter(
    (r) => !statusFilter || r.status === statusFilter
  );

  const updateStatus = (id: string, status: RequestStatus) => {
    setViewingRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (selectedReq?.id === id) {
      setSelectedReq((prev) => (prev ? { ...prev, status } : null));
    }
    addToast({ type: 'success', title: `Request marked ${status}` });
  };

  const addNote = () => {
    if (!selectedReq || !newNote.trim()) return;
    const note = {
      id: `n-${Date.now()}`,
      author: 'Admin',
      text: newNote.trim(),
      createdAt: '2026-11-13 11:05',
    };
    setViewingRequests((prev) =>
      prev.map((r) => (r.id === selectedReq.id ? { ...r, notes: [...r.notes, note] } : r))
    );
    setSelectedReq((prev) => (prev ? { ...prev, notes: [...prev.notes, note] } : null));
    setNewNote('');
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cPhone.trim()) return;
    const newReq: ViewingRequest = {
      id: `req-${Date.now()}`,
      reference: `DM-REQ-${Math.floor(1050 + Math.random() * 899)}`,
      clientName: cName.trim(),
      clientPhone: cPhone.trim(),
      clientEmail: 'Walk-in / Manual',
      carId: cCarId,
      source: cSource,
      preferredDate: cDate,
      message: 'Logged manually by showroom desk.',
      whatsappOptIn: true,
      status: 'New',
      assignedTo: 'Christian Ndi (Sales)',
      createdAt: '2026-11-13 11:10',
      notes: [],
    };
    setViewingRequests((prev) => [newReq, ...prev]);
    setAddModalOpen(false);
    setCName('');
    setCPhone('');
    addToast({ type: 'success', title: `Added request ${newReq.reference}` });
  };

  return (
    <div className="space-y-4">
      <div className="clay-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
              statusFilter === '' ? 'clay-btn !h-8' : 'clay-pill !h-8 text-[#616161]'
            }`}
          >
            All ({viewingRequests.length})
          </button>
          {STATUS_FLOW.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === st ? 'clay-btn !h-8' : 'clay-pill !h-8 text-[#616161]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="clay-btn h-9 px-4 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add request</span>
        </button>
      </div>

      <div className="clay-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[820px]">
          <thead>
            <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Preferred date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECEC] text-xs">
            {filtered.map((req) => {
              const car = cars.find((c) => c.id === req.carId);
              return (
                <tr
                  key={req.id}
                  onClick={() => setSelectedReq(req)}
                  className="hover:bg-[#FFF8F6]/60 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono-num font-semibold text-[#FF3600]">
                    {req.reference}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-[#040401]">{req.clientName}</div>
                    <div className="font-mono-num text-[11px] text-[#616161]">
                      {req.clientPhone}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#040401] font-medium">
                    {car?.title || 'Vehicle'}
                  </td>
                  <td className="py-3 px-4 text-[#616161]">{req.source}</td>
                  <td className="py-3 px-4 font-mono-num text-[#040401]">
                    {req.preferredDate}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td
                    className="py-3 px-4 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedReq(req)}
                      className="text-xs font-semibold text-[#FF3600] hover:underline cursor-pointer"
                    >
                      Open drawer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Request Detail Drawer */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl clay-card !rounded-none sm:!rounded-l-3xl">
            <div className="px-5 py-4 border-b border-[#ECECEC] flex items-center justify-between">
              <div>
                <div className="font-mono-num text-xs text-[#FF3600] font-semibold">
                  {selectedReq.reference}
                </div>
                <h3 className="font-display font-bold text-base text-[#040401]">
                  {selectedReq.clientName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReq(null)}
                className="w-9 h-9 rounded-full hover:bg-[#FFF3EE] flex items-center justify-center cursor-pointer text-[#040401]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] space-y-1.5 text-xs">
                <div className="font-semibold text-[#040401]">
                  Vehicle: {cars.find((c) => c.id === selectedReq.carId)?.title}
                </div>
                <div className="font-mono-num text-[#616161]">
                  {selectedReq.clientPhone} · {selectedReq.clientEmail}
                </div>
                <div className="text-[#616161]">
                  Preferred date: <strong className="text-[#040401]">{selectedReq.preferredDate}</strong> · Source: {selectedReq.source}
                </div>
                <div className="pt-1 text-[#040401] italic">&ldquo;{selectedReq.message}&rdquo;</div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const car = cars.find((c) => c.id === selectedReq.carId);
                    openComposer({
                      recipientName: selectedReq.clientName,
                      recipientPhone: selectedReq.clientPhone,
                      linkedRecord: selectedReq.reference,
                      windowMinutesRemaining: 192,
                      variables: {
                        car: car?.title || 'Vehicle',
                        date: selectedReq.preferredDate,
                        time: '10:30',
                      },
                    });
                  }}
                  className="clay-pill h-10 px-3 bg-[#25D366] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Send WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    addToast({ type: 'info', title: `Dialing ${selectedReq.clientPhone}` })
                  }
                  className="clay-pill h-10 px-3 text-[#040401] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#FF3600]" />
                  <span>Call client</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selectedReq.id, 'Viewing scheduled')}
                  className="clay-pill h-10 px-3 bg-[#FFF3EE] text-[#FF3600] text-xs font-semibold cursor-pointer"
                >
                  Schedule viewing
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateStatus(selectedReq.id, 'Sold');
                    setPreselectedReceiptCarId(selectedReq.carId);
                    setSelectedReq(null);
                    setAdminPage('billing-receipts');
                  }}
                  className="clay-btn h-10 px-3 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  <span>Mark sold &amp; receipt</span>
                </button>
              </div>

              {/* Status Pipeline */}
              <div>
                <div className="text-xs font-semibold text-[#040401] mb-2">Update status</div>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_FLOW.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(selectedReq.id, st)}
                      className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        selectedReq.status === st
                          ? 'clay-btn-dark'
                          : 'clay-pill text-[#616161]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes Timeline */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#040401]">Notes Timeline</div>
                {selectedReq.notes.length === 0 ? (
                  <p className="text-xs text-[#8290A3]">No notes added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedReq.notes.map((n) => (
                      <div key={n.id} className="p-3 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] text-xs">
                        <div className="font-semibold text-[#040401]">
                          {n.author} · <span className="font-mono-num text-[#8290A3]">{n.createdAt}</span>
                        </div>
                        <p className="text-[#616161] mt-1">{n.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add internal note..."
                    className="flex-1 h-9 px-3 rounded-xl border border-[#ECECEC] bg-white text-xs focus:outline-none focus:border-[#FF3600]"
                  />
                  <button
                    type="button"
                    onClick={addNote}
                    className="clay-btn h-9 px-4 text-xs font-semibold cursor-pointer"
                  >
                    Add note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddManual}
            className="clay-card p-6 max-w-md w-full space-y-4"
          >
            <h3 className="font-display font-bold text-base text-[#040401]">
              Log Manual Viewing Request
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                required
                placeholder="Client full name"
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                className="dm-input"
              />
              <input
                type="tel"
                required
                placeholder="WhatsApp phone (+237...)"
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value)}
                className="dm-input font-mono-num"
              />
              <select
                value={cCarId}
                onChange={(e) => setCCarId(e.target.value)}
                className="dm-input"
              >
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.reference} — {c.title}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={cSource}
                  onChange={(e) => setCSource(e.target.value as typeof cSource)}
                  className="dm-input"
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Call">Call</option>
                  <option value="Form">Form</option>
                </select>
                <input
                  type="date"
                  value={cDate}
                  onChange={(e) => setCDate(e.target.value)}
                  className="dm-input font-mono-num"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="clay-pill h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clay-btn h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Save request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
