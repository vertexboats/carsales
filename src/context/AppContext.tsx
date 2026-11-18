import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdminPage,
  AutomationRule,
  Brand,
  CarForSale,
  CarStatus,
  ConversationThread,
  DealershipSettings,
  Driver,
  Invoice,
  Language,
  MessageLogEntry,
  PaymentRecord,
  PickupBooking,
  PickupVehicle,
  PolicyDoc,
  PublicRoute,
  RentalBooking,
  RentalCar,
  SalesReceipt,
  ServiceItem,
  ToSendQueueItem,
  VehicleModel,
  VehicleProperty,
  ViewingRequest,
  WhatsAppSettingsState,
  WhatsAppTemplate,
} from '../types/derico';
import {
  SEED_AUTOMATIONS,
  SEED_BRANDS,
  SEED_CARS,
  SEED_CONVERSATIONS,
  SEED_DEALERSHIP_SETTINGS,
  SEED_DRIVERS,
  SEED_INVOICES,
  SEED_MESSAGE_LOG,
  SEED_MODELS,
  SEED_PICKUP_BOOKINGS,
  SEED_PICKUP_VEHICLES,
  SEED_POLICIES,
  SEED_PROPERTIES,
  SEED_RECEIPTS,
  SEED_RENTAL_BOOKINGS,
  SEED_RENTALS,
  SEED_SERVICES,
  SEED_TEMPLATES,
  SEED_TO_SEND_QUEUE,
  SEED_VIEWING_REQUESTS,
  SEED_WHATSAPP_SETTINGS,
} from '../data/seedData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  description?: string;
}

export interface ComposerPayload {
  recipientName: string;
  recipientPhone: string;
  linkedRecord: string;
  variables?: Record<string, string>;
  attachmentLabel?: string;
  windowMinutesRemaining?: number;
  defaultTemplateId?: string;
}

