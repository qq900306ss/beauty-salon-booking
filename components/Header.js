import { useBranding } from '../hooks/useBranding';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { branding } = useBranding();
  const { user, logout } = useAuth();

  return (
    <header className="glass-nav fixed w-full top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer group">
              {branding.logo ? (
                <img
                  src={branding.logo}
                  alt={branding.name}
                  className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span className="text-3xl filter drop-shadow-md">✨</span>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-secondary-800 tracking-tight">
                  {branding.name}
                </h1>
                <p className="text-secondary-500 text-xs tracking-widest uppercase hidden sm:block">
                  {branding.description}
                </p>
              </div>
            </div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/my-bookings">
                  <button className="hidden sm:flex items-center gap-2 text-secondary-600 hover:text-primary-600 font-medium transition-colors">
                    📋 我的預約
                  </button>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-secondary-600 hidden md:block font-medium">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-5 py-2 rounded-full border border-secondary-200 text-secondary-600 hover:bg-secondary-50 hover:text-secondary-800 transition-all duration-300 text-sm font-medium"
                  >
                    登出
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-full font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-sm tracking-wide">
                  登入 / 註冊
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
