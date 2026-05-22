import RestaurantCard from './RestaurantCard';

function ResultsContainer({ restaurants, userLocation }) {
  return (
    <div className="mt-10 max-w-6xl mx-auto animate-fade-in">
      <div className="rounded-3xl border border-white/10 bg-black/80 p-8 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <h2 className="text-4xl font-semibold text-white mb-2">
          {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''} Found
        </h2>
        <p className="text-slate-400 text-base">
          {userLocation
            ? 'Curated for you with AI-powered insights.'
            : 'Ranked by sentiment analysis and review sentiment.'}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={index} restaurant={restaurant} userLocation={userLocation} />
        ))}
      </div>
    </div>
  );
}

export default ResultsContainer;
