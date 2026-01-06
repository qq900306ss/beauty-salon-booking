import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { serviceService } from '../lib/services/service.service';
import ServiceCard from '../components/ServiceCard';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
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
        <title>琳達髮廊 - 專業美容預約系統</title>
        <meta name="description" content="提供專業的美容美髮服務" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary-600">✨ 琳達髮廊</h1>
                <p className="text-gray-600 mt-1">讓美麗成為習慣</p>
              </div>
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-gray-700">👋 {user.name || user.email}</span>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    登出
                  </button>
                </div>
              ) : (
                <Link href="/login">
                  <button className="flex items-center gap-2 bg-white border-2 border-primary-500 text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg font-medium transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="hidden sm:inline">會員登入</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            歡迎來到琳達髮廊
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            提供最專業的美容美髮服務，讓您煥然一新
          </p>
        </section>

        {/* Category Filter */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary-100 border border-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 pb-16">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">載入中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchServices}
                className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                重試
              </button>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">目前沒有可用的服務項目</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">© 2024 琳達髮廊 - 版權所有</p>
            <p className="text-gray-500 text-sm mt-2">營業時間：10:00 - 20:00</p>
          </div>
        </footer>
      </div>
    </>
  );
}
