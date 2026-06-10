'use client';

import {
  CalendarDays,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Scissors,
  User,
  UserRound,
} from 'lucide-react';
import type { Service, Stylist } from '@/lib/types';
import { formatDateLabel, formatDuration, formatPrice } from '@/lib/date';
import type { CustomerForm } from './CustomerStep';

interface ConfirmStepProps {
  service: Service;
  stylist: Stylist;
  date: string;
  time: string;
  customer: CustomerForm;
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-rosegold-400" />
      <span className="w-20 shrink-0 text-sm text-cocoa-400">{label}</span>
      <span className="text-sm text-cocoa-700">{value}</span>
    </div>
  );
}

export default function ConfirmStep({
  service,
  stylist,
  date,
  time,
  customer,
}: ConfirmStepProps) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="overflow-hidden rounded-3xl border border-blush-100 bg-white/85 shadow-sm">
        <div className="bg-gradient-to-r from-rosegold-500 to-rosegold-400 px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-white">
            預約摘要
          </h3>
          <p className="text-xs text-white/80">請確認以下資訊無誤後送出預約</p>
        </div>
        <div className="divide-y divide-blush-50 px-6 py-2">
          <Row
            icon={Scissors}
            label="服務項目"
            value={
              <>
                {service.name}
                <span className="ml-2 text-xs text-cocoa-400">
                  {formatDuration(service.durationMinutes)}
                </span>
              </>
            }
          />
          <Row icon={UserRound} label="設計師" value={`${stylist.name}（${stylist.title}）`} />
          <Row icon={CalendarDays} label="日期" value={formatDateLabel(date)} />
          <Row icon={Clock} label="時間" value={time} />
          <Row icon={User} label="姓名" value={customer.name} />
          <Row icon={Phone} label="電話" value={customer.phone} />
          {customer.email.trim() && (
            <Row icon={Mail} label="電子郵件" value={customer.email} />
          )}
          {customer.notes.trim() && (
            <Row icon={MessageSquare} label="備註" value={customer.notes} />
          )}
        </div>
        <div className="flex items-center justify-between border-t border-blush-100 bg-blush-50/60 px-6 py-4">
          <span className="text-sm text-cocoa-500">預約金額</span>
          <span className="font-display text-2xl font-semibold text-rosegold-500">
            {formatPrice(service.price)}
          </span>
        </div>
      </div>
      <p className="mt-4 text-center text-xs leading-6 text-cocoa-400">
        送出後將由專人與您確認，如需更改請來電 (02) 2700-1234。
      </p>
    </div>
  );
}
