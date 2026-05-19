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

    if ('geolocation' in navigator) {
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
        <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search by location or restaurant name..."
              className="w-full rounded-3xl border border-slate-700 bg-slate-900/90 px-6 py-4 text-lg text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 outline-none transition duration-300"
              disabled={isLoading || isGettingLocation}
            />
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLoading || isGettingLocation}
              className="rounded-3xl border border-slate-700 bg-slate-800 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGettingLocation ? 'Locating…' : 'Near Me'}
            </button>
            <button
              type="submit"
              disabled={isLoading || isGettingLocation}
              className="rounded-3xl bg-cyan-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="font-semibold text-slate-300">Try:</span>
          <button
            type="button"
            onClick={() => onSearch('The Cheesecake Factory')}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            The Cheesecake Factory
          </button>
          <button
            type="button"
            onClick={() => onSearch('Pizza Boston')}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Pizza Boston
          </button>
          <button
            type="button"
            onClick={() => onSearch('Sushi near me')}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Sushi near me
          </button>
          <span className="text-slate-500">or</span>
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="rounded-full border border-slate-700 bg-slate-900/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            Near Me
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
