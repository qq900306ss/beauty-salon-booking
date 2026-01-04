export default function StylistCard({ stylist, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(stylist.id)}
      className={`card cursor-pointer transition-all duration-200 ${
        selected ? 'border-primary-500 border-2 bg-primary-50' : 'hover:border-primary-300'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl">{stylist.image}</div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{stylist.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{stylist.description}</p>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-yellow-500">⭐ {stylist.rating}</span>
            <span className="text-gray-500">經驗 {stylist.experience} 年</span>
          </div>
        </div>
      </div>
    </div>
  );
}
