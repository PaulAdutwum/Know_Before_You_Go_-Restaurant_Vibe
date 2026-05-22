import glassLogo from '../assets/glass_wine.png';

function Logo() {
  return (
    <div className="flex items-center gap-3 animate-fade-in cursor-pointer">
      <img
        src={glassLogo}
        alt="Know Before You Go logo"
        className="w-10 h-10 object-contain"
      />
      <div className="hidden sm:block">
        <h1 className="text-xl font-bold text-white">Know Before You Go</h1>
        <p className="text-xs text-slate-400">AI-powered review analysis</p>
      </div>
    </div>
  );
}

export default Logo;
