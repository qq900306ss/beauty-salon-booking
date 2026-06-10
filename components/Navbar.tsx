'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarHeart, Menu, Search, Sparkles, X } from 'lucide-react';

const links = [
  { href: '/', label: '首頁' },
  { href: '/booking/', label: '線上預約' },
  { href: '/lookup/', label: '查詢預約' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || !onHome || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid ? 'frosted shadow-sm shadow-rosegold-300/10' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <Link href="/" className="group flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-rosegold-500 transition-transform duration-500 group-hover:rotate-90" />
          <span className="font-display text-xl font-semibold tracking-wide text-cocoa-700">
            Linda <span className="gold-gradient-text">Salon</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative text-sm tracking-widest transition-colors hover:text-rosegold-500 ${
                pathname === l.href ? 'text-rosegold-500' : 'text-cocoa-600'
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1.5 left-0 h-px w-full bg-rosegold-400"
                />
              )}
            </Link>
          ))}
          <Link
            href="/booking/"
            className="card-shine rounded-full bg-gradient-to-r from-rosegold-500 to-rosegold-400 px-5 py-2 text-sm tracking-widest text-white shadow-lg shadow-rosegold-500/25 transition-transform hover:scale-105"
          >
            立即預約
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-full p-2 text-cocoa-600 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '關閉選單' : '開啟選單'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-rosegold-300/20 md:hidden"
          >
            <div className="frosted flex flex-col gap-1 px-5 pb-6 pt-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm tracking-widest ${
                    pathname === l.href
                      ? 'bg-blush-50 text-rosegold-600'
                      : 'text-cocoa-600'
                  }`}
                >
                  {l.href === '/lookup/' ? (
                    <Search className="h-4 w-4 text-rosegold-400" />
                  ) : l.href === '/booking/' ? (
                    <CalendarHeart className="h-4 w-4 text-rosegold-400" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-rosegold-400" />
                  )}
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
