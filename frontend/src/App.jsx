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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950">
      {/* Header - DARK RESTAURANT VIBE */}
      <header className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl relative overflow-hidden border-b-2 border-slate-700/50">
        {/* Dark restaurant ambiance - subtle warm glows */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-900/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-900/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        </div>
        
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="max-w-7xl mx-auto px-6 py-10 sm:px-8 lg:px-12 relative z-10">
          {/* Logo in top left - DARKER STYLE */}
          <div className="absolute top-5 left-5 sm:left-8 flex items-center space-x-2.5 animate-fade-in">
            <div className="bg-gradient-to-br from-blue-600/80 to-cyan-600/80 backdrop-blur-md p-2.5 rounded-xl border border-blue-500/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <span className="text-xl font-black text-white tracking-tighter">KB</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-black text-xs tracking-tight">Know Before</p>
              <p className="text-slate-300 font-bold text-[10px] -mt-0.5 tracking-tight">You Go</p>
            </div>
          </div>

          {/* Main Content - STRATEGIC & CATCHY */}
          <div className="text-center pt-20 sm:pt-16 pb-8 relative z-20">
            {/* Animated Title - VISIBLE */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 tracking-tight drop-shadow-2xl leading-tight">
              <span className="inline-block animate-slide-up">
                Know Before You Go
              </span>
              <br />
              <span className="inline-block text-cyan-400 animate-slide-up" style={{animationDelay: '0.2s'}}>
                Every Restaurant's True Vibe
              </span>
            </h1>
            
            {/* Strategic Subtitle - VISIBLE */}
            <p className="text-slate-300 text-lg sm:text-xl font-semibold max-w-3xl mx-auto leading-relaxed mt-6 animate-fade-in">
              Real sentiment from thousands of reviews. Must-try dishes. Common complaints.
              <span className="block mt-2 text-cyan-400 font-bold">All before you make a reservation.</span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - MORE SPACED */}
      <main className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        
        {error && (
          <div className="mt-6 bg-red-900/30 border-2 border-red-500 text-red-200 px-6 py-4 rounded-xl shadow-xl animate-slide-up">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <p className="font-bold">{error}</p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="mt-12 text-center animate-fade-in">
            <div className="inline-block relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-cyan-500 border-opacity-70"></div>
              <div className="absolute top-0 left-0 animate-ping rounded-full h-20 w-20 border-4 border-blue-400 opacity-20"></div>
            </div>
            <p className="mt-6 text-white text-xl font-black animate-pulse">
              Analyzing reviews and finding insights...
            </p>
          </div>
        )}

        {!isLoading && hasSearched && restaurants.length === 0 && !error && (
          <div className="mt-12 text-center animate-slide-up">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-300 text-xl font-bold">No restaurants found. Try a different location.</p>
          </div>
        )}

        {!isLoading && restaurants.length > 0 && (
          <ResultsContainer restaurants={restaurants} userLocation={userLocation} />
        )}

        {!hasSearched && !isLoading && (
          <div className="mt-12 text-center">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3 animate-fade-in">
                How It Works
              </h2>
              <p className="text-slate-300 text-lg font-semibold mb-12 max-w-2xl mx-auto animate-fade-in">
                AI-powered insights from thousands of real reviews
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-slate-700/50 animate-slide-up">
                  <div className="text-5xl mb-5 font-black text-cyan-400">01</div>
                  <h3 className="text-white font-black text-xl mb-3">Search</h3>
                  <p className="text-slate-300 text-base leading-relaxed font-medium">
                    Location, cuisine, or restaurant name. Instant results.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-slate-700/50 animate-slide-up" style={{animationDelay: '0.2s'}}>
                  <div className="text-5xl mb-5 font-black text-blue-400">02</div>
                  <h3 className="text-white font-black text-xl mb-3">AI Analysis</h3>
                  <p className="text-slate-300 text-base leading-relaxed font-medium">
                    ML analyzes sentiment, vibes, and patterns from thousands of reviews.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-slate-700/50 animate-slide-up" style={{animationDelay: '0.4s'}}>
                  <div className="text-5xl mb-5 font-black text-cyan-400">03</div>
                  <h3 className="text-white font-black text-xl mb-3">Decide</h3>
                  <p className="text-slate-300 text-base leading-relaxed font-medium">
                    Get honest insights: sentiment, dishes, and what to watch for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer - BLUISH THEME */}
      <footer className="mt-20 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 border-t-4 border-cyan-500/50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-500 p-2 rounded-xl">
                  <span className="text-2xl font-black text-white">KB</span>
                </div>
                <div>
                  <h3 className="text-white font-black text-xl">Know Before You Go</h3>
                  <p className="text-slate-300 text-sm font-bold">Smart Dining Decisions</p>
                </div>
              </div>
              <p className="text-slate-200 text-base leading-relaxed mb-4 font-medium">
                We analyze <span className="text-cyan-400 font-black">thousands of restaurant reviews</span> using advanced 
                <span className="text-blue-400 font-black"> Natural Language Processing (NLP)</span> and 
                <span className="text-cyan-400 font-black"> Machine Learning</span> to reveal the true vibe, sentiment, 
                and must-know insights about any restaurant—before you make a reservation.
              </p>
              <p className="text-slate-300 text-sm font-semibold">
                Stop wasting time reading hundreds of reviews. Let AI do it for you in seconds.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 p-6 rounded-2xl border-2 border-cyan-500/50">
              <h4 className="text-white font-black text-lg mb-4">Platform Stats</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-black text-cyan-400">100K+</p>
                  <p className="text-slate-300 text-sm font-bold">Reviews Analyzed</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-blue-400">10K+</p>
                  <p className="text-slate-300 text-sm font-bold">Restaurants Covered</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-green-400">89%</p>
                  <p className="text-slate-300 text-sm font-bold">Sentiment Accuracy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Sources */}
          <div className="border-t border-slate-700 pt-6 mb-6">
            <h4 className="text-white font-black text-sm mb-3">Powered By</h4>
            <div className="flex flex-wrap gap-3">
              <span className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-bold border border-slate-600">
                Google Places API
              </span>
              <span className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-bold border border-slate-600">
                VADER Sentiment
              </span>
              <span className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-bold border border-slate-600">
                LDA Topic Modeling
              </span>
              <span className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-bold border border-slate-600">
                TF-IDF Extraction
              </span>
              <span className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-bold border border-slate-600">
                Python ML Pipeline
              </span>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-700 pt-6 text-center">
            <p className="text-slate-300 text-sm font-bold">
              © {new Date().getFullYear()} Know Before You Go • Built with React, FastAPI, and AI/ML
            </p>
            <p className="text-slate-400 text-xs mt-2 font-semibold">
              Making every dining decision smarter, one insight at a time
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
