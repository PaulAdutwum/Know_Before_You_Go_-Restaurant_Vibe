import RestaurantCard from './RestaurantCard';

function ResultsContainer({ restaurants, userLocation }) {
  return (
    <div className="mt-10 animate-fade-in max-w-6xl mx-auto">
      {/* Header - BLUISH THEME */}
      <div className="mb-8 text-center bg-gradient-to-r from-blue-900/60 via-slate-900 to-blue-900/60 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-500/50 shadow-2xl">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
          Found {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''}
        </h2>
        <p className="text-slate-200 text-lg font-bold">
          {userLocation 
            ? 'Near you with AI-powered insights' 
            : 'Sorted by sentiment & ML analysis'}
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
