/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Sparkles, Heart } from 'lucide-react';
import { PhotoItem } from '../types/photo';

interface GreetingCardModalProps {
  photo: PhotoItem;
  onClose: () => void;
}

export const GreetingCardModal: React.FC<GreetingCardModalProps> = ({ photo, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [greetingText, setGreetingText] = useState<string>(
    'Chúc cậu ngày 20/10 luôn xinh đẹp, rạng rỡ và ngập tràn hạnh phúc!'
  );
  const [recipientName, setRecipientName] = useState<string>('Cô Gái Dễ Thương');

  useEffect(() => {
    drawCard();
  }, [photo, greetingText, recipientName]);

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 800;
    const height = 1100;
    canvas.width = width;
    canvas.height = height;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090b14');
    bgGrad.addColorStop(0.5, '#161226');
    bgGrad.addColorStop(1, '#1b0d20');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative outer border
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    ctx.strokeStyle = 'rgba(147, 197, 253, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 38, width - 76, height - 76);

    // Header Title
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#f472b6';
    ctx.fillText('HAPPY VIETNAMESE WOMEN\'S DAY', width / 2, 85);

    ctx.font = 'bold 36px "Be Vietnam Pro", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('CHÚC MỪNG 20/10', width / 2, 135);

    // Tiny Robot Stamp
    ctx.font = 'bold 24px "Roboto Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('[ • ‿ • ] ~ Tiny', width / 2, 175);

    // Draw the image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Photo frame position
      const frameX = 100;
      const frameY = 210;
      const frameW = 600;
      const frameH = 580;

      // Polaroid white backing
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetY = 12;
      ctx.fillRect(frameX - 16, frameY - 16, frameW + 32, frameH + 32);
      ctx.shadowColor = 'transparent';

      // Draw image inside photo area
      ctx.save();
      ctx.beginPath();
      ctx.rect(frameX, frameY, frameW, frameH);
      ctx.clip();

      // Cover scaling
      const imgRatio = img.width / img.height;
      const frameRatio = frameW / frameH;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > frameRatio) {
        drawH = frameH;
        drawW = img.width * (frameH / img.height);
        drawX = frameX - (drawW - frameW) / 2;
        drawY = frameY;
      } else {
        drawW = frameW;
        drawH = img.height * (frameW / img.width);
        drawX = frameX;
        drawY = frameY - (drawH - frameH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // Golden photo corners
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 3;
      // top-left
      ctx.strokeRect(frameX - 10, frameY - 10, 20, 20);
      // top-right
      ctx.strokeRect(frameX + frameW - 10, frameY - 10, 20, 20);

      // Recipient & Caption
      ctx.textAlign = 'center';
      ctx.font = 'bold 28px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#fbcfe8';
      ctx.fillText(`Gửi: ${recipientName}`, width / 2, 880);

      ctx.font = 'italic 20px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`"${photo.caption}"`, width / 2, 920);

      ctx.font = '18px "Be Vietnam Pro", sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText(greetingText, width / 2, 965);

      // Footer note
      ctx.font = '14px "Roboto Mono", monospace';
      ctx.fillStyle = 'rgba(147, 197, 253, 0.7)';
      ctx.fillText('Nguyện chúc mọi điều may mắn & bình an luôn đến với cậu 🌸', width / 2, 1025);
    };

    img.src = photo.url;
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `thiep-20-10-${photo.caption.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div
      style={{ fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif" }}
      className="fixed inset-0 z-[100010] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in pointer-events-auto font-sans"
    >
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-900/95 border border-pink-500/40 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,114,182,0.3)] text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-pink-300">
          <Sparkles className="w-5 h-5 text-pink-400" />
          <h3 className="text-xl font-bold font-sans">Tạo Thiệp Chúc Mừng 20/10</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Canvas Preview */}
          <div className="flex flex-col items-center">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[340px] rounded-xl shadow-2xl border border-pink-400/30"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-1">Tên người nhận:</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400"
                placeholder="Nhập tên người nhận..."
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-cyan-300 mb-1">Lời chúc 20/10:</label>
              <textarea
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400 resize-none"
                placeholder="Nhập lời chúc ngọt ngào..."
              />
            </div>

            <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-500/20 text-xs text-pink-200">
              <p className="flex items-center gap-1 font-semibold mb-1">
                <Heart className="w-3.5 h-3.5 text-pink-400" /> Gợi ý lời chúc:
              </p>
              <ul className="space-y-1 list-disc pl-4 text-slate-300">
                <li
                  className="cursor-pointer hover:text-pink-300"
                  onClick={() => setGreetingText('Chúc cậu luôn vui vẻ, xinh đẹp và ngập tràn hạnh phúc mỗi ngày!')}
                >
                  "Chúc cậu luôn vui vẻ, xinh đẹp và ngập tràn hạnh phúc mỗi ngày!"
                </li>
                <li
                  className="cursor-pointer hover:text-pink-300"
                  onClick={() => setGreetingText('Ngày 20/10 chúc người con gái tuyệt vời nhất luôn nhận được những điều ngọt ngào nhất!')}
                >
                  "Ngày 20/10 chúc người con gái tuyệt vời nhất luôn nhận được những điều ngọt ngào nhất!"
                </li>
              </ul>
            </div>

            <button
              onClick={handleDownload}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold text-sm shadow-[0_0_20px_rgba(244,114,182,0.4)] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Tải Thiệp Chúc Mừng Về Máy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
