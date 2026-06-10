import type { Metadata } from 'next';
import LookupClient from '@/components/lookup/LookupClient';

export const metadata: Metadata = {
  title: '查詢預約 | Linda Salon',
  description: '輸入聯絡電話，查詢您在 Linda Salon 的預約紀錄與狀態。',
};

export default function LookupPage() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-blush-100/60 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-28 md:px-8 md:pt-36">
        <div className="mb-10 text-center">
          <p className="text-xs tracking-[0.4em] text-rosegold-500">MY BOOKINGS</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-cocoa-700">
            查詢預約
          </h1>
          <p className="mt-3 text-sm text-cocoa-400">
            輸入預約時填寫的電話號碼，即可查詢您的預約紀錄。
          </p>
        </div>
        <LookupClient />
      </div>
    </div>
  );
}
