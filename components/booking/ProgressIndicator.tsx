'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const STEPS = ['選擇服務', '選擇設計師', '日期時間', '填寫資料', '確認預約'];

export default function ProgressIndicator({ step }: { step: number }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const done = step > n;
          const active = step === n;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: active ? 1.12 : 1,
                  }}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition-colors duration-500 md:h-10 md:w-10 ${
                    done
                      ? 'border-rosegold-400 bg-rosegold-400 text-white'
                      : active
                        ? 'border-rosegold-500 bg-white text-rosegold-500 shadow-lg shadow-rosegold-300/30'
                        : 'border-blush-200 bg-white text-cocoa-400/60'
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : n}
                </motion.div>
                <span
                  className={`mt-2 hidden text-[11px] tracking-widest sm:block ${
                    active || done ? 'text-rosegold-500' : 'text-cocoa-400/50'
                  }`}
                >
                  {label}
                </span>
              </div>
              {n < STEPS.length && (
                <div className="relative mx-2 h-px flex-1 self-center bg-blush-200 sm:-mt-6">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-rosegold-400"
                    initial={false}
                    animate={{ width: done ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs tracking-widest text-rosegold-500 sm:hidden">
        {STEPS[step - 1]}
      </p>
    </div>
  );
}
