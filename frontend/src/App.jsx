import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsContainer from './components/ResultsContainer';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const handleSearch = async (location, coords = null) => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    // Save user location for distance calculations
    if (coords) {
      setUserLocation(coords);
    }

    try {
      // Build API URL with user location if available
      let apiUrl = `http://localhost:8000/api/v1/search?location=${encodeURIComponent(location)}&max_results=10`;
      
      if (coords && coords.lat && coords.lng) {
        apiUrl += `&user_lat=${coords.lat}&user_lng=${coords.lng}`;
      }
      
      // Call the actual API
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }
      
      const data = await response.json();
      setRestaurants(data);
      setIsLoading(false);
      
      // Fallback mock data (commented out, will be used if backend is not running)
      /*
      setTimeout(() => {
        const mockData = [
          {
            name: "Joe's Pizza",
            rating: 4.5,
            trueSentiment: "82% Positive",
            vibeCheck: ["#Loud", "#GoodForGroups", "#Casual"],
            mustTryDishes: ["Spicy Rigatoni", "Garlic Knots", "Margherita Pizza"],
            commonComplaints: ["Slow service on weekends", "Can get very crowded"]
          },
          {
            name: "The Riverside Bistro",
            rating: 4.8,
            trueSentiment: "91% Positive",
            vibeCheck: ["#Romantic", "#Quiet", "#DateNight"],
            mustTryDishes: ["Pan-Seared Salmon", "Lobster Risotto", "Chocolate Soufflé"],
            commonComplaints: ["Pricey", "Limited parking"]
          },
          {
            name: "Mama's Kitchen",
            rating: 4.3,
            trueSentiment: "76% Positive",
            vibeCheck: ["#FamilyFriendly", "#Comfort", "#HomeStyle"],
            mustTryDishes: ["Chicken Pot Pie", "Meatloaf", "Apple Pie"],
            commonComplaints: ["Long wait times", "Small portions"]
          },
          {
            name: "Sakura Sushi Bar",
            rating: 4.7,
            trueSentiment: "88% Positive",
            vibeCheck: ["#Fresh", "#Modern", "#HealthyOptions"],
            mustTryDishes: ["Dragon Roll", "Salmon Sashimi", "Miso Soup"],
            commonComplaints: ["Expensive", "Limited seating"]
          }
        ];
        
        setRestaurants(mockData);
        setIsLoading(false);
      }, 1500);
      */
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to fetch restaurants. Make sure the backend is running on http://localhost:8000');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-blue to-primary-light shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              🍽️ VibeFinder
            </h1>
            <p className="text-blue-100 text-lg">
              Discover the perfect dining experience with AI-powered insights
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="mt-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent-orange"></div>
            <p className="mt-4 text-text-gray text-lg">Finding the best vibes for you...</p>
          </div>
        )}

        {!isLoading && hasSearched && restaurants.length === 0 && !error && (
          <div className="mt-12 text-center">
            <p className="text-text-gray text-lg">No restaurants found. Try a different location.</p>
          </div>
        )}

        {!isLoading && restaurants.length > 0 && (
          <ResultsContainer restaurants={restaurants} userLocation={userLocation} />
        )}

        {!hasSearched && !isLoading && (
          <div className="mt-16 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-4">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-card-bg p-6 rounded-lg">
                  <div className="text-4xl mb-3">🔍</div>
                  <h3 className="text-white font-semibold mb-2">Search</h3>
                  <p className="text-text-gray">Enter any location to discover restaurants</p>
                </div>
                <div className="bg-card-bg p-6 rounded-lg">
                  <div className="text-4xl mb-3">🤖</div>
                  <h3 className="text-white font-semibold mb-2">AI Analysis</h3>
                  <p className="text-text-gray">Our ML models analyze thousands of reviews</p>
                </div>
                <div className="bg-card-bg p-6 rounded-lg">
                  <div className="text-4xl mb-3">✨</div>
                  <h3 className="text-white font-semibold mb-2">Get Insights</h3>
                  <p className="text-text-gray">See vibes, dishes, and honest sentiment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-card-bg border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-text-gray">
            Powered by AI • Real Reviews • Honest Insights
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
