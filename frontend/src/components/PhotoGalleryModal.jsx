import { useEffect } from 'react';

function PhotoGalleryModal({ photos, restaurantName, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h3 className="text-white font-semibold text-lg">{restaurantName}</h3>
          <p className="text-slate-500 text-sm">{photos.length} photo{photos.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-3xl leading-none transition"
          aria-label="Close gallery"
        >
          ×
        </button>
      </div>

      <div
        className="flex-1 overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {photos.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`${restaurantName} — photo ${i + 1}`}
              className="w-full rounded-2xl object-cover aspect-video bg-white/5"
              loading="lazy"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotoGalleryModal;
