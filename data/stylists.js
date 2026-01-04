export const stylists = [
  {
    id: 1,
    name: 'Amy 老師',
    specialty: ['hair', 'facial'],
    experience: 8,
    rating: 4.9,
    image: '👩‍🦰',
    description: '擁有8年經驗的資深髮型設計師，擅長各種髮型設計與臉部護理'
  },
  {
    id: 2,
    name: 'Bella 老師',
    specialty: ['nail', 'eyelash'],
    experience: 5,
    rating: 4.8,
    image: '👩‍🦱',
    description: '專業美甲美睫師，細心溫柔，深受客戶喜愛'
  },
  {
    id: 3,
    name: 'Cindy 老師',
    specialty: ['hair', 'tattoo'],
    experience: 10,
    rating: 5.0,
    image: '👩',
    description: '資深設計師，擅長染燙與半永久紋繡，作品精緻細膩'
  },
  {
    id: 4,
    name: 'Diana 老師',
    specialty: ['facial'],
    experience: 6,
    rating: 4.7,
    image: '👩‍🦳',
    description: '專業美容師，擁有豐富的皮膚護理經驗'
  }
];

export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 10; hour <= 19; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time: timeString,
        available: Math.random() > 0.3 // 70% 的時段可預約
      });
    }
  }
  return slots;
};
