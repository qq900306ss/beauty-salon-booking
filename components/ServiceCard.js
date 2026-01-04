import Link from 'next/link';

export default function ServiceCard({ service }) {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="text-6xl mb-4 text-center">{service.image}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{service.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-500 text-sm">⏱️ {service.duration} 分鐘</span>
        <span className="text-primary-600 font-bold text-lg">NT$ {service.price}</span>
      </div>
      <Link href={`/booking?serviceId=${service.id}`}>
        <button className="btn-primary w-full">
          立即預約
        </button>
      </Link>
    </div>
  );
}
