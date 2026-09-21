"use client";

// A grid of faint dots that light up and gently orbit their base position
// near the cursor. Pure canvas, no dependencies. Idle dots cost nothing more
// than a fixed 2D draw call; the orbit math only runs for dots the pointer
// has actually lit up, so the steady-state cost of this on a page nobody is
// touching is a single flat re-render per frame.
//
// Colors are read from the site's own CSS variables (--line, --accent) at
// resize/theme-change time rather than hardcoded, so this follows light/dark
// mode and the paper palette instead of importing a foreign color scheme.
//
// Respects prefers-reduced-motion: dots still light up near the pointer
// (useful signal, not just decoration) but hold still instead of orbiting.

import { useEffect, useRef } from "react";

const SPACING = 28;
const DOT_RADIUS = 1.3;
const IMPACT_RADIUS = 120;
const MAX_ORBIT = 13;
const ORBIT_SPEED = 4.5;
const RISE = 20;
const FALL = 90;

interface Dot {
  bx: number;
  by: number;
  inc: number;
  asc: number;
  ph: number;
  a: number;
}

export function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999 };
    let last: number | null = null;
    let raf = 0;

    function colors() {
      const s = getComputedStyle(document.documentElement);
      return {
        base: s.getPropertyValue("--line").trim() || "rgba(150,150,150,.3)",
        glow: s.getPropertyValue("--accent").trim() || "rgba(180,85,45,.9)",
      };
    }

    function build() {
      dots = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          dots.push({
            bx: i * SPACING,
            by: j * SPACING,
            inc: (Math.random() * 2 - 1) * 1.3,
            asc: Math.random() * Math.PI * 2,
            ph: Math.random() * Math.PI * 2,
            a: 0,
          });
        }
      }
    }

    function orbit(d: Dot, time: number) {
      const r = d.a * MAX_ORBIT;
      if (r <= 0) return { dx: 0, dy: 0, depth: 0 };
      const a = d.ph + time * ORBIT_SPEED;
      const ox = r * Math.cos(a);
      const oy = r * Math.sin(a);
      const ci = Math.cos(d.inc);
      const si = Math.sin(d.inc);
      const y1 = oy * ci;
      const z1 = oy * si;
      const ca = Math.cos(d.asc);
      const sa = Math.sin(d.asc);
      return {
        dx: ox * ca - y1 * sa,
        dy: ox * sa + y1 * ca,
        depth: r > 0 ? z1 / r : 0,
      };
    }

    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const c = colors();
      for (const d of dots) {
        let x = d.bx;
        let y = d.by;
        let depth = 0;
        if (!reduce && d.a > 0) {
          const o = orbit(d, time);
          x += o.dx;
          y += o.dy;
          depth = o.depth;
        }
        const t = d.a;
        if (t > 0) {
          const scale = 1 + depth * 0.4;
          const radius = Math.max(0.5, (DOT_RADIUS + t * 1.4) * scale);
          const alpha = Math.min(
            1,
            0.3 + t * 0.7 * (0.65 + 0.35 * ((depth + 1) / 2)),
          );
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = c.glow;
          ctx.globalAlpha = alpha;
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = c.base;
          ctx.globalAlpha = 1;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    function step(dt: number) {
      for (const d of dots) {
        const dx = d.bx - mouse.x;
        const dy = d.by - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const prox = dist < IMPACT_RADIUS ? 1 - dist / IMPACT_RADIUS : 0;
        const t = prox * prox;
        const rate = t > d.a ? RISE : FALL;
        d.a += (t - d.a) * Math.min(1, dt * rate);
        if (d.a < 0.0008) d.a = 0;
      }
    }

    function statDraw() {
      for (const d of dots) {
        const dx = d.bx - mouse.x;
        const dy = d.by - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const prox = dist < IMPACT_RADIUS ? 1 - dist / IMPACT_RADIUS : 0;
        d.a = prox * prox;
      }
      draw(0);
    }

    function resize() {
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      draw(0);
    }

    function loop(ts: number) {
      if (last === null) last = ts;
      const dt = Math.min(0.05, (ts - last) / 1000);
      last = ts;
      step(dt);
      draw(ts / 1000);
      raf = requestAnimationFrame(loop);
    }

    function move(x: number, y: number) {
      mouse.x = x;
      mouse.y = y;
      if (reduce) statDraw();
    }

    const onResize = () => resize();
    const onMouseMove = (e: MouseEvent) => move(e.clientX, e.clientY);
    const onMouseLeave = () => move(-9999, -9999);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches[0]) {
        move(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => move(-9999, -9999);

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    // Theme toggles swap --line/--accent on <html data-theme>; redraw so the
    // grid picks up the new palette immediately instead of on next move.
    const themeObserver = new MutationObserver(() => {
      if (reduce) statDraw();
      else draw(last ? last / 1000 : 0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    if (!reduce) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 block"
    />
  );
}
