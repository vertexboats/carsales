import React, { useState } from 'react';
import {
  Bell,
  CalendarCheck,
  Car,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileCheck2,
  FileText,
  Inbox,
  KeyRound,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Menu,
  PlaneLanding,
  Receipt,
  Search,
  Send,
  Settings,
  Sliders,
  Sparkles,
  Tags,
  UserCheck,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DericoLogo } from '../common/DericoLogo';
import { WhatsAppIcon } from '../common/WhatsAppIcon';
import { AdminPage } from '../../types/derico';
import { StatusBadge } from '../common/StatusBadge';

interface NavGroup {
  label: string;
  items: { id: AdminPage; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[];
}

export const AdminLayout: React.FC<{
  title: string;
  breadcrumb: string;
  primaryAction?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, breadcrumb, primaryAction, children }) => {
  const {
    adminPage,
    setAdminPage,
    setMode,
    logoutAdmin,
    waSettings,
    viewingRequests,
    rentalBookings,
    pickupBookings,
    messageLog,
    toSendQueue,
    addToast,
  } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const pendingReqCount = viewingRequests.filter((r) => r.status === 'New').length;
  const pendingRentalsCount = rentalBookings.filter((b) => b.status === 'Pending').length;
  const pendingPickupsCount = pickupBookings.filter((b) => b.status === 'Pending').length;
  const failedMsgsCount = messageLog.filter((m) => m.status === 'failed').length;
  const queueRemaining = toSendQueue.filter((q) => !q.sent).length;

  const navGroups: NavGroup[] = [
    {
      label: 'Overview',
      items: [{ id: 'overview', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      label: 'Sales',
      items: [
        { id: 'cars', label: 'Cars for sale', icon: Car },
        { id: 'brands', label: 'Brands & models', icon: Tags },
        { id: 'properties', label: 'Vehicle properties', icon: Sliders },
        { id: 'requests', label: 'Viewing requests', icon: Inbox, badge: pendingReqCount || undefined },
      ],
    },
    {
      label: 'Rentals',
      items: [
        { id: 'rental-cars', label: 'Rental cars', icon: KeyRound },
        { id: 'rental-bookings', label: 'Rental bookings', icon: CalendarCheck, badge: pendingRentalsCount || undefined },
      ],
    },
    {
      label: 'Pick-up',
      items: [
        { id: 'pickup-vehicles', label: 'Pick-up vehicles', icon: PlaneLanding },
        { id: 'pickup-bookings', label: 'Pick-up bookings', icon: ListChecks, badge: pendingPickupsCount || undefined },
      ],
    },
    {
      label: 'Operations',
      items: [
        { id: 'drivers', label: 'Drivers', icon: UserCheck },
        { id: 'services', label: 'Services', icon: Wrench },
      ],
    },
    {
      label: 'Billing',
      items: [
        { id: 'billing-invoices', label: 'Invoices', icon: FileText },
        { id: 'billing-receipts', label: 'Sales receipts', icon: Receipt },
      ],
    },
    {
      label: 'Messaging (WhatsApp)',
      items: [
        { id: 'messaging-inbox', label: 'Inbox', icon: WhatsAppIcon },
        { id: 'messaging-templates', label: 'Templates', icon: FileCheck2 },
        { id: 'messaging-automations', label: 'Automations', icon: Zap },
        { id: 'messaging-log', label: 'Message log', icon: Send, badge: failedMsgsCount || undefined },
        { id: 'messaging-queue', label: 'To send today', icon: Sparkles, badge: queueRemaining || undefined },
        { id: 'messaging-connection', label: 'Connection', icon: Settings },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'policies-admin', label: 'Pages & policies', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = globalSearch.toLowerCase().trim();
    if (!q) return;
    if (q.includes('lexus') || q.includes('brand') || q.includes('toyota')) {
      setAdminPage('brands');
    } else if (q.includes('prop') || q.includes('sunroof') || q.includes('fuel')) {
      setAdminPage('properties');
    } else if (q.includes('inv')) {
      setAdminPage('billing-invoices');
    } else if (q.includes('rec')) {
      setAdminPage('billing-receipts');
    } else if (q.includes('paul') || q.includes('driver')) {
      setAdminPage('drivers');
    } else {
      setAdminPage('cars');
    }
    addToast({ type: 'info', title: `Jumped to matching section for "${globalSearch}"` });
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-[#040401] text-slate-200 select-none border-r border-white/10">
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
        <div className="flex items-center min-w-0">
          <DericoLogo
            variant="dark"
            size="sm"
            showWordmark={!collapsed || isMobile}
            adminLabel
          />
        </div>
        {!isMobile ? (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-slate-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            {(!collapsed || isMobile) && (
              <div className="px-2.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#8E8E93]">
                {group.label}
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  adminPage === item.id ||
                  (item.id === 'cars' && adminPage === 'car-form');
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setAdminPage(item.id);
                      if (isMobile) setMobileOpen(false);
                    }}
                    title={collapsed && !isMobile ? item.label : undefined}
                    className={`relative w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer overflow-hidden ${
                      isActive
                        ? 'bg-[#FF3600] text-white font-bold shadow-sm shadow-[#FF3600]/30 pl-3.5 before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:bg-white before:rounded-r'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <item.icon className="w-4 h-4 shrink-0" />
                      {(!collapsed || isMobile) && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </span>
                    {(!collapsed || isMobile) && item.badge !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono-num font-bold ${
                          isActive
                            ? 'bg-white text-[#FF3600]'
                            : 'bg-white/15 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setMode('public')}
          className="w-full flex items-center justify-center gap-2 h-9 px-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {(!collapsed || isMobile) && <span>Public Website</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F7F9FC]">
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-200 ${
          collapsed ? 'w-16' : 'w-64'
        } sticky top-0 h-screen`}
      >
        {renderSidebarContent(false)}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-[#14213D]/50 backdrop-blur-[2px] flex">
          <div className="w-64 h-full">{renderSidebarContent(true)}</div>
          <div className="flex-1" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E8EDF4] px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl border border-[#E2E8F0] flex items-center justify-center text-[#14213D] cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <form onSubmit={handleGlobalSearch} className="relative w-full max-w-sm">
              <Search className="w-4 h-4 text-[#8290A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search cars, brands, properties, invoices..."
                className="w-full h-10 pl-10 pr-3.5 rounded-full border border-[#DBE3EE] bg-[#F8FAFC] focus:bg-white text-xs text-[#14213D] transition-colors"
              />
            </form>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setAdminPage('messaging-connection')}
              className="hidden sm:inline-flex items-center gap-1.5 cursor-pointer"
              title="Open WhatsApp Connection Settings"
            >
              <span className="text-[11px] font-medium text-[#64748B]">WhatsApp:</span>
              <StatusBadge status={waSettings.connectionStatus} />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative w-10 h-10 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] flex items-center justify-center text-[#475569] cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {(pendingReqCount + failedMsgsCount) > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] font-bold flex items-center justify-center">
                    {pendingReqCount + failedMsgsCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#E8EDF4] shadow-xl p-3.5 z-50 space-y-2 text-xs">
                  <div className="font-display font-bold text-[#14213D]">Action Alerts</div>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      setAdminPage('drivers');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#DC2626]/10 text-[#B91C1C] cursor-pointer"
                  >
                    Paul Mbarga’s driving licence expires in 20 days.
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      setAdminPage('messaging-log');
                    }}
                    className="w-full text-left p-2.5 rounded-xl bg-[#F59E0B]/12 text-[#92400E] cursor-pointer"
                  >
                    {failedMsgsCount} failed WhatsApp message(s) in log.
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAvatarMenuOpen((o) => !o)}
                className="h-10 pl-1.5 pr-3.5 rounded-full border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] flex items-center gap-2 cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#14213D] text-white text-xs font-bold flex items-center justify-center">
                  DM
                </div>
                <span className="hidden md:inline text-xs font-semibold text-[#14213D]">
                  Admin
                </span>
              </button>

              {avatarMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#E8EDF4] shadow-xl p-1.5 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      setAdminPage('settings');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FAFC] text-[#14213D] cursor-pointer"
                  >
                    Dealership Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      setMode('public');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#F8FAFC] text-[#14213D] cursor-pointer"
                  >
                    View Public Website
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      logoutAdmin();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#DC2626]/10 text-[#DC2626] font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-[#64748B]">{breadcrumb}</div>
            <h1 className="font-display font-extrabold text-2xl text-[#14213D] mt-0.5">
              {title}
            </h1>
          </div>
          {primaryAction && <div className="flex items-center gap-2 shrink-0">{primaryAction}</div>}
        </div>

        <div className="px-4 sm:px-6 pb-10 flex-1">{children}</div>
      </div>
    </div>
  );
};
