import { useState } from 'react';

function RestaurantCard({ restaurant, userLocation }) {
  const { name, rating, trueSentiment, vibeCheck, mustTryDishes, commonComplaints, address, distance } = restaurant;
  const [showChart, setShowChart] = useState(false);

  // Calculate sentiment value for chart
  const sentimentValue = parseInt(trueSentiment);

  // Check if data is available
  const hasMLData = trueSentiment !== "N/A" && vibeCheck && vibeCheck[0] !== "#NoReviewsAvailable";

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700 hover:border-blue-500 transition-all duration-500 transform hover:-translate-y-1">
      {/* Header Section - BLUISH THEME */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 p-5 relative overflow-hidden">
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse-slow"></div>
        </div>

        <div className="relative z-10">
          {/* Restaurant Name & Rating */}
          <div className="mb-3">
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
              {name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                <span className="text-xl">⭐</span>
                <span className="text-white font-bold text-base">{rating}</span>
              </div>
              {distance && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30">
                  <span className="text-white text-sm">📍</span>
                  <span className="text-white font-semibold text-sm">{distance}</span>
                </div>
              )}
              {hasMLData && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40">
                  <span className="text-white font-black text-base">{trueSentiment}</span>
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          {address && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
              <p className="text-white/90 text-xs font-medium flex items-start gap-1">
                <span className="text-sm">📍</span>
                <span>{address}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content Section - BLUISH DARK */}
      <div className="p-5 space-y-4">
        {!hasMLData && (
          <div className="bg-yellow-900/30 border-2 border-yellow-600/50 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="text-yellow-300 font-bold text-sm mb-1">Limited Review Data</p>
                <p className="text-yellow-200/80 text-xs leading-relaxed">
                  Try searching popular locations for full AI insights!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vibe Check Section */}
        {hasMLData && vibeCheck && vibeCheck.length > 0 && (
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-600">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-black text-base flex items-center gap-2">
                <span className="text-xl">✨</span>
                Vibe Check
              </h4>
              <button
                onClick={() => setShowChart(!showChart)}
                className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-3 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {showChart ? '📊 Hide' : '📊 Chart'}
              </button>
            </div>

            {/* Sentiment Chart - FIXED COLORS & VISIBILITY */}
            {showChart && (
              <div className="mb-4 bg-slate-900/90 p-4 rounded-lg border border-slate-700">
                <p className="text-gray-200 font-bold text-xs mb-3 uppercase tracking-wide">Sentiment Breakdown</p>
                <div className="space-y-3">
                  {/* POSITIVE - GREEN (white text, green bar) */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-bold w-20">✓ Positive</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden border border-slate-700">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-700 shadow-md" 
                        style={{width: `${sentimentValue || 60}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-green-400 font-black w-12 text-right">{sentimentValue || 60}%</span>
                  </div>
                  
                  {/* NEUTRAL - BLUE (white text, blue bar) */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-bold w-20">− Neutral</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden border border-slate-700">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700 shadow-md" 
                        style={{width: `${100 - (sentimentValue || 60) - 10}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-blue-400 font-black w-12 text-right">{100 - (sentimentValue || 60) - 10}%</span>
                  </div>
                  
                  {/* NEGATIVE - RED (white text, red bar) */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white font-bold w-20">✕ Negative</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-5 overflow-hidden border border-slate-700">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-700 shadow-md" style={{width: '10%'}}></div>
                    </div>
                    <span className="text-sm text-red-400 font-black w-12 text-right">10%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Vibe Tags - Bluish */}
            <div className="flex flex-wrap gap-2">
              {vibeCheck.map((vibe, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-400/50"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Must-Try Dishes Section */}
        {hasMLData && mustTryDishes && mustTryDishes.length > 0 && (
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-600">
            <h4 className="text-white font-black text-base mb-3 flex items-center gap-2">
              <span className="text-xl">🍴</span>
              Must-Try Dishes
            </h4>
            <ul className="space-y-2">
              {mustTryDishes.map((dish, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-white bg-green-900/30 border border-green-600/50 px-3 py-2 rounded-lg hover:border-green-500 transition-all duration-300 transform hover:translate-x-1"
                >
                  <span className="text-green-400 font-bold text-base">▸</span>
                  <span className="font-medium text-sm">{dish}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Complaints Section */}
        {hasMLData && commonComplaints && commonComplaints.length > 0 && (
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-600">
            <h4 className="text-white font-black text-base mb-3 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Heads Up
            </h4>
            <ul className="space-y-2">
              {commonComplaints.map((complaint, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-white bg-red-900/30 border border-red-600/50 px-3 py-2 rounded-lg hover:border-red-500 transition-all duration-300"
                >
                  <span className="text-red-400 font-bold text-base">•</span>
                  <span className="font-medium text-sm">{complaint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-slate-900/90 border-t border-slate-700">
        <p className="text-xs text-gray-300 text-center font-semibold">
          {hasMLData ? '🤖 AI analysis from hundreds of reviews' : '📊 Data from Google Places'}
        </p>
      </div>
    </div>
  );
}

export default RestaurantCard;
