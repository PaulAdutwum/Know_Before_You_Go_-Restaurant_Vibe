import { useState } from 'react';

function SearchBar({ onSearch, isLoading }) {
  const [location, setLocation] = useState('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [geoError, setGeoError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setGeoError(null);
    onSearch(location);
  };

  const handleUseMyLocation = () => {
    setIsGettingLocation(true);
    setGeoError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude},${longitude}`;
          setLocation(`Near me (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          onSearch(locationString, { lat: latitude, lng: longitude });
          setIsGettingLocation(false);
        },
        () => {
          setGeoError('Unable to get your location. Please enter it manually.');
          setIsGettingLocation(false);
        }
      );
    } else {
      setGeoError('Geolocation is not supported by your browser.');
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
              className="w-full rounded-3xl border border-slate-700 bg-black/90 px-6 py-4 text-lg text-white placeholder:text-slate-500 focus:border-amber-300 focus:ring-0 outline-none transition duration-300"
              disabled={isLoading || isGettingLocation}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={isLoading || isGettingLocation}
              className="rounded-3xl border border-slate-700 bg-slate-900 px-5 py-4 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGettingLocation ? 'Locating…' : 'Near Me'}
            </button>
            <button
              type="submit"
              disabled={isLoading || isGettingLocation}
              className="rounded-3xl bg-amber-400 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>

        {geoError && (
          <p className="mt-3 text-sm text-red-400 text-center animate-fade-in">{geoError}</p>
        )}

        <div className="mt-4 hidden sm:flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="font-semibold text-slate-300">Try:</span>
          <button
            type="button"
            onClick={() => onSearch('The Cheesecake Factory')}
            className="rounded-full border border-slate-700 bg-black/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            The Cheesecake Factory
          </button>
          <button
            type="button"
            onClick={() => onSearch('Italian in Brooklyn')}
            className="rounded-full border border-slate-700 bg-black/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Italian in Brooklyn
          </button>
          <button
            type="button"
            onClick={() => onSearch('Sushi downtown Boston')}
            className="rounded-full border border-slate-700 bg-black/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Sushi downtown Boston
          </button>
          <span className="text-slate-500">or</span>
          <button
            type="button"
            onClick={handleUseMyLocation}
            className="rounded-full border border-slate-700 bg-black/80 px-4 py-2 text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
          >
            Near Me
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
