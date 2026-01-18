import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import LoginButton from '../components/LoginButton';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // 如果已經登入，檢查是否有待處理的預約
  useEffect(() => {
    if (isAuthenticated()) {
      const pendingBooking = localStorage.getItem('pendingBooking');
      if (pendingBooking) {
        localStorage.removeItem('pendingBooking');
        router.push(`/booking?serviceId=${pendingBooking}`);
      } else {
        router.push('/');
      }
    }
  }, [isAuthenticated, router]);

  return (
    <>
      <Head>
        <title>會員登入 - 琳達髮廊</title>
      </Head>

      <div className="min-h-screen bg-stone-50 flex flex-col">
        {/* Header */}
        <header className="glass-nav absolute w-full z-10 transition-all duration-300">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="text-xl font-serif font-bold text-secondary-800 hover:text-primary-600 transition-colors flex items-center gap-2">
              <span className="text-2xl">←</span> 返回首頁
            </Link>
          </div>
        </header>

        {/* Login Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-20 relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-primary-100/20 to-transparent -z-10" />
          <div className="absolute bottom-0 left-0 w-2/3 h-full bg-gradient-to-r from-stone-200/20 to-transparent -z-10" />

          <div className="w-full max-w-md relative z-10">
            {/* Logo & Welcome */}
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="inline-block p-4 rounded-full bg-white shadow-sm mb-4">
                <div className="text-5xl">✨</div>
              </div>
              <h1 className="text-4xl font-serif font-bold text-secondary-800 mb-3">歡迎回來</h1>
              <p className="text-secondary-500">登入以享受更多尊榮會員服務</p>
            </div>

            {/* Login Card */}
            <div className="card backdrop-blur-sm bg-white/80 animate-fade-in-up animation-delay-200">
              <LoginButton />

              {/* Benefits */}
              <div className="mt-8 pt-8 border-t border-stone-100 space-y-4">
                <h3 className="text-center text-xs font-bold text-secondary-400 uppercase tracking-widest mb-4">
                  會員專屬權益
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-secondary-600">
                  <div className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> 快速預約
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> 行程管理
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> 專屬優惠
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-primary-500">✓</span> 設計師收藏
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-10 text-center text-xs text-secondary-400">
              <p>登入即表示您同意我們的</p>
              <p className="mt-1">
                <a href="#" className="text-secondary-600 hover:text-primary-600 hover:underline transition-colors">服務條款</a>
                {' 與 '}
                <a href="#" className="text-secondary-600 hover:text-primary-600 hover:underline transition-colors">隱私權政策</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
