'use client';

import { Award, Check, Star, User } from 'lucide-react';
import type { Stylist } from '@/lib/types';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

interface StylistStepProps {
  stylists: Stylist[] | null;
  error: boolean;
  onRetry: () => void;
  selected: Stylist | null;
  onSelect: (stylist: Stylist) => void;
}

export default function StylistStep({
  stylists,
  error,
  onRetry,
  selected,
  onSelect,
}: StylistStepProps) {
  if (error) {
    return (
      <ErrorState message="設計師資訊暫時無法載入，請稍後再試。" onRetry={onRetry} />
    );
  }

  if (stylists === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    );
  }

  if (stylists.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-cocoa-400">
        目前尚無可預約的設計師。
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {stylists.map((s) => {
        const isSelected = selected?.id === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`relative flex gap-4 rounded-2xl border-2 bg-white/80 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rosegold-300/15 ${
              isSelected
                ? 'border-rosegold-400 shadow-lg shadow-rosegold-300/20'
                : 'border-blush-100'
            }`}
          >
            {isSelected && (
              <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-rosegold-400 text-white">
                <Check className="h-3.5 w-3.5" />
              </span>
            )}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blush-100 to-cream-200">
              {s.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.imageUrl}
                  alt={s.name}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User className="h-6 w-6 text-rosegold-300/70" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="font-display text-lg font-semibold text-cocoa-700">
                  {s.name}
                </h3>
                <span className="text-xs tracking-widest text-rosegold-500">
                  {s.title}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-cocoa-400">
                <span className="inline-flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {s.rating.toFixed(1)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-rosegold-400" />
                  {s.yearsExperience} 年資歷
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.specialties.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blush-50 px-2.5 py-0.5 text-[11px] text-rosegold-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
