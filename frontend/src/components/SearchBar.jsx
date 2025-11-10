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
          {/* Search Input */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative group">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location or restaurant name (e.g., 'Boston' or 'Joe's Pizza')"
                className="w-full px-6 py-4 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-200 transition-all duration-300 text-lg font-medium shadow-soft"
                disabled={isLoading || isGettingLocation}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3">
              {/* Near Me Button */}
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLoading || isGettingLocation}
                className="px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-glow active:scale-95 text-lg whitespace-nowrap shadow-soft"
                title="Use my current location"
              >
                {isGettingLocation ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  '📍 Near Me'
                )}
              </button>
              
              {/* Search Button */}
              <button
                type="submit"
                disabled={isLoading || isGettingLocation}
                className="px-8 py-4 bg-gradient-to-r from-accent-500 via-accent-600 to-accent-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold rounded-xl focus:outline-none focus:ring-4 focus:ring-accent-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 hover:shadow-glow-orange active:scale-95 text-lg whitespace-nowrap shadow-soft"
                style={{ backgroundSize: '200% auto' }}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  '🔍 Search'
                )}
              </button>
            </div>
          </div>
          
          {/* Helper Text */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              💡 <span className="font-semibold">Try:</span> 
              <span className="text-primary-600 font-medium mx-1">"The Cheesecake Factory"</span>,
              <span className="text-primary-600 font-medium mx-1">"Pizza Boston"</span>,
              <span className="text-primary-600 font-medium mx-1">"Sushi near me"</span>
              or click "Near Me"
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
