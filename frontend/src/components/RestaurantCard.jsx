import { useState } from 'react';
import PhotoGalleryModal from './PhotoGalleryModal';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= Math.round(rating) ? 'text-amber-300/60' : 'text-white/15'}`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-slate-400">{rating}</span>
    </div>
  );
}

function RestaurantCard({ restaurant }) {
  const [showGallery, setShowGallery] = useState(false);

  const allPhotos = restaurant.photos?.length > 0
    ? restaurant.photos
    : restaurant.photo_url
      ? [restaurant.photo_url]
      : [];

  const directionsUrl = restaurant.lat && restaurant.lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(restaurant.address || restaurant.name)}`;

  const menuUrl = restaurant.website
    ? restaurant.website
    : `https://www.google.com/search?q=${encodeURIComponent(restaurant.name + ' menu')}`;

  const reserveUrl = `https://www.opentable.com/s/?covers=2&term=${encodeURIComponent(restaurant.name)}`;

  return (
    <>
      <div
        className="rounded-3xl border border-white/10 bg-black/80 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition duration-300 hover:border-white/20 hover:shadow-[0_24px_80px_rgba(217,119,0,0.12)] flex flex-col gap-0"
      >
        {/* Name + Rating */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl font-semibold text-white leading-snug">{restaurant.name}</h3>
          {restaurant.rating > 0 && <StarRating rating={restaurant.rating} />}
        </div>

        {/* Address + Distance + Directions */}
        {restaurant.address && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-4">
            <span className="text-sm text-slate-400 leading-none">{restaurant.address}</span>
            {restaurant.distance && (
              <>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-sm text-slate-400 shrink-0">{restaurant.distance}</span>
              </>
            )}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-xs font-semibold text-amber-300/60 hover:text-amber-200/70 border border-amber-400/30 hover:border-amber-400/60 rounded-full px-2.5 py-0.5 transition"
            >
              Directions ↗
            </a>
          </div>
        )}

        {/* Neighborhood note */}
        {restaurant.neighborhoodNote && (
          <p className="text-xs text-slate-500 mb-4">
            📍 {restaurant.neighborhoodNote}
          </p>
        )}

        {/* Vibe description */}
        {restaurant.vibeDescription && (
          <div className="border-t border-white/5 pt-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70 mb-1.5">Vibe</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {restaurant.vibeDescription}
            </p>
          </div>
        )}

        {/* Best for / Skip if */}
        {(restaurant.bestFor?.length > 0 || restaurant.skipIf?.length > 0) && (
          <div className="border-t border-white/5 pt-4 mb-4 space-y-2">
            {restaurant.bestFor?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Best for:</span>
                {restaurant.bestFor.map((item, i) => (
                  <span
                    key={i}
                    className="bg-green-400/10 text-green-300 border border-green-400/20 text-xs px-2.5 py-0.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            {restaurant.skipIf?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold shrink-0">Skip if:</span>
                {restaurant.skipIf.map((item, i) => (
                  <span
                    key={i}
                    className="bg-orange-400/10 text-orange-300 border border-orange-400/20 text-xs px-2.5 py-0.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* True Sentiment */}
        {restaurant.trueSentiment && (
          <div className="border-t border-white/5 pt-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70 mb-1">True Sentiment</p>
            <p className="text-sm text-slate-300">{restaurant.trueSentiment}</p>
          </div>
        )}

        {/* Must Try */}
        {restaurant.mustTryDishes?.length > 0 && (
          <div className="border-t border-white/5 pt-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70 mb-1">Must Try</p>
            <p className="text-sm text-slate-300 leading-relaxed">
              {restaurant.mustTryDishes.join(' · ')}
            </p>
          </div>
        )}

        {/* Heads Up */}
        {restaurant.commonComplaints?.length > 0 && (
          <div className="border-t border-white/5 pt-4 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-red-400/80 mb-2">Heads Up</p>
            <ul className="space-y-1">
              {restaurant.commonComplaints.map((complaint, idx) => (
                <li key={idx} className="text-sm text-slate-400 flex items-start gap-2">
                  <span className="text-red-400/60 mt-0.5 shrink-0">!</span>
                  <span className="line-clamp-2">{complaint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2 mt-auto">
          {allPhotos.length > 0 && (
            <button
              onClick={() => setShowGallery(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 transition"
            >
              📷 Photos{allPhotos.length > 1 ? ` (${allPhotos.length})` : ''}
            </button>
          )}
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 transition"
          >
            📋 {restaurant.website ? 'Menu / Website' : 'Find Menu'} ↗
          </a>
          <a
            href={reserveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-200/70 hover:bg-amber-400/20 hover:border-amber-400/40 transition"
          >
            Reserve ↗
          </a>
        </div>
      </div>

      {showGallery && (
        <PhotoGalleryModal
          photos={allPhotos}
          restaurantName={restaurant.name}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}

export default RestaurantCard;
