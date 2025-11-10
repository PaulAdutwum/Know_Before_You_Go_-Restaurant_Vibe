function Logo() {
  return (
    <div className="flex items-center space-x-3 animate-fade-in group cursor-pointer">
      {/* Bowl with Steam Logo - NICELY COLORED */}
      <div className="relative">
        {/* Steam/Flames rising from bowl - WAVY & SHORTER */}
        <svg 
          width="65" 
          height="50" 
          viewBox="0 0 65 50" 
          className="absolute -top-5 -left-1 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        >
          <defs>
            <linearGradient id="steamGradient1" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" style={{stopColor: '#10b981', stopOpacity: 0.9}} />
              <stop offset="30%" style={{stopColor: '#14b8a6', stopOpacity: 0.8}} />
              <stop offset="60%" style={{stopColor: '#f59e0b', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
            </linearGradient>
            <linearGradient id="steamGradient2" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" style={{stopColor: '#14b8a6', stopOpacity: 0.9}} />
              <stop offset="30%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
              <stop offset="60%" style={{stopColor: '#f59e0b', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
            </linearGradient>
            <linearGradient id="steamGradient3" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" style={{stopColor: '#f59e0b', stopOpacity: 0.9}} />
              <stop offset="30%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
              <stop offset="60%" style={{stopColor: '#14b8a6', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
            </linearGradient>
            <filter id="steamGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Left Steam - wavy and shorter */}
          <path 
            d="M 18 40 Q 16 35, 15 28 Q 14 22, 15 16 Q 16 12, 17 8 Q 18 5, 19 8 Q 20 12, 21 16 Q 22 22, 21 28 Q 20 35, 19 38 Z" 
            fill="url(#steamGradient1)" 
            filter="url(#steamGlow)"
            className="group-hover:animate-pulse"
          />
          
          {/* Center Steam - wavy and shorter (tallest) */}
          <path 
            d="M 32.5 42 Q 30.5 36, 29 28 Q 27.5 20, 29 12 Q 30.5 8, 32.5 4 Q 34.5 2, 36.5 4 Q 38.5 8, 40 12 Q 41.5 20, 40 28 Q 38.5 36, 36.5 40 Z" 
            fill="url(#steamGradient3)" 
            filter="url(#steamGlow)"
            className="group-hover:animate-pulse"
            style={{animationDelay: '0.1s'}}
          />
          
          {/* Right Steam - wavy and shorter */}
          <path 
            d="M 47 40 Q 49 35, 50 28 Q 51 22, 50 16 Q 49 12, 48 8 Q 47 5, 46 8 Q 45 12, 44 16 Q 43 22, 44 28 Q 45 35, 46 38 Z" 
            fill="url(#steamGradient2)" 
            filter="url(#steamGlow)"
            className="group-hover:animate-pulse"
            style={{animationDelay: '0.2s'}}
          />
        </svg>
        
        {/* Bowl with Food Logo */}
        <div className="relative z-10">
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 60 60"
            className="group-hover:scale-110 transition-transform duration-500"
            style={{filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))'}}
          >
            <defs>
              {/* Bowl gradient */}
              <linearGradient id="bowlGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: '#475569', stopOpacity: 1}} />
                <stop offset="30%" style={{stopColor: '#64748b', stopOpacity: 1}} />
                <stop offset="70%" style={{stopColor: '#475569', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: '#334155', stopOpacity: 1}} />
              </linearGradient>
              
              {/* Food gradient */}
              <radialGradient id="foodGradient" cx="50%" cy="40%">
                <stop offset="0%" style={{stopColor: '#f59e0b', stopOpacity: 0.9}} />
                <stop offset="40%" style={{stopColor: '#10b981', stopOpacity: 0.8}} />
                <stop offset="70%" style={{stopColor: '#14b8a6', stopOpacity: 0.7}} />
                <stop offset="100%" style={{stopColor: '#1e293b', stopOpacity: 0.9}} />
              </radialGradient>
              
              {/* Bowl highlight */}
              <linearGradient id="bowlHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
                <stop offset="30%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
                <stop offset="50%" style={{stopColor: '#ffffff', stopOpacity: 0.4}} />
                <stop offset="70%" style={{stopColor: '#ffffff', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
              </linearGradient>
              
              {/* Food highlight */}
              <radialGradient id="foodHighlight" cx="40%" cy="30%">
                <stop offset="0%" style={{stopColor: '#ffffff', stopOpacity: 0.4}} />
                <stop offset="50%" style={{stopColor: '#ffffff', stopOpacity: 0.1}} />
                <stop offset="100%" style={{stopColor: '#ffffff', stopOpacity: 0}} />
              </radialGradient>
              
              <filter id="bowlGlow">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Bowl shadow */}
            <ellipse 
              cx="30" 
              cy="55" 
              rx="22" 
              ry="4" 
              fill="rgba(0,0,0,0.3)"
            />
            
            {/* Bowl outer shape */}
            <path 
              d="M 12 35 Q 10 40, 10 45 Q 10 50, 12 52 Q 14 54, 18 55 Q 22 56, 30 56 Q 38 56, 42 55 Q 46 54, 48 52 Q 50 50, 50 45 Q 50 40, 48 35 Q 46 30, 42 28 Q 38 26, 30 26 Q 22 26, 18 28 Q 14 30, 12 35 Z" 
              fill="url(#bowlGradient)" 
              filter="url(#bowlGlow)"
              className="group-hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
            />
            
            {/* Bowl rim highlight */}
            <ellipse 
              cx="30" 
              cy="35" 
              rx="19" 
              ry="3" 
              fill="url(#bowlHighlight)"
            />
            
            {/* Bowl inner shadow */}
            <path 
              d="M 12 35 Q 10 40, 10 45 Q 10 50, 12 52 Q 14 54, 18 55 Q 22 56, 30 56 Q 38 56, 42 55 Q 46 54, 48 52 Q 50 50, 50 45 Q 50 40, 48 35" 
              fill="none"
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
            />
            
            {/* Food mound inside bowl */}
            <ellipse 
              cx="30" 
              cy="38" 
              rx="18" 
              ry="12" 
              fill="url(#foodGradient)"
            />
            
            {/* Food highlight */}
            <ellipse 
              cx="30" 
              cy="35" 
              rx="14" 
              ry="8" 
              fill="url(#foodHighlight)"
            />
            
            {/* Food texture/details */}
            <circle cx="24" cy="38" r="2" fill="#f59e0b" opacity="0.7" />
            <circle cx="30" cy="40" r="1.5" fill="#10b981" opacity="0.7" />
            <circle cx="36" cy="38" r="2" fill="#14b8a6" opacity="0.7" />
            <circle cx="27" cy="42" r="1.5" fill="#f59e0b" opacity="0.6" />
            <circle cx="33" cy="42" r="1.5" fill="#10b981" opacity="0.6" />
          </svg>
        </div>
      </div>
      
      {/* Text Label */}
      <div className="hidden sm:block backdrop-blur-md bg-white/8 px-3 py-1.5 rounded-lg border border-white/15 group-hover:bg-white/12 transition-all">
        <p className="text-white font-black text-xs tracking-tight">Know Before</p>
        <p className="text-slate-300 font-bold text-[10px] -mt-0.5 tracking-tight">You Go</p>
      </div>
    </div>
  );
}

export default Logo;

