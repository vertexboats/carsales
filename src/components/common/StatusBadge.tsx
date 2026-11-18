import React from 'react';
import {
  AlertTriangle,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Info,
  MinusCircle,
  XCircle,
} from 'lucide-react';
import { MessageStatus } from '../../types/derico';

type Tone = 'success' | 'warning' | 'error' | 'info' | 'neutral';

const TONE_MAP: Record<string, Tone> = {
  Available: 'success',
  Confirmed: 'success',
  Paid: 'success',
  'Paid in full': 'success',
  Delivered: 'success',
  Connected: 'success',
  Completed: 'success',
  Verified: 'success',
  Approved: 'success',
  Active: 'success',
  High: 'success',

  Pending: 'warning',
  Reserved: 'warning',
  Limited: 'warning',
  'Partially paid': 'warning',
  Deposit: 'warning',
  'Part-paid': 'warning',
  'Expiring soon': 'warning',
  Contacted: 'warning',
  Submitted: 'warning',
  Medium: 'warning',

  Failed: 'error',
  Overdue: 'error',
  Cancelled: 'error',
  Disconnected: 'error',
  Booked: 'error',
  Rejected: 'error',
  'Action needed': 'error',
  Low: 'error',
  Voided: 'error',

  'In progress': 'info',
  New: 'info',
  'Viewing scheduled': 'info',
  Sent: 'info',
  Read: 'info',

  Sold: 'neutral',
  Draft: 'neutral',
  Archived: 'neutral',
  Inactive: 'neutral',
  Maintenance: 'neutral',
};

const TONE_CLASSES: Record<Tone, string> = {
  success: 'bg-[#F0FDF4] text-[#15803D] border-[#16A34A]/25',
  warning: 'bg-[#FFFBEB] text-[#92400E] border-[#F59E0B]/30',
  error: 'bg-[#FEF2F2] text-[#B91C1C] border-[#DC2626]/25',
  info: 'bg-[#FFF3EE] text-[#FF3600] border-[#FF3600]/25',
  neutral: 'bg-[#F4F4F6] text-[#616161] border-[#ECECEC]',
};

export const StatusBadge: React.FC<{
  status: string;
  toneOverride?: Tone;
  className?: string;
}> = ({ status, toneOverride, className = '' }) => {
  const tone: Tone = toneOverride || TONE_MAP[status] || 'neutral';

  const Icon =
    tone === 'success'
      ? CheckCircle2
      : tone === 'warning'
      ? Clock
      : tone === 'error'
      ? XCircle
      : tone === 'info'
      ? Info
      : MinusCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-tight whitespace-nowrap shrink-0 clay-pill ${TONE_CLASSES[tone]} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
};

export const PromoBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#FF3600] text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase whitespace-nowrap shrink-0 clay-pill">
    {label}
  </span>
);

export const StatusTicks: React.FC<{
  status: MessageStatus;
  onResend?: () => void;
}> = ({ status, onResend }) => {
  if (status === 'queued') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#8290A3] whitespace-nowrap" title="Queued">
        <Clock className="w-3.5 h-3.5" />
        <span>Queued</span>
      </span>
    );
  }
  if (status === 'sent') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#475569] whitespace-nowrap" title="Sent">
        <Check className="w-3.5 h-3.5" />
        <span>Sent</span>
      </span>
    );
  }
  if (status === 'delivered') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#475569] whitespace-nowrap" title="Delivered">
        <CheckCheck className="w-3.5 h-3.5" />
        <span>Delivered</span>
      </span>
    );
  }
  if (status === 'read') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#2563EB] font-medium whitespace-nowrap" title="Read">
        <CheckCheck className="w-3.5 h-3.5" />
        <span>Read</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[#DC2626] font-medium whitespace-nowrap">
      <AlertTriangle className="w-3.5 h-3.5" />
      <span>Failed</span>
      {onResend && (
        <button
          type="button"
          onClick={onResend}
          className="underline hover:text-[#B91C1C] ml-1 cursor-pointer"
        >
          Resend
        </button>
      )}
    </span>
  );
};
