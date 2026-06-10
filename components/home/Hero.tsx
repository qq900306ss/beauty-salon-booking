'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import MagneticButton from '@/components/ui/MagneticButton';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-24 w-24 animate-float-slow rounded-full bg-gradient-to-br from-blush-200 via-blush-300 to-rosegold-300 opacity-70 blur-sm" />
        <span className="text-xs tracking-[0.3em] text-rosegold-400">
          美好正在醞釀…
        </span>
      </div>
    </div>
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.25 + i * 0.18, duration: 0.9, ease: 'easeOut' },
  }),
};

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden">
      {/* 背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-b from-blush-50 via-cream-50 to-cream-100" />
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush-200/40 blur-3xl"
      />

      {/* 3D 場景 */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* 文字內容 */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-5 flex items-center gap-2 text-xs tracking-[0.5em] text-rosegold-500"
        >
          <Sparkles className="h-4 w-4" />
          BEAUTY &amp; ELEGANCE
          <Sparkles className="h-4 w-4" />
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-display text-5xl font-semibold leading-tight text-cocoa-700 md:text-7xl"
        >
          Linda <span className="gold-gradient-text">Salon</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 max-w-md text-base leading-8 tracking-wide text-cocoa-500 md:text-lg"
        >
          指尖流轉的細膩工藝，為您雕琢專屬的優雅。
          <br className="hidden md:block" />
          在靜謐與香氛之間，遇見更美的自己。
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="pointer-events-auto mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton
            onClick={() => router.push('/booking/')}
            className="card-shine rounded-full bg-gradient-to-r from-rosegold-500 to-rosegold-400 px-10 py-4 text-base tracking-[0.3em] text-white shadow-xl shadow-rosegold-500/30"
          >
            立即預約
          </MagneticButton>
          <Link
            href="/lookup/"
            className="rounded-full border border-rosegold-300/60 px-8 py-3.5 text-sm tracking-[0.2em] text-rosegold-600 backdrop-blur-sm transition-colors hover:bg-white/50"
          >
            查詢我的預約
          </Link>
        </motion.div>
      </div>

      {/* 下捲提示 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-rosegold-400"
        >
          <span className="text-[10px] tracking-[0.4em]">SCROLL</span>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>

      {/* 與下個區塊的漸層銜接 */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-cream-50" />
    </section>
  );
}
