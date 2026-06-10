'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ImageIcon } from 'lucide-react';
import { getServices } from '@/lib/api';
import type { Service } from '@/lib/types';
import { formatDuration, formatPrice } from '@/lib/date';
import SectionTitle from '@/components/ui/SectionTitle';
import { CardSkeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

function ServiceCard({ service, index }: { service: Service; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      className="card-shine group overflow-hidden rounded-3xl border border-blush-100 bg-white/80 shadow-sm transition-shadow duration-500 hover:shadow-xl hover:shadow-rosegold-300/20"
    >
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blush-100 to-cream-200">
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt={service.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-10 w-10 text-rosegold-300/60" />
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs tracking-widest text-rosegold-600 backdrop-blur-sm">
          {service.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-cocoa-700">
            {service.name}
          </h3>
          <span className="shrink-0 font-display text-lg font-semibold text-rosegold-500">
            {formatPrice(service.price)}
          </span>
        </div>
        <p className="mt-2 line-clamp-2 min-h-[2.75rem] text-sm leading-6 text-cocoa-400">
          {service.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-cocoa-400">
            <Clock className="h-3.5 w-3.5 text-rosegold-400" />
            {formatDuration(service.durationMinutes)}
          </span>
          <Link
            href={`/booking/?serviceId=${service.id}`}
            className="rounded-full border border-rosegold-300/60 px-4 py-1.5 text-xs tracking-widest text-rosegold-500 transition-all hover:bg-rosegold-500 hover:text-white"
          >
            預約此服務
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  const [services, setServices] = useState<Service[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setError(false);
    setServices(null);
    getServices()
      .then((data) =>
        setServices(
          data
            .filter((s) => s.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder)
        )
      )
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-24 md:px-8">
      <SectionTitle
        eyebrow="OUR SERVICES"
        title="服務項目"
        description="從髮絲到指尖，每一項服務皆由資深設計師親自操刀，使用頂級產品呵護您的美麗。"
      />
      <div className="mt-14">
        {error ? (
          <ErrorState message="服務項目暫時無法載入，請稍後再試。" onRetry={load} />
        ) : services === null ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : services.length === 0 ? (
          <p className="py-16 text-center text-sm text-cocoa-400">
            目前尚無服務項目，敬請期待。
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
