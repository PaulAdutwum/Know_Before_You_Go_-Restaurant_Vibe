import RestaurantCard from './RestaurantCard';

function ResultsContainer({ restaurants, userLocation }) {
  return (
    <div className="mt-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Found {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''}
        </h2>
        <p className="text-text-gray">
          {userLocation ? 'Showing restaurants near you with AI-powered insights' : 'Sorted by AI-powered insights and sentiment analysis'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} userLocation={userLocation} />
        ))}
      </div>
    </div>
  );
}

export default ResultsContainer;

