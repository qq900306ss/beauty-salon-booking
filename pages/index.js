import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serviceService } from '../lib/services/service.service';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { useBranding } from '../hooks/useBranding';

export default function Home() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const { branding } = useBranding();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // 檢查是否從 OAuth callback 返回
    if (router.query.login === 'success') {
      // 重新取得用戶資訊
      login();
      // 清除 URL 參數
      router.replace('/', undefined, { shallow: true });
    }

    fetchServices();
  }, [router.query]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAll();
      setServices(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('載入服務項目失敗');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories from services
  const categories = [
    { id: 'all', name: '全部服務' },
    ...Array.from(new Set(services.map(s => s.category).filter(Boolean)))
      .map(cat => ({ id: cat, name: cat }))
  ];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(service => service.category === selectedCategory);

  return (
    <>
      <Head>
        <title>{branding.name} - 專業美容預約系統</title>
        <meta name="description" content={branding.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-stone-50">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-gradient-ethereal">
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Ethereal Abstract Shapes - Light Mode */}
            <div className="absolute -top-40 -right-40 w-2/3 h-2/3 bg-primary-200/20 blur-[100px] rounded-full opacity-60 animate-pulse-slow mix-blend-multiply" />
            <div className="absolute -bottom-40 -left-40 w-2/3 h-2/3 bg-rose-200/20 blur-[120px] rounded-full opacity-40 animate-float mix-blend-multiply" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-4 rounded-full bg-white/40 border border-white/60 text-secondary-600 text-xs font-bold tracking-[0.3em] uppercase mb-8 backdrop-blur-md animate-fade-in-up shadow-sm">
              Premium Beauty & Wellness
            </span>
            <h2 className="text-5xl md:text-8xl font-serif font-bold text-secondary-800 mb-8 leading-tight tracking-tight animate-fade-in-up animation-delay-200 drop-shadow-sm">
              <span className="block text-secondary-500 text-2xl md:text-3xl mb-4 font-light italic tracking-normal">Welcome to</span>
              <span className="text-shadow-glow text-primary-700">{branding.name}</span>
            </h2>
            <p className="text-lg md:text-xl text-secondary-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed tracking-wide animate-fade-in-up animation-delay-400">
              探索極致美學，在光影流動中綻放您的獨特風采
            </p>
            <div className="flex justify-center gap-6 animate-fade-in-up animation-delay-400">
              <button
                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary relative overflow-hidden group shadow-xl hover:shadow-2xl"
              >
                <span className="relative z-10">立即預約</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              </button>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section id="services" className="container mx-auto px-4 mb-20 relative z-10">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3 rounded-full font-bold transition-all duration-300 text-xs tracking-[0.15em] uppercase backdrop-blur-md shadow-sm ${selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                  : 'bg-white/60 text-secondary-500 border border-stone-100 hover:border-primary-200 hover:text-primary-600 hover:bg-white'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 pb-24">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-6 text-secondary-500 font-light tracking-widest">載入中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchServices}
                className="btn-primary"
              >
                重試
              </button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm mx-auto max-w-2xl">
              <p className="text-secondary-400 text-lg">目前沒有可用的服務項目</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-secondary-900 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-serif font-bold mb-4">{branding.name}</h3>
                <p className="text-secondary-400 leading-relaxed">
                  致力於提供頂級的美容美髮體驗，<br />讓每一位顧客都能散發自信光彩。
                </p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-secondary-300">Quick Links</h4>
                <ul className="space-y-2 text-secondary-400">
                  <li><a href="#" className="hover:text-primary-400 transition-colors">關於我們</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">服務項目</a></li>
                  <li><a href="#" className="hover:text-primary-400 transition-colors">設計師團隊</a></li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <h4 className="text-lg font-bold mb-4 uppercase tracking-widest text-secondary-300">Contact</h4>
                <p className="text-secondary-400">營業時間：10:00 - 20:00</p>
                <p className="text-secondary-400 mt-2">預約專線：(02) 1234-5678</p>
              </div>
            </div>
            <div className="border-t border-secondary-800 pt-8 text-center text-secondary-500 text-sm">
              <p>© 2024 {branding.name} - 版權所有</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
