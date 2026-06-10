import Hero from '@/components/home/Hero';
import ServicesSection from '@/components/home/ServicesSection';
import StylistsSection from '@/components/home/StylistsSection';
import FeaturesSection from '@/components/home/FeaturesSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <div className="section-divider mx-auto max-w-4xl" />
      <StylistsSection />
      <div className="section-divider mx-auto max-w-4xl" />
      <FeaturesSection />
    </>
  );
}
