import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import ResultsContainer from './components/ResultsContainer';
import Logo from './components/Logo';

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [currentBgImage, setCurrentBgImage] = useState(0);

  // Beautiful restaurant ambiance images - visually appealing
  const backgroundImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=90&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=90&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=90&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=90&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552568043-7c8e0b0c0b5e?w=1920&q=90&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&q=90&auto=format&fit=crop',
  ];

  // Rotate background images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

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
      // Use environment variable for backend URL (defaults to localhost for development)
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      // Build API URL with user location if available
      let apiUrl = `${API_BASE_URL}/api/v1/search?location=${encodeURIComponent(location)}&max_results=10`;
      
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
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      setError(`Failed to fetch restaurants. Make sure the backend is running on ${API_BASE_URL}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header - DYNAMIC BACKGROUND IMAGES */}
      <header className="relative overflow-hidden border-b border-white/10 bg-slate-950">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${backgroundImages[currentBgImage]})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/95 via-slate-950/80 to-slate-950/95" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
            <Logo />
            <div className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-400">
              AI-powered review and vibe analysis
            </div>
          </div>

          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80 mb-4">Discover restaurant insights</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Know restaurant vibe and sentiment before you go.
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Analyze real reviews with AI to uncover true sentiment, atmosphere, must-try dishes, and common complaints in one clean, easy-to-use app.
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-900/85 px-5 py-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sentiment</p>
                <p className="mt-3 text-white font-semibold text-lg">Real review analysis</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/85 px-5 py-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Vibe</p>
                <p className="mt-3 text-white font-semibold text-lg">Ambiance tags from reviews</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/85 px-5 py-6 shadow-soft">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Recommendations</p>
                <p className="mt-3 text-white font-semibold text-lg">Must-try dishes and issues</p>
              </div>
            </div>
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
          <div className="mt-16">
            {/* Use Cases Section - BRILLIANTLY POSITIONED */}
            <div className="max-w-6xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 text-center animate-fade-in">
                Perfect For Every Occasion
              </h2>
              <p className="text-slate-300 text-lg font-semibold mb-12 text-center max-w-2xl mx-auto animate-fade-in">
                Make informed decisions for any dining experience
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Date Night Card */}
                <div className="bg-slate-800/40 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/15 relative overflow-hidden animate-slide-up group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 via-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">💕</div>
                    <h3 className="text-white font-black text-2xl mb-3">Plan Perfect Dates</h3>
                    <p className="text-slate-300 text-base leading-relaxed font-medium">
                      Discover romantic atmospheres, quiet spots, and ideal settings for intimate moments. Know the vibe before you book.
                    </p>
                  </div>
                </div>
                
                {/* Friends Hangout Card */}
                <div className="bg-slate-800/40 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/15 relative overflow-hidden animate-slide-up group" style={{animationDelay: '0.2s'}}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-white font-black text-2xl mb-3">Friends & Hangouts</h3>
                    <p className="text-slate-300 text-base leading-relaxed font-medium">
                      Find the best spots for group dining, casual meetups, and social gatherings. Check if it's good for groups and lively atmospheres.
                    </p>
                  </div>
                </div>
                
                {/* Family & Special Occasions Card */}
                <div className="bg-slate-800/40 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/15 relative overflow-hidden animate-slide-up group" style={{animationDelay: '0.4s'}}>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">🎉</div>
                    <h3 className="text-white font-black text-2xl mb-3">Special Moments</h3>
                    <p className="text-slate-300 text-base leading-relaxed font-medium">
                      Choose the right ambiance for celebrations, family dinners, and memorable occasions. Get insights on atmosphere and crowd levels.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fade-in bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
                How It Works
              </h2>
              <p className="text-slate-300 text-lg font-semibold mb-16 max-w-2xl mx-auto animate-fade-in">
                AI-powered insights from thousands of real reviews
              </p>
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                <div className="bg-slate-800/30 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/10 relative overflow-hidden animate-slide-up group">
                  {/* Silver shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">01</div>
                    <h3 className="text-white font-black text-2xl mb-4">Search</h3>
                    <p className="text-slate-300 text-base leading-relaxed font-medium">
                      Location, cuisine, or restaurant name. Instant results.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/10 relative overflow-hidden animate-slide-up group" style={{animationDelay: '0.2s'}}>
                  {/* Silver shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 font-black bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent">02</div>
                    <h3 className="text-white font-black text-2xl mb-4">AI Analysis</h3>
                    <p className="text-slate-300 text-base leading-relaxed font-medium">
                      ML analyzes sentiment, vibes, and patterns from thousands of reviews.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border border-white/10 relative overflow-hidden animate-slide-up group" style={{animationDelay: '0.4s'}}>
                  {/* Silver shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">03</div>
                    <h3 className="text-white font-black text-2xl mb-4">Decide</h3>
                    <p className="text-slate-300 text-base leading-relaxed font-medium">
                      Get honest insights: sentiment, dishes, and what to watch for.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-24 border-t border-slate-800/70 bg-slate-950/95">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400 font-semibold">Know Before You Go</p>
            <p className="mt-3 max-w-xl text-slate-500 text-sm leading-relaxed">
              AI-powered restaurant insights for more confident decisions. Built with React, Tailwind CSS, and a Python backend.
            </p>
          </div>
          <p className="text-slate-500 text-sm">Clean UI · Fast searches · Real review analysis</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
