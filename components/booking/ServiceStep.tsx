'use client';

import { Check, Clock } from 'lucide-react';
import type { Service } from '@/lib/types';
import { formatDuration, formatPrice } from '@/lib/date';
import { Skeleton } from '@/components/ui/Skeleton';
import ErrorState from '@/components/ui/ErrorState';

interface ServiceStepProps {
  services: Service[] | null;
  error: boolean;
  onRetry: () => void;
  selected: Service | null;
  onSelect: (service: Service) => void;
}

export default function ServiceStep({
  services,
  error,
  onRetry,
  selected,
  onSelect,
}: ServiceStepProps) {
  if (error) {
    return <ErrorState message="服務項目暫時無法載入，請稍後再試。" onRetry={onRetry} />;
  }

  if (services === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-cocoa-400">
        目前尚無可預約的服務項目。
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((s) => {
        const isSelected = selected?.id === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`relative rounded-2xl border-2 bg-white/80 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rosegold-300/15 ${
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
            <span className="text-[11px] tracking-widest text-rosegold-500">
              {s.category}
            </span>
            <h3 className="mt-1 font-display text-lg font-semibold text-cocoa-700">
              {s.name}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-cocoa-400">
              {s.description}
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="font-display font-semibold text-rosegold-500">
                {formatPrice(s.price)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-cocoa-400">
                <Clock className="h-3.5 w-3.5 text-rosegold-400" />
                {formatDuration(s.durationMinutes)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
