import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Confirmation() {
  const router = useRouter();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (router.query.data) {
      try {
        const data = JSON.parse(router.query.data);
        setBooking(data);
      } catch (error) {
        console.error('Error parsing booking data:', error);
      }
    }
  }, [router.query.data]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>預約確認 - 琳達髮廊</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              琳達髮廊
            </Link>
          </div>
        </header>

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
            </div>

            {/* Booking Details */}
            <div className="card space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">預約詳情</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-lg">
                  <div className="text-4xl">{booking.service.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{booking.service.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{booking.service.description}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>⏱️ {booking.service.duration} 分鐘</span>
                      <span className="font-bold text-primary-600">NT$ {booking.service.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-lg">
                  <div className="text-4xl">{booking.stylist.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">{booking.stylist.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{booking.stylist.description}</p>
                    <div className="flex gap-3 mt-2 text-sm text-gray-600">
                      <span>⭐ {booking.stylist.rating}</span>
                      <span>經驗 {booking.stylist.experience} 年</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">預約日期</div>
                    <div className="font-bold text-gray-800">📅 {booking.date}</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">預約時間</div>
                    <div className="font-bold text-gray-800">🕐 {booking.time}</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-2">聯絡資訊</h3>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>👤 姓名：{booking.customer.name}</p>
                    <p>📱 電話：{booking.customer.phone}</p>
                    {booking.customer.email && <p>📧 信箱：{booking.customer.email}</p>}
                    {booking.customer.notes && (
                      <div className="mt-2">
                        <p className="font-semibold">備註：</p>
                        <p className="text-gray-600 mt-1">{booking.customer.notes}</p>
                      </div>
                    )}
                  </div>
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
