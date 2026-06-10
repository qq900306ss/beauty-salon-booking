import Link from 'next/link';
import { Clock, MapPin, Phone, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-cocoa-800 text-cream-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rosegold-400/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-rosegold-500/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rosegold-300" />
            <span className="font-display text-2xl font-semibold">
              Linda Salon
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-7 text-cream-200/70">
            以細膩手藝與溫柔款待，為每一位貴賓打造專屬的美麗時光。
          </p>
          <div className="mt-6 flex gap-4 text-sm">
            <Link
              href="/booking/"
              className="rounded-full border border-rosegold-300/40 px-5 py-2 text-rosegold-300 transition-colors hover:bg-rosegold-500/10"
            >
              立即預約
            </Link>
            <Link
              href="/lookup/"
              className="rounded-full px-5 py-2 text-cream-200/70 transition-colors hover:text-rosegold-300"
            >
              查詢預約
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-rosegold-300">營業時間</h3>
          <ul className="mt-4 space-y-3 text-sm text-cream-200/80">
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-rosegold-300/70" />
              週二 至 週五　10:00 – 20:00
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-rosegold-300/70" />
              週六 至 週日　10:00 – 18:00
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-4 w-4 shrink-0 text-rosegold-300/70" />
              週一公休
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg text-rosegold-300">聯絡我們</h3>
          <ul className="mt-4 space-y-3 text-sm text-cream-200/80">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rosegold-300/70" />
              台北市大安區仁愛路四段 100 號 2 樓
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-rosegold-300/70" />
              (02) 2700-1234
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-100/10 py-6 text-center text-xs tracking-widest text-cream-200/40">
        © {new Date().getFullYear()} Linda Salon. All rights reserved.
      </div>
    </footer>
  );
}
