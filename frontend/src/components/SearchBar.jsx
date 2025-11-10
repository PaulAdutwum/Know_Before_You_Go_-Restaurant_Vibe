import { useState } from 'react';

function SearchBar({ onSearch, isLoading }) {
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(location);
  };

  const handleUseMyLocation = () => {
    setIsGettingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          setLocation(`Near me (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          onSearch(locationString, { lat: latitude, lng: longitude });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter it manually.');
          setIsGettingLocation(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
    }
  };

  return (
    <div className="mt-8 animate-slide-up">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          {/* Search Input - PROFESSIONAL STYLE */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by location or restaurant name..."
                className="w-full px-6 py-4 bg-slate-800 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-lg font-medium shadow-lg"
                disabled={isLoading || isGettingLocation}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
            
            {/* Buttons - CREATIVE & ANIMATED */}
            <div className="flex gap-3">
              {/* Near Me Button - CREATIVE STYLE */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLoading || isGettingLocation}
                className="group relative px-5 py-3.5 bg-gradient-to-r from-blue-600/90 to-blue-700/90 text-white font-bold rounded-lg hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-sm whitespace-nowrap shadow-lg border border-blue-400/40 overflow-hidden"
                title="Use my current location"
              >
                {/* Animated background shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center gap-1.5">
                  {isGettingLocation ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <span className="text-xs">📍</span>
                      <span>Near Me</span>
                    </>
                  )}
                </span>
              </button>
              
              {/* Search Button - CREATIVE STYLE */}
              <button
                type="submit"
                disabled={isLoading || isGettingLocation}
                className="group relative px-7 py-3.5 bg-gradient-to-r from-cyan-600/90 to-cyan-700/90 text-white font-bold rounded-lg hover:from-cyan-500 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 active:scale-95 text-sm whitespace-nowrap shadow-lg border border-cyan-400/40 overflow-hidden"
              >
                {/* Animated background shimmer */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs">🔍</span>
                      <span>Search</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
          
          {/* Helper Text - DARK TRANSPARENT BUTTONS */}
          <div className="mt-4 flex flex-wrap items-center gap-2 justify-start">
            <span className="text-slate-400 text-sm font-semibold mr-1">Try:</span>
            <button
              onClick={() => onSearch("The Cheesecake Factory")}
              className="px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg text-cyan-400 text-sm font-bold hover:bg-slate-700/60 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              "The Cheesecake Factory"
            </button>
            <button
              onClick={() => onSearch("Pizza Boston")}
              className="px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg text-cyan-400 text-sm font-bold hover:bg-slate-700/60 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              "Pizza Boston"
            </button>
            <button
              onClick={() => onSearch("Sushi near me")}
              className="px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg text-cyan-400 text-sm font-bold hover:bg-slate-700/60 hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              "Sushi near me"
            </button>
            <span className="text-slate-500 text-sm mx-1">or</span>
            <button
              onClick={handleUseMyLocation}
              className="px-4 py-2 bg-slate-800/60 backdrop-blur-sm border border-blue-500/50 rounded-lg text-blue-400 text-sm font-bold hover:bg-slate-700/60 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              "Near Me"
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
