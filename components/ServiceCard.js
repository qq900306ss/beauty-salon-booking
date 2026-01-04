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
    <div className="card hover:shadow-xl transition-shadow duration-300">
      {service.image_url ? (
        <div className="mb-4 h-40 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="text-6xl mb-4 text-center">{getDefaultEmoji()}</div>
      )}
      <h3 className="text-xl font-bold mb-2 text-gray-800">{service.name}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 text-sm">⏱️ {service.duration} 分鐘</span>
        <span className="text-primary-600 font-bold text-lg">NT$ {service.price}</span>
      </div>
      <Link href={`/booking?serviceId=${service.id}`} onClick={handleBooking}>
        <button className="btn-primary w-full">
          立即預約
        </button>
      </Link>
    </div>
  );
}
