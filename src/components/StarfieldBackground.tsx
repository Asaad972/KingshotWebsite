'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

const STAR_COUNT = 70;

/** A subtle, lightweight recreation of a starry-night background video the
 * user wanted, without shipping the actual 26MB clip -- a handful of
 * softly-twinkling, gently-drifting canvas stars over a slow-drifting
 * nebula gradient (the gradient reuses the same .gradient-flow keyframe
 * already used sparingly elsewhere, kept to a very low opacity so it reads
 * as ambient texture, not a competing animated element). Each star drifts
 * at its own slow, slightly-varied velocity (not just twinkling in place)
 * and wraps around the edges, so the motion actually reads as "moving"
 * rather than a static field of blinking dots. Respects
 * prefers-reduced-motion by drawing one static frame instead of animating.
 * Rendered once in the root layout (applies sitewide) -- a fixed
 * full-viewport layer that paints behind the page's normal content simply
 * by coming first in the DOM, no z-index needed. */
export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars: Star[] = [];
    let raf = 0;
    let lastTime = 0;

    function resize() {
      if (!canvas) return;
      const prevW = canvas.width || window.innerWidth;
      const prevH = canvas.height || window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Rescale existing stars to the new size on resize instead of
      // regenerating, so the field doesn't visibly "jump" on orientation
      // changes -- only (re)create it the first time.
      if (stars.length === 0) {
        stars = Array.from({ length: STAR_COUNT }, () => {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 0.012 + 0.004;
          return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.006, // slight overall upward drift
            radius: Math.random() * 1.1 + 0.4,
            baseAlpha: Math.random() * 0.35 + 0.25,
            twinkleSpeed: Math.random() * 0.6 + 0.2,
            phase: Math.random() * Math.PI * 2,
          };
        });
      } else {
        const scaleX = canvas.width / prevW;
        const scaleY = canvas.height / prevH;
        for (const s of stars) {
          s.x *= scaleX;
          s.y *= scaleY;
        }
      }
    }

    function draw(time: number) {
      if (!ctx || !canvas) return;
      const dt = lastTime ? Math.min(time - lastTime, 100) : 16;
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        if (!reduceMotion) {
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          if (s.x < -5) s.x = canvas.width + 5;
          if (s.x > canvas.width + 5) s.x = -5;
          if (s.y < -5) s.y = canvas.height + 5;
          if (s.y > canvas.height + 5) s.y = -5;
        }
        const alpha = reduceMotion ? s.baseAlpha : s.baseAlpha + Math.sin(time * 0.001 * s.twinkleSpeed + s.phase) * 0.25;
        ctx.beginPath();
        ctx.fillStyle = `rgba(226, 232, 255, ${Math.max(0, alpha)})`;
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    if (reduceMotion) draw(0);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 20% 15%, rgba(59,66,140,0.16) 0%, transparent 60%), radial-gradient(ellipse 70% 45% at 85% 70%, rgba(30,58,95,0.14) 0%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-flow 40s ease-in-out infinite',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
