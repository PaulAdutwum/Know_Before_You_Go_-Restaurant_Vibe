import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ResultsContainer from './components/ResultsContainer';
import Logo from './components/Logo';

const DISCOVER_CARDS = [
  {
    icon: '◎',
    title: 'Atmosphere & Vibe',
    desc: 'A real sentence describing what it feels like inside — noise level, lighting, crowd energy. Not a generic tag.',
    delay: 0,
  },
  {
    icon: '↑↓',
    title: 'True Sentiment',
    desc: 'A percentage calculated from what reviewers actually said — not just the star average.',
    delay: 100,
  },
  {
    icon: '✦',
    title: 'Dish Highlights',
    desc: 'The food and drinks reviewers mention by name — real items worth ordering, not guesses.',
    delay: 200,
  },
  {
    icon: '◈',
    title: 'Right for Your Night',
    desc: 'Know if it fits — date night, groups of 4+, solo lunch, business dinner. And when to skip it.',
    delay: 300,
  },
  {
    icon: '📍',
    title: 'Neighborhood Safety',
    desc: 'Whether the area is safe to walk at night, what\'s nearby, and landmarks worth knowing.',
    delay: 400,
  },
  {
    icon: '!',
    title: 'Honest Warnings',
    desc: 'The most common complaints from real diners — slow service, parking, noise — before you book.',
    delay: 500,
  },
];

function App() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleSearch = async (location, coords = null) => {
    if (!location.trim()) {
      setError('Please enter a location');
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    if (coords) {
      setUserLocation(coords);
    }

    try {
      let apiUrl = `${API_BASE_URL}/api/v1/search?location=${encodeURIComponent(location)}&max_results=10`;

      if (coords && coords.lat && coords.lng) {
        apiUrl += `&user_lat=${coords.lat}&user_lng=${coords.lng}`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch restaurants');
      }

      const data = await response.json();
      setRestaurants(data);
      setIsLoading(false);
    } catch (err) {
      console.error('API Error:', err);
      setError(`Failed to fetch restaurants. Make sure the backend is running on ${API_BASE_URL}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="relative border-b border-white/5 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-12">
          <div className="flex items-center">
            <Logo />
          </div>
        </div>
      </header>

      <main className="bg-black">
        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
              Know the vibe<br className="hidden sm:block" /> before you walk in.
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Know the vibe, whether it's right for your night, what to order, and if the area is safe to walk — all from real reviews, before you go.
            </p>

            {/* Feature preview strips */}
            <div className="mb-12 max-w-xl mx-auto w-full space-y-3 text-left">
              {/* Vibe */}
              <div className="rounded-2xl border border-white/10 bg-black/80 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70 mb-1.5">Vibe</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  "Dimly lit and buzzing — a packed tapas bar where the energy runs high all night. Bar counter seats are always the best spot."
                </p>
              </div>

              {/* When to go */}
              <div className="rounded-2xl border border-white/10 bg-black/80 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70 mb-2">Know when to go</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="text-xs text-slate-500 font-semibold self-center">Best for:</span>
                  {['Date Night', 'Groups 4+', 'Late Night'].map(c => (
                    <span key={c} className="bg-green-400/10 text-green-300 border border-green-400/20 text-xs px-2.5 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-slate-500 font-semibold self-center">Skip if:</span>
                  {['Quiet Conversation', 'Quick Bite'].map(c => (
                    <span key={c} className="bg-orange-400/10 text-orange-300 border border-orange-400/20 text-xs px-2.5 py-0.5 rounded-full">{c}</span>
                  ))}
                </div>
              </div>

              {/* Neighborhood */}
              <div className="rounded-2xl border border-white/10 bg-black/80 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-200/70 mb-1.5">The neighborhood</p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  South End, Boston — walkable, safe to stroll at night. Near SoWa Art District and Peters Park.
                </p>
              </div>
            </div>

            <div className="mb-10">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>

            <p className="text-sm text-slate-500 text-center mb-16">
              Search any city, neighborhood, or restaurant name — or tap{' '}
              <span className="text-amber-400 font-medium">Near Me</span> to start instantly.
            </p>
          </div>
        </section>

        {!hasSearched && (
          <section className="border-t border-white/5 bg-black py-24">
            <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4">What You'll Discover</h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Six things Google Maps won't tell you.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DISCOVER_CARDS.map(({ icon, title, desc, delay }) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/10 p-8 bg-black/80 shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition duration-300 hover:shadow-[0_24px_80px_rgba(217,119,0,0.22)] animate-fade-in"
                    style={{ animationDelay: `${delay}ms` }}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-200/70 font-bold text-base mb-4">
                      {icon}
                    </div>
                    <h3 className="text-lg font-bold mb-3">{title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          {error && (
            <div className="mt-6 bg-red-900/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-lg animate-slide-up">
              <div className="flex items-center gap-3">
                <span className="text-lg">⚠</span>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="mt-12 text-center animate-fade-in">
              <div className="inline-block relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-400"></div>
              </div>
              <p className="mt-8 text-slate-300 text-lg font-semibold">Analyzing reviews and finding insights...</p>
            </div>
          )}

          {!isLoading && hasSearched && restaurants.length === 0 && !error && (
            <div className="mt-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-400 text-lg">No restaurants found. Try a different location.</p>
            </div>
          )}

          {!isLoading && restaurants.length > 0 && (
            <ResultsContainer restaurants={restaurants} userLocation={userLocation} />
          )}
        </section>
      </main>

      <footer className="relative overflow-hidden border-t border-white/5 bg-black">
        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 text-center text-slate-500 text-sm">
          <p className="mb-1 font-medium text-slate-400">Know Before You Go</p>
          <p>Smarter restaurant decisions powered by AI review analysis. © 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
