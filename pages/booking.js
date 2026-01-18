import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { serviceService } from '../lib/services/service.service';
import { stylistService } from '../lib/services/stylist.service';
import { bookingService } from '../lib/services/booking.service';
import StylistCard from '../components/StylistCard';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { useBranding } from '../hooks/useBranding';

export default function Booking() {
  const router = useRouter();
  const { serviceId } = router.query;
  const { user, isAuthenticated } = useAuth();
  const { branding } = useBranding();

  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]); // 改為陣列支援多選
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
        setSelectedServices([service]); // 改為陣列
      }
    }
  }, [serviceId, services]);

  useEffect(() => {
    if (selectedDate && selectedStylist && selectedServices.length > 0) {
      generateAvailableTimeSlots();
    }
  }, [selectedDate, selectedStylist, selectedServices]);

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
    if (selectedServices.length === 0) {
      setTimeSlots([]);
      return;
    }

    // 計算所有服務的總時長
    const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

    try {
      // Call backend API to get available slots
      const slots = await stylistService.getAvailableSlots(
        selectedStylist,
        selectedDate,
        totalDuration
      );

      // 過濾掉已經過去的時間
      const now = new Date();
      const selectedDateObj = new Date(selectedDate);
      const isToday = selectedDateObj.toDateString() === now.toDateString();

      let filteredSlots = slots;
      if (isToday) {
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        filteredSlots = slots.map(slot => {
          // 如果時間已經過去，標記為不可用
          if (slot.time <= currentTime) {
            return { ...slot, available: false };
          }
          return slot;
        });
      }

      setTimeSlots(filteredSlots);
    } catch (err) {
      console.error('Failed to fetch available slots:', err);
      setTimeSlots([]);
    }
  };

  const filteredStylists = stylists;

  // 計算總價格和總時長
  const getTotalPrice = () => selectedServices.reduce((sum, service) => sum + service.price, 0);
  const getTotalDuration = () => selectedServices.reduce((sum, service) => sum + service.duration, 0);

  const handleNext = () => {
    if (step === 1 && selectedServices.length === 0) {
      alert('請至少選擇一項服務');
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
    if (!customerInfo.name) {
      alert('請填寫姓名');
      return;
    }

    try {
      setSubmitting(true);

      // Format booking data for API
      const bookingData = {
        service_ids: selectedServices.map(s => s.id), // 改為陣列
        stylist_id: selectedStylist,
        date: selectedDate,
        start_time: selectedTime,
        notes: customerInfo.notes || '',
        customer_name: customerInfo.name || '',
        customer_phone: customerInfo.phone || '',
        customer_email: customerInfo.email || '',
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
        <title>預約服務 - {branding.name}</title>
      </Head>

      <div className="min-h-screen bg-stone-50">
        <Header />

        <div className="container mx-auto px-4 py-12 lg:py-16">
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex justify-center items-center max-w-3xl mx-auto">
              {[1, 2, 3, 4].map((num, index) => (
                <div key={num} className="flex items-center w-full last:w-auto">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-lg transition-all duration-500 z-10 ${step >= num
                        ? 'bg-primary-500 text-white shadow-lg scale-110'
                        : 'bg-white text-secondary-300 border-2 border-secondary-200'
                      }`}>
                      {num}
                    </div>
                    <span className={`absolute top-14 whitespace-nowrap text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${step === num ? 'text-primary-600' : 'text-secondary-400'
                      }`}>
                      {num === 1 && '選擇服務'}
                      {num === 2 && '選擇設計師'}
                      {num === 3 && '選擇時間'}
                      {num === 4 && '填寫資訊'}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 mx-4 transition-all duration-500 ${step > num ? 'bg-primary-300' : 'bg-secondary-200'
                      }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20">
            {/* Step 1: Select Service */}
            {step === 1 && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-secondary-800 mb-2 text-center">選擇服務項目</h2>
                <p className="text-secondary-500 text-center mb-10">請選擇您想要體驗的服務（可多選）</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 hover:gap-6">
                  {services.map(service => {
                    const isSelected = selectedServices.some(s => s.id === service.id);
                    return (
                      <div
                        key={service.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedServices(selectedServices.filter(s => s.id !== service.id));
                          } else {
                            setSelectedServices([...selectedServices, service]);
                          }
                        }}
                        className={`group cursor-pointer transition-all duration-300 relative rounded-2xl overflow-hidden border ${isSelected
                            ? 'bg-white ring-2 ring-primary-400 border-transparent shadow-xl transform -translate-y-1'
                            : 'bg-white border-stone-200 hover:border-primary-200 hover:shadow-lg hover:-translate-y-1'
                          }`}
                      >
                        {/* Checkbox indicator */}
                        <div className={`absolute top-4 right-4 z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? 'bg-primary-500 border-primary-500 scale-110' : 'bg-white/80 border-stone-300 backdrop-blur-sm'
                          }`}>
                          {isSelected && <span className="text-white text-xs">✓</span>}
                        </div>

                        {service.image_url ? (
                          <div className="h-40 overflow-hidden relative">
                            <img
                              src={service.image_url}
                              alt={service.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-primary-900/10 transition-opacity duration-300 ${isSelected ? 'opacity-20' : 'opacity-0'}`} />
                          </div>
                        ) : (
                          <div className="h-40 bg-stone-50 flex items-center justify-center text-5xl">💆‍♀️</div>
                        )}
                        <div className="p-5">
                          <h3 className="text-lg font-serif font-bold mb-2 text-secondary-800">{service.name}</h3>
                          <div className="flex justify-between items-end mt-4">
                            <span className="text-secondary-500 text-sm bg-stone-100 px-2 py-1 rounded-md">
                              ⏱️ {service.duration} min
                            </span>
                            <span className="text-primary-600 font-bold text-lg">
                              NT$ {service.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 顯示已選服務的總計 - Fixed Bottom Bar */}
                {selectedServices.length > 0 && (
                  <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] p-4 z-40 animate-slide-up">
                    <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-center sm:text-left">
                        <div className="text-sm text-secondary-500 mb-1">已選擇 {selectedServices.length} 項服務</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-serif font-bold text-secondary-800">NT$ {getTotalPrice()}</span>
                          <span className="text-secondary-400 text-sm">/ {getTotalDuration()} 分鐘</span>
                        </div>
                      </div>
                      <button
                        onClick={handleNext}
                        className="btn-primary w-full sm:w-auto min-w-[200px]"
                      >
                        下一步
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Stylist */}
            {step === 2 && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-secondary-800 mb-2 text-center">選擇設計師</h2>
                <p className="text-secondary-500 text-center mb-10">選擇您信賴的專屬設計師</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <h2 className="text-3xl font-serif font-bold text-secondary-800 mb-2 text-center">選擇日期與時間</h2>
                <p className="text-secondary-500 text-center mb-10">預約您方便的時段</p>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="col-span-1 md:col-span-5">
                    <div className="card h-full">
                      <label className="block text-lg font-serif font-bold mb-4 text-secondary-800">選擇日期</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                          setSelectedDate(e.target.value);
                          setSelectedTime('');
                        }}
                        min={getMinDate()}
                        max={getMaxDate()}
                        className="input-field cursor-pointer"
                      />
                      <div className="mt-4 text-sm text-secondary-500 leading-relaxed">
                        <p>• 請選擇未來 30 天內的日期</p>
                        <p>• 若當日無法預約，請嘗試其他日期</p>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-7">
                    {selectedDate ? (
                      <div className="card h-full min-h-[300px]">
                        <label className="block text-lg font-serif font-bold mb-4 text-secondary-800">
                          {selectedDate} 的可預約時段
                        </label>
                        {timeSlots.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-48 text-secondary-400">
                            <div className="text-4xl mb-2">😴</div>
                            <p>此設計師當天休息或已額滿</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {timeSlots.map((slot, index) => (
                              <button
                                key={index}
                                onClick={() => slot.available && setSelectedTime(slot.time)}
                                disabled={!slot.available}
                                className={`py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedTime === slot.time
                                    ? 'bg-primary-500 text-white shadow-md transform scale-105'
                                    : slot.available
                                      ? 'bg-stone-50 text-secondary-600 hover:bg-primary-50 hover:text-primary-600 border border-stone-100'
                                      : 'bg-stone-100 text-stone-300 cursor-not-allowed decoration-slice'
                                  }`}
                              >
                                {slot.time}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="card h-full flex flex-col items-center justify-center text-secondary-400 min-h-[300px]">
                        <span className="text-6xl mb-4 opacity-20">📅</span>
                        <p>請先選擇左側日期</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Customer Info */}
            {step === 4 && (
              <div>
                <h2 className="text-3xl font-serif font-bold text-secondary-800 mb-2 text-center">填寫聯絡資訊</h2>
                <p className="text-secondary-500 text-center mb-10">最後一步！請確認您的預約資訊</p>
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
                  <div className="card space-y-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold mb-2 text-secondary-700">
                          姓名 <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          className="input-field"
                          placeholder="例如：王小美"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2 text-secondary-700">電話</label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          className="input-field"
                          placeholder="例如：0912345678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-secondary-700">電子郵件</label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="input-field"
                        placeholder="例如：example@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-secondary-700">備註</label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                        rows="4"
                        className="input-field resize-none"
                        placeholder="有任何特殊需求或問題嗎？（選填）"
                      />
                    </div>
                  </div>

                  <div className="bg-primary-50 rounded-xl p-6 border border-primary-100 mb-8">
                    <h4 className="font-bold text-primary-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">📝</span> 預約摘要
                    </h4>
                    <div className="space-y-2 text-sm text-secondary-600">
                      <div className="flex justify-between">
                        <span>預約日期：</span>
                        <span className="font-bold text-secondary-800">{selectedDate} {selectedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>設計師：</span>
                        <span className="font-bold text-secondary-800">{filteredStylists.find(s => s.id === selectedStylist)?.name}</span>
                      </div>
                      <div className="border-t border-primary-200 my-2 pt-2">
                        {selectedServices.map(s => (
                          <div key={s.id} className="flex justify-between mb-1">
                            <span>{s.name}</span>
                            <span>NT$ {s.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold text-lg text-primary-700 pt-2 border-t-2 border-primary-200">
                        <span>總計</span>
                        <span>NT$ {getTotalPrice()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 btn-secondary"
                      disabled={submitting}
                    >
                      上一步
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      disabled={submitting}
                    >
                      {submitting ? '處理中...' : '確認預約'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Navigation Buttons for Step 2 & 3 */}
            {(step === 2 || step === 3) && (
              <div className="flex justify-center gap-4 max-w-2xl mx-auto mt-12">
                <button
                  onClick={() => setStep(step - 1)}
                  className="btn-secondary w-32"
                >
                  上一步
                </button>
                <button
                  onClick={handleNext}
                  className="btn-primary w-32"
                >
                  下一步
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
