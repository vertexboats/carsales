import React from 'react';
import { formatXaf } from '../../i18n/translations';
import { Invoice, SalesReceipt } from '../../types/derico';
import { DERICO_LOGO_SRC } from './DericoLogo';
import { StatusBadge } from './StatusBadge';

export const InvoicePdfPreview: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
  const subtotal = invoice.lineItems.reduce((s, li) => s + li.quantity * li.unitPriceXaf, 0);
  const afterDiscount = Math.max(0, subtotal - invoice.discountXaf);
  const taxAmount = Math.round(afterDiscount * (invoice.taxPercent / 100));
  const total = afterDiscount + taxAmount;
  const paid = invoice.payments.reduce((s, p) => s + p.amountXaf, 0);
  const balance = Math.max(0, total - paid);

  return (
    <div className="clay-card p-6 text-xs text-[#616161] space-y-5 bg-white">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#ECECEC]">
        <div className="flex items-center gap-3">
          <img
            src={DERICO_LOGO_SRC}
            alt="Derico Motors"
            className="w-12 h-12 object-contain rounded-xl border border-[#ECECEC] p-0.5 bg-white shrink-0"
          />
          <div>
            <div className="font-display font-extrabold text-lg text-[#040401]">DERICO MOTORS</div>
            <div className="text-[11px] text-[#616161] mt-0.5">
              Rue des Hydrocarbures, Bonapriso, Douala · Cameroon
            </div>
            <div className="text-[11px] text-[#616161]">+237 6 90 12 45 00 · contact@dericomotors.cm</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-base text-[#040401]">INVOICE</div>
          <div className="font-mono-num font-semibold text-[#FF3600] mt-0.5">{invoice.number}</div>
          <div className="mt-1.5 flex justify-end">
            <StatusBadge status={invoice.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#8290A3] uppercase tracking-wider">Billed to</div>
          <div className="font-semibold text-[#040401] text-sm mt-0.5">{invoice.clientName || 'Client Name'}</div>
          <div className="font-mono-num">{invoice.clientPhone}</div>
          <div>{invoice.clientEmail}</div>
        </div>
        <div className="text-right space-y-1">
          <div>
            <span className="text-[#8290A3]">Issue Date:</span>{' '}
            <span className="font-mono-num text-[#040401]">{invoice.createdAt}</span>
          </div>
          <div>
            <span className="text-[#8290A3]">Due Date:</span>{' '}
            <span className="font-mono-num text-[#040401]">{invoice.dueDate}</span>
          </div>
          {invoice.linkedBookingRef && (
            <div>
              <span className="text-[#8290A3]">Booking Ref:</span>{' '}
              <span className="font-mono-num text-[#FF3600]">{invoice.linkedBookingRef}</span>
            </div>
          )}
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-y border-[#ECECEC] bg-[#FFF8F6] text-[#040401]">
            <th className="text-left py-2 px-2 font-semibold">Description</th>
            <th className="text-right py-2 px-2 font-semibold">Qty</th>
            <th className="text-right py-2 px-2 font-semibold">Unit Price</th>
            <th className="text-right py-2 px-2 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#ECECEC]">
          {invoice.lineItems.map((li) => (
            <tr key={li.id}>
              <td className="py-2.5 px-2 text-[#040401]">{li.description || 'Service line item'}</td>
              <td className="py-2.5 px-2 text-right font-mono-num">{li.quantity}</td>
              <td className="py-2.5 px-2 text-right font-mono-num">{formatXaf(li.unitPriceXaf)}</td>
              <td className="py-2.5 px-2 text-right font-mono-num font-medium text-[#040401]">
                {formatXaf(li.quantity * li.unitPriceXaf)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-1.5">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono-num">{formatXaf(subtotal)}</span>
          </div>
          {invoice.discountXaf > 0 && (
            <div className="flex justify-between text-[#16A34A]">
              <span>Discount</span>
              <span className="font-mono-num">-{formatXaf(invoice.discountXaf)}</span>
            </div>
          )}
          {invoice.taxPercent > 0 && (
            <div className="flex justify-between">
              <span>VAT ({invoice.taxPercent}%)</span>
              <span className="font-mono-num">{formatXaf(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-1.5 border-t border-[#ECECEC] font-display font-bold text-sm text-[#040401]">
            <span>Total</span>
            <span className="font-mono-num">{formatXaf(total)}</span>
          </div>
          <div className="flex justify-between text-[#16A34A] font-semibold">
            <span>Amount Paid</span>
            <span className="font-mono-num">{formatXaf(paid)}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-[#ECECEC] font-bold text-[#040401]">
            <span>Balance Due</span>
            <span className="font-mono-num text-[#FF3600]">{formatXaf(balance)}</span>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC] space-y-1">
        <div className="font-semibold text-[#040401]">Payment Instructions (Cameroon)</div>
        <div>MTN MoMo Merchant: *126# (Derico Motors SARL) · Orange Money: #150# · Afriland First Bank Douala</div>
        {invoice.notes && <div className="text-[#616161] italic pt-1">{invoice.notes}</div>}
      </div>
    </div>
  );
};

export const SalesReceiptPdfPreview: React.FC<{ receipt: SalesReceipt }> = ({ receipt }) => {
  const paid = receipt.payments.reduce((s, p) => s + p.amountXaf, 0);
  const balance = Math.max(0, receipt.salePriceXaf - paid);

  return (
    <div className="clay-card p-6 text-xs text-[#616161] space-y-5 bg-white">
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#ECECEC]">
        <div className="flex items-center gap-3">
          <img
            src={DERICO_LOGO_SRC}
            alt="Derico Motors"
            className="w-12 h-12 object-contain rounded-xl border border-[#ECECEC] p-0.5 bg-white shrink-0"
          />
          <div>
            <div className="font-display font-extrabold text-lg text-[#040401]">DERICO MOTORS</div>
            <div className="text-[11px]">Official Vehicle Sales Receipt · Douala / Yaoundé</div>
            <div className="text-[11px]">RCCM: RC/DLA/2021/B/1402 · NIU: M03211489021A</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-display font-bold text-base text-[#040401]">SALES RECEIPT</div>
          <div className="font-mono-num font-semibold text-[#FF3600] mt-0.5">{receipt.number}</div>
          <div className="mt-1.5 flex justify-end">
            <StatusBadge status={receipt.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3.5 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC]">
          <div className="text-[11px] font-semibold text-[#8290A3] uppercase mb-1">Buyer Details</div>
          <div className="font-semibold text-[#040401] text-sm">{receipt.buyerName || 'Buyer Full Name'}</div>
          <div className="font-mono-num">{receipt.buyerPhone}</div>
          <div>ID / Passport: <span className="font-mono-num text-[#040401]">{receipt.buyerIdNumber || '—'}</span></div>
          <div>{receipt.buyerAddress || '—'}</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFF8F6] border border-[#ECECEC]">
          <div className="text-[11px] font-semibold text-[#8290A3] uppercase mb-1">Vehicle Details</div>
          <div className="font-semibold text-[#040401] text-sm">{receipt.carTitle}</div>
          <div>
            {receipt.carBrand} {receipt.carModel} ({receipt.carYear}) · {receipt.carColour}
          </div>
          <div>
            Chassis / VIN:{' '}
            <span className="font-mono-num font-semibold text-[#040401]">{receipt.carChassisVin}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="font-semibold text-[#040401] mb-2">Payment Schedule</div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-y border-[#ECECEC] bg-[#FFF8F6] text-[#040401]">
              <th className="text-left py-2 px-2">Date</th>
              <th className="text-left py-2 px-2">Method</th>
              <th className="text-left py-2 px-2">Reference</th>
              <th className="text-right py-2 px-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECEC]">
            {receipt.payments.map((p) => (
              <tr key={p.id}>
                <td className="py-2 px-2 font-mono-num">{p.date}</td>
                <td className="py-2 px-2">{p.method}</td>
                <td className="py-2 px-2 font-mono-num">{p.reference}</td>
                <td className="py-2 px-2 text-right font-mono-num font-medium text-[#040401]">
                  {formatXaf(p.amountXaf)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64 space-y-1">
          <div className="flex justify-between">
            <span>Agreed Sale Price</span>
            <span className="font-mono-num font-semibold text-[#040401]">{formatXaf(receipt.salePriceXaf)}</span>
          </div>
          <div className="flex justify-between text-[#16A34A] font-semibold">
            <span>Total Paid</span>
            <span className="font-mono-num font-semibold">{formatXaf(paid)}</span>
          </div>
          <div className="flex justify-between pt-1.5 border-t border-[#ECECEC] font-bold text-[#040401]">
            <span>Remaining Balance</span>
            <span className="font-mono-num text-[#FF3600]">{formatXaf(balance)}</span>
          </div>
        </div>
      </div>

      {receipt.voidReason && (
        <div className="p-3.5 rounded-2xl bg-[#DC2626]/10 border border-[#DC2626]/20 text-[#B91C1C]">
          <strong>VOIDED:</strong> {receipt.voidReason}
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 pt-6 border-t border-[#ECECEC]">
        <div>
          <div className="h-10 border-b border-dashed border-[#CBD5E1]" />
          <div className="mt-1 text-[11px] text-[#616161]">Buyer Signature &amp; Date</div>
        </div>
        <div>
          <div className="h-10 border-b border-dashed border-[#CBD5E1]" />
          <div className="mt-1 text-[11px] text-[#616161]">Derico Motors Authorized Stamp</div>
        </div>
      </div>
    </div>
  );
};
