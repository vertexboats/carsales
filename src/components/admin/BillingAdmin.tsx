import React, { useEffect, useState } from 'react';
import {
  CreditCard,
  Eye,
  Lock,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatXaf } from '../../i18n/translations';
import { Invoice, InvoiceLineItem, PaymentRecord, SalesReceipt } from '../../types/derico';
import { InvoicePdfPreview, SalesReceiptPdfPreview } from '../common/PdfPreview';
import { StatusBadge } from '../common/StatusBadge';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

export const InvoicesAdmin: React.FC = () => {
  const {
    invoices,
    setInvoices,
    rentalBookings,
    pickupBookings,
    preselectedInvoiceBookingRef,
    setPreselectedInvoiceBookingRef,
    recordInvoicePayment,
    openComposer,
    addToast,
  } = useApp();

  const [creating, setCreating] = useState(false);
  const [previewInv, setPreviewInv] = useState<Invoice | null>(null);
  const [payInvId, setPayInvId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState(50000);
  const [payMethod, setPayMethod] = useState<PaymentRecord['method']>('MTN MoMo');
  const [payRef, setPayRef] = useState('MOMO-2026-8812');

  // Create invoice draft state
  const [draftClient, setDraftClient] = useState('Stephen Ebong');
  const [draftPhone, setDraftPhone] = useState('+237 678 55 90 11');
  const [draftEmail, setDraftEmail] = useState('stephen.ebong@example.cm');
  const [draftBookingRef, setDraftBookingRef] = useState('');
  const [draftItems, setDraftItems] = useState<InvoiceLineItem[]>([
    { id: 'li-new', description: 'Vehicle Rental Service', quantity: 2, unitPriceXaf: 95000 },
  ]);
  const [draftDiscount, setDraftDiscount] = useState(0);
  const [draftTax, setDraftTax] = useState(0);
  const [draftDueDate, setDraftDueDate] = useState('2026-11-20');
  const [draftNotes, setDraftNotes] = useState('Payable via MTN MoMo, Orange Money, or Bank Transfer.');

  useEffect(() => {
    if (preselectedInvoiceBookingRef) {
      const rb = rentalBookings.find((b) => b.reference === preselectedInvoiceBookingRef);
      const pb = pickupBookings.find((b) => b.reference === preselectedInvoiceBookingRef);
      if (rb) {
        setDraftClient(rb.clientName);
        setDraftPhone(rb.clientPhone);
        setDraftEmail(rb.clientEmail);
        setDraftBookingRef(rb.reference);
        setDraftItems([
          { id: 'li-auto', description: `Rental Booking ${rb.reference} (${rb.startDate} to ${rb.endDate})`, quantity: 1, unitPriceXaf: rb.totalXaf },
        ]);
      } else if (pb) {
        setDraftClient(pb.clientName);
        setDraftPhone(pb.clientPhone);
        setDraftEmail(pb.clientEmail);
        setDraftBookingRef(pb.reference);
        setDraftItems([
          { id: 'li-auto', description: `Pick-up Transfer ${pb.reference} (${pb.pickupPoint} → ${pb.destination})`, quantity: 1, unitPriceXaf: pb.totalXaf },
        ]);
      }
      setCreating(true);
      setPreselectedInvoiceBookingRef(null);
    }
  }, [preselectedInvoiceBookingRef]);

  const draftInvoice: Invoice = {
    id: 'draft',
    number: `DM-INV-2026-000${invoices.length + 1}`,
    clientName: draftClient,
    clientPhone: draftPhone,
    clientEmail: draftEmail,
    linkedBookingRef: draftBookingRef || undefined,
    lineItems: draftItems,
    discountXaf: draftDiscount,
    taxPercent: draftTax,
    payments: [],
    dueDate: draftDueDate,
    status: 'Sent',
    notes: draftNotes,
    createdAt: '2026-11-13',
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Invoice = { ...draftInvoice, id: `inv-${Date.now()}` };
    setInvoices((prev) => [created, ...prev]);
    setCreating(false);
    addToast({ type: 'success', title: `Created invoice ${created.number}` });
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payInvId) return;
    recordInvoicePayment(payInvId, {
      amountXaf: payAmount,
      method: payMethod,
      reference: payRef,
      date: '2026-11-13',
    });
    setPayInvId(null);
    addToast({ type: 'success', title: `Recorded payment of ${formatXaf(payAmount)}` });
  };

  if (creating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#040401]">
            Create Invoice — Live PDF Preview
          </h2>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="clay-pill h-9 px-4 text-xs font-semibold cursor-pointer text-[#040401]"
          >
            Back to Invoices
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleSaveInvoice}
            className="lg:col-span-6 clay-card p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Client name</label>
                <input
                  type="text"
                  required
                  value={draftClient}
                  onChange={(e) => setDraftClient(e.target.value)}
                  className="dm-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">WhatsApp phone</label>
                <input
                  type="text"
                  required
                  value={draftPhone}
                  onChange={(e) => setDraftPhone(e.target.value)}
                  className="dm-input font-mono-num"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Linked Booking</label>
                <input
                  type="text"
                  value={draftBookingRef}
                  onChange={(e) => setDraftBookingRef(e.target.value)}
                  placeholder="e.g. DM-RB-3012"
                  className="dm-input font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Due date</label>
                <input
                  type="date"
                  value={draftDueDate}
                  onChange={(e) => setDraftDueDate(e.target.value)}
                  className="dm-input font-mono-num"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#040401]">Line items</label>
                <button
                  type="button"
                  onClick={() =>
                    setDraftItems((prev) => [
                      ...prev,
                      { id: `li-${Date.now()}`, description: 'Additional Service', quantity: 1, unitPriceXaf: 20000 },
                    ])
                  }
                  className="text-xs font-semibold text-[#FF3600] cursor-pointer hover:underline"
                >
                  + Add line
                </button>
              </div>
              {draftItems.map((li) => (
                <div key={li.id} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    value={li.description}
                    onChange={(e) =>
                      setDraftItems((prev) =>
                        prev.map((x) => (x.id === li.id ? { ...x, description: e.target.value } : x))
                      )
                    }
                    className="col-span-6 h-9 px-2.5 rounded-xl border border-[#ECECEC] text-xs focus:outline-none focus:border-[#FF3600]"
                  />
                  <input
                    type="number"
                    min={1}
                    value={li.quantity}
                    onChange={(e) =>
                      setDraftItems((prev) =>
                        prev.map((x) => (x.id === li.id ? { ...x, quantity: Number(e.target.value) } : x))
                      )
                    }
                    className="col-span-2 h-9 px-2 rounded-xl border border-[#ECECEC] text-xs font-mono-num focus:outline-none focus:border-[#FF3600]"
                  />
                  <input
                    type="number"
                    value={li.unitPriceXaf}
                    onChange={(e) =>
                      setDraftItems((prev) =>
                        prev.map((x) => (x.id === li.id ? { ...x, unitPriceXaf: Number(e.target.value) } : x))
                      )
                    }
                    className="col-span-3 h-9 px-2 rounded-xl border border-[#ECECEC] text-xs font-mono-num focus:outline-none focus:border-[#FF3600]"
                  />
                  <button
                    type="button"
                    onClick={() => setDraftItems((prev) => prev.filter((x) => x.id !== li.id))}
                    className="col-span-1 text-[#DC2626] flex justify-center cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Discount (XAF)</label>
                <input
                  type="number"
                  value={draftDiscount}
                  onChange={(e) => setDraftDiscount(Number(e.target.value))}
                  className="dm-input font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Tax (%)</label>
                <input
                  type="number"
                  value={draftTax}
                  onChange={(e) => setDraftTax(Number(e.target.value))}
                  className="dm-input font-mono-num"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">Notes</label>
              <textarea
                rows={2}
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-[#ECECEC] text-xs focus:outline-none focus:border-[#FF3600]"
              />
            </div>

            <button
              type="submit"
              className="clay-btn w-full h-11 text-sm font-semibold cursor-pointer"
            >
              Issue Invoice
            </button>
          </form>

          <div className="lg:col-span-6">
            <InvoicePdfPreview invoice={draftInvoice} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="clay-btn h-10 px-4 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create invoice</span>
        </button>
      </div>

      <div className="clay-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
              <th className="py-3 px-4">Number</th>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Booking</th>
              <th className="py-3 px-4 text-right">Total (XAF)</th>
              <th className="py-3 px-4 text-right">Balance</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECEC] text-xs">
            {invoices.map((inv) => {
              const subtotal = inv.lineItems.reduce((s, l) => s + l.quantity * l.unitPriceXaf, 0);
              const total = Math.max(0, subtotal - inv.discountXaf) * (1 + inv.taxPercent / 100);
              const paid = inv.payments.reduce((s, p) => s + p.amountXaf, 0);
              const bal = Math.max(0, total - paid);
              return (
                <tr key={inv.id} className="hover:bg-[#FFF8F6]/60 transition-colors">
                  <td className="py-3 px-4 font-mono-num font-semibold text-[#FF3600]">{inv.number}</td>
                  <td className="py-3 px-4 font-semibold text-[#040401]">{inv.clientName}</td>
                  <td className="py-3 px-4 font-mono-num text-[#616161]">{inv.linkedBookingRef || '—'}</td>
                  <td className="py-3 px-4 text-right font-mono-num font-semibold text-[#040401]">
                    {formatXaf(total)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-semibold text-[#FF3600]">
                    {formatXaf(bal)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setPreviewInv(inv)}
                      className="text-xs font-semibold text-[#040401] hover:text-[#FF3600] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#FF3600]" />
                      <span>PDF</span>
                    </button>
                    {bal > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPayInvId(inv.id);
                          setPayAmount(bal);
                        }}
                        className="text-xs font-semibold text-[#16A34A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Record payment</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        openComposer({
                          recipientName: inv.clientName,
                          recipientPhone: inv.clientPhone,
                          linkedRecord: inv.number,
                          attachmentLabel: `${inv.number}.pdf`,
                          defaultTemplateId: 'tpl-11',
                          variables: {
                            amount: formatXaf(total),
                            invoice_link: `https://dericomotors.cm/inv/${inv.number}`,
                          },
                        })
                      }
                      className="text-xs font-semibold text-[#16A34A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <WhatsAppIcon className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {previewInv && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-sm text-[#040401]">PDF Preview</span>
              <button type="button" onClick={() => setPreviewInv(null)} className="cursor-pointer text-[#040401]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <InvoicePdfPreview invoice={previewInv} />
          </div>
        </div>
      )}

      {payInvId && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordPayment}
            className="clay-card p-6 max-w-sm w-full space-y-4"
          >
            <h3 className="font-display font-bold text-base text-[#040401]">Record Payment</h3>
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">Amount (XAF)</label>
              <input
                type="number"
                required
                value={payAmount}
                onChange={(e) => setPayAmount(Number(e.target.value))}
                className="dm-input font-mono-num"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">Method</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as PaymentRecord['method'])}
                className="dm-input"
              >
                <option>MTN MoMo</option>
                <option>Orange Money</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">Reference</label>
              <input
                type="text"
                required
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                className="dm-input font-mono-num"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPayInvId(null)}
                className="clay-pill h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-9 px-4 rounded-full bg-[#16A34A] text-white text-xs font-semibold cursor-pointer shadow-xs"
              >
                Save Payment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export const SalesReceiptsAdmin: React.FC = () => {
  const {
    receipts,
    setReceipts,
    cars,
    brands,
    models,
    preselectedReceiptCarId,
    setPreselectedReceiptCarId,
    updateCarStatus,
    openComposer,
    addToast,
  } = useApp();

  const [creating, setCreating] = useState(false);
  const [previewRec, setPreviewRec] = useState<SalesReceipt | null>(null);
  const [selectedCarId, setSelectedCarId] = useState(cars[0]?.id || '');
  const [buyerName, setBuyerName] = useState('Marie Ngo Bassa');
  const [buyerPhone, setBuyerPhone] = useState('+237 677 12 34 01');
  const [buyerIdNumber, setBuyerIdNumber] = useState('119402811');
  const [buyerAddress, setBuyerAddress] = useState('Bonapriso, Douala');
  const [salePrice, setSalePrice] = useState(cars[0]?.priceXaf || 9500000);
  const [paidAmount, setPaidAmount] = useState(cars[0]?.priceXaf || 9500000);
  const [payMethod, setPayMethod] = useState<PaymentRecord['method']>('Bank Transfer');
  const [markCarModal, setMarkCarModal] = useState<{ carId: string; recNum: string } | null>(null);

  useEffect(() => {
    if (preselectedReceiptCarId) {
      const car = cars.find((c) => c.id === preselectedReceiptCarId);
      if (car) {
        setSelectedCarId(car.id);
        setSalePrice(car.priceXaf);
        setPaidAmount(car.priceXaf);
      }
      setCreating(true);
      setPreselectedReceiptCarId(null);
    }
  }, [preselectedReceiptCarId, cars]);

  const selectedCar = cars.find((c) => c.id === selectedCarId) || cars[0];
  const carBrand = brands.find((b) => b.id === selectedCar?.brandId)?.name || '';
  const carModel = models.find((m) => m.id === selectedCar?.modelId)?.name || '';

  const draftReceipt: SalesReceipt = {
    id: 'draft',
    number: `DM-REC-2026-000${receipts.length + 1}`,
    buyerName,
    buyerPhone,
    buyerIdNumber,
    buyerAddress,
    carId: selectedCar?.id || '',
    carTitle: selectedCar?.title || 'Vehicle',
    carBrand,
    carModel,
    carYear: String(selectedCar?.properties.year || '2020'),
    carChassisVin: selectedCar?.chassisVin || '',
    carColour: String(selectedCar?.properties.colour || 'Silver'),
    salePriceXaf: salePrice,
    payments: [
      {
        id: 'p1',
        amountXaf: paidAmount,
        method: payMethod,
        reference: 'PAY-2026-01',
        date: '2026-11-13',
      },
    ],
    status: paidAmount >= salePrice ? 'Paid in full' : paidAmount > 0 ? 'Part-paid' : 'Deposit',
    issuedLocked: true,
    createdAt: '2026-11-13',
  };

  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const created: SalesReceipt = { ...draftReceipt, id: `rec-${Date.now()}` };
    setReceipts((prev) => [created, ...prev]);
    setCreating(false);
    setMarkCarModal({ carId: created.carId, recNum: created.number });
    addToast({ type: 'success', title: `Issued Sales Receipt ${created.number}` });
  };

  const voidReceipt = (rec: SalesReceipt) => {
    setReceipts((prev) =>
      prev.map((r) =>
        r.id === rec.id
          ? { ...r, status: 'Voided', voidReason: 'Voided and re-issued for correction on 2026-11-13.' }
          : r
      )
    );
    addToast({ type: 'warning', title: `${rec.number} voided (audit trail kept)` });
  };

  if (creating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#040401]">
            Create Sales Receipt — Live PDF Preview
          </h2>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="clay-pill h-9 px-4 text-xs font-semibold cursor-pointer text-[#040401]"
          >
            Back to Receipts
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleSaveReceipt}
            className="lg:col-span-6 clay-card p-5 space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-[#040401] mb-1">
                Vehicle from Inventory (auto-fills Brand, Model, Year, Chassis/VIN)
              </label>
              <select
                value={selectedCarId}
                onChange={(e) => {
                  const cid = e.target.value;
                  setSelectedCarId(cid);
                  const found = cars.find((c) => c.id === cid);
                  if (found) {
                    setSalePrice(found.priceXaf);
                    setPaidAmount(found.priceXaf);
                  }
                }}
                className="dm-input"
              >
                {cars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.reference} — {c.title} (VIN: {c.chassisVin})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Buyer Name *</label>
                <input
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="dm-input"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Buyer WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="dm-input font-mono-num"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">CNI / Passport No.</label>
                <input
                  type="text"
                  value={buyerIdNumber}
                  onChange={(e) => setBuyerIdNumber(e.target.value)}
                  className="dm-input font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Buyer Address</label>
                <input
                  type="text"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className="dm-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Sale Price (XAF)</label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="dm-input font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Amount Paid (XAF)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="dm-input font-mono-num"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#040401] mb-1">Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentRecord['method'])}
                  className="dm-input"
                >
                  <option>Bank Transfer</option>
                  <option>MTN MoMo</option>
                  <option>Orange Money</option>
                  <option>Cash</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="clay-btn w-full h-11 text-sm font-semibold cursor-pointer"
            >
              Issue Locked Sales Receipt
            </button>
          </form>

          <div className="lg:col-span-6">
            <SalesReceiptPdfPreview receipt={draftReceipt} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="clay-btn h-10 px-4 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create sales receipt</span>
        </button>
      </div>

      <div className="clay-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="border-b border-[#ECECEC] bg-[#FFF8F6] text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
              <th className="py-3 px-4">Number</th>
              <th className="py-3 px-4">Buyer</th>
              <th className="py-3 px-4">Vehicle</th>
              <th className="py-3 px-4 text-right">Sale Price</th>
              <th className="py-3 px-4 text-right">Paid</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECEC] text-xs">
            {receipts.map((rec) => {
              const paid = rec.payments.reduce((s, p) => s + p.amountXaf, 0);
              return (
                <tr key={rec.id} className="hover:bg-[#FFF8F6]/60 transition-colors">
                  <td className="py-3 px-4 font-mono-num font-semibold text-[#FF3600]">
                    <span className="inline-flex items-center gap-1">
                      {rec.issuedLocked && <Lock className="w-3 h-3 text-[#8290A3]" />}
                      {rec.number}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#040401]">{rec.buyerName}</td>
                  <td className="py-3 px-4 text-[#616161]">{rec.carTitle}</td>
                  <td className="py-3 px-4 text-right font-mono-num font-semibold text-[#040401]">
                    {formatXaf(rec.salePriceXaf)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-[#16A34A] font-semibold">
                    {formatXaf(paid)}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => setPreviewRec(rec)}
                      className="text-xs font-semibold text-[#040401] hover:text-[#FF3600] cursor-pointer"
                    >
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        openComposer({
                          recipientName: rec.buyerName,
                          recipientPhone: rec.buyerPhone,
                          linkedRecord: rec.number,
                          attachmentLabel: `${rec.number}.pdf`,
                          defaultTemplateId: 'tpl-13',
                          variables: {
                            car: rec.carTitle,
                            amount: formatXaf(rec.salePriceXaf),
                          },
                        })
                      }
                      className="text-xs font-semibold text-[#16A34A] hover:underline cursor-pointer"
                    >
                      Send WhatsApp
                    </button>
                    {rec.status !== 'Voided' && (
                      <button
                        type="button"
                        onClick={() => voidReceipt(rec)}
                        className="text-xs font-semibold text-[#DC2626] hover:underline cursor-pointer"
                      >
                        Void
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {previewRec && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-display font-bold text-sm text-[#040401]">
                Sales Receipt PDF Preview
              </span>
              <button type="button" onClick={() => setPreviewRec(null)} className="cursor-pointer text-[#040401]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <SalesReceiptPdfPreview receipt={previewRec} />
          </div>
        </div>
      )}

      {markCarModal && (
        <div className="fixed inset-0 z-50 bg-[#040401]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="clay-card p-6 max-w-sm w-full space-y-4">
            <h3 className="font-display font-bold text-base text-[#040401]">
              Update Car Inventory Status?
            </h3>
            <p className="text-xs text-[#616161]">
              Receipt <strong className="font-mono-num">{markCarModal.recNum}</strong> has been issued. Should we mark this vehicle as Reserved or Sold?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  updateCarStatus(markCarModal.carId, 'Reserved');
                  setMarkCarModal(null);
                  addToast({ type: 'info', title: 'Car marked as Reserved' });
                }}
                className="h-9 px-3.5 rounded-full bg-[#F59E0B]/15 text-[#92400E] text-xs font-semibold cursor-pointer shadow-xs"
              >
                Mark Reserved
              </button>
              <button
                type="button"
                onClick={() => {
                  updateCarStatus(markCarModal.carId, 'Sold');
                  setMarkCarModal(null);
                  addToast({ type: 'success', title: 'Car marked as Sold' });
                }}
                className="clay-btn h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Mark Sold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
