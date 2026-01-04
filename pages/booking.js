import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { services } from '../data/services';
import { stylists, generateTimeSlots } from '../data/stylists';
import StylistCard from '../components/StylistCard';

export default function Booking() {
  const router = useRouter();
  const { serviceId } = router.query;

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  useEffect(() => {
    if (serviceId) {
      const service = services.find(s => s.id === parseInt(serviceId));
      setSelectedService(service);
    }
  }, [serviceId]);

  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots());
    }
  }, [selectedDate]);

  const filteredStylists = selectedService
    ? stylists.filter(stylist =>
        stylist.specialty.includes(selectedService.category)
      )
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerInfo.name || !customerInfo.phone) {
      alert('請填寫必填資訊');
      return;
    }

    const booking = {
      service: selectedService,
      stylist: stylists.find(s => s.id === selectedStylist),
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo
    };

    router.push({
      pathname: '/confirmation',
      query: { data: JSON.stringify(booking) }
    });
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
                    <div className="text-6xl mb-4 text-center">{service.image}</div>
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
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
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {selectedDate && (
                  <div className="card">
                    <label className="block text-lg font-semibold mb-3 text-gray-700">選擇時間</label>
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
                  >
                    上一步
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    確認預約
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
