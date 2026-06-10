'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';

const GemCanvas = dynamic(() => import('@/components/three/GemCanvas'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-full bg-blush-100" />
  ),
});

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  gemColor?: string;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  gemColor,
}: SectionTitleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="mx-auto max-w-2xl text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="mb-3 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-rosegold-300" />
          <div className="h-12 w-12">{inView && <GemCanvas color={gemColor} />}</div>
          <span className="h-px w-10 bg-rosegold-300" />
        </div>
        <p className="text-xs tracking-[0.4em] text-rosegold-500">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-cocoa-700 md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm leading-7 text-cocoa-400 md:text-base">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
}
