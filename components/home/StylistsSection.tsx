'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, User } from 'lucide-react';
import { getStylists } from '@/lib/api';
import type { Stylist } from '@/lib/types';
import SectionTitle from '@/components/ui/SectionTitle';
import { CardSkeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

function StylistCard({ stylist, index }: { stylist: Stylist; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="card-shine group overflow-hidden rounded-3xl border border-blush-100 bg-white/80 shadow-sm transition-shadow duration-500 hover:shadow-xl hover:shadow-rosegold-300/20"
    >
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-cream-200 to-blush-100">
        {stylist.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={stylist.imageUrl}
            alt={stylist.name}
            className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User className="h-12 w-12 text-rosegold-300/60" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-cocoa-800/50 to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1 backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-cocoa-700">
            {stylist.rating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-xl font-semibold text-cocoa-700">
            {stylist.name}
          </h3>
          <span className="text-xs tracking-widest text-rosegold-500">
            {stylist.title}
          </span>
        </div>
        <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-cocoa-400">
          <Award className="h-3.5 w-3.5 text-rosegold-400" />
          {stylist.yearsExperience} 年資歷
        </p>
        <p className="mt-3 line-clamp-2 min-h-[2.75rem] text-sm leading-6 text-cocoa-400">
          {stylist.bio}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {stylist.specialties.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-blush-50 px-3 py-1 text-xs text-rosegold-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function StylistsSection() {
  const [stylists, setStylists] = useState<Stylist[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setStylists(null);
    getStylists()
      .then((data) => setStylists(data.filter((s) => s.isActive)))
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section id="stylists" className="bg-gradient-to-b from-cream-50 via-blush-50/60 to-cream-50 py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle
          eyebrow="OUR TEAM"
          title="設計師團隊"
          description="集結多年經驗與美感品味的設計師群，傾聽您的需求，打造最適合您的風格。"
          gemColor="#e8b4bc"
        />
        <div className="mt-14">
          {error ? (
            <ErrorState
              message="設計師資訊暫時無法載入，請稍後再試。"
              onRetry={load}
            />
          ) : stylists === null ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : stylists.length === 0 ? (
            <p className="py-16 text-center text-sm text-cocoa-400">
              設計師資訊即將上線，敬請期待。
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {stylists.map((s, i) => (
                <StylistCard key={s.id} stylist={s} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
