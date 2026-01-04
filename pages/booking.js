import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { serviceService } from '../lib/services/service.service';
import { stylistService } from '../lib/services/stylist.service';
import { bookingService } from '../lib/services/booking.service';
import StylistCard from '../components/StylistCard';
import { useAuth } from '../contexts/AuthContext';

export default function Booking() {
  const router = useRouter();
  const { serviceId } = router.query;
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // 檢查登入狀態
  useEffect(() => {
    if (!isAuthenticated()) {
      // 保存當前嘗試預約的服務ID
      if (serviceId) {
        localStorage.setItem('pendingBooking', serviceId);
      }
      router.push('/login');
    }
  }, [isAuthenticated, router, serviceId]);

  // 從用戶資料自動填入
  useEffect(() => {
    if (user) {
      setCustomerInfo({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        notes: ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === parseInt(serviceId));
      if (service) {
        setSelectedService(service);
      }
    }
  }, [serviceId, services]);

  useEffect(() => {
    if (selectedDate && selectedStylist && selectedService) {
      generateAvailableTimeSlots();
    }
  }, [selectedDate, selectedStylist, selectedService]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [servicesData, stylistsData] = await Promise.all([
        serviceService.getAll(),
        stylistService.getAll(),
      ]);
      setServices(servicesData.filter(s => s.is_active));
      setStylists(stylistsData.filter(s => s.is_active));
    } catch (err) {
      console.error('Failed to fetch data:', err);
      alert('載入資料失敗，請重新整理頁面');
    } finally {
      setLoading(false);
    }
  };

  const generateAvailableTimeSlots = async () => {
    if (!selectedService) {
      setTimeSlots([]);
      return;
    }

    try {
      // Call backend API to get available slots
      const slots = await stylistService.getAvailableSlots(
        selectedStylist,
        selectedDate,
        selectedService.duration
      );
      setTimeSlots(slots);
    } catch (err) {
      console.error('Failed to fetch available slots:', err);
      setTimeSlots([]);
    }
  };

  const filteredStylists = selectedService
    ? stylists.filter(stylist => stylist.specialty?.includes(selectedService.category) || true)
    : stylists;

  const handleNext = () => {
    if (step === 1 && !selectedService) {
      alert('請選擇服務項目');
      return;
    }
    if (step === 2 && !selectedStylist) {
      alert('請選擇設計師');
      return;
    }
    if (step === 3 && (!selectedDate || !selectedTime)) {
      alert('請選擇日期和時間');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert('請填寫必填資訊');
      return;
    }

    try {
      setSubmitting(true);

      // Format booking data for API
      const bookingData = {
        service_id: selectedService.id,
        stylist_id: selectedStylist,
        booking_date: selectedDate,
        booking_time: selectedTime,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: customerInfo.email || '',
        notes: customerInfo.notes || '',
      };

      const result = await bookingService.create(bookingData);

      // Navigate to confirmation with booking ID
      router.push({
        pathname: '/confirmation',
        query: { bookingId: result.id }
      });
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert(err.response?.data?.error || '預約失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.setDate(today.getDate() + 30));
    return maxDate.toISOString().split('T')[0];
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

  return (
    <>
      <Head>
        <title>預約服務 - 琳達髮廊</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-6">
            <Link href="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700">
              ← 琳達髮廊
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-center items-center gap-4">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= num ? 'bg-primary-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {num}
                  </div>
                  {num < 4 && <div className={`w-16 h-1 ${step > num ? 'bg-primary-500' : 'bg-gray-300'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-20 mt-2 text-sm text-gray-600">
              <span className={step === 1 ? 'font-bold text-primary-600' : ''}>選擇服務</span>
              <span className={step === 2 ? 'font-bold text-primary-600' : ''}>選擇設計師</span>
              <span className={step === 3 ? 'font-bold text-primary-600' : ''}>選擇時間</span>
              <span className={step === 4 ? 'font-bold text-primary-600' : ''}>填寫資訊</span>
            </div>
          </div>

          {/* Step 1: Select Service */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">選擇服務項目</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {services.map(service => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`card cursor-pointer transition-all duration-200 ${
                      selectedService?.id === service.id
                        ? 'border-primary-500 border-2 bg-primary-50'
                        : 'hover:border-primary-300'
                    }`}
                  >
                    {service.image_url ? (
                      <div className="mb-4 h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img src={service.image_url} alt={service.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="text-6xl mb-4 text-center">💆‍♀️</div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">⏱️ {service.duration} 分鐘</span>
                      <span className="text-primary-600 font-bold">NT$ {service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Stylist */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">選擇設計師</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {filteredStylists.map(stylist => (
                  <StylistCard
                    key={stylist.id}
                    stylist={stylist}
                    selected={selectedStylist === stylist.id}
                    onSelect={setSelectedStylist}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">選擇日期與時間</h2>
              <div className="max-w-2xl mx-auto">
                <div className="card mb-6">
                  <label className="block text-lg font-semibold mb-3 text-gray-700">選擇日期</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime(''); // Reset time when date changes
                    }}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {selectedDate && (
                  <div className="card">
                    <label className="block text-lg font-semibold mb-3 text-gray-700">選擇時間</label>
                    {timeSlots.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">此設計師當天休息，請選擇其他日期</p>
                    ) : (
                      <div className="grid grid-cols-4 gap-3">
                        {timeSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
                            className={`py-3 rounded-lg font-medium transition-all duration-200 ${
                              selectedTime === slot.time
                                ? 'bg-primary-500 text-white shadow-lg'
                                : slot.available
                                ? 'bg-white border border-gray-300 hover:bg-primary-100'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Customer Info */}
          {step === 4 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">填寫聯絡資訊</h2>
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                <div className="card space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      電話 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">電子郵件</label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">備註</label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="有任何特殊需求或問題嗎？"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                    disabled={submitting}
                  >
                    上一步
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? '處理中...' : '確認預約'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-4 max-w-2xl mx-auto mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  上一步
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex-1 btn-primary"
              >
                下一步
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
