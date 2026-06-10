'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarX2 } from 'lucide-react';
import { getTimeslots } from '@/lib/api';
import type { Timeslot } from '@/lib/types';
import { getNextDays } from '@/lib/date';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

interface DateTimeStepProps {
  serviceId: string;
  stylistId: string;
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}

export default function DateTimeStep({
  serviceId,
  stylistId,
  date,
  time,
  onDateChange,
  onTimeChange,
}: DateTimeStepProps) {
  const days = useMemo(() => getNextDays(14), []);
  const [slots, setSlots] = useState<Timeslot[] | null>(null);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    setSlots(null);
    setError(false);
    getTimeslots(stylistId, date, serviceId)
      .then((res) => {
        if (!cancelled) setSlots(res.slots);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [stylistId, serviceId, date, reload]);

  return (
    <div>
      {/* 日期橫向選擇列 */}
      <h3 className="mb-3 text-sm tracking-widest text-cocoa-500">選擇日期</h3>
      <div className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2">
        {days.map((d) => {
          const isSelected = date === d.key;
          return (
            <button
              key={d.key}
              onClick={() => {
                onDateChange(d.key);
                onTimeChange('');
              }}
              className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border-2 py-3 transition-all duration-300 ${
                isSelected
                  ? 'border-rosegold-400 bg-rosegold-400 text-white shadow-lg shadow-rosegold-300/30'
                  : 'border-blush-100 bg-white/80 text-cocoa-500 hover:border-rosegold-300'
              }`}
            >
              <span
                className={`text-[11px] ${isSelected ? 'text-white/85' : 'text-cocoa-400'}`}
              >
                {d.isToday ? '今天' : d.weekday}
              </span>
              <span className="mt-1 font-display text-xl font-semibold">
                {d.day}
              </span>
              <span
                className={`text-[10px] ${isSelected ? 'text-white/75' : 'text-cocoa-400/70'}`}
              >
                {d.month} 月
              </span>
            </button>
          );
        })}
      </div>

      {/* 時段網格 */}
      <h3 className="mb-3 mt-8 text-sm tracking-widest text-cocoa-500">
        選擇時段
      </h3>
      {!date ? (
        <p className="py-10 text-center text-sm text-cocoa-400">
          請先選擇日期。
        </p>
      ) : error ? (
        <ErrorState
          message="時段資訊暫時無法載入，請稍後再試。"
          onRetry={() => setReload((n) => n + 1)}
        />
      ) : slots === null ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-11 rounded-xl" />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-cocoa-400">
          <CalendarX2 className="h-8 w-8 text-rosegold-300" />
          <p className="text-sm">此日期沒有可預約的時段，請選擇其他日期。</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5"
        >
          {slots.map((slot) => {
            const isSelected = time === slot.time;
            return (
              <div key={slot.time} className="group relative">
                <button
                  disabled={!slot.available}
                  onClick={() => onTimeChange(slot.time)}
                  className={`w-full rounded-xl border-2 py-2.5 text-sm transition-all duration-300 ${
                    isSelected
                      ? 'border-rosegold-400 bg-rosegold-400 text-white shadow-md shadow-rosegold-300/30'
                      : slot.available
                        ? 'border-blush-100 bg-white/80 text-cocoa-600 hover:border-rosegold-300 hover:text-rosegold-500'
                        : 'cursor-not-allowed border-cream-200 bg-cream-100 text-cocoa-400/40 line-through'
                  }`}
                >
                  {slot.time}
                </button>
                {!slot.available && slot.reason && (
                  <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-cocoa-700 px-2.5 py-1 text-[11px] text-cream-100 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                    {slot.reason}
                  </span>
                )}
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
