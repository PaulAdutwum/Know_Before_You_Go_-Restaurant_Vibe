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
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location or restaurant name (e.g., 'Boston' or 'Joe's Pizza')"
                className="w-full px-6 py-4 bg-card-bg border-2 border-gray-600 rounded-lg text-white placeholder-text-gray focus:outline-none focus:border-primary-light transition-colors text-lg"
                disabled={isLoading || isGettingLocation}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={isLoading || isGettingLocation}
                className="px-6 py-4 bg-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-primary-blue/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 text-lg whitespace-nowrap"
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
              <button
                type="submit"
                disabled={isLoading || isGettingLocation}
                className="px-8 py-4 bg-gradient-to-r from-accent-orange to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-accent-orange/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 text-lg whitespace-nowrap"
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
          <p className="text-sm text-text-gray text-center">
            💡 Try: <span className="text-primary-light">"The Cheesecake Factory"</span>, <span className="text-primary-light">"Pizza Boston"</span>, <span className="text-primary-light">"Sushi near me"</span>, or click "Near Me"
          </p>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;

