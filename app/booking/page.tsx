import { Suspense } from 'react';
import type { Metadata } from 'next';
import BookingFlow from '@/components/booking/BookingFlow';
import { Skeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: '線上預約 | Linda Salon',
  description: '選擇服務、設計師與時段，輕鬆完成 Linda Salon 線上預約。',
};

function BookingFallback() {
  return (
    <div className="space-y-8">
      <Skeleton className="mx-auto h-10 max-w-3xl" />
      <Skeleton className="h-64" />
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* 柔和背景光暈 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-blush-100/60 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-28 md:px-8 md:pt-36">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.4em] text-rosegold-500">RESERVATION</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-cocoa-700">
            線上預約
          </h1>
        </div>
        <Suspense fallback={<BookingFallback />}>
          <BookingFlow />
        </Suspense>
      </div>
    </div>
  );
}
