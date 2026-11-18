import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Car,
  Clock,
  FileText,
  Plus,
  Send,
  UserX,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatusBadge, StatusTicks } from '../common/StatusBadge';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const AdminDashboardOverview: React.FC = () => {
  const {
    cars,
    rentals,
    pickupVehicles,
    viewingRequests,
    rentalBookings,
    pickupBookings,
    invoices,
    drivers,
    messageLog,
    toSendQueue,
    waSettings,
    setAdminPage,
    setEditingCarId,
    openComposer,
  } = useApp();

  const newRequestsToday = viewingRequests.filter((r) => r.status === 'New').length;
  const viewingsThisWeek = viewingRequests.filter(
    (r) => r.status === 'Viewing scheduled' || r.status === 'Contacted'
  ).length;
  const activeRentals = rentalBookings.filter(
    (b) => b.status === 'Confirmed' || b.status === 'In progress'
  ).length;
  const pickupsToday = pickupBookings.length;
  const unpaidInvoices = invoices.filter(
    (i) => i.status === 'Overdue' || i.status === 'Partially paid' || i.status === 'Sent'
  ).length;
  const failedMessages = messageLog.filter((m) => m.status === 'failed').length;

  const kpis = [
    { label: 'New requests (today)', value: newRequestsToday, page: 'requests' as const, tone: 'text-[#2563EB]' },
    { label: 'Viewings this week', value: viewingsThisWeek, page: 'requests' as const, tone: 'text-[#14213D]' },
    { label: 'Active rentals', value: activeRentals, page: 'rental-bookings' as const, tone: 'text-[#16A34A]' },
    { label: 'Pick-ups scheduled', value: pickupsToday, page: 'pickup-bookings' as const, tone: 'text-[#14213D]' },
    { label: 'Unpaid invoices', value: unpaidInvoices, page: 'billing-invoices' as const, tone: 'text-[#92400E]' },
    { label: 'Messages failed', value: failedMessages, page: 'messaging-log' as const, tone: 'text-[#DC2626]' },
  ];

  const pendingBookings = rentalBookings.filter((b) => b.status === 'Pending');
  const unassignedRentals = rentalBookings.filter((b) => b.withDriver && !b.driverId);
  const unassignedPickups = pickupBookings.filter((b) => !b.driverId);

  const expiringDrivers = drivers.filter((d) => {
    const diff =
      (new Date(d.licenceExpiry).getTime() - new Date('2026-11-13').getTime()) /
      86400000;
    return diff <= 60;
  });

  const fleetData = [
    {
      name: 'Sales Cars',
      Available: cars.filter((c) => c.status === 'Available').length,
      ReservedBooked: cars.filter((c) => c.status === 'Reserved').length,
    },
    {
      name: 'Rentals',
      Available: rentals.filter((r) => r.status === 'Available').length,
      ReservedBooked: rentalBookings.filter((b) => b.status === 'Confirmed').length,
    },
    {
      name: 'Pick-up',
      Available: pickupVehicles.filter((p) => p.status === 'Available').length,
      ReservedBooked: pickupBookings.filter((b) => b.status === 'Confirmed').length,
    },
  ];

  const pendingQueueCount = toSendQueue.filter((q) => !q.sent).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={() => setAdminPage(k.page)}
            className="clay-card p-4 text-left hover:border-[#FF3600]/50 transition-all cursor-pointer bg-white"
          >
            <div className="text-xs font-semibold text-[#8E8E93] line-clamp-1">{k.label}</div>
            <div className={`font-display font-extrabold text-2xl mt-1.5 tabular-nums ${k.tone}`}>
              {k.value}
            </div>
          </button>
        ))}
      </div>

      <div className="clay-card p-4 flex flex-wrap items-center justify-between gap-3 bg-white">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
          Quick Actions
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setEditingCarId(null);
              setAdminPage('car-form');
            }}
            className="h-9 px-4 rounded-full clay-btn text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add car</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminPage('rental-bookings')}
            className="h-9 px-4 rounded-full border border-[#ECECEC] bg-[#F5F5F7] hover:bg-[#FFF3EE] hover:text-[#FF3600] text-[#040401] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors clay-pill"
          >
            <Calendar className="w-3.5 h-3.5 text-[#FF3600]" />
            <span>Add booking</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminPage('billing-invoices')}
            className="h-9 px-4 rounded-full border border-[#ECECEC] bg-[#F5F5F7] hover:bg-[#FFF3EE] hover:text-[#FF3600] text-[#040401] text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors clay-pill"
          >
            <FileText className="w-3.5 h-3.5 text-[#FF3600]" />
            <span>Create invoice</span>
          </button>
          <button
            type="button"
            onClick={() =>
              openComposer({
                recipientName: 'Marie Ngo Bassa',
                recipientPhone: '+237 677 12 34 01',
                linkedRecord: 'DM-REQ-1041',
                windowMinutesRemaining: 192,
                variables: { car: '2019 Toyota Corolla 1.8', date: '2026-11-14', time: '10:30' },
              })
            }
            className="h-9 px-4 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer clay-pill"
          >
            <WhatsAppIcon className="w-3.5 h-3.5" />
            <span>Send WhatsApp message</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 clay-card p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#040401]">Needs Action</h2>
            <span className="text-xs font-semibold text-[#8E8E93] tabular-nums">
              {pendingBookings.length + unassignedRentals.length + unassignedPickups.length + expiringDrivers.length} items
            </span>
          </div>

          <div className="divide-y divide-[#ECECEC]">
            {pendingBookings.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Clock className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#040401] truncate">
                      Confirm rental {b.reference} — {b.clientName}
                    </div>
                    <div className="text-[11px] text-[#616161]">
                      {b.startDate} to {b.endDate}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminPage('rental-bookings')}
                  className="text-xs font-bold text-[#FF3600] hover:underline shrink-0 cursor-pointer"
                >
                  Review
                </button>
              </div>
            ))}

            {(unassignedRentals.length > 0 || unassignedPickups.length > 0) && (
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <UserX className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-[#040401]">
                      {unassignedRentals.length + unassignedPickups.length} booking(s) need a driver assigned
                    </div>
                    <div className="text-[11px] text-[#616161]">
                      Assign inline from the Rentals or Pick-up bookings table
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminPage('rental-bookings')}
                  className="text-xs font-bold text-[#FF3600] hover:underline shrink-0 cursor-pointer"
                >
                  Assign
                </button>
              </div>
            )}

            {expiringDrivers.map((d) => {
              const daysLeft = Math.round(
                (new Date(d.licenceExpiry).getTime() - new Date('2026-11-13').getTime()) /
                  86400000
              );
              const isCritical = daysLeft < 30;
              return (
                <div key={d.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle
                      className={`w-4 h-4 shrink-0 ${
                        isCritical ? 'text-[#DC2626]' : 'text-[#F59E0B]'
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-[#040401]">
                        Driver licence expiring: {d.name} ({daysLeft} days left)
                      </div>
                      <div className="text-[11px] text-[#616161]">
                        Licence {d.licenceNumber} · Expires {d.licenceExpiry}
                      </div>
                    </div>
                  </div>
                  <StatusBadge
                    status={isCritical ? 'Expiring < 30d' : 'Expiring soon'}
                    toneOverride={isCritical ? 'error' : 'warning'}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-6 clay-card p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#040401]">
              Today’s Schedule (WAT)
            </h2>
            <span className="text-xs text-[#8E8E93]">13 Nov 2026</span>
          </div>

          <div className="space-y-3">
            {[
              { time: '10:30', type: 'Viewing', title: 'Marie Ngo Bassa — 2019 Toyota Corolla 1.8', loc: 'Bonapriso Showroom', tone: 'info' as const },
              { time: '14:30', type: 'Handover', title: 'Stephen Ebong — Toyota Prado (Driver: Paul Mbarga)', loc: 'Douala Airport (DLA)', tone: 'success' as const },
              { time: '16:15', type: 'Pick-up', title: 'Aminatou Njoya — Camry Executive (Driver: Alain Tchoumi)', loc: 'DLA → Krystal Palace', tone: 'info' as const },
            ].map((ev) => (
              <div
                key={ev.title}
                className="p-3.5 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] flex items-center justify-between gap-3 clay-pill"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono-num text-xs font-bold text-[#FF3600] shrink-0">
                    {ev.time}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#040401] truncate">{ev.title}</div>
                    <div className="text-[11px] text-[#616161]">{ev.loc}</div>
                  </div>
                </div>
                <StatusBadge status={ev.type} toneOverride={ev.tone} />
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF3EE] border border-[#FF3600]/20 flex items-center justify-between gap-3 clay-pill">
            <div>
              <div className="text-xs font-bold text-[#040401]">
                WhatsApp &ldquo;To send today&rdquo; Queue ({waSettings.mode === 'click_to_chat' ? 'Active Mode' : 'Ready'})
              </div>
              <div className="text-[11px] text-[#616161] mt-0.5">
                {pendingQueueCount} message(s) remaining for today’s reminders
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdminPage('messaging-queue')}
              className="h-9 px-4 rounded-full clay-btn text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>Open queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 clay-card p-6 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#040401]">
              Fleet Availability
            </h2>
            <Car className="w-4 h-4 text-[#FF3600]" />
          </div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fleetData} barGap={6}>
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#616161' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#616161' }} />
                <Tooltip />
                <Bar dataKey="Available" fill="#16A34A" radius={[6, 6, 0, 0]} />
                <Bar dataKey="ReservedBooked" name="Reserved / Booked" fill="#FF3600" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-7 clay-card p-6 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-base text-[#040401]">
              Recent WhatsApp Activity
            </h2>
            <button
              type="button"
              onClick={() => setAdminPage('messaging-log')}
              className="text-xs font-bold text-[#FF3600] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Full log</span>
              <Send className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-[#ECECEC]">
            {messageLog.slice(0, 5).map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#040401] truncate">
                    {m.recipientName}{' '}
                    <span className="font-mono-num font-normal text-[#8E8E93]">
                      ({m.templateName})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#616161] truncate">
                    {m.timestamp} · {m.linkedRecord}
                  </div>
                </div>
                <StatusTicks status={m.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
