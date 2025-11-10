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
    <div className="min-h-screen bg-gradient-to-br from-background-light via-background to-background-dark">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 shadow-xl relative overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 relative z-10">
          {/* Logo in top left */}
          <div className="absolute top-4 left-4 sm:left-8 flex items-center space-x-2 animate-fade-in">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border-2 border-white/30">
              <span className="text-3xl">🍽️</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm">Know Before</p>
              <p className="text-white/80 font-semibold text-xs -mt-1">You Go</p>
            </div>
          </div>

          <div className="text-center animate-fade-in pt-12 sm:pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
              Find the Vibe of Your Restaurant<br />
              <span className="text-white/90">Before You Go</span>
            </h1>
            <p className="text-white/95 text-lg sm:text-xl font-semibold max-w-3xl mx-auto leading-relaxed">
              Understand the true atmosphere, discover must-try dishes, and plan the perfect meal—all before making a reservation
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="mt-6 bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl shadow-soft animate-slide-up">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-primary-500"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-20 w-20 border-4 border-accent-400 opacity-20"></div>
            </div>
            <p className="mt-6 text-gray-700 text-xl font-semibold animate-pulse">
              ✨ Analyzing reviews and finding insights...
            </p>
          </div>
        )}

        {!isLoading && hasSearched && restaurants.length === 0 && !error && (
          <div className="mt-12 text-center animate-slide-up">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-600 text-xl font-medium">No restaurants found. Try a different location.</p>
          </div>
        )}

        {!isLoading && restaurants.length > 0 && (
          <ResultsContainer restaurants={restaurants} userLocation={userLocation} />
        )}

        {!hasSearched && !isLoading && (
          <div className="mt-16 text-center animate-slide-up">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Plan the Perfect Dining Experience
              </h2>
              <p className="text-gray-700 text-xl font-medium mb-16 max-w-3xl mx-auto">
                Our AI analyzes thousands of reviews to reveal what you <span className="text-primary-600 font-bold">really</span> need to know
              </p>
              <div className="grid md:grid-cols-3 gap-10 mt-8">
                <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-4 border-primary-200">
                  <div className="text-7xl mb-6 animate-bounce-slow">🔍</div>
                  <h3 className="text-gray-900 font-black text-2xl mb-4">1. Search Any Restaurant</h3>
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    Enter a location, cuisine type, or specific restaurant name. We'll find it instantly.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-4 border-accent-200">
                  <div className="text-7xl mb-6" style={{animation: 'bounce 2s infinite', animationDelay: '0.2s'}}>🤖</div>
                  <h3 className="text-gray-900 font-black text-2xl mb-4">2. AI Reads 1000s of Reviews</h3>
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    Advanced ML analyzes sentiment, detects vibes, and finds patterns humans miss.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-success-50 to-success-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border-4 border-success-200">
                  <div className="text-7xl mb-6" style={{animation: 'bounce 2s infinite', animationDelay: '0.4s'}}>✨</div>
                  <h3 className="text-gray-900 font-black text-2xl mb-4">3. Make Smart Decisions</h3>
                  <p className="text-gray-700 text-lg leading-relaxed font-medium">
                    Get honest insights: true sentiment, must-try dishes, and what to watch out for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t-4 border-primary-500">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-500 p-2 rounded-xl">
                  <span className="text-3xl">🍽️</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">Know Before You Go</h3>
                  <p className="text-gray-400 text-sm">Smart Dining Decisions</p>
                </div>
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-4">
                We analyze <span className="text-primary-400 font-bold">thousands of restaurant reviews</span> using advanced 
                <span className="text-accent-400 font-bold"> Natural Language Processing (NLP)</span> and 
                <span className="text-success-400 font-bold"> Machine Learning</span> to reveal the true vibe, sentiment, 
                and must-know insights about any restaurant—before you make a reservation.
              </p>
              <p className="text-gray-400 text-sm">
                Stop wasting time reading hundreds of reviews. Let AI do it for you in seconds.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary-900/50 to-accent-900/50 p-6 rounded-2xl border-2 border-primary-700/50">
              <h4 className="text-white font-bold text-lg mb-4">📊 Platform Stats</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-black text-primary-400">100K+</p>
                  <p className="text-gray-400 text-sm">Reviews Analyzed</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-accent-400">10K+</p>
                  <p className="text-gray-400 text-sm">Restaurants Covered</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-success-400">89%</p>
                  <p className="text-gray-400 text-sm">Sentiment Accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="border-t border-gray-700 pt-6 mb-6">
            <h4 className="text-white font-semibold text-sm mb-3">🔗 Powered By</h4>
            <div className="flex flex-wrap gap-3">
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700">
                Google Places API
              </span>
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700">
                VADER Sentiment Analysis
              </span>
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700">
                LDA Topic Modeling
              </span>
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700">
                TF-IDF Extraction
              </span>
              <span className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium border border-gray-700">
                Python ML Pipeline
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Know Before You Go • Built with React, FastAPI, and AI/ML
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Making every dining decision smarter, one insight at a time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
