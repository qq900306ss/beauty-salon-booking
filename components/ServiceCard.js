import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

export default function ServiceCard({ service }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleBooking = (e) => {
    if (!isAuthenticated()) {
      e.preventDefault();
      // 保存要預約的服務ID，登入後跳轉回來
      localStorage.setItem('pendingBooking', service.id.toString());
      router.push('/login');
    }
  };
  // Fallback emoji based on category or name
  const getDefaultEmoji = () => {
    const name = service.name?.toLowerCase() || '';
    const category = service.category?.toLowerCase() || '';

    if (name.includes('剪髮') || name.includes('剪发')) return '💇‍♀️';
    if (name.includes('染髮') || name.includes('染发')) return '🎨';
    if (name.includes('燙髮') || name.includes('烫发')) return '〰️';
    if (name.includes('護髮') || name.includes('护发')) return '✨';
    if (name.includes('臉部') || category.includes('facial')) return '🧖‍♀️';
    if (name.includes('美甲') || category.includes('nail')) return '💅';
    if (name.includes('美睫') || category.includes('eyelash')) return '👁️';
    if (name.includes('紋繡') || category.includes('tattoo')) return '✏️';
    return '💆‍♀️';
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-stone-100 hover:border-primary-100 flex flex-col h-full transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {service.image_url ? (
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl shadow-inner bg-stone-50">
            {getDefaultEmoji()}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-serif font-bold mb-2 text-secondary-800 group-hover:text-primary-600 transition-colors">
            {service.name}
          </h3>
          <p className="text-secondary-500 text-sm line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-5 pt-4 border-t border-stone-100">
            <span className="text-secondary-500 text-sm flex items-center gap-1 font-medium bg-stone-50 px-3 py-1 rounded-full">
              ⏱️ {service.duration} min
            </span>
            <span className="text-primary-600 font-serif font-bold text-xl">
              NT$ {service.price}
            </span>
          </div>
          <Link href={`/booking?serviceId=${service.id}`} onClick={handleBooking}>
            <button className="w-full bg-secondary-800 hover:bg-primary-500 text-white py-3 rounded-xl font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:tracking-wide">
              <span>立即預約</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
