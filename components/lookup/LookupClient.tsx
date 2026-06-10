'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  Loader2,
  Phone,
  Scissors,
  Search,
  SearchX,
  UserRound,
} from 'lucide-react';
import { ApiError, lookupBookings } from '@/lib/api';
import type { Booking } from '@/lib/types';
import { formatDateLabel, formatPrice } from '@/lib/date';
import StatusBadge from '@/components/ui/StatusBadge';

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="relative pl-10"
    >
      {/* 時間軸節點 */}
      <span className="absolute left-0 top-7 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-rosegold-400 bg-white" />

      <div className="card-shine rounded-3xl border border-blush-100 bg-white/85 p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-rosegold-300/15">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-cocoa-700">
            <Scissors className="h-4 w-4 text-rosegold-400" />
            {booking.serviceName}
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="mt-4 grid gap-2.5 text-sm text-cocoa-500 sm:grid-cols-2">
          <p className="flex items-center gap-2.5">
            <CalendarDays className="h-4 w-4 text-rosegold-400" />
            {formatDateLabel(booking.date)}
          </p>
          <p className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 text-rosegold-400" />
            {booking.time}
          </p>
          <p className="flex items-center gap-2.5">
            <UserRound className="h-4 w-4 text-rosegold-400" />
            設計師：{booking.stylistName}
          </p>
          <p className="flex items-center gap-2.5 font-medium text-rosegold-500">
            {formatPrice(booking.price)}
          </p>
        </div>

        <p className="mt-4 border-t border-blush-50 pt-3 text-xs tracking-wider text-cocoa-400/70">
          預約編號：{booking.id}
        </p>
      </div>
    </motion.li>
  );
}

export default function LookupClient() {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Booking[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = phone.trim().replace(/[\s-]/g, '');
    if (!/^0\d{8,9}$/.test(value)) {
      setPhoneError('請輸入有效的電話號碼（例：0912345678）');
      return;
    }
    setPhoneError('');
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const bookings = await lookupBookings(value);
      // 依日期時間排序（新→舊）
      setResults(
        [...bookings].sort((a, b) =>
          `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
        )
      );
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : '查詢時發生錯誤，請稍後再試。'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* 查詢表單 */}
      <motion.form
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        onSubmit={handleSearch}
        className="mx-auto max-w-md"
      >
        <label htmlFor="lookup-phone" className="mb-2 block text-sm text-cocoa-500">
          預約時填寫的聯絡電話
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rosegold-400" />
            <input
              id="lookup-phone"
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError('');
              }}
              placeholder="0912 345 678"
              className={`w-full rounded-full border-2 bg-white/85 py-3 pl-11 pr-5 text-sm text-cocoa-700 outline-none transition-colors placeholder:text-cocoa-400/50 focus:border-rosegold-400 ${
                phoneError ? 'border-red-300' : 'border-blush-100'
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="card-shine inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-rosegold-500 to-rosegold-400 px-6 py-3 text-sm tracking-widest text-white shadow-lg shadow-rosegold-400/30 transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            查詢
          </button>
        </div>
        {phoneError && (
          <p className="mt-2 text-xs text-red-400">{phoneError}</p>
        )}
      </motion.form>

      {/* 查詢結果 */}
      <div className="mx-auto mt-12 max-w-2xl">
        <AnimatePresence mode="wait">
          {error ? (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-red-400"
            >
              {error}
            </motion.p>
          ) : results !== null && results.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 py-10 text-center"
            >
              <SearchX className="h-10 w-10 text-rosegold-300" />
              <p className="text-sm text-cocoa-400">
                查無此電話的預約紀錄。
              </p>
              <Link
                href="/booking/"
                className="rounded-full border border-rosegold-300/60 px-6 py-2.5 text-sm tracking-widest text-rosegold-500 transition-colors hover:bg-blush-50"
              >
                立即預約
              </Link>
            </motion.div>
          ) : results !== null ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="mb-6 text-center text-sm text-cocoa-400">
                共找到 {results.length} 筆預約紀錄
              </p>
              {/* 時間軸 */}
              <ul className="relative space-y-6 before:absolute before:bottom-2 before:left-0 before:top-2 before:w-px before:bg-gradient-to-b before:from-rosegold-300/60 before:via-blush-200 before:to-transparent">
                {results.map((b, i) => (
                  <BookingCard key={b.id} booking={b} index={i} />
                ))}
              </ul>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
