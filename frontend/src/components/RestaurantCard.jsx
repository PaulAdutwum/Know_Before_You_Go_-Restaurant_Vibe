import { useState } from 'react';

function RestaurantCard({ restaurant, userLocation }) {
  const { name, rating, trueSentiment, vibeCheck, mustTryDishes, commonComplaints, address, distance } = restaurant;
  const [showChart, setShowChart] = useState(false);

  // Calculate sentiment color
  const sentimentValue = parseInt(trueSentiment);
  const getSentimentColor = () => {
    if (sentimentValue >= 80) return 'text-success-600';
    if (sentimentValue >= 60) return 'text-yellow-600';
    return 'text-accent-600';
  };

  const getSentimentBgColor = () => {
    if (sentimentValue >= 80) return 'bg-success-50 border-success-300';
    if (sentimentValue >= 60) return 'bg-yellow-50 border-yellow-300';
    return 'bg-accent-50 border-accent-300';
  };

  const getSentimentGradient = () => {
    if (sentimentValue >= 80) return 'from-success-400 to-success-600';
    if (sentimentValue >= 60) return 'from-yellow-400 to-yellow-600';
    return 'from-accent-400 to-accent-600';
  };

  // Check if data is available
  const hasMLData = trueSentiment !== "N/A" && vibeCheck && vibeCheck[0] !== "#NoReviewsAvailable";

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border-2 border-gray-100 hover:border-primary-300 hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1 animate-slide-up">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 p-6 relative overflow-hidden">
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-sm">{name}</h3>
              <div className="flex items-center space-x-3 flex-wrap gap-2">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <span className="text-yellow-300 text-xl">⭐</span>
                  <span className="text-white font-bold text-lg">{rating}</span>
                </div>
                {distance && (
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-sm">📍</span>
                    <span className="text-white font-semibold text-sm">{distance}</span>
                  </div>
                )}
              </div>
            </div>
            {hasMLData && (
              <div className={`px-4 py-3 rounded-xl border-2 backdrop-blur-sm bg-white/10 ${getSentimentBgColor().replace('bg-', 'border-')}`}>
                <p className="text-xs text-white/90 uppercase tracking-wide font-semibold">Sentiment</p>
                <p className={`text-2xl font-black ${getSentimentColor().replace('text-', 'text-white')}`}>
                  {trueSentiment}
                </p>
              </div>
            )}
          </div>

          {/* Address */}
          {address && (
            <div className="mt-3 flex items-start space-x-2 bg-white/10 backdrop-blur-sm rounded-lg p-2">
              <span className="text-white/90 text-sm">📍</span>
              <p className="text-white/90 text-sm font-medium">{address}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        {!hasMLData && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">ℹ️</span>
              <div>
                <p className="text-yellow-800 font-bold text-sm">Limited Review Data</p>
                <p className="text-yellow-700 text-xs mt-1">
                  Try searching popular locations or specific restaurant names for AI insights!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vibe Check */}
        {hasMLData && vibeCheck && vibeCheck.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-gray-800 font-bold text-lg flex items-center">
                <span className="mr-2 text-2xl">✨</span>
                Vibe Check
              </h4>
              <button
                onClick={() => setShowChart(!showChart)}
                className="text-xs bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-soft"
              >
                {showChart ? '📊 Hide Chart' : '📊 Show Chart'}
              </button>
            </div>

            {showChart && (
              <div className="mb-4 bg-gray-50 p-5 rounded-xl border-2 border-gray-200 animate-slide-up">
                <p className="text-gray-600 font-semibold text-sm mb-3">Sentiment Distribution</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-success-600 font-semibold w-20">Positive</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-success-400 to-success-600 h-full rounded-full transition-all duration-500" 
                        style={{width: `${sentimentValue || 60}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700 font-bold w-12">{sentimentValue || 60}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 font-semibold w-20">Neutral</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-gray-300 to-gray-400 h-full rounded-full transition-all duration-500" 
                        style={{width: `${100 - (sentimentValue || 60) - 10}%`}}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-700 font-bold w-12">{100 - (sentimentValue || 60) - 10}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-red-500 font-semibold w-20">Negative</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div className="bg-gradient-to-r from-red-400 to-red-600 h-full rounded-full transition-all duration-500" style={{width: '10%'}}></div>
                    </div>
                    <span className="text-sm text-gray-700 font-bold w-12">10%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {vibeCheck.map((vibe, index) => (
                <span
                  key={index}
                  className="px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-sm font-bold shadow-soft hover:shadow-glow transform hover:scale-105 transition-all duration-300"
                >
                  {vibe}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Must-Try Dishes */}
        {hasMLData && mustTryDishes && mustTryDishes.length > 0 && (
          <div>
            <h4 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
              <span className="mr-2 text-2xl">🍴</span>
              Must-Try Dishes
            </h4>
            <ul className="space-y-2">
              {mustTryDishes.map((dish, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-700 bg-success-50 border-2 border-success-100 px-4 py-3 rounded-xl hover:border-success-300 transition-all duration-300 transform hover:translate-x-1"
                >
                  <span className="mr-3 text-success-500 font-bold text-lg">▸</span>
                  <span className="font-medium">{dish}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Complaints */}
        {hasMLData && commonComplaints && commonComplaints.length > 0 && (
          <div>
            <h4 className="text-gray-800 font-bold text-lg mb-4 flex items-center">
              <span className="mr-2 text-2xl">⚠️</span>
              Heads Up
            </h4>
            <ul className="space-y-2">
              {commonComplaints.map((complaint, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-700 bg-red-50 border-2 border-red-100 px-4 py-3 rounded-xl hover:border-red-300 transition-all duration-300"
                >
                  <span className="mr-3 text-red-500 font-bold">•</span>
                  <span className="font-medium">{complaint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-100">
        <p className="text-sm text-gray-500 text-center font-medium">
          {hasMLData ? '🤖 AI-powered analysis from hundreds of reviews' : '📊 Data from Google Places API'}
        </p>
      </div>
    </div>
  );
}

export default RestaurantCard;
