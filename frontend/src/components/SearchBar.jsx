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
    <div className="mt-10 animate-slide-up">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-5">
          {/* Search Input - SILVER GLASS STYLE */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Search by location or restaurant name..."
                className="w-full px-6 py-5 bg-slate-800/40 backdrop-blur-2xl border-2 border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-white/30 focus:ring-4 focus:ring-white/10 transition-all duration-300 text-lg font-medium shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                disabled={isLoading || isGettingLocation}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                🔍
              </div>
              {/* Silver shine on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
            </div>
            
            {/* Buttons - SILVER GLASS STYLE */}
            <div className="flex gap-4">
              {/* Near Me Button */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLoading || isGettingLocation}
                className="group relative px-6 py-5 bg-slate-700/50 backdrop-blur-xl text-white font-bold rounded-2xl hover:bg-slate-600/60 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 text-sm whitespace-nowrap shadow-2xl border border-white/20 hover:border-white/30 overflow-hidden"
                title="Use my current location"
              >
                {/* Silver shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center gap-2">
                  {isGettingLocation ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <span className="text-base">📍</span>
                      <span>Near Me</span>
                    </>
                  )}
                </span>
              </button>
              
              {/* Search Button */}
              <button
                type="submit"
                disabled={isLoading || isGettingLocation}
                className="group relative px-8 py-5 bg-gradient-to-r from-emerald-600/70 to-teal-600/70 backdrop-blur-xl text-white font-bold rounded-2xl hover:from-emerald-500/80 hover:to-teal-500/80 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 text-sm whitespace-nowrap shadow-2xl border border-emerald-400/30 hover:border-emerald-300/40 overflow-hidden"
              >
                {/* Silver shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base">🔍</span>
                      <span>Search</span>
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>
          
          {/* Helper Text - SILVER GLASS BUTTONS */}
          <div className="mt-2 flex flex-wrap items-center gap-3 justify-start">
            <span className="text-slate-400 text-sm font-semibold">Try:</span>
            <button
              onClick={() => onSearch("The Cheesecake Factory")}
              className="px-5 py-2.5 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-xl text-emerald-400 text-sm font-bold hover:bg-slate-700/50 hover:border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              "The Cheesecake Factory"
            </button>
            <button
              onClick={() => onSearch("Pizza Boston")}
              className="px-5 py-2.5 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-xl text-emerald-400 text-sm font-bold hover:bg-slate-700/50 hover:border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              "Pizza Boston"
            </button>
            <button
              onClick={() => onSearch("Sushi near me")}
              className="px-5 py-2.5 bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-xl text-emerald-400 text-sm font-bold hover:bg-slate-700/50 hover:border-emerald-400/40 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              "Sushi near me"
            </button>
            <span className="text-slate-500 text-sm mx-1">or</span>
            <button
              onClick={handleUseMyLocation}
              className="px-5 py-2.5 bg-slate-800/40 backdrop-blur-xl border border-white/20 rounded-xl text-slate-300 text-sm font-bold hover:bg-slate-700/50 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
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
