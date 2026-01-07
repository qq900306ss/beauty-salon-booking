import { useBranding } from '../hooks/useBranding';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export default function Header() {
  const { branding } = useBranding();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              {branding.logo ? (
                <img
                  src={branding.logo}
                  alt={branding.name}
                  className="h-12 w-auto object-contain"
                />
              ) : (
                <span className="text-3xl">✨</span>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-primary-600">
                  {branding.name}
                </h1>
                <p className="text-gray-600 text-sm hidden sm:block">
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
                  <button className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    📋 我的預約
                  </button>
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-gray-700 hidden md:block">
                    👋 {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    登出
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  登入
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
