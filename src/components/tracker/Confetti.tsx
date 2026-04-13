"use client";

import { useEffect, useRef } from "react";

interface ConfettiProps {
  active: boolean;
  intensity: "normal" | "big";
}

const NORMAL_COLORS = ["#7C6AFF", "#A78BFA", "#34D399"];
const BIG_COLORS = ["#7C6AFF", "#A78BFA", "#34D399", "#FFD700", "#FF6EB4", "#60A5FA", "#22D3EE", "#FB923C"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  s: number;
  col: string;
  rot: number;
  rs: number;
  life: number;
  shape: "rect" | "circle";
}

export default function Confetti({ active, intensity }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isBig = intensity === "big";
    const colors = isBig ? BIG_COLORS : NORMAL_COLORS;
    const count = isBig ? 100 : 28;
    const spread = isBig ? 200 : 90;
    const maxFrames = isBig ? 180 : 70;
    const lifeDec = isBig ? 0.007 : 0.018;
    const minSize = isBig ? 4 : 3;
    const maxSize = isBig ? 9 : 5;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const shape: "rect" | "circle" = isBig && Math.random() > 0.5 ? "circle" : "rect";
      particles.push({
        x: cx + (Math.random() - 0.5) * spread,
        y: cy + (Math.random() - 0.5) * spread,
        vx: (Math.random() - 0.5) * (isBig ? 8 : 5),
        vy: (Math.random() - 0.8) * (isBig ? 10 : 7),
        s: minSize + Math.random() * (maxSize - minSize),
        col: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * Math.PI * 2,
        rs: (Math.random() - 0.5) * 0.4,
        life: 1,
        shape,
      });
    }

    let frame = 0;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        alive = true;

        p.vy += 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rs;
        p.life -= lifeDec;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.col;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.s / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        }

        ctx.restore();
      }

      frame++;
      if (alive && frame < maxFrames) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [active, intensity]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
