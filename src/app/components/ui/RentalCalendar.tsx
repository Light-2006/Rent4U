import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RentalCalendarProps {
  startDate: Date | null;
  endDate: Date | null;
  onRangeChange: (start: Date | null, end: Date | null) => void;
  unavailableDates?: Date[];
}

const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBefore(a: Date, b: Date) {
  return new Date(a.getFullYear(), a.getMonth(), a.getDate()) < new Date(b.getFullYear(), b.getMonth(), b.getDate());
}

function inRange(date: Date, start: Date, end: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const s = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const e = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return d > s && d < e;
}

export function RentalCalendar({ startDate, endDate, onRangeChange, unavailableDates = [] }: RentalCalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  function getDaysInMonth(month: number, year: number) {
    return new Date(year, month + 1, 0).getDate();
  }

  function getFirstDayOfMonth(month: number, year: number) {
    return new Date(year, month, 1).getDay();
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  }

  function isUnavailable(date: Date) {
    return unavailableDates.some((d) => sameDay(d, date));
  }

  function isPast(date: Date) {
    return isBefore(date, today);
  }

  function handleDayClick(day: number) {
    const clicked = new Date(viewYear, viewMonth, day);
    if (isPast(clicked) || isUnavailable(clicked)) return;

    if (!startDate || (startDate && endDate)) {
      // Start fresh
      onRangeChange(clicked, null);
    } else {
      // We have a start, now set end
      if (isBefore(clicked, startDate) || sameDay(clicked, startDate)) {
        onRangeChange(clicked, null);
      } else {
        onRangeChange(startDate, clicked);
      }
    }
  }

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
  const previewEnd = hoveredDate && startDate && !endDate ? hoveredDate : null;
  const displayEnd = endDate || previewEnd;

  const days: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to full weeks
  while (days.length % 7 !== 0) days.push(null);

  const nights = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white rounded-2xl border border-[#EDE0D0] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0E8DC]">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0E8DC] text-[#6B5135] transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="font-medium text-[#3D2B1F] text-sm">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F0E8DC] text-[#6B5135] transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 px-3 pt-3">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-[#9B8E84] py-1.5 font-medium">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 px-3 pb-4 gap-y-1">
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const date = new Date(viewYear, viewMonth, day);
          const isStart = startDate && sameDay(date, startDate);
          const isEnd = endDate && sameDay(date, endDate);
          const isInRng = startDate && displayEnd && !isBefore(displayEnd, startDate) && inRange(date, startDate, displayEnd);
          const unavailable = isUnavailable(date);
          const past = isPast(date);
          const isToday = sameDay(date, today);
          const disabled = unavailable || past;

          return (
            <div
              key={day}
              className={`relative flex items-center justify-center h-9 text-sm cursor-pointer select-none transition-all
                ${isStart || isEnd
                  ? 'bg-[#8B6F47] text-white rounded-xl z-10 font-medium shadow-md'
                  : isInRng
                  ? 'bg-[#F0E8DC] text-[#6B5135]'
                  : disabled
                  ? 'text-[#C4A882] cursor-not-allowed line-through'
                  : 'text-[#3D2B1F] hover:bg-[#F0E8DC] rounded-xl'
                }
                ${isStart ? 'rounded-l-xl' : ''}
                ${isEnd ? 'rounded-r-xl' : ''}
              `}
              onClick={() => !disabled && handleDayClick(day)}
              onMouseEnter={() => !disabled && setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {day}
              {isToday && !isStart && !isEnd && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#8B6F47] rounded-full" />
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="px-5 py-4 bg-[#FAF8F5] border-t border-[#F0E8DC]">
        {startDate && endDate && nights ? (
          <div className="flex items-center justify-between">
            <div className="text-sm text-[#3D2B1F]">
              <span className="font-medium">{startDate.getDate()}/{startDate.getMonth() + 1}</span>
              <span className="text-[#9B8E84] mx-2">→</span>
              <span className="font-medium">{endDate.getDate()}/{endDate.getMonth() + 1}</span>
            </div>
            <span className="text-sm bg-[#8B6F47] text-white px-3 py-1 rounded-full">
              {nights} đêm
            </span>
          </div>
        ) : startDate ? (
          <p className="text-sm text-[#9B8E84] text-center">Chọn ngày trả</p>
        ) : (
          <p className="text-sm text-[#9B8E84] text-center">Chọn ngày bắt đầu thuê</p>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-3 border-t border-[#F0E8DC]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#8B6F47] rounded" />
          <span className="text-xs text-[#9B8E84]">Đã chọn</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-[#EDE0D0] rounded line-through text-xs leading-3">×</div>
          <span className="text-xs text-[#9B8E84]">Không có</span>
        </div>
      </div>
    </div>
  );
}
