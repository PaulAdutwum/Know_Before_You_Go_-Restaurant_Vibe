import { useState } from 'react';

function RestaurantCard({ restaurant, userLocation }) {
  const { name, rating, trueSentiment, vibeCheck, mustTryDishes, commonComplaints, address, distance } = restaurant;
  const [showChart, setShowChart] = useState(false);

  // Calculate sentiment color
  const sentimentValue = parseInt(trueSentiment);
  
  // Get card border color based on sentiment
  const getCardBorderColor = () => {
    if (sentimentValue >= 85) return 'border-success-500 hover:border-success-400';
    if (sentimentValue >= 70) return 'border-yellow-500 hover:border-yellow-400';
    if (sentimentValue >= 50) return 'border-orange-500 hover:border-orange-400';
    return 'border-red-500 hover:border-red-400';
  };

  // Get header gradient based on sentiment
  const getHeaderGradient = () => {
    if (sentimentValue >= 85) return 'from-success-600 via-success-500 to-success-600';
    if (sentimentValue >= 70) return 'from-yellow-600 via-yellow-500 to-yellow-600';
    if (sentimentValue >= 50) return 'from-orange-600 via-orange-500 to-orange-600';
    return 'from-red-600 via-red-500 to-red-600';
  };

  // Get sentiment badge gradient
  const getSentimentBadgeGradient = () => {
    if (sentimentValue >= 85) return 'from-success-500 to-success-600';
    if (sentimentValue >= 70) return 'from-yellow-500 to-yellow-600';
    if (sentimentValue >= 50) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  // Check if data is available
  const hasMLData = trueSentiment !== "N/A" && vibeCheck && vibeCheck[0] !== "#NoReviewsAvailable";

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-850 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 ${hasMLData ? getCardBorderColor() : 'border-gray-700 hover:border-gray-600'} transition-all duration-500 transform hover:-translate-y-1`}>
      {/* Header Section */}
      <div className={`bg-gradient-to-r ${hasMLData ? getHeaderGradient() : 'from-gray-700 via-gray-600 to-gray-700'} p-5 relative overflow-hidden`}>
        {/* Subtle animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
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
                <div className={`flex items-center gap-2 bg-gradient-to-r ${getSentimentBadgeGradient()} px-4 py-1.5 rounded-full border border-white/40 shadow-lg`}>
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

      {/* Content Section */}
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
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-black text-base flex items-center gap-2">
                <span className="text-xl">✨</span>
                Vibe Check
              </h4>
              <button
                onClick={() => setShowChart(!showChart)}
                className="text-xs bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold px-3 py-1.5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {showChart ? '📊 Hide' : '📊 Chart'}
              </button>
            </div>

            {/* Sentiment Chart - FIXED COLORS */}
            {showChart && (
              <div className="mb-4 bg-gray-900/90 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-300 font-bold text-xs mb-3 uppercase tracking-wide">Sentiment Breakdown</p>
                <div className="space-y-3">
                  {/* POSITIVE - GREEN */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-success-400 font-bold w-20">✓ Positive</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-5 overflow-hidden border border-gray-700">
                      <div 
                        className="bg-gradient-to-r from-success-500 to-success-600 h-full rounded-full transition-all duration-700 shadow-md" 
                        style={{width: `${sentimentValue || 60}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-success-400 font-black w-12 text-right">{sentimentValue || 60}%</span>
                  </div>
                  
                  {/* NEUTRAL - BLUE */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-primary-400 font-bold w-20">− Neutral</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-5 overflow-hidden border border-gray-700">
                      <div 
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-700 shadow-md" 
                        style={{width: `${100 - (sentimentValue || 60) - 10}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-primary-400 font-black w-12 text-right">{100 - (sentimentValue || 60) - 10}%</span>
                  </div>
                  
                  {/* NEGATIVE - RED */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-400 font-bold w-20">✕ Negative</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-5 overflow-hidden border border-gray-700">
                      <div className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all duration-700 shadow-md" style={{width: '10%'}}></div>
                    </div>
                    <span className="text-sm text-red-400 font-black w-12 text-right">10%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Vibe Tags */}
            <div className="flex flex-wrap gap-2">
              {vibeCheck.map((vibe, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-primary-400/50"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Must-Try Dishes Section */}
        {hasMLData && mustTryDishes && mustTryDishes.length > 0 && (
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
            <h4 className="text-white font-black text-base mb-3 flex items-center gap-2">
              <span className="text-xl">🍴</span>
              Must-Try Dishes
            </h4>
            <ul className="space-y-2">
              {mustTryDishes.map((dish, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-white bg-success-900/30 border border-success-600/50 px-3 py-2 rounded-lg hover:border-success-500 transition-all duration-300 transform hover:translate-x-1"
                >
                  <span className="text-success-400 font-bold text-base">▸</span>
                  <span className="font-medium text-sm">{dish}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Complaints Section */}
        {hasMLData && commonComplaints && commonComplaints.length > 0 && (
          <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700">
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
      <div className="px-5 py-3 bg-gray-900/90 border-t border-gray-700">
        <p className="text-xs text-gray-400 text-center font-semibold">
          {hasMLData ? '🤖 AI analysis from hundreds of reviews' : '📊 Data from Google Places'}
        </p>
      </div>
    </div>
  );
}

export default RestaurantCard;
