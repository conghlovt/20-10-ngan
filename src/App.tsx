/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PhotoItem } from './types/photo';
import { DEFAULT_PHOTOS } from './data/defaultPhotos';
import { PhotoAlbumModal } from './components/PhotoAlbumModal';
const MISS_LINES: Record<number, string[]> = {
  1: ['Ui, hụt mất rồi! Chạm đúng trái tim hồng nha.', 'Tim ở bên kia kìa! Công chờ cậu bắt lại nè.', 'Suýt trúng rồi! Thử thêm lần nữa cùng Công nhé.'],
  2: ['Hoa mọc ở đồng cỏ phía dưới cơ, cậu ơi!', 'Công chưa thấy hoa đâu… chạm vào bãi cỏ nhé.', 'Xuống dưới một chút nữa là tới khu vườn rồi!'],
  3: ['Ối, ngôi sao ở phía trên kìa!', 'Công đang chờ điều ước… chạm đúng một ngôi sao nhé.', 'Suýt chạm tới sao rồi! Cậu thử lại nha.'],
  4: ['Giữ chiếc cỏ bốn lá thêm một chút để nhận quà nha!', 'Công hồi hộp quá… cậu tìm chiếc cỏ xanh nhé!', 'Gần tới món quà rồi! Chạm và giữ cỏ bốn lá nha.'],
};



interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  caught: boolean;
}

interface PlantedFlower {
  id: number;
  x: number;
  color: string;
  height: number;
}

const INITIAL_HEARTS: FloatingHeart[] = [
  { id: 1, x: 22, y: 62, size: 34, delay: 0, caught: false },
  { id: 2, x: 76, y: 58, size: 38, delay: 0.4, caught: false },
  { id: 3, x: 48, y: 72, size: 36, delay: 0.8, caught: false },
  { id: 4, x: 28, y: 80, size: 32, delay: 1.2, caught: false },
  { id: 5, x: 72, y: 76, size: 35, delay: 0.6, caught: false },
];

