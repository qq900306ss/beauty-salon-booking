'use client';

import type { BookingCustomer } from '@/lib/types';

export interface CustomerForm {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

export interface CustomerErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export function validateCustomer(form: CustomerForm): CustomerErrors {
  const errors: CustomerErrors = {};
  if (!form.name.trim()) {
    errors.name = '請填寫您的大名';
  }
  const phone = form.phone.trim();
  if (!phone) {
    errors.phone = '請填寫聯絡電話';
  } else if (!/^0\d{8,9}$/.test(phone.replace(/[\s-]/g, ''))) {
    errors.phone = '請填寫有效的台灣電話號碼（例：0912345678）';
  }
  const email = form.email.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = '電子郵件格式不正確';
  }
  return errors;
}

export function toCustomerPayload(form: CustomerForm): BookingCustomer {
  return {
    name: form.name.trim(),
    phone: form.phone.trim().replace(/[\s-]/g, ''),
    email: form.email.trim() || undefined,
    notes: form.notes.trim() || undefined,
  };
}

interface CustomerStepProps {
  form: CustomerForm;
  errors: CustomerErrors;
  onChange: (form: CustomerForm) => void;
}

const inputClass = (hasError: boolean) =>
  `w-full rounded-xl border-2 bg-white/80 px-4 py-3 text-sm text-cocoa-700 outline-none transition-colors placeholder:text-cocoa-400/50 focus:border-rosegold-400 ${
    hasError ? 'border-red-300' : 'border-blush-100'
  }`;

export default function CustomerStep({
  form,
  errors,
  onChange,
}: CustomerStepProps) {
  const set = (key: keyof CustomerForm) => (value: string) =>
    onChange({ ...form, [key]: value });

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-cocoa-500">
          姓名 <span className="text-rosegold-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => set('name')(e.target.value)}
          placeholder="您的大名"
          className={inputClass(!!errors.name)}
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-sm text-cocoa-500">
          聯絡電話 <span className="text-rosegold-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => set('phone')(e.target.value)}
          placeholder="0912 345 678"
          className={inputClass(!!errors.phone)}
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-cocoa-500">
          電子郵件（選填）
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => set('email')(e.target.value)}
          placeholder="you@example.com"
          className={inputClass(!!errors.email)}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm text-cocoa-500">
          備註（選填）
        </label>
        <textarea
          id="notes"
          rows={4}
          value={form.notes}
          onChange={(e) => set('notes')(e.target.value)}
          placeholder="想對設計師說的話、特殊需求…"
          className={inputClass(false)}
        />
      </div>
    </div>
  );
}
