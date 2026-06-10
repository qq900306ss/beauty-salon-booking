'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, Send } from 'lucide-react';
import { ApiError, createBooking, getServices, getStylists } from '@/lib/api';
import type { Booking, Service, Stylist } from '@/lib/types';
import { getNextDays } from '@/lib/date';
import ProgressIndicator from './ProgressIndicator';
import ServiceStep from './ServiceStep';
import StylistStep from './StylistStep';
import DateTimeStep from './DateTimeStep';
import CustomerStep, {
  type CustomerErrors,
  type CustomerForm,
  toCustomerPayload,
  validateCustomer,
} from './CustomerStep';
import ConfirmStep from './ConfirmStep';
import SuccessScreen from './SuccessScreen';

const TOTAL_STEPS = 5;

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

const STEP_TITLES: Record<number, { title: string; hint: string }> = {
  1: { title: '選擇服務', hint: '請選擇您想預約的服務項目' },
  2: { title: '選擇設計師', hint: '挑選為您服務的專屬設計師' },
  3: { title: '選擇日期與時間', hint: '挑選最適合您的時段' },
  4: { title: '填寫聯絡資料', hint: '留下您的聯絡方式，方便我們與您確認' },
  5: { title: '確認預約', hint: '最後確認一下預約內容' },
};

export default function BookingFlow() {
  const searchParams = useSearchParams();
  const preselectServiceId = searchParams.get('serviceId');

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [services, setServices] = useState<Service[] | null>(null);
  const [servicesError, setServicesError] = useState(false);
  const [stylists, setStylists] = useState<Stylist[] | null>(null);
  const [stylistsError, setStylistsError] = useState(false);

  const [service, setService] = useState<Service | null>(null);
  const [stylist, setStylist] = useState<Stylist | null>(null);
  const [date, setDate] = useState(() => getNextDays(1)[0].key);
  const [time, setTime] = useState('');
  const [customer, setCustomer] = useState<CustomerForm>({
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [customerErrors, setCustomerErrors] = useState<CustomerErrors>({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);

  const loadServices = useCallback(() => {
    setServicesError(false);
    setServices(null);
    getServices()
      .then((data) =>
        setServices(
          data
            .filter((s) => s.isActive)
            .sort((a, b) => a.sortOrder - b.sortOrder)
        )
      )
      .catch(() => setServicesError(true));
  }, []);

  const loadStylists = useCallback(() => {
    setStylistsError(false);
    setStylists(null);
    getStylists()
      .then((data) => setStylists(data.filter((s) => s.isActive)))
      .catch(() => setStylistsError(true));
  }, []);

  useEffect(() => {
    loadServices();
    loadStylists();
  }, [loadServices, loadStylists]);

  // 從首頁 CTA 帶入 ?serviceId= 預先選取
  useEffect(() => {
    if (preselectServiceId && services) {
      const found = services.find((s) => s.id === preselectServiceId);
      if (found) {
        setService((prev) => prev ?? found);
      }
    }
  }, [preselectServiceId, services]);

  const goTo = (next: number) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const canProceed = (() => {
    switch (step) {
      case 1:
        return service !== null;
      case 2:
        return stylist !== null;
      case 3:
        return date !== '' && time !== '';
      case 4:
        return true; // 於按下下一步時驗證
      default:
        return true;
    }
  })();

  const handleNext = () => {
    if (step === 4) {
      const errors = validateCustomer(customer);
      setCustomerErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }
    if (step < TOTAL_STEPS) goTo(step + 1);
  };

  const handleSubmit = async () => {
    if (!service || !stylist) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await createBooking({
        serviceId: service.id,
        stylistId: stylist.id,
        date,
        time,
        customer: toCustomerPayload(customer),
      });
      setBooking(result);
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : '送出預約時發生錯誤，請稍後再試。'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (booking) {
    return <SuccessScreen booking={booking} />;
  }

  const meta = STEP_TITLES[step];

  return (
    <div>
      <ProgressIndicator step={step} />

      <div className="mt-10 text-center">
        <h2 className="font-display text-2xl font-semibold text-cocoa-700">
          {meta.title}
        </h2>
        <p className="mt-2 text-sm text-cocoa-400">{meta.hint}</p>
      </div>

      <div className="relative mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {step === 1 && (
              <ServiceStep
                services={services}
                error={servicesError}
                onRetry={loadServices}
                selected={service}
                onSelect={(s) => {
                  setService(s);
                  setTime('');
                }}
              />
            )}
            {step === 2 && (
              <StylistStep
                stylists={stylists}
                error={stylistsError}
                onRetry={loadStylists}
                selected={stylist}
                onSelect={(s) => {
                  setStylist(s);
                  setTime('');
                }}
              />
            )}
            {step === 3 && service && stylist && (
              <DateTimeStep
                serviceId={service.id}
                stylistId={stylist.id}
                date={date}
                time={time}
                onDateChange={setDate}
                onTimeChange={setTime}
              />
            )}
            {step === 4 && (
              <CustomerStep
                form={customer}
                errors={customerErrors}
                onChange={(f) => {
                  setCustomer(f);
                  setCustomerErrors({});
                }}
              />
            )}
            {step === 5 && service && stylist && (
              <ConfirmStep
                service={service}
                stylist={stylist}
                date={date}
                time={time}
                customer={customer}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <p className="mt-6 text-center text-sm text-red-400">{submitError}</p>
      )}

      {/* 導覽按鈕 */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          onClick={() => goTo(step - 1)}
          disabled={step === 1 || submitting}
          className={`inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm tracking-widest transition-colors ${
            step === 1
              ? 'cursor-not-allowed border-cream-200 text-cocoa-400/40'
              : 'border-rosegold-300/60 text-rosegold-500 hover:bg-blush-50'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          上一步
        </button>

        {step < TOTAL_STEPS ? (
          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm tracking-widest text-white transition-all ${
              canProceed
                ? 'card-shine bg-gradient-to-r from-rosegold-500 to-rosegold-400 shadow-lg shadow-rosegold-400/30 hover:scale-105'
                : 'cursor-not-allowed bg-cream-300'
            }`}
          >
            下一步
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="card-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rosegold-500 to-rosegold-400 px-8 py-3 text-sm tracking-widest text-white shadow-lg shadow-rosegold-400/30 transition-transform hover:scale-105 disabled:cursor-wait disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                送出中…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                確認送出
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
