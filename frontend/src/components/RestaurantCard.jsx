import { useState } from 'react';

function RestaurantCard({ restaurant, userLocation }) {
  const { name, rating, trueSentiment, vibeCheck, mustTryDishes, commonComplaints, address, distance } = restaurant;
  const [showChart, setShowChart] = useState(false);

  // Calculate sentiment color
  const sentimentValue = parseInt(trueSentiment);
  const getSentimentColor = () => {
    if (sentimentValue >= 80) return 'text-green-400';
    if (sentimentValue >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getSentimentBgColor = () => {
    if (sentimentValue >= 80) return 'bg-green-900/30 border-green-500/50';
    if (sentimentValue >= 60) return 'bg-yellow-900/30 border-yellow-500/50';
    return 'bg-orange-900/30 border-orange-500/50';
  };

  // Check if data is available
  const hasMLData = trueSentiment !== "N/A" && vibeCheck && vibeCheck[0] !== "#NoReviewsAvailable";

  return (
    <div className="bg-card-bg rounded-xl shadow-xl overflow-hidden border border-gray-700 hover:border-primary-light transition-all duration-300 transform hover:scale-[1.02]">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-blue to-primary-light p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 text-xl">⭐</span>
                <span className="text-white font-semibold text-lg">{rating}</span>
              </div>
              {distance && (
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-white text-sm">📍</span>
                  <span className="text-white font-medium text-sm">{distance}</span>
                </div>
              )}
            </div>
          </div>
          {hasMLData && (
            <div className={`px-4 py-2 rounded-lg border-2 ${getSentimentBgColor()}`}>
              <p className="text-xs text-gray-300 uppercase tracking-wide">True Sentiment</p>
              <p className={`text-xl font-bold ${getSentimentColor()}`}>{trueSentiment}</p>
            </div>
          )}
        </div>

        {/* Address */}
        {address && (
          <div className="mt-3 flex items-start space-x-2">
            <span className="text-blue-200 text-sm">📍</span>
            <p className="text-blue-100 text-sm">{address}</p>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-6">
        {!hasMLData && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-xl">ℹ️</span>
              <div>
                <p className="text-yellow-300 font-semibold">Limited Review Data</p>
                <p className="text-yellow-200 text-sm mt-1">
                  Google Places API provides limited reviews. Try searching more popular locations or specific restaurant names for AI insights!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vibe Check */}
        {hasMLData && vibeCheck && vibeCheck.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-semibold flex items-center">
                <span className="mr-2">✨</span>
                Vibe Check
              </h4>
              <button
                onClick={() => setShowChart(!showChart)}
                className="text-xs bg-primary-blue hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors"
              >
                {showChart ? '📊 Hide Chart' : '📊 Show Chart'}
              </button>
            </div>

            {showChart && (
              <div className="mb-4 bg-primary-dark/50 p-4 rounded-lg">
                <p className="text-text-gray text-sm mb-2">Sentiment Distribution</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-400 w-20">Positive</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div className="bg-green-500 h-full" style={{width: `${sentimentValue || 60}%`}}></div>
                    </div>
                    <span className="text-sm text-white w-12">{sentimentValue || 60}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400 w-20">Neutral</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div className="bg-gray-500 h-full" style={{width: `${100 - (sentimentValue || 60) - 10}%`}}></div>
                    </div>
                    <span className="text-sm text-white w-12">{100 - (sentimentValue || 60) - 10}%</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-red-400 w-20">Negative</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div className="bg-red-500 h-full" style={{width: '10%'}}></div>
                    </div>
                    <span className="text-sm text-white w-12">10%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {vibeCheck.map((vibe, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-primary-blue to-primary-light text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
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
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <span className="mr-2">🍴</span>
              Must-Try Dishes
            </h4>
            <ul className="space-y-2">
              {mustTryDishes.map((dish, index) => (
                <li
                  key={index}
                  className="flex items-center text-text-gray bg-primary-dark/50 px-4 py-2 rounded-lg"
                >
                  <span className="mr-2 text-accent-orange">▸</span>
                  {dish}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Complaints */}
        {hasMLData && commonComplaints && commonComplaints.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-3 flex items-center">
              <span className="mr-2">⚠️</span>
              Heads Up
            </h4>
            <ul className="space-y-2">
              {commonComplaints.map((complaint, index) => (
                <li
                  key={index}
                  className="flex items-center text-text-gray bg-red-900/20 px-4 py-2 rounded-lg border border-red-900/30"
                >
                  <span className="mr-2 text-red-400">•</span>
                  {complaint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-primary-dark/50 border-t border-gray-700">
        <p className="text-sm text-text-gray text-center">
          {hasMLData ? 'Powered by AI analysis of hundreds of reviews' : 'Data from Google Places API'}
        </p>
      </div>
    </div>
  );
}

export default RestaurantCard;
