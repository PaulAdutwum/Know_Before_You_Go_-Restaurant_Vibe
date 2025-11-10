import RestaurantCard from './RestaurantCard';

function ResultsContainer({ restaurants, userLocation }) {
  return (
    <div className="mt-10 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 border-2 border-gray-700 shadow-xl">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
          Found {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''}
        </h2>
        <p className="text-gray-300 text-lg font-bold">
          {userLocation 
            ? '📍 Near you with AI-powered insights' 
            : '✨ Sorted by sentiment & ML analysis'}
        </p>
      </div>

      {/* Results Grid - Smaller, Better Balanced */}
      <div className="grid gap-6 md:grid-cols-2">
        {restaurants.map((restaurant, index) => (
          <div 
            key={index}
            style={{
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            <RestaurantCard restaurant={restaurant} userLocation={userLocation} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsContainer;