export default function App() {
  // Audio & visual effect states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [effectsEnabled, setEffectsEnabled] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Story chapter (0..4) & sub-step within chapter 0
  // Chapter 0: Wake up Pi & 20/10 intro
  // Chapter 1: Catch floating hearts (5 hearts)
  // Chapter 2: Plant 3 flowers in glowing grass
  // Chapter 3: Light up 3 wishing stars in constellation
  // Chapter 4: Hold 4-leaf clover to open Memory Planet
  const [chapter, setChapter] = useState<number>(0);
  const [introSubStep, setIntroSubStep] = useState<number>(0); // 0: sleeping, 1: woke up, 2: 20/10 reminder, 3: ready
  const [isAlbumOpen, setIsAlbumOpen] = useState<boolean>(false);

  // Chapter 1 state: Catching hearts
  const [hearts, setHearts] = useState<FloatingHeart[]>(INITIAL_HEARTS);

  // Chapter 2 state: Planting 3 flowers
  const [flowers, setFlowers] = useState<PlantedFlower[]>([]);

  // Chapter 3 state: Lighting 3 wishing stars
  const [litStars, setLitStars] = useState<boolean[]>([false, false, false]);

  // Chapter 4 state: Holding 4-leaf clover (0..100)
  const [cloverProgress, setCloverProgress] = useState<number>(0);
  const [isHoldingClover, setIsHoldingClover] = useState<boolean>(false);
  const [cloverCompleted, setCloverCompleted] = useState<boolean>(false);
  const holdIntervalRef = useRef<number | null>(null);

  // Typewriter state
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const fullTextRef = useRef<string>('');

  // Blinking animation for Pi's eyes
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  const photos = DEFAULT_PHOTOS;
  const [miss, setMiss] = useState<{ text: string; mood: 'puzzled' | 'sad' | 'surprised'; id: number; x: number; y: number } | null>(null);
  const missCount = useRef(0);
  useEffect(() => { setMiss(null); }, [chapter, isAlbumOpen]);
  useEffect(() => {
    if (!miss) return;
    const timer = window.setTimeout(() => setMiss(null), 3500);
    return () => clearTimeout(timer);
  }, [miss]);
  const reactToMiss = (e: React.MouseEvent | React.PointerEvent) => {
    const index = missCount.current++ % 3;
    setMiss({ text: MISS_LINES[chapter][index], mood: (['puzzled', 'sad', 'surprised'] as const)[index], id: Date.now(), x: e.clientX, y: e.clientY });
  };

  // Periodic natural eye blink when Pi is awake
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (chapter === 0 && introSubStep === 0) return;
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 170);
    }, 3800);
    return () => clearInterval(interval);
  }, [chapter, introSubStep]);

  // Determine the current narrative line based on chapter & progress
  const getCurrentDialogue = useCallback((): string => {
    if (chapter === 0) {
      if (introSubStep === 0) return 'Công đang ngủ... chạm vào đâu đó để đánh thức nhé';
      if (introSubStep === 1) return 'Ơ... Cậu đến rồi hả? Làm tớ ngủ quên mất tiêu!';
      if (introSubStep === 2)
        return 'Mà tớ quên mất, hôm nay là ngày 20/10 — ngày đặc biệt của Cậu đó!';
      return 'Tớ có chuẩn bị vài điều bất ngờ cho Cậu. Chạm nhẹ để tiếp tục nha!';
    }

    if (chapter === 1) {
      const caughtCount = hearts.filter((h) => h.caught).length;
      if (caughtCount === 0) return 'Cậu giúp tớ bắt mấy trái tim đang trốn nha';
      if (caughtCount < 5)
        return `Hay quá! Cậu bắt được ${caughtCount} trái tim rồi, bắt nốt nha!`;
      return 'Giỏi quá! Cậu bắt hết rồi, tim tớ ấm hẳn lên';
    }

    if (chapter === 2) {
      const count = flowers.length;
      if (count === 0) return 'Chạm vào đồng cỏ để trồng 3 bông hoa thật xinh cho ngày 20/10 nhé';
      if (count === 1) return 'Bông hoa đầu tiên nở rồi, thơm dịu dàng như nụ cười của Cậu vậy';
      if (count === 2) return 'Thêm một bông nữa nè, cả khu vườn đang rực rỡ hẳn lên';
      return 'Bông cuối cùng nở rồi! Chúc Cậu lúc nào cũng rạng rỡ như hoa nhé';
    }

    if (chapter === 3) {
      const starCount = litStars.filter(Boolean).length;
      if (starCount === 0) return 'Trên bầu trời có 3 ngôi sao điều ước, Cậu chạm vào từng ngôi sao nhé';
      if (starCount === 1)
        return 'Chúc Cậu thật nhiều sức khỏe, ăn ngon ngủ kỹ, chẳng lo muộn phiền';
      if (starCount === 2)
        return 'Chúc Cậu luôn xinh đẹp, tự tin và ngập tràn niềm vui mỗi ngày';
      return 'Ba điều ước bay lên trời hết rồi, tớ nghe thấy tiếng vỗ tay đó';
    }

    if (chapter === 4) {
      if (!cloverCompleted) {
        return 'Cậu giữ chặt nó một chút để nhận quà nha';
      }
      return 'Cỏ 4 lá may mắn đã thuộc về Cậu! Cùng bay tới Hành tinh kỷ niệm nha!';
    }

    return '';
  }, [chapter, introSubStep, hearts, flowers.length, litStars, cloverCompleted]);

  // Run typewriter effect whenever dialogue changes
  useEffect(() => {
    const target = miss?.text ?? getCurrentDialogue();
    fullTextRef.current = target;

    if (chapter === 0 && introSubStep === 0) {
      setTypedText(target);
      setIsTyping(false);
      return;
    }

    setTypedText('');
    setIsTyping(true);
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 1;
      setTypedText(target.slice(0, idx));
      if (idx >= target.length) {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 28);

    return () => clearInterval(timer);
  }, [getCurrentDialogue, chapter, introSubStep, miss]);

  // Ensure audio starts playing on first user interaction
  const ensureAudioPlaying = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {});
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          audio.muted = false;
          setIsPlaying(true);
        })
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Clover hold progress loop
  useEffect(() => {
    if (isHoldingClover && !cloverCompleted) {
      holdIntervalRef.current = window.setInterval(() => {
        setCloverProgress((prev) => {
          const next = prev + 4;
          if (next >= 100) {
            setCloverCompleted(true);
            setIsHoldingClover(false);
            setTimeout(() => {
              setIsAlbumOpen(true);
            }, 950);
            return 100;
          }
          return next;
        });
      }, 40);
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
        holdIntervalRef.current = null;
      }
    }
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [isHoldingClover, cloverCompleted]);

  // Helper to plant a flower in Chapter 2
  const plantNextFlower = (clientX?: number) => {
    if (flowers.length >= 3) return;
    const colors = ['#f472b6', '#38bdf8', '#facc15'];
    const defaultPositions = [26, 52, 74];
    const xPercent =
      typeof clientX === 'number' && window.innerWidth > 0
        ? Math.min(82, Math.max(18, Math.round((clientX / window.innerWidth) * 100)))
        : defaultPositions[flowers.length];

    setFlowers((prev) => [
      ...prev,
      {
        id: Date.now() + prev.length,
        x: xPercent,
        color: colors[prev.length % colors.length],
        height: 95 + (prev.length % 2) * 20,
      },
    ]);
  };

  // Main screen tap handler for smooth progression
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    ensureAudioPlaying();

    const needsTarget = (chapter === 1 && hearts.some(h => !h.caught)) ||
      (chapter === 2 && flowers.length < 3) ||
      (chapter === 3 && litStars.some(s => !s)) ||
      (chapter === 4 && !cloverCompleted);
    if (needsTarget) { reactToMiss(e); return; }

    // If typewriter is still typing, complete the line immediately on first tap
    if (isTyping) {
      setTypedText(fullTextRef.current);
      setIsTyping(false);
      return;
    }

    if (chapter === 0) {
      if (introSubStep < 3) {
        setIntroSubStep((prev) => prev + 1);
      } else {
        setChapter(1);
      }
      return;
    }

    if (chapter === 1) {
      setChapter(2);
      return;
    }

    if (chapter === 2) {
      setChapter(3);
      return;
    }

    if (chapter === 3) {
      setChapter(4);
      return;
    }

    if (chapter === 4 && cloverCompleted) setIsAlbumOpen(true);
  };

  const handleCatchHeart = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    ensureAudioPlaying();
    setMiss(null);
    setHearts((prev) => prev.map((h) => (h.id === id ? { ...h, caught: true } : h)));
  };

  const handleTapStar = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    ensureAudioPlaying();
    setMiss(null);
    if (!litStars[idx]) {
      setLitStars((prev) => prev.map((s, i) => (i === idx ? true : s)));
    } else if (litStars.every(Boolean)) {
      setChapter(4);
    }
  };

  // Render highlighted keywords inside typed text (matching TikTok video styling)
  const renderStyledDialogue = (text: string) => {
    const highlights: { word: string; className: string }[] = [
      { word: 'tim', className: 'text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]' },
      { word: 'sức khỏe', className: 'text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]' },
      { word: 'xinh đẹp', className: 'text-pink-400 font-bold drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]' },
      { word: '20/10', className: 'text-cyan-300 font-bold drop-shadow-[0_0_8px_rgba(103,232,249,0.8)]' },
    ];

    for (const h of highlights) {
      const idx = text.indexOf(h.word);
      if (idx !== -1) {
        const before = text.slice(0, idx);
        const match = text.slice(idx, idx + h.word.length);
        const after = text.slice(idx + h.word.length);
        return (
          <>
            {before}
            <span className={h.className}>{match}</span>
            {after}
          </>
        );
      }
    }
    return text;
  };

  // Dynamic background gradient for each chapter matching TikTok video frames
  const getBackgroundStyle = () => {
    switch (chapter) {
      case 0:
        return 'bg-gradient-to-b from-[#050811] via-[#070b18] to-[#090d1d]';
      case 1:
        return 'bg-gradient-to-b from-[#1d0522] via-[#2c0834] to-[#3f112d]';
      case 2:
        return 'bg-gradient-to-b from-[#041320] via-[#062335] to-[#07313c]';
      case 3:
        return 'bg-gradient-to-b from-[#0d0722] via-[#1a0c3b] to-[#26114a]';
      case 4:
        return 'bg-gradient-to-b from-[#041d11] via-[#07331e] to-[#0a4929]';
      default:
        return 'bg-[#060913]';
    }
  };

  // Determine Pi's eye expression
  const getEyeMode = (): 'sleeping' | 'normal' | 'happy' | 'wink' | 'chevron' | 'puzzled' | 'sad' | 'surprised' => {
    if (miss) return miss.mood;
    if (chapter === 0 && introSubStep === 0) return 'sleeping';
    if (chapter === 0 && introSubStep === 2) return 'happy';
    if (chapter === 1) return 'happy';
    if (chapter === 2 && flowers.length >= 2) return 'wink';
    if (chapter === 3 && litStars.every(Boolean)) return 'happy';
    if (chapter === 4 && !cloverCompleted) return 'chevron';
    if (chapter === 4 && cloverCompleted) return 'happy';
    return 'normal';
  };

  const eyeMode = getEyeMode();
  const showBlush =
    eyeMode === 'happy' || (chapter === 1) || (chapter === 0 && introSubStep === 2);

  return (
    <div
      onClick={handleStageClick}
      className={`relative w-screen h-screen overflow-hidden select-none cursor-pointer transition-colors duration-700 ${getBackgroundStyle()}`}
    >
      {miss && effectsEnabled && <span key={miss.id} aria-hidden="true" className="fixed z-40 pointer-events-none text-cyan-200 text-3xl animate-miss-ring" style={{ left: miss.x, top: miss.y }}>?</span>}
      {/* Background Music */}
      <audio ref={audioRef} src="/pi-bgm.mp3" loop preload="auto" />

      {/* ============================================================
          TOP PROGRESS DOTS & CONTROLS (Exact match to TikTok video)
         ============================================================ */}
      <header
        onClick={(e) => e.stopPropagation()}
        className="absolute top-0 left-0 right-0 z-30 pt-5 px-4 flex items-start justify-between pointer-events-none"
      >
        {/* Left spacer for centering dots */}
        <div className="w-24 hidden sm:block" />

        {/* Center Progress Indicator Dots */}
        <div className="flex items-center gap-2 mx-auto pointer-events-auto py-1">
          {[0, 1, 2, 3, 4].map((idx) => {
            const isActive = chapter === idx && !isAlbumOpen;
            const isPassed = chapter > idx || isAlbumOpen;
            return (
              <button
                key={idx}
                onClick={() => {
                  ensureAudioPlaying();
                  setIsAlbumOpen(false);
                  setChapter(idx);
                  if (idx === 0 && introSubStep === 0) setIntroSubStep(1);
                }}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? 'w-7 h-2.5 bg-[#22d3ee] shadow-[0_0_14px_#22d3ee]'
                    : isPassed
                    ? 'w-2.5 h-2.5 bg-[#22d3ee]/80 shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                    : 'w-2.5 h-2.5 bg-slate-600/60 hover:bg-slate-400/70'
                }`}
                title={`Cảnh ${idx + 1}`}
                aria-label={`Chuyển đến cảnh ${idx + 1}`}
              />
            );
          })}
          {/* Final dot for Hành tinh kỷ niệm */}
          <button
            onClick={() => {
              ensureAudioPlaying();
              setIsAlbumOpen(true);
            }}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              isAlbumOpen
                ? 'w-7 h-2.5 bg-[#22d3ee] shadow-[0_0_14px_#22d3ee]'
                : 'w-2.5 h-2.5 bg-slate-600/60 hover:bg-pink-400/80'
            }`}
            title="Hành tinh kỷ niệm"
            aria-label="Mở Hành tinh kỷ niệm"
          />
        </div>

        {/* Right Audio Equalizer & Effect Toggle Pill Buttons */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Audio Equalizer Button */}
          <button
            onClick={toggleSound}
            className="w-14 h-9 rounded-full border border-cyan-400/35 bg-[#091326]/75 backdrop-blur-md flex items-center justify-center gap-1 shadow-[0_0_15px_rgba(34,211,238,0.15)] hover:border-cyan-300/70 transition-all cursor-pointer"
            title={isPlaying ? 'Tạm dừng nhạc' : 'Bật nhạc nền'}
            aria-label="Bật tắt nhạc nền"
          >
            {isPlaying ? (
              <div className="flex items-end gap-1 h-4">
                <span
                  className="w-1 bg-[#22d3ee] rounded-full shadow-[0_0_6px_#22d3ee]"
                  style={{ animation: 'eqBar1 0.65s ease-in-out infinite' }}
                />
                <span
                  className="w-1 bg-[#22d3ee] rounded-full shadow-[0_0_6px_#22d3ee]"
                  style={{ animation: 'eqBar2 0.55s ease-in-out infinite' }}
                />
                <span
                  className="w-1 bg-[#22d3ee] rounded-full shadow-[0_0_6px_#22d3ee]"
                  style={{ animation: 'eqBar3 0.75s ease-in-out infinite' }}
                />
                <span
                  className="w-1 bg-[#22d3ee] rounded-full shadow-[0_0_6px_#22d3ee]"
                  style={{ animation: 'eqBar4 0.6s ease-in-out infinite' }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
                <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
                <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
                <span className="w-1 h-1 rounded-full bg-[#22d3ee]" />
              </div>
            )}
          </button>

          {/* Effects Toggle Button ("Hiệu ứng: bật") */}
          <button
            onClick={() => setEffectsEnabled((prev) => !prev)}
            className="px-3.5 py-1 rounded-full border border-cyan-400/30 bg-[#091326]/75 backdrop-blur-md text-xs font-mono-vn text-slate-200 hover:border-cyan-300/60 transition-all cursor-pointer"
          >
            Hiệu ứng: {effectsEnabled ? 'bật' : 'tắt'}
          </button>
        </div>
      </header>

      {/* ============================================================
          AMBIENT BOKEH / FIREFLY PARTICLES PER CHAPTER
         ============================================================ */}
      {effectsEnabled && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Chapter 1: Warm glowing pink & amber bokeh at bottom */}
          {chapter === 1 && (
            <>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[360px] h-[320px] rounded-full bg-amber-500/15 blur-[90px]" />
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={`c1-p-${i}`}
                  className="absolute rounded-full animate-float-slow"
                  style={{
                    width: `${8 + (i % 4) * 4}px`,
                    height: `${8 + (i % 4) * 4}px`,
                    left: `${(i * 19) % 96}%`,
                    bottom: `${(i * 11) % 38}%`,
                    background: i % 2 === 0 ? '#f472b6' : '#fb923c',
                    boxShadow:
                      i % 2 === 0 ? '0 0 12px #f472b6' : '0 0 12px #fb923c',
                    opacity: 0.65,
                    animationDelay: `${(i * 0.3) % 4}s`,
                  }}
                />
              ))}
            </>
          )}

          {/* Chapter 2: Golden fireflies in the garden */}
          {chapter === 2 &&
            Array.from({ length: 26 }).map((_, i) => (
              <div
                key={`c2-p-${i}`}
                className="absolute rounded-full animate-float-slow"
                style={{
                  width: `${7 + (i % 3) * 4}px`,
                  height: `${7 + (i % 3) * 4}px`,
                  left: `${(i * 17) % 95}%`,
                  top: `${25 + ((i * 23) % 65)}%`,
                  background: '#fde047',
                  boxShadow: '0 0 14px #facc15',
                  opacity: 0.6,
                  animationDelay: `${(i * 0.35) % 4}s`,
                }}
              />
            ))}

          {/* Chapter 3: Starry night dust */}
          {chapter === 3 &&
            Array.from({ length: 24 }).map((_, i) => (
              <div
                key={`c3-p-${i}`}
                className="absolute rounded-full animate-float-slow"
                style={{
                  width: `${5 + (i % 3) * 3}px`,
                  height: `${5 + (i % 3) * 3}px`,
                  left: `${(i * 37 + (i * i * 13)) % 94}%`,
                  top: `${8 + ((i * 53 + i * 7) % 82)}%`,
                  background: i % 3 === 0 ? '#e9d5ff' : '#c084fc',
                  boxShadow: '0 0 10px rgba(233,213,255,0.8)',
                  opacity: 0.55,
                  animationDelay: `${(i * 0.4) % 4}s`,
                }}
              />
            ))}

          {/* Chapter 4: Magical emerald bokeh orbs */}
          {chapter === 4 &&
            Array.from({ length: 24 }).map((_, i) => (
              <div
                key={`c4-p-${i}`}
                className="absolute rounded-full animate-float-slow"
                style={{
                  width: `${10 + (i % 4) * 5}px`,
                  height: `${10 + (i % 4) * 5}px`,
                  left: `${(i * 41 + i * i * 11) % 94}%`,
                  bottom: `${(i * 19 + i * 7) % 42}%`,
                  background: '#4ade80',
                  boxShadow: '0 0 18px #4ade80',
                  opacity: 0.5,
                  animationDelay: `${(i * 0.25) % 3.5}s`,
                }}
              />
            ))}
        </div>
      )}

      {/* ============================================================
          CHAPTER 3 CONSTELLATION STARS (Top Half of Screen)
         ============================================================ */}
      {chapter === 3 && (
        <div className="absolute top-[9%] sm:top-[10%] left-1/2 -translate-x-1/2 w-[330px] sm:w-[420px] h-[185px] z-20 pointer-events-none">
          {/* Constellation connecting lines when stars are lit */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 185">
            {litStars[0] && litStars[1] && (
              <line
                x1="68"
                y1="138"
                x2="210"
                y2="38"
                stroke="#fde047"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />
            )}
            {litStars[1] && litStars[2] && (
              <line
                x1="210"
                y1="38"
                x2="352"
                y2="138"
                stroke="#fde047"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />
            )}
          </svg>

          {/* Left Star (Star 0) */}
          <button
            onClick={(e) => handleTapStar(0, e)}
            style={{ left: '16%', top: '74%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110"
            aria-label="Ngôi sao điều ước 1"
          >
            <svg
              width="68"
              height="68"
              viewBox="0 0 100 100"
              className={
                litStars[0]
                  ? 'drop-shadow-[0_0_25px_rgba(253,224,71,0.95)] scale-110 transition-all'
                  : 'opacity-45 hover:opacity-75 transition-all'
              }
            >
              <polygon
                points="50,8 63,36 93,40 71,61 76,91 50,76 24,91 29,61 7,40 37,36"
                fill={litStars[0] ? '#fde047' : '#a1885c'}
                stroke={litStars[0] ? '#fef9c3' : '#cbd5e1'}
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Top Center Star (Star 1) */}
          <button
            onClick={(e) => handleTapStar(1, e)}
            style={{ left: '50%', top: '21%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110"
            aria-label="Ngôi sao điều ước 2"
          >
            <svg
              width="72"
              height="72"
              viewBox="0 0 100 100"
              className={
                litStars[1]
                  ? 'drop-shadow-[0_0_25px_rgba(253,224,71,0.95)] scale-110 transition-all'
                  : 'opacity-45 hover:opacity-75 transition-all'
              }
            >
              <polygon
                points="50,8 63,36 93,40 71,61 76,91 50,76 24,91 29,61 7,40 37,36"
                fill={litStars[1] ? '#fde047' : '#a1885c'}
                stroke={litStars[1] ? '#fef9c3' : '#cbd5e1'}
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Right Star (Star 2) */}
          <button
            onClick={(e) => handleTapStar(2, e)}
            style={{ left: '84%', top: '74%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer transition-transform duration-300 hover:scale-110"
            aria-label="Ngôi sao điều ước 3"
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 100 100"
              className={
                litStars[2]
                  ? 'drop-shadow-[0_0_25px_rgba(253,224,71,0.95)] scale-110 transition-all'
                  : 'opacity-45 hover:opacity-75 transition-all'
              }
            >
              <polygon
                points="50,8 63,36 93,40 71,61 76,91 50,76 24,91 29,61 7,40 37,36"
                fill={litStars[2] ? '#fde047' : '#a1885c'}
                stroke={litStars[2] ? '#fef9c3' : '#cbd5e1'}
                strokeWidth="4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* ============================================================
          CENTER CHARACTER: PI'S GLOWING CYAN EYES & DIALOGUE
         ============================================================ */}
      <main className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 text-center pointer-events-none">
        {/* Pi's Eyes Container */}
        <div key={miss?.id ?? 'idle'} className={`relative flex flex-col items-center mb-7 ${miss && effectsEnabled ? 'animate-pi-miss' : ''}`}>
          {/* Ambient Cyan Aura Behind Eyes */}
          <div
            className={`absolute -inset-10 rounded-full blur-[48px] transition-opacity duration-700 ${
              eyeMode === 'sleeping'
                ? 'bg-cyan-500/20 opacity-60'
                : 'bg-cyan-400/35 opacity-95'
            }`}
          />

          {/* The Two Eyes */}
          <div className="relative flex items-center gap-7 sm:gap-8 h-[82px]">
            {[0, 1].map((eyeIdx) => {
              if (eyeMode === 'puzzled' || eyeMode === 'sad' || eyeMode === 'surprised') {
                return <div key={eyeIdx} className="bg-cyan-300 shadow-[0_0_30px_#22d3ee] transition-all duration-200" style={{ width: eyeMode === 'surprised' ? 52 : 70, height: eyeMode === 'sad' ? 22 : eyeMode === 'puzzled' && eyeIdx === 1 ? 30 : 64, borderRadius: eyeMode === 'surprised' ? '50%' : '20px', transform: `rotate(${eyeMode === 'sad' ? (eyeIdx === 0 ? -15 : 15) : eyeMode === 'puzzled' ? (eyeIdx === 0 ? -10 : 10) : 0}deg)` }} />;
              }
              if (eyeMode === 'sleeping') {
                return (
                  <div
                    key={eyeIdx}
                    className="w-[70px] h-[26px] rounded-t-full bg-cyan-400/45 shadow-[0_0_22px_rgba(34,211,238,0.45)] transition-all duration-500"
                  />
                );
              }

              if (eyeMode === 'happy') {
                return (
                  <div
                    key={eyeIdx}
                    className="w-[72px] h-[30px] rounded-t-full bg-gradient-to-b from-[#a5f3fc] to-[#22d3ee] shadow-[0_0_32px_#22d3ee] transition-all duration-300"
                  />
                );
              }

              if (eyeMode === 'chevron') {
                return (
                  <div
                    key={eyeIdx}
                    className="w-[72px] h-[70px] rounded-[22px] bg-gradient-to-br from-[#67e8f9]/85 to-[#06b6d4]/85 shadow-[0_0_32px_rgba(34,211,238,0.75)] flex items-center justify-center transition-all duration-300"
                  >
                    <span className="text-4xl font-extrabold text-[#a7f3d0] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] font-mono-vn">
                      {eyeIdx === 0 ? '>' : '<'}
                    </span>
                  </div>
                );
              }

              const isWinkingRight = eyeMode === 'wink' && eyeIdx === 1;

              return (
                <div
                  key={eyeIdx}
                  style={{
                    transform: isBlinking ? 'scaleY(0.12)' : 'scaleY(1)',
                  }}
                  className={`w-[72px] ${
                    isWinkingRight ? 'h-[48px]' : 'h-[70px]'
                  } rounded-[22px] bg-gradient-to-br from-[#cffafe] via-[#67e8f9] to-[#22d3ee] shadow-[0_0_36px_#22d3ee] transition-all duration-200`}
                />
              );
            })}
          </div>

          {/* Cute Pink Blush Marks ("////   ////") */}
          {showBlush && (
            <div className="flex items-center justify-between w-[180px] mt-3 text-pink-400/90 font-mono-vn text-sm sm:text-base tracking-widest font-bold drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]">
              <span>////</span>
              <span>////</span>
            </div>
          )}
        </div>

        {/* Typewriter Dialogue Line */}
        <div className="min-h-[68px] max-w-md flex flex-col items-center justify-center">
          <p
            aria-live="polite"
            className={`text-base sm:text-xl font-mono-vn leading-relaxed tracking-wide ${
              chapter === 0 && introSubStep === 0
                ? 'text-cyan-300/80 drop-shadow-[0_0_10px_rgba(34,211,238,0.45)]'
                : 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]'
            }`}
          >
            {renderStyledDialogue(typedText)}
            {!(chapter === 0 && introSubStep === 0) && (
              <span className="inline-block w-2.5 h-5 ml-1 align-middle bg-[#22d3ee] shadow-[0_0_10px_#22d3ee] animate-cursor-blink" />
            )}
          </p>

          {/* Sub-counters matching video */}
          {chapter === 1 && (
            <div className="mt-5 text-sm sm:text-base font-mono-vn text-pink-200/80">
              trái tim đã bắt: {hearts.filter((h) => h.caught).length}/5
            </div>
          )}

          {chapter === 2 && (
            <div className="mt-5 text-sm sm:text-base font-mono-vn text-cyan-200/80">
              hoa đã trồng: {flowers.length}/3
            </div>
          )}

          {chapter === 3 && (
            <div className="mt-5 text-sm sm:text-base font-mono-vn text-purple-200/80">
              điều ước: {litStars.filter(Boolean).length}/3
            </div>
          )}
        </div>
      </main>

      {/* ============================================================
          CHAPTER 1 INTERACTIVE FLOATING HEARTS
         ============================================================ */}
      {chapter === 1 && (
        <div className="absolute inset-0 z-25 pointer-events-none">
          {hearts.map(
            (h) =>
              !h.caught && (
                <button
                  key={h.id}
                  onClick={(e) => handleCatchHeart(h.id, e)}
                  style={{
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    animationDelay: `${h.delay}s`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer animate-heart-float hover:scale-125 transition-transform p-2"
                  aria-label="Bắt trái tim"
                >
                  <svg
                    width={h.size}
                    height={h.size}
                    viewBox="0 0 24 24"
                    fill="#f43f5e"
                    className="drop-shadow-[0_0_16px_rgba(244,63,94,0.9)]"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              )
          )}
        </div>
      )}

      {/* ============================================================
          CHAPTER 2 GLOWING GRASS GARDEN & PLANTED FLOWERS
         ============================================================ */}
      {chapter === 2 && (
        <div onClick={(e) => { if (flowers.length >= 3) return; e.stopPropagation(); ensureAudioPlaying(); setMiss(null); plantNextFlower(e.clientX); }} className="absolute bottom-0 left-0 right-0 h-[220px] z-20 pointer-events-auto overflow-hidden" role="button" tabIndex={0} aria-label="Plant a flower" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMiss(null); plantNextFlower(); } }}>
          {/* Planted Flowers */}
          {flowers.map((flower) => (
            <div
              key={flower.id}
              style={{ left: `${flower.x}%` }}
              className="absolute bottom-4 -translate-x-1/2 flex flex-col items-center animate-grass-sway"
            >
              {/* Flower Petals */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div
                  className="w-11 h-11 rounded-full blur-[2px]"
                  style={{
                    background: flower.color,
                    boxShadow: `0 0 20px ${flower.color}`,
                  }}
                />
                <div className="absolute w-4 h-4 rounded-full bg-yellow-200 shadow-[0_0_8px_#fef08a]" />
              </div>
              {/* Stem */}
              <div
                style={{ height: `${flower.height}px` }}
                className="w-1.5 bg-gradient-to-t from-emerald-600 to-lime-300 rounded-full shadow-[0_0_10px_#4ade80]"
              />
            </div>
          ))}

          {/* Swaying Neon Green Grass Blades along bottom (Exact match to frame_05.jpg) */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-1">
            {Array.from({ length: 42 }).map((_, i) => {
              const height = 70 + ((i * 29) % 95);
              return (
                <div
                  key={i}
                  style={{
                    height: `${height}px`,
                    animationDelay: `${(i * 0.15) % 2.5}s`,
                  }}
                  className="w-1 sm:w-1.5 rounded-t-full bg-gradient-to-t from-[#16a34a] via-[#4ade80] to-[#bef264] shadow-[0_0_12px_rgba(74,222,128,0.65)] animate-grass-sway"
                />
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================
          CHAPTER 4 GLOWING 4-LEAF CLOVER WITH HOLD RING (frame_08.jpg)
         ============================================================ */}
      {chapter === 4 && (
        <div
          onClick={(e) => { e.stopPropagation(); if (cloverCompleted) setIsAlbumOpen(true); }}
          onPointerDown={(e) => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); ensureAudioPlaying(); setMiss(null); setIsHoldingClover(true); }}
          onPointerUp={(e) => { setIsHoldingClover(false); if (!cloverCompleted) { setCloverProgress(0); reactToMiss(e); } }}
          onPointerCancel={() => { setIsHoldingClover(false); setCloverProgress(0); }}
          className="absolute bottom-[16%] right-[12%] sm:right-[28%] z-30 pointer-events-auto cursor-pointer group select-none touch-none"
          title="Chạm hoặc giữ chặt cỏ 4 lá để nhận quà"
        >
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Ambient Green Glow */}
            <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-[32px] group-hover:bg-emerald-400/50 transition-all" />

            {/* Circular Hold Progress Ring */}
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#4ade80"
                strokeWidth="4"
                strokeOpacity="0.35"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#86efac"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 52}
                strokeDashoffset={2 * Math.PI * 52 * (1 - cloverProgress / 100)}
                strokeLinecap="round"
                className="drop-shadow-[0_0_12px_#4ade80] transition-all duration-75"
              />
            </svg>

            {/* 4-Leaf Clover SVG */}
            <svg
              className="absolute w-28 h-28 drop-shadow-[0_0_18px_#4ade80] group-active:scale-95 transition-transform"
              viewBox="0 0 120 140"
            >
              {/* Top Leaf */}
              <path
                d="M60 55 C45 30 35 18 50 12 C56 9 60 15 60 20 C60 15 64 9 70 12 C85 18 75 30 60 55 Z"
                fill="rgba(74, 222, 128, 0.45)"
                stroke="#86efac"
                strokeWidth="3"
              />
              {/* Bottom Leaf */}
              <path
                d="M60 55 C45 80 35 92 50 98 C56 101 60 95 60 90 C60 95 64 101 70 98 C85 92 75 80 60 55 Z"
                fill="rgba(74, 222, 128, 0.45)"
                stroke="#86efac"
                strokeWidth="3"
              />
              {/* Left Leaf */}
              <path
                d="M60 55 C35 40 23 30 17 45 C14 51 20 55 25 55 C20 55 14 59 17 65 C23 80 35 70 60 55 Z"
                fill="rgba(74, 222, 128, 0.45)"
                stroke="#86efac"
                strokeWidth="3"
              />
              {/* Right Leaf */}
              <path
                d="M60 55 C85 40 97 30 103 45 C106 51 100 55 95 55 C100 55 106 59 103 65 C97 80 85 70 60 55 Z"
                fill="rgba(74, 222, 128, 0.45)"
                stroke="#86efac"
                strokeWidth="3"
              />
              {/* Center Glow Dot */}
              <circle cx="60" cy="55" r="3.5" fill="#ffffff" />
              {/* Stem */}
              <path
                d="M60 58 Q58 95 66 130"
                fill="none"
                stroke="#86efac"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* ============================================================
          BOTTOM QUICK SKIP LINK (Leads directly to Hành tinh kỷ niệm)
         ============================================================ */}
      {!isAlbumOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-5 left-5 right-5 z-30 flex items-center justify-between pointer-events-none"
        >
          <button
            onClick={() => {
              ensureAudioPlaying();
              setIsAlbumOpen(true);
            }}
            className="pointer-events-auto text-xs sm:text-sm font-mono-vn text-slate-400/85 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            Bỏ qua, đến Hành tinh kỷ niệm ›
          </button>

          <button
            onClick={handleStageClick as any}
            className="pointer-events-auto px-3.5 py-1.5 rounded-full border border-cyan-400/30 bg-[#091326]/70 text-cyan-200/90 hover:text-white hover:border-cyan-300 text-xs font-mono-vn transition-all cursor-pointer"
          >
            Tiếp tục ›
          </button>
        </div>
      )}

      {/* ============================================================
          HÀNH TINH KỶ NIỆM & 10 CÂU HỎI (PhotoAlbumModal)
         ============================================================ */}
      {isAlbumOpen && (
        <PhotoAlbumModal
          photos={photos}
          onClose={() => setIsAlbumOpen(false)}
          effectsEnabled={effectsEnabled}
        />
      )}
    </div>
  );
}
