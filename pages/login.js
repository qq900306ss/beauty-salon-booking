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

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              ← 琳達髮廊
            </Link>
          </div>
        </header>

        {/* Login Content */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            {/* Logo & Welcome */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✨</div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">歡迎回來</h1>
              <p className="text-gray-600">登入以享受更多會員專屬功能</p>
            </div>

            {/* Login Card */}
            <div className="card">
              <LoginButton />
            </div>

            {/* Benefits */}
            <div className="mt-8 space-y-3">
              <h3 className="text-center text-sm font-semibold text-gray-700 mb-4">
                登入後可享有
              </h3>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-primary-500">✓</span>
                <span>快速填寫預約資料</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-primary-500">✓</span>
                <span>查看與管理預約記錄</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-primary-500">✓</span>
                <span>累積會員點數與優惠</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <span className="text-primary-500">✓</span>
                <span>收藏喜愛的設計師</span>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="mt-8 text-center text-xs text-gray-500">
              <p>登入即表示您同意我們的</p>
              <p className="mt-1">
                <a href="#" className="text-primary-600 hover:underline">服務條款</a>
                {' 與 '}
                <a href="#" className="text-primary-600 hover:underline">隱私權政策</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
