export type Language = 'en' | 'fr';

export type VehicleBodyStyle =
  | 'Sedan'
  | 'SUV'
  | 'Pickup'
  | 'Hatchback'
  | 'Minibus'
  | 'Van'
  | 'Coupe'
  | 'Truck';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string;
  descriptionFr?: string;
  featured: boolean;
  visible: boolean;
  order: number;
  logoColor: string;
  badgeText: string;
  catalogCountOffset?: number; // Allows realistic catalog counts alongside live cars
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  defaultBodyType: VehicleBodyStyle;
  yearsAvailable: string;
  visible: boolean;
  order: number;
}

export type PropertyGroup =
  | 'General'
  | 'Engine and performance'
  | 'Body and interior'
  | 'Safety'
  | 'Features and comfort'
  | 'Commercial';

export type PropertyInputType =
  | 'single_select'
  | 'multi_select'
  | 'number'
  | 'number_range'
  | 'yes_no'
  | 'short_text'
  | 'colour';

export type FilterStyle = 'checkbox' | 'dropdown' | 'slider' | 'toggle';

export type AppliesTo = 'sale' | 'rental' | 'pickup';

export interface VehicleProperty {
  id: string;
  key: string;
  name: string;
  nameFr: string;
  group: PropertyGroup;
  inputType: PropertyInputType;
  options?: string[];
  unit?: string;
  showAsFilter: boolean;
  filterStyle: FilterStyle;
  required: boolean;
  showOnCard: boolean;
  appliesTo: AppliesTo[];
  order: number;
  isCore?: boolean;
}

export type CarStatus = 'Draft' | 'Available' | 'Reserved' | 'Sold' | 'Archived';

export type PromoTag = 'Hot deal' | 'Price drop' | null;

export interface CarPhoto {
  id: string;
  angle: 'front34' | 'side' | 'rear34' | 'interior';
  caption: string;
  isCover: boolean;
}

export type PropertyValue = string | number | boolean | string[];

export interface CarForSale {
  id: string;
  reference: string;
  brandId: string;
  modelId: string;
  trim?: string;
  title: string;
  chassisVin: string;
  priceXaf: number;
  previousPriceXaf?: number;
  negotiable: boolean;
  priceOnRequest: boolean;
  status: CarStatus;
  promoTag: PromoTag;
  visible: boolean;
  featured: boolean;
  views: number;
  requestsCount: number;
  updatedAt: string;
  descriptionEn: string;
  descriptionFr: string;
  photos: CarPhoto[];
  properties: Record<string, PropertyValue>;
}

export interface DateRangeBlock {
  start: string; // YYYY-MM-DD
  end: string;   // YYYY-MM-DD
  status: 'booked' | 'pending' | 'maintenance';
  label?: string;
}

export interface RentalCar {
  id: string;
  reference: string;
  brandId: string;
  modelId: string;
  title: string;
  shortDescriptionEn: string;
  shortDescriptionFr: string;
  pricePerDayXaf: number;
  driverAvailable: boolean;
  driverDailyFeeXaf: number;
  status: 'Available' | 'Booked' | 'Maintenance';
  visible: boolean;
  bookedRanges: DateRangeBlock[];
  properties: Record<string, PropertyValue>;
  photos: CarPhoto[];
}

export interface PickupVehicle {
  id: string;
  reference: string;
  brandId: string;
  modelId: string;
  title: string;
  routeSummaryEn: string;
  routeSummaryFr: string;
  pricePerTripXaf: number;
  maxPassengers: number;
  maxLuggage: number;
  status: 'Available' | 'Booked' | 'Maintenance';
  visible: boolean;
  bookedDates: { date: string; status: 'booked' | 'pending' }[];
  properties: Record<string, PropertyValue>;
  photos: CarPhoto[];
}

export type RequestStatus =
  | 'New'
  | 'Contacted'
  | 'Viewing scheduled'
  | 'Completed'
  | 'Sold'
  | 'Cancelled';

