'use client';

import { motion } from 'framer-motion';
import { Flower2, Gem, HeartHandshake, Leaf } from 'lucide-react';
import SectionTitle from '@/components/ui/SectionTitle';

const features = [
  {
    icon: Gem,
    title: '頂級產品',
    text: '嚴選國際專業品牌髮品與保養品，溫和呵護每一寸肌膚與髮絲。',
  },
  {
    icon: Flower2,
    title: '靜謐空間',
    text: '柔光、香氛與輕音樂交織，讓每次到訪都是一場身心的療癒之旅。',
  },
  {
    icon: HeartHandshake,
    title: '專屬諮詢',
    text: '服務前細心溝通需求與期待，量身打造最適合您的造型方案。',
  },
  {
    icon: Leaf,
    title: '安心衛生',
    text: '器具逐一消毒、毛巾一客一換，以最高標準守護您的安心體驗。',
  },
];

export default function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 md:px-8">
      <SectionTitle
        eyebrow="WHY LINDA"
        title="關於我們"
        description="十年如一日的堅持，只為帶給您超越期待的美好體驗。"
        gemColor="#dcb8d8"
      />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: 'easeOut' }}
            className="group rounded-3xl border border-blush-100 bg-white/70 p-8 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-lg hover:shadow-rosegold-300/15"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-cream-200 transition-transform duration-500 group-hover:scale-110">
              <f.icon className="h-6 w-6 text-rosegold-500" />
            </div>
            <h3 className="mt-5 font-display text-lg font-semibold text-cocoa-700">
              {f.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-cocoa-400">{f.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
