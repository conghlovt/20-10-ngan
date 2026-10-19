import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PhotoItem } from '../types/photo';

interface PhotoAlbumModalProps {
  photos: PhotoItem[];
  onClose?: () => void;
  effectsEnabled?: boolean;
}

export const PhotoAlbumModal: React.FC<PhotoAlbumModalProps> = ({ photos, onClose, effectsEnabled = true }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [orbitAngle, setOrbitAngle] = useState(0);
  useEffect(() => {
    if (!effectsEnabled || selected !== null) return;
    let frame: number;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      setOrbitAngle(angle => (angle + delta * 0.52) % (Math.PI * 2));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [effectsEnabled, selected]);
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (selected !== null) setSelected(null); else onClose?.(); }
      if (selected !== null && e.key === 'ArrowRight') setSelected((selected + 1) % photos.length);
      if (selected !== null && e.key === 'ArrowLeft') setSelected((selected - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selected, photos.length, onClose]);

  const iconButton = 'p-3 rounded-full bg-black/60 text-white hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-cyan-300 cursor-pointer';
  return (
    <div onClick={e => e.stopPropagation()} className="fixed inset-0 z-[100000] overflow-y-auto bg-[#060914]">
      {effectsEnabled && (
        <div aria-hidden="true" className="memory-effects fixed inset-0 overflow-hidden pointer-events-none">
          <div className="memory-nebula absolute -left-24 top-[12%] w-96 h-96 rounded-full bg-cyan-500/10 blur-[90px]" />
          <div className="memory-nebula absolute -right-24 bottom-[8%] w-96 h-96 rounded-full bg-fuchsia-500/10 blur-[90px]" style={{ animationDelay: '-9s' }} />
          {Array.from({ length: 48 }, (_, i) => (
            <span key={i} className="memory-star absolute rounded-full bg-cyan-100 shadow-[0_0_8px_rgba(165,243,252,0.7)]" style={{ left: `${(i * 37 + 7) % 100}%`, top: `${(i * 61 + 11) % 100}%`, width: i % 4 === 0 ? 3 : 2, height: i % 4 === 0 ? 3 : 2, animationDelay: `${-i * .43}s`, animationDuration: `${3 + i % 5}s` }} />
          ))}
          {[0, 1, 2].map(i => <span key={`comet-${i}`} className="memory-comet absolute h-px w-28 bg-gradient-to-r from-transparent to-cyan-100/80" style={{ left: `${15 + i * 30}%`, top: `${12 + i * 25}%`, animationDelay: `${i * 4}s` }} />)}
          {Array.from({ length: 7 }, (_, i) => <span key={`heart-${i}`} className="memory-heart absolute text-pink-300/40 text-sm" style={{ left: `${8 + i * 14}%`, bottom: '-30px', animationDelay: `${-i * 3}s`, animationDuration: `${18 + i * 2}s` }}>♡</span>)}
        </div>
      )}
      {onClose && <button onClick={onClose} aria-label="Close gallery" className={`fixed right-3 top-3 z-40 ${iconButton}`}><X /></button>}
      <div className="relative min-h-[100dvh] w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center overflow-hidden">
        <div aria-hidden="true" className="absolute w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
          {/* 3D Planet & 9-Photo Orbit Stage */}
          <div className="relative w-full h-[320px] sm:h-[350px] flex items-center justify-center my-2 select-none">
            {effectsEnabled && <div aria-hidden="true" className="memory-halo absolute w-56 h-56 rounded-full border border-cyan-300/15 shadow-[0_0_45px_rgba(34,211,238,0.12)] pointer-events-none" />}
            {/* Dashed Elliptical Orbit Ring */}
            <svg
              className="absolute w-[330px] sm:w-[390px] h-[150px] sm:h-[175px] pointer-events-none opacity-45"
              viewBox="0 0 400 180"
            >
              <ellipse
                cx="200"
                cy="90"
                rx="185"
                ry="68"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.6"
                strokeDasharray="5,6"
                transform="rotate(-8 200 90)"
              />
            </svg>

            {/* The Center 3D Blue-Indigo Planet Sphere (zIndex 15) */}
            <div
              className="relative z-[15] w-[140px] h-[140px] sm:w-[156px] sm:h-[156px] rounded-full pointer-events-none transition-transform duration-500"
              style={{
                background:
                  'radial-gradient(circle at 34% 28%, #dbeafe 0%, #93c5fd 18%, #3b82f6 48%, #1d4ed8 74%, #0f172a 98%)',
                boxShadow:
                  '0 0 65px rgba(59, 130, 246, 0.45), inset -18px -20px 35px rgba(15, 23, 42, 0.85), inset 8px 8px 22px rgba(255, 255, 255, 0.35)',
              }}
            />

            {/* Orbiting Photo Slots */}
            {photos.map((photo, idx) => {
              const total = Math.max(photos.length, 1);
              const angle = orbitAngle + (idx * Math.PI * 2) / total;
              const rx = typeof window !== 'undefined' && window.innerWidth < 500 ? 136 : 168;
              const ry = typeof window !== 'undefined' && window.innerWidth < 500 ? 54 : 64;

              // Elliptical coordinates with slight tilt (-8 deg)
              const rawX = Math.cos(angle) * rx;
              const rawY = Math.sin(angle) * ry;
              const tilt = -0.14;
              const x = rawX * Math.cos(tilt) - rawY * Math.sin(tilt);
              const y = rawX * Math.sin(tilt) + rawY * Math.cos(tilt);

              // Depth: sin(angle) > 0 is in front of the planet, < 0 is behind the planet
              const depth = Math.sin(angle);
              const scale = 0.72 + ((depth + 1) / 2) * 0.38; // 0.72 at back -> 1.10 at front
              const zIndex = depth >= 0 ? 20 + Math.round(depth * 10) : 5 + Math.round((depth + 1) * 8);
              const opacity = depth >= 0 ? 1 : 0.52 + ((depth + 1) / 2) * 0.38;

              return (
                <div
                  key={photo.id}
                  onClick={() => setSelected(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View photo ${idx + 1}`}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(idx); } }}
                  style={{
                    transform: `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
                    zIndex,
                    opacity,
                  }}
                  className="absolute w-[68px] h-[78px] sm:w-[76px] sm:h-[86px] rounded-[18px] cursor-pointer transition-shadow duration-200 hover:brightness-110"
                >
                    <div className="w-full h-full rounded-[18px] border-[2.5px] border-white/95 bg-slate-900 overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.55)]">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                </div>
              );
            })}
          </div>
          <p className="relative mt-2 px-4 text-center text-sm sm:text-base font-sans-vn text-cyan-200/85">
            Chạm vào ảnh để phóng to và xem rõ hơn
          </p>
      </div>
      {selected !== null && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8" onClick={() => setSelected(null)}>
          <figure className="m-0 flex max-h-[90dvh] w-full max-w-[640px] flex-col items-center gap-4 overflow-y-auto rounded-[30px] border-2 border-teal-400/60 bg-[#0b1324] px-4 py-5 sm:px-8 sm:py-6 shadow-[0_0_60px_rgba(45,212,191,0.18)]" onClick={e => e.stopPropagation()}>
            <img src={photos[selected].url} alt={photos[selected].caption} className="min-h-0 max-w-full max-h-[62dvh] shrink-0 rounded-[28px] sm:rounded-[48px] object-contain shadow-2xl" />
            <figcaption className="w-full max-w-lg pb-1 text-center font-sans-vn">
              <h2 className="text-lg sm:text-2xl font-bold text-white">{photos[selected].caption}</h2>
              <p className="mt-2 text-sm sm:text-lg leading-relaxed text-cyan-200/85">{photos[selected].subCaption}</p>
            </figcaption>
          </figure>
          <button autoFocus onClick={() => setSelected(null)} aria-label="Close photo" className={`absolute right-3 top-3 ${iconButton}`}><X /></button>
          <button onClick={e => { e.stopPropagation(); setSelected((selected - 1 + photos.length) % photos.length); }} aria-label="Previous photo" className={`absolute left-2 sm:left-6 ${iconButton}`}><ChevronLeft /></button>
          <button onClick={e => { e.stopPropagation(); setSelected((selected + 1) % photos.length); }} aria-label="Next photo" className={`absolute right-2 sm:right-6 ${iconButton}`}><ChevronRight /></button>
        </div>
      )}
    </div>
  );
};
