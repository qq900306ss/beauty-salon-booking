'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarDays, Check, Clock, Search, Sparkles } from 'lucide-react';
import type { Booking } from '@/lib/types';
import { formatDateLabel } from '@/lib/date';

const COLORS = ['#B76E79', '#D9A8A0', '#EAB8BC', '#F5D7B8', '#DCB8D8', '#E8C8B8'];

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotate: number;
}

/** 預約成功的灑花動畫 */
function Confetti() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        x: (Math.random() - 0.5) * 360,
        y: -(80 + Math.random() * 240),
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        delay: Math.random() * 0.35,
        duration: 1.4 + Math.random() * 1.2,
        rotate: (Math.random() - 0.5) * 540,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: 0,
            rotate: p.rotate,
            scale: 0.4,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          className="absolute rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}

export default function SuccessScreen({ booking }: { booking: Booking }) {
  return (
    <div className="relative mx-auto max-w-lg px-2 py-8 text-center">
      <Confetti />

      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-rosegold-400 to-rosegold-500 shadow-xl shadow-rosegold-400/40"
      >
        <Check className="h-10 w-10 text-white" strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7 }}
      >
        <h2 className="mt-6 flex items-center justify-center gap-2 font-display text-3xl font-semibold text-cocoa-700">
          <Sparkles className="h-5 w-5 text-rosegold-400" />
          預約成功
          <Sparkles className="h-5 w-5 text-rosegold-400" />
        </h2>
        <p className="mt-3 text-sm leading-7 text-cocoa-400">
          感謝您的預約！我們已收到您的預約申請，
          <br />
          專人將盡快與您聯繫確認。
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7 }}
        className="mt-8 rounded-3xl border border-blush-100 bg-white/85 p-6 text-left shadow-sm"
      >
        <p className="text-center text-xs tracking-widest text-cocoa-400">
          預約編號
        </p>
        <p className="mt-1 break-all text-center font-display text-lg font-semibold tracking-wider text-rosegold-500">
          {booking.id}
        </p>
        <div className="mt-5 space-y-3 border-t border-blush-50 pt-5 text-sm text-cocoa-600">
          <p className="flex items-center gap-3">
            <CalendarDays className="h-4 w-4 text-rosegold-400" />
            {formatDateLabel(booking.date)} {booking.time}
          </p>
          <p className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-rosegold-400" />
            {booking.serviceName}・{booking.stylistName}
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7 }}
        className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
      >
        <Link
          href="/lookup/"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rosegold-500 to-rosegold-400 px-7 py-3 text-sm tracking-widest text-white shadow-lg shadow-rosegold-400/30 transition-transform hover:scale-105"
        >
          <Search className="h-4 w-4" />
          查詢我的預約
        </Link>
        <Link
          href="/"
          className="rounded-full border border-rosegold-300/60 px-7 py-3 text-sm tracking-widest text-rosegold-500 transition-colors hover:bg-blush-50"
        >
          回到首頁
        </Link>
      </motion.div>
    </div>
  );
}
