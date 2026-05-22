function RestaurantCard({ restaurant }) {
  const sentimentColor =
    restaurant.trueSentiment?.toLowerCase().includes('great') ||
    restaurant.trueSentiment?.toLowerCase().includes('love') ||
    restaurant.trueSentiment?.toLowerCase().includes('excellent')
      ? 'border-l-green-500/40'
      : restaurant.trueSentiment?.toLowerCase().includes('mixed')
      ? 'border-l-amber-500/40'
      : 'border-l-white/10';

  return (
    <div
      className={`rounded-3xl border border-white/10 border-l-4 ${sentimentColor} bg-black/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition duration-300 hover:border-amber-400/20 hover:shadow-[0_24px_80px_rgba(217,119,0,0.12)]`}
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-white mb-1">{restaurant.name}</h3>
        {restaurant.rating && (
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-sm ${star <= Math.round(restaurant.rating) ? 'text-amber-400' : 'text-white/15'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-slate-400">{restaurant.rating}/5.0</span>
          </div>
        )}
      </div>

      {/* Sentiment */}
      {restaurant.trueSentiment && (
        <div className="border-t border-white/5 pt-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-1">True Sentiment</p>
          <p className="text-sm text-slate-300 leading-relaxed">{restaurant.trueSentiment}</p>
        </div>
      )}

      {/* Vibe tags */}
      {restaurant.vibeCheck && restaurant.vibeCheck.length > 0 && (
        <div className="border-t border-white/5 pt-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2">Vibe</p>
          <div className="flex flex-wrap gap-2">
            {restaurant.vibeCheck.map((tag, idx) => (
              <span key={idx} className="bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Must-try dishes */}
      {restaurant.mustTryDishes && restaurant.mustTryDishes.length > 0 && (
        <div className="border-t border-white/5 pt-4 mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-300 mb-2">Must Try</p>
          <ul className="space-y-1">
            {restaurant.mustTryDishes.map((dish, idx) => (
              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">✦</span>
                {dish}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Complaints */}
      {restaurant.commonComplaints && restaurant.commonComplaints.length > 0 && (
        <div className="border-t border-white/5 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400/80 mb-2">Heads Up</p>
          <ul className="space-y-1">
            {restaurant.commonComplaints.map((complaint, idx) => (
              <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                <span className="text-red-400/60 mt-0.5">!</span>
                {complaint}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RestaurantCard;
