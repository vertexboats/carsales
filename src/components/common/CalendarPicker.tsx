import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { DateRangeBlock } from '../../types/derico';

interface CalendarPickerProps {
  mode: 'range' | 'single';
  bookedRanges?: DateRangeBlock[];
  bookedDates?: { date: string; status: 'booked' | 'pending' }[];
  startDate: string;
  endDate?: string;
  onChange: (start: string, end?: string) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toYmd(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export const CalendarPicker: React.FC<CalendarPickerProps> = ({
  mode,
  bookedRanges = [],
  bookedDates = [],
  startDate,
  endDate,
  onChange,
}) => {
  // Default to November 2026 to align with prototype date & seeded blocks
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(10); // 0-indexed -> 10 = November

  const monthLabel = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const getDayStatus = (ymd: string): 'available' | 'booked' | 'pending' => {
    for (const r of bookedRanges) {
      if (ymd >= r.start && ymd <= r.end) {
        return r.status === 'pending' ? 'pending' : 'booked';
      }
    }
    const found = bookedDates.find((b) => b.date === ymd);
    if (found) return found.status;
    return 'available';
  };

  const nextAvailableDate = useMemo(() => {
    for (let d = 14; d <= 30; d++) {
      const ymd = toYmd(year, month, d);
      if (getDayStatus(ymd) === 'available') {
        const dt = new Date(`${ymd}T00:00:00`);
        return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      }
    }
    return '1 Dec';
  }, [year, month, bookedRanges, bookedDates]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstJsDay = new Date(year, month, 1).getDay(); // 0=Sun..6=Sat
  const offset = (firstJsDay + 6) % 7; // Monday-first offset

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleDayClick = (ymd: string) => {
    const status = getDayStatus(ymd);
    if (status === 'booked') return;

    if (mode === 'single') {
      onChange(ymd);
      return;
    }

    if (!startDate || (startDate && endDate && startDate !== endDate)) {
      onChange(ymd, ymd);
    } else if (ymd < startDate) {
      onChange(ymd, startDate);
    } else {
      // Check if any booked day is in between
      let hasBookedBetween = false;
      const cur = new Date(`${startDate}T00:00:00`);
      const target = new Date(`${ymd}T00:00:00`);
      while (cur <= target) {
        const check = cur.toISOString().slice(0, 10);
        if (getDayStatus(check) === 'booked') {
          hasBookedBetween = true;
          break;
        }
        cur.setDate(cur.getDate() + 1);
      }
      if (hasBookedBetween) {
        onChange(ymd, ymd);
      } else {
        onChange(startDate, ymd);
      }
    }
  };

  return (
    <div className="clay-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[#FF3600]" />
          <span className="font-display font-semibold text-sm text-[#040401]">{monthLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-full border border-[#ECECEC] hover:bg-[#FFF3EE] flex items-center justify-center text-[#616161] hover:text-[#040401] cursor-pointer transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-full border border-[#ECECEC] hover:bg-[#FFF3EE] flex items-center justify-center text-[#616161] hover:text-[#040401] cursor-pointer transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[11px] font-medium text-[#8290A3] py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const ymd = toYmd(year, month, day);
          const status = getDayStatus(ymd);
          const isPast = ymd < '2026-11-13';
          const isSelected =
            mode === 'single'
              ? startDate === ymd
              : Boolean(startDate && ((endDate && ymd >= startDate && ymd <= endDate) || startDate === ymd));

          let cellStyle =
            'bg-white text-[#040401] border border-[#ECECEC] hover:border-[#FF3600] cursor-pointer';
          if (isPast) {
            cellStyle = 'bg-[#FFF8F6] text-[#CBD5E1] border border-transparent cursor-not-allowed';
          } else if (status === 'booked') {
            cellStyle =
              'bg-[#DC2626]/10 text-[#B91C1C] border border-[#DC2626]/20 line-through cursor-not-allowed';
          } else if (isSelected) {
            cellStyle = 'clay-btn-dark !h-9 font-semibold cursor-pointer';
          } else if (status === 'pending') {
            cellStyle =
              'bg-[#F59E0B]/12 text-[#92400E] border border-[#F59E0B]/30 hover:border-[#FF3600] cursor-pointer';
          }

          return (
            <button
              key={ymd}
              type="button"
              disabled={isPast || status === 'booked'}
              onClick={() => handleDayClick(ymd)}
              className={`h-9 rounded-xl text-xs tabular-nums transition-colors flex items-center justify-center ${cellStyle}`}
              title={
                status === 'booked'
                  ? 'Booked (unavailable)'
                  : status === 'pending'
                  ? 'Pending confirmation'
                  : 'Available'
              }
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-[#ECECEC] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-[#616161]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-white border border-[#CBD5E1]" /> Available
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B]/20 border border-[#F59E0B]/40" /> Pending
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#DC2626]/15 border border-[#DC2626]/30" /> Booked
          </span>
        </div>
        <span className="font-semibold text-[#16A34A]">
          Next available: {nextAvailableDate}
        </span>
      </div>
    </div>
  );
};
