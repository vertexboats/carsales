import React, { useEffect, useRef, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { GlobalOverlays } from './components/common/GlobalOverlays';
import { MessageComposerModal } from './components/common/MessageComposerModal';
import { PageLoader } from './components/common/PageLoader';
import { PublicLayout } from './components/public/PublicLayout';
import { HomePage } from './components/public/HomePage';
import { BuyCarsPage } from './components/public/BuyCarsPage';
import { CarDetailPage } from './components/public/CarDetailPage';
import { RentCarsPage } from './components/public/RentCarsPage';
import { PickUpPage } from './components/public/PickUpPage';
import { ServicesPage } from './components/public/ServicesPage';
import { PoliciesPage } from './components/public/PoliciesPage';
import { ContactPage } from './components/public/ContactPage';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardOverview } from './components/admin/AdminDashboardOverview';
import { CarsForSaleAdmin } from './components/admin/CarsForSaleAdmin';
import { AddEditCarForm } from './components/admin/AddEditCarForm';
import { BrandsModelsAdmin } from './components/admin/BrandsModelsAdmin';
import { VehiclePropertiesAdmin } from './components/admin/VehiclePropertiesAdmin';
import { ViewingRequestsAdmin } from './components/admin/ViewingRequestsAdmin';
import {
  PickUpBookingsAdmin,
  PickUpFleetAdmin,
  RentalBookingsAdmin,
  RentalFleetAdmin,
} from './components/admin/RentalsAndPickupsAdmin';
import { DriversAdmin, ServicesAdmin } from './components/admin/DriversAndServicesAdmin';
import { InvoicesAdmin, SalesReceiptsAdmin } from './components/admin/BillingAdmin';
import {
  MessagingAutomationsAdmin,
  MessagingConnectionAdmin,
  MessagingInboxAdmin,
  MessagingLogAdmin,
  MessagingTemplatesAdmin,
  ToSendTodayQueueAdmin,
} from './components/admin/MessagingAdmin';
import {
  DealershipSettingsAdmin,
  PoliciesAdmin,
} from './components/admin/PoliciesAndSettingsAdmin';

const ADMIN_META: Record<string, { title: string; breadcrumb: string }> = {
  overview: { title: 'Dashboard Overview', breadcrumb: 'Admin / Dashboard' },
  cars: { title: 'Cars for Sale', breadcrumb: 'Sales / Cars for sale' },
  'car-form': { title: 'Add / Edit Car', breadcrumb: 'Sales / Cars for sale / Editor' },
  brands: { title: 'Brands and Models', breadcrumb: 'Sales / Brands & models' },
  properties: {
    title: 'Vehicle Properties Library',
    breadcrumb: 'Sales / Vehicle properties (searchable attributes)',
  },
  requests: {
    title: 'Viewing & Quotation Requests',
    breadcrumb: 'Sales / Viewing requests',
  },
  'rental-cars': { title: 'Rental Fleet', breadcrumb: 'Rentals / Rental cars' },
  'rental-bookings': { title: 'Rental Bookings', breadcrumb: 'Rentals / Rental bookings' },
  'pickup-vehicles': { title: 'Pick-up Vehicles', breadcrumb: 'Pick-up / Vehicles' },
  'pickup-bookings': { title: 'Pick-up Bookings', breadcrumb: 'Pick-up / Bookings' },
  drivers: { title: 'Drivers', breadcrumb: 'Operations / Drivers' },
  services: { title: 'Automotive Services', breadcrumb: 'Operations / Services' },
  'billing-invoices': { title: 'Service Invoices', breadcrumb: 'Billing / Invoices' },
  'billing-receipts': { title: 'Vehicle Sales Receipts', breadcrumb: 'Billing / Sales receipts' },
  'messaging-inbox': { title: 'WhatsApp Inbox', breadcrumb: 'Messaging / Inbox' },
  'messaging-templates': { title: 'WhatsApp Templates', breadcrumb: 'Messaging / Templates' },
  'messaging-automations': {
    title: 'WhatsApp Automations',
    breadcrumb: 'Messaging / Automations',
  },
  'messaging-log': { title: 'WhatsApp Message Log', breadcrumb: 'Messaging / Message log' },
  'messaging-queue': {
    title: 'To Send Today (Click-to-Chat)',
    breadcrumb: 'Messaging / To send today',
  },
  'messaging-connection': {
    title: 'WhatsApp Connection Settings',
    breadcrumb: 'Messaging / Connection',
  },
  'policies-admin': { title: 'Pages & Policies', breadcrumb: 'System / Policies' },
  settings: { title: 'Dealership Settings', breadcrumb: 'System / Settings' },
};

