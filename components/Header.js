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
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-secondary-800 tracking-tight group-hover:text-primary-600 transition-colors duration-300">
                  {branding.name}
                </h1>
                <p className="text-secondary-500 text-xs tracking-[0.2em] uppercase hidden sm:block group-hover:text-secondary-700 transition-colors duration-300">
                  {branding.description}
                </p>
              </div>
            </div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <Link href="/my-bookings">
                  <button className="hidden sm:flex items-center gap-2 text-secondary-600 hover:text-primary-600 font-medium transition-colors tracking-wide group">
                    <span className="group-hover:animate-bounce">📋</span> <span>我的預約</span>
                  </button>
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-secondary-800 hidden md:block font-medium tracking-wide">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-5 py-2 rounded-full border border-stone-200 text-secondary-600 hover:bg-stone-50 hover:text-secondary-800 hover:border-stone-300 transition-all duration-300 text-sm font-medium"
                  >
                    登出
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="btn-primary px-6 py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 text-sm tracking-widest uppercase">
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
