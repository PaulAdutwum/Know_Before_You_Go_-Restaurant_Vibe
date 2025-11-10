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
      <header className="bg-gradient-to-br from-slate-900/50 via-slate-800/40 to-slate-950/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden border-b border-white/10">
        {/* Dynamic Hero Background Images - ROTATING */}
        <div 
          className="absolute inset-0 opacity-60 transition-opacity ease-in-out"
          style={{
            backgroundImage: `url(${backgroundImages[currentBgImage]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.85) contrast(1.15) saturate(1.1)',
            transitionDuration: '2s'
          }}
        ></div>
        {/* Better overlay - subtle dark with warm tones */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-900/30 to-slate-950/45"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/10 via-transparent to-purple-950/10"></div>
        
        {/* Silver glass animated glows */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-white rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-slate-300 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-white/40 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '0.8s'}}></div>
        </div>
        
        {/* Silver glass texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent"></div>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }}></div>
        
        <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12 relative z-10">
          {/* Logo in top left - WITH FLAMES */}
          <div className="absolute top-6 left-6 sm:left-8">
            <Logo />
          </div>

          {/* Main Content - ELEGANT & CREATIVE */}
          <div className="text-center pt-24 sm:pt-20 pb-12 relative z-20">
            {/* Animated Title - DARKER & MORE VISIBLE */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
              <span className="inline-block text-white animate-slide-up drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]" style={{textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)'}}>
                Know Before You Go
              </span>
              <br />
              <span className="inline-block text-slate-100 animate-slide-up mt-2 drop-shadow-[0_4px_15px_rgba(0,0,0,0.7)]" style={{animationDelay: '0.2s', textShadow: '0 4px 15px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)'}}>
                Every Restaurant's True Vibe
              </span>
            </h1>
            
            {/* Strategic Subtitle - ENHANCED CONTRAST CARDS */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8 animate-fade-in max-w-5xl mx-auto">
              <div className="px-5 py-2.5 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                <span className="text-white text-base sm:text-lg font-black drop-shadow-lg">Real sentiment from thousands of reviews</span>
              </div>
              <span className="text-white/60 text-xl font-bold">•</span>
              <div className="px-5 py-2.5 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                <span className="text-white text-base sm:text-lg font-black drop-shadow-lg">Must-try dishes</span>
              </div>
              <span className="text-white/60 text-xl font-bold">•</span>
              <div className="px-5 py-2.5 bg-white/15 backdrop-blur-xl rounded-xl border border-white/30 shadow-xl hover:bg-white/20 transition-all">
                <span className="text-white text-base sm:text-lg font-black drop-shadow-lg">Common complaints</span>
              </div>
              <div className="px-5 py-2.5 bg-gradient-to-r from-emerald-400/50 to-teal-400/50 backdrop-blur-xl rounded-xl border border-emerald-300/60 shadow-xl hover:from-emerald-400/60 hover:to-teal-400/60 transition-all">
                <span className="text-white text-base sm:text-lg font-black drop-shadow-lg">Check before your reservation</span>
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

      {/* Footer - SILVER GLASS THEME */}
      <footer className="mt-24 bg-slate-900/40 backdrop-blur-2xl border-t border-white/10 relative overflow-hidden">
        {/* Silver glow effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-slate-300 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative z-10">
          {/* Main Footer Content */}
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            {/* About Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-slate-800/50 backdrop-blur-xl p-3 rounded-2xl border border-white/20 shadow-xl">
                  <span className="text-2xl font-black text-white">KB</span>
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl">Know Before You Go</h3>
                  <p className="text-slate-300 text-sm font-bold">Smart Dining Decisions</p>
                </div>
              </div>
              <p className="text-slate-200 text-base leading-relaxed mb-4 font-medium">
                We analyze <span className="text-emerald-400 font-black">thousands of restaurant reviews</span> using advanced 
                <span className="text-slate-300 font-black"> Natural Language Processing (NLP)</span> and 
                <span className="text-emerald-400 font-black"> Machine Learning</span> to reveal the true vibe, sentiment, 
                and must-know insights about any restaurant—before you make a reservation.
              </p>
              <p className="text-slate-300 text-sm font-semibold">
                Stop wasting time reading hundreds of reviews. Let AI do it for you in seconds.
              </p>
            </div>

            {/* Quick Stats - SILVER GLASS */}
            <div className="bg-slate-800/30 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Silver shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
              <div className="relative z-10">
                <h4 className="text-white font-black text-xl mb-6">Platform Stats</h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">100K+</p>
                    <p className="text-slate-300 text-sm font-bold mt-1">Reviews Analyzed</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black bg-gradient-to-r from-slate-400 to-slate-500 bg-clip-text text-transparent">10K+</p>
                    <p className="text-slate-300 text-sm font-bold mt-1">Restaurants Covered</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">89%</p>
                    <p className="text-slate-300 text-sm font-bold mt-1">Sentiment Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Powered Insights - PROFESSIONAL */}
          <div className="border-t border-white/10 pt-8 mb-8">
            <h4 className="text-white font-black text-lg mb-6 flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span>AI-Guided Insights</span>
            </h4>
            <p className="text-slate-300 text-sm mb-6 font-medium leading-relaxed max-w-4xl">
              Our advanced AI analyzes thousands of reviews to guide you to the best dining decisions. 
              Using <span className="text-emerald-400 font-bold">sentiment analysis</span>, 
              <span className="text-emerald-400 font-bold"> topic modeling</span>, and 
              <span className="text-emerald-400 font-bold"> natural language processing</span>, 
              we extract the most valuable insights—so you don't have to read hundreds of reviews.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-slate-800/40 backdrop-blur-xl px-5 py-4 rounded-xl border border-white/10 shadow-lg hover:border-emerald-400/30 hover:bg-slate-800/50 transition-all">
                <p className="text-emerald-400 font-black text-xs mb-1">DATA SOURCE</p>
                <p className="text-white font-bold text-sm">Google Places</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl px-5 py-4 rounded-xl border border-white/10 shadow-lg hover:border-emerald-400/30 hover:bg-slate-800/50 transition-all">
                <p className="text-emerald-400 font-black text-xs mb-1">SENTIMENT</p>
                <p className="text-white font-bold text-sm">VADER Analysis</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl px-5 py-4 rounded-xl border border-white/10 shadow-lg hover:border-emerald-400/30 hover:bg-slate-800/50 transition-all">
                <p className="text-emerald-400 font-black text-xs mb-1">TOPICS</p>
                <p className="text-white font-bold text-sm">LDA Modeling</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl px-5 py-4 rounded-xl border border-white/10 shadow-lg hover:border-emerald-400/30 hover:bg-slate-800/50 transition-all">
                <p className="text-emerald-400 font-black text-xs mb-1">EXTRACTION</p>
                <p className="text-white font-bold text-sm">TF-IDF Keywords</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl px-5 py-4 rounded-xl border border-white/10 shadow-lg hover:border-emerald-400/30 hover:bg-slate-800/50 transition-all">
                <p className="text-emerald-400 font-black text-xs mb-1">PIPELINE</p>
                <p className="text-white font-bold text-sm">Python ML</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-slate-300 text-sm font-bold">
              © {new Date().getFullYear()} Know Before You Go • Powered by AI & Machine Learning
            </p>
            <p className="text-slate-400 text-xs mt-2 font-semibold">
              Let AI guide you to the best dining experiences
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