const AppRouter: React.FC = () => {
  const { mode, publicRoute, adminLoggedIn, adminPage } = useApp();

  // ── Page transition loader ──────────────────────────────────────────────
  // Build a unique string from the current route so we can detect changes.
  const routeKey = mode === 'admin'
    ? `admin:${adminPage}`
    : `${publicRoute.page}:${(publicRoute as Record<string, string>).carId ?? ''}:${(publicRoute as Record<string, string>).brandSlug ?? ''}:${(publicRoute as Record<string, string>).rentalId ?? ''}:${(publicRoute as Record<string, string>).pickupId ?? ''}:${(publicRoute as Record<string, string>).serviceSlug ?? ''}`;

  const [loaderKey, setLoaderKey] = useState(0);
  const prevRouteKey = useRef(routeKey);

  useEffect(() => {
    if (prevRouteKey.current !== routeKey) {
      prevRouteKey.current = routeKey;
      // Remount loader on every route change
      setLoaderKey((k) => k + 1);
    }
  }, [routeKey]);
  // ───────────────────────────────────────────────────────────────────────

  if (mode === 'admin') {
    if (!adminLoggedIn) {
      return <AdminLogin />;
    }

    const meta = ADMIN_META[adminPage] || ADMIN_META.overview;

    let content: React.ReactNode = <AdminDashboardOverview />;
    if (adminPage === 'cars') content = <CarsForSaleAdmin />;
    else if (adminPage === 'car-form') content = <AddEditCarForm />;
    else if (adminPage === 'brands') content = <BrandsModelsAdmin />;
    else if (adminPage === 'properties') content = <VehiclePropertiesAdmin />;
    else if (adminPage === 'requests') content = <ViewingRequestsAdmin />;
    else if (adminPage === 'rental-cars') content = <RentalFleetAdmin />;
    else if (adminPage === 'rental-bookings') content = <RentalBookingsAdmin />;
    else if (adminPage === 'pickup-vehicles') content = <PickUpFleetAdmin />;
    else if (adminPage === 'pickup-bookings') content = <PickUpBookingsAdmin />;
    else if (adminPage === 'drivers') content = <DriversAdmin />;
    else if (adminPage === 'services') content = <ServicesAdmin />;
    else if (adminPage === 'billing-invoices') content = <InvoicesAdmin />;
    else if (adminPage === 'billing-receipts') content = <SalesReceiptsAdmin />;
    else if (adminPage === 'messaging-inbox') content = <MessagingInboxAdmin />;
    else if (adminPage === 'messaging-templates') content = <MessagingTemplatesAdmin />;
    else if (adminPage === 'messaging-automations') content = <MessagingAutomationsAdmin />;
    else if (adminPage === 'messaging-log') content = <MessagingLogAdmin />;
    else if (adminPage === 'messaging-queue') content = <ToSendTodayQueueAdmin />;
    else if (adminPage === 'messaging-connection') content = <MessagingConnectionAdmin />;
    else if (adminPage === 'policies-admin') content = <PoliciesAdmin />;
    else if (adminPage === 'settings') content = <DealershipSettingsAdmin />;

    return (
      <AdminLayout title={meta.title} breadcrumb={meta.breadcrumb}>
        {content}
      </AdminLayout>
    );
  }

  let publicContent: React.ReactNode = <HomePage />;
  if (publicRoute.page === 'buy') publicContent = <BuyCarsPage brandSlug={publicRoute.brandSlug} />;
  else if (publicRoute.page === 'car-detail') publicContent = <CarDetailPage carId={publicRoute.carId} />;
  else if (publicRoute.page === 'rent') publicContent = <RentCarsPage />;
  else if (publicRoute.page === 'rent-detail')
    publicContent = <RentCarsPage rentalId={publicRoute.rentalId} />;
  else if (publicRoute.page === 'pickup') publicContent = <PickUpPage />;
  else if (publicRoute.page === 'pickup-detail')
    publicContent = <PickUpPage pickupId={publicRoute.pickupId} />;
  else if (publicRoute.page === 'services')
    publicContent = <ServicesPage serviceSlug={publicRoute.serviceSlug} />;
  else if (publicRoute.page === 'policies')
    publicContent = <PoliciesPage policySlug={publicRoute.policySlug} />;
  else if (publicRoute.page === 'contact') publicContent = <ContactPage />;

  return (
    <>
      <PublicLayout>{publicContent}</PublicLayout>
      {loaderKey > 0 && <PageLoader key={loaderKey} />}
    </>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppRouter />
      <MessageComposerModal />
      <GlobalOverlays />
    </AppProvider>
  );
}

export default App;
