import type { BookingStatus } from '@/lib/types';

const STATUS_MAP: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: '待確認',
    className: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  confirmed: {
    label: '已確認',
    className: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  completed: {
    label: '已完成',
    className: 'bg-sky-50 text-sky-600 border-sky-200',
  },
  cancelled: {
    label: '已取消',
    className: 'bg-stone-100 text-stone-500 border-stone-200',
  },
};

export function statusLabel(status: BookingStatus | string): string {
  return STATUS_MAP[status]?.label ?? status;
}

export default function StatusBadge({
  status,
}: {
  status: BookingStatus | string;
}) {
  const info = STATUS_MAP[status] ?? {
    label: status,
    className: 'bg-stone-100 text-stone-500 border-stone-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs tracking-wider ${info.className}`}
    >
      {info.label}
    </span>
  );
}
