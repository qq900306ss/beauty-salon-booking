import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { bookingService } from '../lib/services/booking.service';
import Header from '../components/Header';
import { useBranding } from '../hooks/useBranding';

export default function Confirmation() {
  const router = useRouter();
  const { bookingId } = router.query;
  const { branding } = useBranding();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getById(parseInt(bookingId));
      setBooking(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch booking:', err);
      setError('載入預約資料失敗');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-gray-600 mb-4">{error || '找不到預約資料'}</p>
          <Link href="/">
            <button className="btn-primary">返回首頁</button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      confirmed: 'text-green-600 bg-green-50 border-green-200',
      completed: 'text-blue-600 bg-blue-50 border-blue-200',
      cancelled: 'text-red-600 bg-red-50 border-red-200',
    };
    return colors[status] || colors.pending;
  };

  const getStatusText = (status) => {
    const texts = {
      pending: '待確認',
      confirmed: '已確認',
      completed: '已完成',
      cancelled: '已取消',
    };
    return texts[status] || status;
  };

  return (
    <>
      <Head>
        <title>預約確認 - {branding.name}</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <Header />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-block bg-green-100 rounded-full p-6 mb-4">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">預約成功！</h1>
              <p className="text-gray-600">我們已收到您的預約，期待為您服務</p>
              <div className={`inline-block mt-4 px-4 py-2 rounded-lg border-2 font-semibold ${getStatusColor(booking.status)}`}>
                {getStatusText(booking.status)}
              </div>
            </div>

            {/* Booking Details */}
            <div className="card space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">預約詳情</h2>
              </div>

              <div className="space-y-4">
                {/* Services Info */}
                <div className="p-4 bg-primary-50 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-3">預約服務</h3>
                  {booking.services && booking.services.length > 0 ? (
                    <div className="space-y-3">
                      {booking.services.map((service, idx) => (
                        <div key={idx} className="flex items-start gap-4">
                          <div className="text-2xl flex-shrink-0">💆‍♀️</div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{service.name}</h4>
                            <div className="flex gap-4 mt-1 text-sm text-gray-600">
                              <span>⏱️ {service.duration} 分鐘</span>
                              <span className="font-bold text-primary-600">NT$ {service.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="border-t border-primary-200 pt-3 mt-3 flex justify-between font-bold">
                        <span>總計</span>
                        <div className="text-right">
                          <div className="text-primary-600">NT$ {booking.price}</div>
                          <div className="text-sm text-gray-600">共 {booking.duration} 分鐘</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">沒有服務資訊</p>
                  )}
                </div>

                {/* Stylist Info */}
                <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg">
                  {booking.stylist.avatar ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img src={booking.stylist.avatar} alt={booking.stylist.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="text-4xl flex-shrink-0">👨‍🎨</div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{booking.stylist.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{booking.stylist.description}</p>
                    {booking.stylist.experience > 0 && (
                      <div className="text-sm text-gray-600 mt-2">
                        <span>經驗 {booking.stylist.experience} 年</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">預約日期</div>
                    <div className="font-bold text-gray-800">📅 {booking.booking_date}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">預約時間</div>
                    <div className="font-bold text-gray-800">🕐 {booking.booking_time}</div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">聯絡資訊</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>👤 姓名：{booking.customer_name}</p>
                    <p>📱 電話：{booking.customer_phone}</p>
                    {booking.customer_email && <p>📧 信箱：{booking.customer_email}</p>}
                    {booking.notes && (
                      <div className="mt-2">
                        <p className="font-semibold">備註：</p>
                        <p className="text-gray-600 mt-1">{booking.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking ID */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">預約編號</div>
                  <div className="font-mono font-bold text-gray-800">#{booking.id}</div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-800">
                  📌 請提前10分鐘到達，如需取消或變更預約，請至少提前24小時通知。
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Link href="/" className="block">
                <button className="btn-primary w-full">
                  返回首頁
                </button>
              </Link>
              <Link href="/booking" className="block">
                <button className="bg-white border-2 border-primary-500 text-primary-500 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium transition-colors w-full">
                  再次預約
                </button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>如有任何問題，歡迎聯絡我們</p>
              <p className="mt-2">
                <span className="font-semibold">電話：</span>02-1234-5678 ｜
                <span className="font-semibold"> 營業時間：</span>10:00 - 20:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
