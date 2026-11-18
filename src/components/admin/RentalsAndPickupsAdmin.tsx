import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  FileText,
  List,
  Plus,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatXaf } from '../../i18n/translations';
import { BookingStatus, PickupBooking, RentalBooking } from '../../types/derico';
import { StatusBadge, StatusTicks } from '../common/StatusBadge';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const RentalFleetAdmin: React.FC = () => {
  const { rentals, setRentals, addToast } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [rate, setRate] = useState(55000);
  const [driverOk, setDriverOk] = useState(true);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setRentals((prev) => [
      {
        id: `rent-${Date.now()}`,
        reference: `DM-R-0${Math.floor(210 + Math.random() * 700)}`,
        brandId: 'br-toyota',
        modelId: 'md-corolla',
        title: title.trim(),
        shortDescriptionEn: 'Inspected rental vehicle ready for daily hire.',
        shortDescriptionFr: 'Véhicule de location inspecté prêt pour location journalière.',
        pricePerDayXaf: rate,
        driverAvailable: driverOk,
        driverDailyFeeXaf: 15000,
        status: 'Available',
        visible: true,
        bookedRanges: [],
        properties: {
          year: 2020,
          colour: 'Silver',
          location: 'Douala',
          fuel_type: 'Petrol',
          transmission: 'Automatic',
          body_type: 'Sedan',
          seats: 5,
        },
        photos: [
          { id: 'p1', angle: 'front34', caption: 'Exterior', isCover: true },
        ],
      },
      ...prev,
    ]);
    setAddOpen(false);
    setTitle('');
    addToast({ type: 'success', title: 'Rental vehicle added to fleet' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="clay-btn h-10 px-4 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add rental car</span>
        </button>
      </div>

      <div className="clay-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
              <th className="py-3 px-4">Reference</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4 text-right">Daily Rate (24h)</th>
              <th className="py-3 px-4">With Driver</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECEC] text-xs">
            {rentals.map((r) => (
              <tr key={r.id} className="hover:bg-[#FFF8F6]/60 transition-colors">
                <td className="py-3 px-4 font-mono-num text-[#FF3600] font-semibold">{r.reference}</td>
                <td className="py-3 px-4 font-semibold text-[#040401]">{r.title}</td>
                <td className="py-3 px-4 text-right font-mono-num font-bold text-[#040401]">
                  {formatXaf(r.pricePerDayXaf)}
                </td>
                <td className="py-3 px-4 text-[#616161]">
                  {r.driverAvailable ? `Yes (+${formatXaf(r.driverDailyFeeXaf)})` : 'Self-drive only'}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={r.status} />
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      setRentals((prev) =>
                        prev.map((x) =>
                          x.id === r.id
                            ? { ...x, status: x.status === 'Available' ? 'Maintenance' : 'Available' }
                            : x
                        )
                      )
                    }
                    className="text-xs font-semibold text-[#FF3600] hover:underline cursor-pointer"
                  >
                    {r.status === 'Available' ? 'Set Maintenance' : 'Set Available'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {addOpen && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAdd}
            className="clay-card p-6 max-w-md w-full space-y-4"
          >
            <h3 className="font-display font-bold text-base text-[#040401]">Add Rental Vehicle</h3>
            <input
              type="text"
              required
              placeholder="Title (e.g. 2020 Toyota RAV4)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="dm-input"
            />
            <input
              type="number"
              required
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="dm-input font-mono-num"
            />
            <label className="flex items-center gap-2 text-xs text-[#040401]">
              <input
                type="checkbox"
                checked={driverOk}
                onChange={(e) => setDriverOk(e.target.checked)}
                className="rounded border-[#ECECEC] text-[#FF3600] accent-[#FF3600]"
              />
              <span>Driver option available</span>
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="clay-pill h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="clay-btn h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Save Vehicle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const RentalBookingsAdmin: React.FC = () => {
  const {
    rentalBookings,
    setRentalBookings,
    rentals,
    drivers,
    openComposer,
    setPreselectedInvoiceBookingRef,
    setAdminPage,
    sendWhatsAppLogEntry,
    addToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [selectedBooking, setSelectedBooking] = useState<RentalBooking | null>(null);

  const datesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) =>
    aStart <= bEnd && bStart <= aEnd;

  const getDriverConflict = (driverId: string, booking: RentalBooking) => {
    return rentalBookings.find(
      (b) =>
        b.id !== booking.id &&
        b.driverId === driverId &&
        b.status !== 'Cancelled' &&
        datesOverlap(booking.startDate, booking.endDate, b.startDate, b.endDate)
    );
  };

  const assignDriver = (booking: RentalBooking, driverId: string | null) => {
    if (driverId) {
      const conflict = getDriverConflict(driverId, booking);
      if (conflict) {
        addToast({
          type: 'error',
          title: 'Driver scheduling conflict',
          description: `Busy until ${conflict.endDate} on ${conflict.reference}`,
        });
        return;
      }
    }
    setRentalBookings((prev) =>
      prev.map((b) => (b.id === booking.id ? { ...b, driverId } : b))
    );
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking((prev) => (prev ? { ...prev, driverId } : null));
    }
    if (driverId) {
      const drv = drivers.find((d) => d.id === driverId);
      addToast({
        type: 'success',
        title: `Assigned ${drv?.name} to ${booking.reference}`,
      });
    }
  };

  const confirmBooking = (booking: RentalBooking) => {
    const car = rentals.find((r) => r.id === booking.rentalCarId);
    const drv = drivers.find((d) => d.id === booking.driverId);
    setRentalBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, status: 'Confirmed', whatsappStatus: 'delivered' }
          : b
      )
    );
    if (selectedBooking?.id === booking.id) {
      setSelectedBooking((prev) =>
        prev ? { ...prev, status: 'Confirmed', whatsappStatus: 'delivered' } : null
      );
    }
    sendWhatsAppLogEntry({
      recipientName: booking.clientName,
      recipientPhone: booking.clientPhone,
      templateName: 'rental_confirmed_driver',
      linkedRecord: booking.reference,
      channel: 'WhatsApp API',
      status: 'delivered',
      previewText: `Hello ${booking.clientName}, your rental of ${car?.title} (${booking.startDate} to ${booking.endDate}) is confirmed! ${
        drv ? `Driver: ${drv.name} (${drv.phone}).` : ''
      }`,
    });
    addToast({
      type: 'success',
      title: `Booking ${booking.reference} confirmed`,
      description: 'WhatsApp confirmation sent with status ticks.',
    });
  };

  const updateStatus = (id: string, status: BookingStatus) => {
    setRentalBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const calendarDays = ['2026-11-14', '2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21'];

  return (
    <div className="space-y-4">
      <div className="clay-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-[#616161]">
          Inline driver assignment automatically checks date conflicts across active rentals.
        </div>
        <div className="flex items-center p-0.5 rounded-xl bg-[#FFF8F6] border border-[#ECECEC]">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'table' ? 'bg-white text-[#FF3600] shadow-xs' : 'text-[#616161]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              viewMode === 'calendar' ? 'bg-white text-[#FF3600] shadow-xs' : 'text-[#616161]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="clay-card overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold text-[#616161]">
                <th className="py-3 px-4 w-56">Rental Vehicle</th>
                {calendarDays.map((d) => (
                  <th key={d} className="py-3 px-2 text-center font-mono-num">
                    {d.slice(5)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {rentals.map((car) => (
                <tr key={car.id}>
                  <td className="py-3 px-4 font-semibold text-[#040401]">{car.title}</td>
                  {calendarDays.map((day) => {
                    const b = rentalBookings.find(
                      (bk) =>
                        bk.rentalCarId === car.id &&
                        bk.status !== 'Cancelled' &&
                        day >= bk.startDate &&
                        day <= bk.endDate
                    );
                    if (!b) {
                      return (
                        <td key={day} className="p-1.5 text-center text-[10px] text-[#8290A3]">
                          Free
                        </td>
                      );
                    }
                    const tone =
                      b.status === 'Confirmed'
                        ? 'bg-[#16A34A]/15 text-[#16A34A] border-[#16A34A]/30'
                        : 'bg-[#F59E0B]/15 text-[#92400E] border-[#F59E0B]/30';
                    return (
                      <td key={day} className="p-1">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className={`w-full py-1.5 px-1 rounded-lg border text-[10px] font-semibold truncate cursor-pointer ${tone}`}
                          title={`${b.reference} · ${b.clientName}`}
                        >
                          {b.clientName.split(' ')[0]}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="clay-card overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[980px]">
            <thead>
              <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
                <th className="py-3 px-3">Ref</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Vehicle &amp; Dates</th>
                <th className="py-3 px-3">Assigned Driver (Inline)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">WhatsApp</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECECEC] text-xs">
              {rentalBookings.map((b) => {
                const car = rentals.find((r) => r.id === b.rentalCarId);
                return (
                  <tr
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="hover:bg-[#FFF8F6]/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-mono-num font-semibold text-[#FF3600]">
                      {b.reference}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#040401]">{b.clientName}</div>
                      <div className="font-mono-num text-[11px] text-[#616161]">{b.clientPhone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#040401]">{car?.title}</div>
                      <div className="font-mono-num text-[11px] text-[#616161]">
                        {b.startDate} → {b.endDate} · {b.withDriver ? 'With driver' : 'Self-drive'}
                      </div>
                    </td>
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      {!b.withDriver ? (
                        <span className="text-[#8290A3]">Self-drive</span>
                      ) : (
                        <select
                          value={b.driverId || ''}
                          onChange={(e) => assignDriver(b, e.target.value || null)}
                          className="h-8 px-2 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                        >
                          <option value="">Unassigned...</option>
                          {drivers
                            .filter((d) => d.status === 'Active')
                            .map((d) => {
                              const conflict = getDriverConflict(d.id, b);
                              return (
                                <option
                                  key={d.id}
                                  value={d.id}
                                  disabled={Boolean(conflict)}
                                >
                                  {d.name}
                                  {conflict ? ` (Busy until ${conflict.endDate})` : ''}
                                </option>
                              );
                            })}
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusTicks status={b.whatsappStatus} />
                    </td>
                    <td
                      className="py-3 px-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {b.status === 'Pending' ? (
                        <button
                          type="button"
                          onClick={() => confirmBooking(b)}
                          className="clay-btn h-8 px-3 text-[11px] font-semibold cursor-pointer"
                        >
                          Confirm
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="text-xs font-semibold text-[#FF3600] hover:underline cursor-pointer"
                        >
                          Details
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Rental Booking Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl clay-card !rounded-none sm:!rounded-l-3xl">
            <div className="px-5 py-4 border-b border-[#ECECEC] flex items-center justify-between">
              <div>
                <div className="font-mono-num text-xs font-semibold text-[#FF3600]">
                  {selectedBooking.reference}
                </div>
                <h3 className="font-display font-bold text-base text-[#040401]">
                  {selectedBooking.clientName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-full hover:bg-[#FFF3EE] cursor-pointer text-[#040401]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] space-y-1.5">
                <div className="font-semibold text-sm text-[#040401]">
                  {rentals.find((r) => r.id === selectedBooking.rentalCarId)?.title}
                </div>
                <div>
                  <strong>Dates:</strong>{' '}
                  <span className="font-mono-num">
                    {selectedBooking.startDate} → {selectedBooking.endDate}
                  </span>
                </div>
                <div>
                  <strong>Pick-up:</strong> {selectedBooking.pickupLocation}
                </div>
                <div>
                  <strong>Return:</strong> {selectedBooking.returnLocation}
                </div>
                <div>
                  <strong>Total:</strong>{' '}
                  <span className="font-mono-num font-bold text-[#040401]">
                    {formatXaf(selectedBooking.totalXaf)}
                  </span>
                </div>
                <div className="pt-1 text-[#16A34A]">
                  Policy accepted: {selectedBooking.policyAcceptedVersion} at{' '}
                  {selectedBooking.policyAcceptedAt}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {selectedBooking.status === 'Pending' && (
                  <button
                    type="button"
                    onClick={() => confirmBooking(selectedBooking)}
                    className="h-10 px-3 rounded-full bg-[#16A34A] text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; WhatsApp</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const car = rentals.find((r) => r.id === selectedBooking.rentalCarId);
                    const drv = drivers.find((d) => d.id === selectedBooking.driverId);
                    openComposer({
                      recipientName: selectedBooking.clientName,
                      recipientPhone: selectedBooking.clientPhone,
                      linkedRecord: selectedBooking.reference,
                      windowMinutesRemaining: 120,
                      defaultTemplateId: 'tpl-04',
                      variables: {
                        car: car?.title || 'Rental Vehicle',
                        date: `${selectedBooking.startDate} to ${selectedBooking.endDate}`,
                        driver_name: drv?.name || 'Pending assignment',
                        driver_phone: drv?.phone || '',
                        amount: formatXaf(selectedBooking.totalXaf),
                      },
                    });
                  }}
                  className="clay-pill h-10 px-3 bg-[#25D366] text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Message client</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreselectedInvoiceBookingRef(selectedBooking.reference);
                    setSelectedBooking(null);
                    setAdminPage('billing-invoices');
                  }}
                  className="clay-btn h-10 px-3 text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selectedBooking.id, 'Cancelled')}
                  className="h-10 px-3 rounded-full border border-[#DC2626]/30 text-[#DC2626] font-semibold cursor-pointer hover:bg-[#DC2626]/10"
                >
                  Cancel booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PickUpFleetAdmin: React.FC = () => {
  const { pickupVehicles } = useApp();
  return (
    <div className="clay-card overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
            <th className="py-3 px-4">Reference</th>
            <th className="py-3 px-4">Vehicle</th>
            <th className="py-3 px-4">Route</th>
            <th className="py-3 px-4 text-right">Price / Trip</th>
            <th className="py-3 px-4">Capacity</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ECECEC] text-xs">
          {pickupVehicles.map((v) => (
            <tr key={v.id} className="hover:bg-[#FFF8F6]/60 transition-colors">
              <td className="py-3 px-4 font-mono-num text-[#FF3600] font-semibold">{v.reference}</td>
              <td className="py-3 px-4 font-semibold text-[#040401]">{v.title}</td>
              <td className="py-3 px-4 text-[#616161]">{v.routeSummaryEn}</td>
              <td className="py-3 px-4 text-right font-mono-num font-bold text-[#040401]">
                {formatXaf(v.pricePerTripXaf)}
              </td>
              <td className="py-3 px-4 text-[#616161]">
                {v.maxPassengers} pax · {v.maxLuggage} bags
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={v.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const PickUpBookingsAdmin: React.FC = () => {
  const {
    pickupBookings,
    setPickupBookings,
    pickupVehicles,
    drivers,
    openComposer,
    setPreselectedInvoiceBookingRef,
    setAdminPage,
    addToast,
  } = useApp();

  const assignDriver = (pb: PickupBooking, driverId: string | null) => {
    setPickupBookings((prev) =>
      prev.map((x) => (x.id === pb.id ? { ...x, driverId } : x))
    );
    if (driverId) {
      const drv = drivers.find((d) => d.id === driverId);
      addToast({ type: 'success', title: `Assigned ${drv?.name} to ${pb.reference}` });
    }
  };

  return (
    <div className="clay-card overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[920px]">
        <thead>
          <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
            <th className="py-3 px-3">Ref</th>
            <th className="py-3 px-3">Client</th>
            <th className="py-3 px-3">Transfer Details</th>
            <th className="py-3 px-3">Assigned Driver</th>
            <th className="py-3 px-3">Status</th>
            <th className="py-3 px-3">WhatsApp</th>
            <th className="py-3 px-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ECECEC] text-xs">
          {pickupBookings.map((pb) => {
            const veh = pickupVehicles.find((v) => v.id === pb.pickupVehicleId);
            return (
              <tr key={pb.id} className="hover:bg-[#FFF8F6]/60 transition-colors">
                <td className="py-3 px-3 font-mono-num font-semibold text-[#FF3600]">
                  {pb.reference}
                </td>
                <td className="py-3 px-3">
                  <div className="font-semibold text-[#040401]">{pb.clientName}</div>
                  <div className="font-mono-num text-[11px] text-[#616161]">{pb.clientPhone}</div>
                </td>
                <td className="py-3 px-3">
                  <div className="font-medium text-[#040401]">
                    {veh?.title} · {pb.date} {pb.time}
                  </div>
                  <div className="text-[11px] text-[#616161]">
                    {pb.pickupPoint} → {pb.destination}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <select
                    value={pb.driverId || ''}
                    onChange={(e) => assignDriver(pb, e.target.value || null)}
                    className="h-8 px-2 rounded-xl border border-[#ECECEC] bg-white text-xs text-[#040401] focus:outline-none focus:border-[#FF3600]"
                  >
                    <option value="">Unassigned...</option>
                    {drivers
                      .filter((d) => d.status === 'Active')
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="py-3 px-3">
                  <StatusBadge status={pb.status} />
                </td>
                <td className="py-3 px-3">
                  <StatusTicks status={pb.whatsappStatus} />
                </td>
                <td className="py-3 px-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      openComposer({
                        recipientName: pb.clientName,
                        recipientPhone: pb.clientPhone,
                        linkedRecord: pb.reference,
                        defaultTemplateId: 'tpl-07',
                        variables: {
                          car: veh?.title || 'Pick-up Transfer',
                          date: pb.date,
                          time: pb.time,
                        },
                      })
                    }
                    className="text-xs font-semibold text-[#16A34A] hover:underline cursor-pointer"
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPreselectedInvoiceBookingRef(pb.reference);
                      setAdminPage('billing-invoices');
                    }}
                    className="text-xs font-semibold text-[#FF3600] hover:underline cursor-pointer"
                  >
                    Invoice
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