export interface RequestNote {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface ViewingRequest {
  id: string;
  reference: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  carId: string;
  source: 'Form' | 'WhatsApp' | 'Call' | 'Walk-in';
  preferredDate: string;
  message: string;
  whatsappOptIn: boolean;
  status: RequestStatus;
  assignedTo: string;
  createdAt: string;
  notes: RequestNote[];
}

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'In progress'
  | 'Completed'
  | 'Cancelled';

export type PaymentStatus = 'Unpaid' | 'Deposit' | 'Partially paid' | 'Paid';

export type MessageStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export interface RentalBooking {
  id: string;
  reference: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  rentalCarId: string;
  startDate: string;
  endDate: string;
  withDriver: boolean;
  driverId: string | null;
  pickupLocation: string;
  returnLocation: string;
  notes: string;
  policyAcceptedVersion: string;
  policyAcceptedAt: string;
  totalXaf: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  whatsappStatus: MessageStatus;
  createdAt: string;
}

export interface PickupBooking {
  id: string;
  reference: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  pickupVehicleId: string;
  date: string;
  time: string;
  pickupPoint: string;
  destination: string;
  passengers: number;
  luggage: number;
  notes: string;
  driverId: string | null;
  policyAcceptedVersion: string;
  policyAcceptedAt: string;
  totalXaf: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  whatsappStatus: MessageStatus;
  createdAt: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  licenceNumber: string;
  licenceExpiry: string; // YYYY-MM-DD
  idNumber: string;
  emergencyContact: string;
  notes: string;
  status: 'Active' | 'Inactive';
}

export interface ServiceItem {
  id: string;
  slug: string;
  titleEn: string;
  titleFr: string;
  summaryEn: string;
  summaryFr: string;
  descriptionEn: string;
  descriptionFr: string;
  visible: boolean;
  order: number;
  ctaType: 'WhatsApp' | 'Form' | 'Call';
  ctaLabelEn: string;
  ctaLabelFr: string;
  whyChooseUs: { icon: string; titleEn: string; titleFr: string; textEn: string; textFr: string }[];
  faqs: { qEn: string; qFr: string; aEn: string; aFr: string }[];
}

export interface PolicyDoc {
  id: string;
  slug: string;
  titleEn: string;
  titleFr: string;
  version: string;
  lastUpdated: string;
  sections: {
    id: string;
    headingEn: string;
    headingFr: string;
    bodyEn: string;
    bodyFr: string;
  }[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceXaf: number;
}

export interface PaymentRecord {
  id: string;
  amountXaf: number;
  method: 'Bank Transfer' | 'MTN MoMo' | 'Orange Money' | 'Cash';
  reference: string;
  date: string;
}

export type InvoiceStatus =
  | 'Draft'
  | 'Sent'
  | 'Partially paid'
  | 'Paid'
  | 'Overdue'
  | 'Cancelled'
  | 'Voided';

export interface Invoice {
  id: string;
  number: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  linkedBookingRef?: string;
  lineItems: InvoiceLineItem[];
  discountXaf: number;
  taxPercent: number;
  payments: PaymentRecord[];
  dueDate: string;
  status: InvoiceStatus;
  notes: string;
  createdAt: string;
}

export interface SalesReceipt {
  id: string;
  number: string;
  buyerName: string;
  buyerPhone: string;
  buyerIdNumber: string;
  buyerAddress: string;
  carId: string;
  carTitle: string;
  carBrand: string;
  carModel: string;
  carYear: string;
  carChassisVin: string;
  carColour: string;
  salePriceXaf: number;
  payments: PaymentRecord[];
  status: 'Deposit' | 'Part-paid' | 'Paid in full' | 'Voided';
  issuedLocked: boolean;
  voidReason?: string;
  createdAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'Utility' | 'Marketing';
  language: 'EN' | 'FR';
  status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected';
  lastUsed: string;
  body: string;
  rejectionReason?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  timing: string;
  templateId: string;
  recipient: 'Client' | 'Admin' | 'Driver' | 'Client & Driver';
  enabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  languageRule: 'Client preference' | 'Default EN' | 'Default FR';
}

export interface MessageLogEntry {
  id: string;
  timestamp: string;
  recipientName: string;
  recipientPhone: string;
  templateName: string;
  linkedRecord: string;
  channel: 'WhatsApp API' | 'Click-to-chat' | 'SMS' | 'Email';
  status: MessageStatus;
  error?: string;
  previewText: string;
}

export interface ConversationMessage {
  id: string;
  direction: 'in' | 'out';
  text: string;
  timestamp: string;
  status?: MessageStatus;
}

export interface ConversationThread {
  id: string;
  clientName: string;
  clientPhone: string;
  linkedTag: string;
  unread: boolean;
  needsReply: boolean;
  windowMinutesRemaining: number; // > 0 means inside 24h free-text window
  messages: ConversationMessage[];
}

export interface ToSendQueueItem {
  id: string;
  recipientName: string;
  recipientPhone: string;
  linkedRef: string;
  dueTime: string;
  messageText: string;
  sent: boolean;
}

export type WhatsAppConnectionMode = 'meta_api' | 'bsp' | 'click_to_chat' | 'email_sms';

export interface VerificationChecklistItem {
  id: string;
  label: string;
  status: 'Verified' | 'Pending' | 'Action needed';
}

export interface WhatsAppSettingsState {
  mode: WhatsAppConnectionMode;
  connectionStatus: 'Connected' | 'Limited' | 'Disconnected';
  businessNumber: string;
  displayName: string;
  qualityRating: 'High' | 'Medium' | 'Low';
  dailyUsed: number;
  dailyLimit: number;
  verifiedBadge: boolean;
  metaBusinessAccountId: string;
  metaPhoneNumberId: string;
  metaAccessToken: string;
  webhookUrl: string;
  verifyToken: string;
  bspProvider: string;
  bspApiKey: string;
  smtpHost: string;
  smsProvider: string;
  automationMode: 'Automatic' | 'Manual approval first';
  fallbackRule: string;
  consentTextEn: string;
  consentTextFr: string;
  optedOutClients: { name: string; phone: string; date: string }[];
  checklist: VerificationChecklistItem[];
}

export interface DealershipSettings {
  name: string;
  phonePrimary: string;
  phoneSecondary: string;
  whatsappNumber: string;
  email: string;
  addressDouala: string;
  addressYaounde: string;
  openingHours: string;
  timezone: string;
  currency: string;
}

export type PublicRoute =
  | { page: 'home' }
  | { page: 'buy'; brandSlug?: string }
  | { page: 'car-detail'; carId: string }
  | { page: 'rent' }
  | { page: 'rent-detail'; rentalId: string }
  | { page: 'pickup' }
  | { page: 'pickup-detail'; pickupId: string }
  | { page: 'services'; serviceSlug?: string }
  | { page: 'policies'; policySlug?: string }
  | { page: 'contact' };

export type AdminPage =
  | 'overview'
  | 'cars'
  | 'car-form'
  | 'brands'
  | 'properties'
  | 'requests'
  | 'rental-cars'
  | 'rental-bookings'
  | 'pickup-vehicles'
  | 'pickup-bookings'
  | 'drivers'
  | 'services'
  | 'billing-invoices'
  | 'billing-receipts'
  | 'messaging-inbox'
  | 'messaging-templates'
  | 'messaging-automations'
  | 'messaging-log'
  | 'messaging-connection'
  | 'messaging-queue'
  | 'policies-admin'
  | 'settings';