export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  mode: 'public' | 'admin';
  setMode: (mode: 'public' | 'admin') => void;
  publicRoute: PublicRoute;
  navigatePublic: (route: PublicRoute) => void;
  adminLoggedIn: boolean;
  loginAdmin: (email: string) => void;
  logoutAdmin: () => void;
  adminPage: AdminPage;
  setAdminPage: (page: AdminPage) => void;
  editingCarId: string | null;
  setEditingCarId: (id: string | null) => void;
  preselectedReceiptCarId: string | null;
  setPreselectedReceiptCarId: (id: string | null) => void;
  preselectedInvoiceBookingRef: string | null;
  setPreselectedInvoiceBookingRef: (ref: string | null) => void;

  // Data
  brands: Brand[];
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
  models: VehicleModel[];
  setModels: React.Dispatch<React.SetStateAction<VehicleModel[]>>;
  properties: VehicleProperty[];
  setProperties: React.Dispatch<React.SetStateAction<VehicleProperty[]>>;
  cars: CarForSale[];
  setCars: React.Dispatch<React.SetStateAction<CarForSale[]>>;
  rentals: RentalCar[];
  setRentals: React.Dispatch<React.SetStateAction<RentalCar[]>>;
  pickupVehicles: PickupVehicle[];
  setPickupVehicles: React.Dispatch<React.SetStateAction<PickupVehicle[]>>;
  viewingRequests: ViewingRequest[];
  setViewingRequests: React.Dispatch<React.SetStateAction<ViewingRequest[]>>;
  rentalBookings: RentalBooking[];
  setRentalBookings: React.Dispatch<React.SetStateAction<RentalBooking[]>>;
  pickupBookings: PickupBooking[];
  setPickupBookings: React.Dispatch<React.SetStateAction<PickupBooking[]>>;
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  services: ServiceItem[];
  setServices: React.Dispatch<React.SetStateAction<ServiceItem[]>>;
  policies: PolicyDoc[];
  setPolicies: React.Dispatch<React.SetStateAction<PolicyDoc[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  receipts: SalesReceipt[];
  setReceipts: React.Dispatch<React.SetStateAction<SalesReceipt[]>>;
  templates: WhatsAppTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<WhatsAppTemplate[]>>;
  automations: AutomationRule[];
  setAutomations: React.Dispatch<React.SetStateAction<AutomationRule[]>>;
  messageLog: MessageLogEntry[];
  setMessageLog: React.Dispatch<React.SetStateAction<MessageLogEntry[]>>;
  conversations: ConversationThread[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationThread[]>>;
  toSendQueue: ToSendQueueItem[];
  setToSendQueue: React.Dispatch<React.SetStateAction<ToSendQueueItem[]>>;
  waSettings: WhatsAppSettingsState;
  setWaSettings: React.Dispatch<React.SetStateAction<WhatsAppSettingsState>>;
  dealership: DealershipSettings;
  setDealership: React.Dispatch<React.SetStateAction<DealershipSettings>>;

  // Actions
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
  composer: ComposerPayload | null;
  openComposer: (payload: ComposerPayload) => void;
  closeComposer: () => void;
  confirmDialog: ConfirmDialogState | null;
  openConfirm: (cfg: Omit<ConfirmDialogState, 'open'>) => void;
  closeConfirm: () => void;
  policyModalSlug: string | null;
  setPolicyModalSlug: (slug: string | null) => void;
  updateCarStatus: (carId: string, status: CarStatus) => void;
  recordInvoicePayment: (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => void;
  sendWhatsAppLogEntry: (entry: Omit<MessageLogEntry, 'id' | 'timestamp'>) => void;
  heroQuickFilter: { brandId?: string; bodyType?: string; maxPrice?: number } | null;
  setHeroQuickFilter: (f: { brandId?: string; bodyType?: string; maxPrice?: number } | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');
  const [mode, setMode] = useState<'public' | 'admin'>('public');
  const [publicRoute, setPublicRoute] = useState<PublicRoute>({ page: 'home' });
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(false);
  const [adminPage, setAdminPage] = useState<AdminPage>('overview');
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [preselectedReceiptCarId, setPreselectedReceiptCarId] = useState<string | null>(null);
  const [preselectedInvoiceBookingRef, setPreselectedInvoiceBookingRef] = useState<string | null>(null);

  const [brands, setBrands] = useState<Brand[]>(SEED_BRANDS);
  const [models, setModels] = useState<VehicleModel[]>(SEED_MODELS);
  const [properties, setProperties] = useState<VehicleProperty[]>(SEED_PROPERTIES);
  const [cars, setCars] = useState<CarForSale[]>(SEED_CARS);
  const [rentals, setRentals] = useState<RentalCar[]>(SEED_RENTALS);
  const [pickupVehicles, setPickupVehicles] = useState<PickupVehicle[]>(SEED_PICKUP_VEHICLES);
  const [viewingRequests, setViewingRequests] = useState<ViewingRequest[]>(SEED_VIEWING_REQUESTS);
  const [rentalBookings, setRentalBookings] = useState<RentalBooking[]>(SEED_RENTAL_BOOKINGS);
  const [pickupBookings, setPickupBookings] = useState<PickupBooking[]>(SEED_PICKUP_BOOKINGS);
  const [drivers, setDrivers] = useState<Driver[]>(SEED_DRIVERS);
  const [services, setServices] = useState<ServiceItem[]>(SEED_SERVICES);
  const [policies, setPolicies] = useState<PolicyDoc[]>(SEED_POLICIES);
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);
  const [receipts, setReceipts] = useState<SalesReceipt[]>(SEED_RECEIPTS);
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>(SEED_TEMPLATES);
  const [automations, setAutomations] = useState<AutomationRule[]>(SEED_AUTOMATIONS);
  const [messageLog, setMessageLog] = useState<MessageLogEntry[]>(SEED_MESSAGE_LOG);
  const [conversations, setConversations] = useState<ConversationThread[]>(SEED_CONVERSATIONS);
  const [toSendQueue, setToSendQueue] = useState<ToSendQueueItem[]>(SEED_TO_SEND_QUEUE);
  const [waSettings, setWaSettings] = useState<WhatsAppSettingsState>(SEED_WHATSAPP_SETTINGS);
  const [dealership, setDealership] = useState<DealershipSettings>(SEED_DEALERSHIP_SETTINGS);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [composer, setComposer] = useState<ComposerPayload | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [policyModalSlug, setPolicyModalSlug] = useState<string | null>(null);
  const [heroQuickFilter, setHeroQuickFilter] = useState<{ brandId?: string; bodyType?: string; maxPrice?: number } | null>(null);

  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        setMode('admin');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `tst-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const navigatePublic = (route: PublicRoute) => {
    setMode('public');
    setPublicRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginAdmin = (email: string) => {
    setAdminLoggedIn(true);
    setAdminPage('overview');
    addToast({ type: 'success', title: `Signed in as ${email}` });
  };

  const logoutAdmin = () => {
    setAdminLoggedIn(false);
    addToast({ type: 'info', title: 'Signed out of Derico Admin' });
  };

  const openComposer = (payload: ComposerPayload) => setComposer(payload);
  const closeComposer = () => setComposer(null);

  const openConfirm = (cfg: Omit<ConfirmDialogState, 'open'>) =>
    setConfirmDialog({ ...cfg, open: true });
  const closeConfirm = () => setConfirmDialog(null);

  const updateCarStatus = (carId: string, status: CarStatus) => {
    setCars((prev) =>
      prev.map((c) => (c.id === carId ? { ...c, status, updatedAt: '2026-11-13' } : c))
    );
  };

  const recordInvoicePayment = (invoiceId: string, payment: Omit<PaymentRecord, 'id'>) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id !== invoiceId) return inv;
        const nextPayments = [...inv.payments, { ...payment, id: `pay-${Date.now()}` }];
        const subtotal = inv.lineItems.reduce((s, li) => s + li.quantity * li.unitPriceXaf, 0);
        const total = Math.max(0, subtotal - inv.discountXaf) * (1 + inv.taxPercent / 100);
        const paid = nextPayments.reduce((s, p) => s + p.amountXaf, 0);
        const nextStatus = paid >= total ? 'Paid' : paid > 0 ? 'Partially paid' : inv.status;
        return { ...inv, payments: nextPayments, status: nextStatus };
      })
    );
  };

  const sendWhatsAppLogEntry = (entry: Omit<MessageLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const newEntry: MessageLogEntry = {
      ...entry,
      id: `msg-${Date.now()}`,
      timestamp: `2026-11-13 ${hh}:${mm}`,
    };
    setMessageLog((prev) => [newEntry, ...prev]);
    setWaSettings((prev) => ({ ...prev, dailyUsed: Math.min(prev.dailyLimit, prev.dailyUsed + 1) }));
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        mode,
        setMode,
        publicRoute,
        navigatePublic,
        adminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminPage,
        setAdminPage,
        editingCarId,
        setEditingCarId,
        preselectedReceiptCarId,
        setPreselectedReceiptCarId,
        preselectedInvoiceBookingRef,
        setPreselectedInvoiceBookingRef,
        brands,
        setBrands,
        models,
        setModels,
        properties,
        setProperties,
        cars,
        setCars,
        rentals,
        setRentals,
        pickupVehicles,
        setPickupVehicles,
        viewingRequests,
        setViewingRequests,
        rentalBookings,
        setRentalBookings,
        pickupBookings,
        setPickupBookings,
        drivers,
        setDrivers,
        services,
        setServices,
        policies,
        setPolicies,
        invoices,
        setInvoices,
        receipts,
        setReceipts,
        templates,
        setTemplates,
        automations,
        setAutomations,
        messageLog,
        setMessageLog,
        conversations,
        setConversations,
        toSendQueue,
        setToSendQueue,
        waSettings,
        setWaSettings,
        dealership,
        setDealership,
        toasts,
        addToast,
        dismissToast,
        composer,
        openComposer,
        closeComposer,
        confirmDialog,
        openConfirm,
        closeConfirm,
        policyModalSlug,
        setPolicyModalSlug,
        updateCarStatus,
        recordInvoicePayment,
        sendWhatsAppLogEntry,
        heroQuickFilter,
        setHeroQuickFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
