import RestaurantCard from './RestaurantCard';

function ResultsContainer({ restaurants, userLocation }) {
  return (
    <div className="mt-12 animate-fade-in">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Found {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''}
        </h2>
        <p className="text-gray-600 text-lg font-medium">
          {userLocation 
            ? '📍 Showing restaurants near you with AI-powered insights' 
            : '✨ Sorted by sentiment analysis and ML insights'}
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
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
