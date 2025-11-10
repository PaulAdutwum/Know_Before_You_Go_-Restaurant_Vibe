import RestaurantCard from './RestaurantCard';

function ResultsContainer({ restaurants, userLocation }) {
  return (
    <div className="mt-10 animate-fade-in max-w-6xl mx-auto">
      {/* Header - SILVER GLASS */}
      <div className="mb-10 text-center bg-gradient-to-r from-slate-800/30 via-slate-700/20 to-slate-800/30 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Silver shine effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-slate-300 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white mb-3 tracking-tight drop-shadow-2xl">
            {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} Found
          </h2>
          <p className="text-slate-200 text-lg font-semibold">
            {userLocation 
              ? 'Curated for you with AI-powered insights' 
              : 'Ranked by sentiment analysis & machine learning'}
          </p>
        </div>
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
