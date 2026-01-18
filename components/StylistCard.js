export default function StylistCard({ stylist, selected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(stylist.id)}
      className={`group cursor-pointer transition-all duration-300 bg-white rounded-2xl overflow-hidden border ${selected
          ? 'ring-2 ring-primary-400 border-transparent shadow-xl transform -translate-y-1'
          : 'border-stone-200 hover:border-primary-200 hover:shadow-lg hover:-translate-y-1'
        }`}
    >
      <div className="flex items-center gap-5 p-5">
        <div className="relative">
          {stylist.avatar ? (
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-stone-100 flex-shrink-0">
              <img src={stylist.avatar} alt={stylist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-4xl border-2 border-stone-100">👨‍🎨</div>
          )}
          {selected && (
            <div className="absolute -right-1 -bottom-1 bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-xs">✓</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className={`text-lg font-serif font-bold transition-colors ${selected ? 'text-primary-700' : 'text-secondary-800'}`}>
            {stylist.name}
          </h3>
          <p className="text-sm text-secondary-500 mb-2 line-clamp-2 leading-relaxed">{stylist.description}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {stylist.specialty && (
              <span className="text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">{stylist.specialty}</span>
            )}
            {stylist.experience > 0 && (
              <span className="text-secondary-400 bg-stone-100 px-2 py-0.5 rounded-full">經驗 {stylist.experience} 年</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
