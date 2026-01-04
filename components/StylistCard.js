export default function StylistCard({ stylist, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(stylist.id)}
      className={`card cursor-pointer transition-all duration-200 ${
        selected ? 'border-primary-500 border-2 bg-primary-50' : 'hover:border-primary-300'
      }`}
    >
      <div className="flex items-start gap-4">
        {stylist.avatar ? (
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img src={stylist.avatar} alt={stylist.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="text-5xl flex-shrink-0">👨‍🎨</div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">{stylist.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{stylist.description}</p>
          <div className="flex items-center gap-3 text-sm">
            {stylist.specialty && (
              <span className="text-primary-600 font-medium">{stylist.specialty}</span>
            )}
            {stylist.experience > 0 && (
              <span className="text-gray-500">經驗 {stylist.experience} 年</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
