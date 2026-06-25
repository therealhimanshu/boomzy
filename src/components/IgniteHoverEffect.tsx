import { useEffect, useRef } from "react";

export default function IgniteHoverEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // Set styling of parent to relative if not already set, to ensure absolute canvas is bounded
    const parentStyle = window.getComputedStyle(parent);
    if (parentStyle.position === "static") {
      parent.style.position = "relative";
    }

    // Resize canvas to match parent
    const resizeCanvas = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();

    // Use ResizeObserver to track responsive parent changes
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(parent);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      gravity: number;
    }

    const particles: Particle[] = [];
    let isHovered = false;
    let lastX = 0;
    let lastY = 0;
    let hasMoved = false;
    let animationFrameId: number | null = null;

    const colors = [
      "rgba(255, 140, 0, ", // Fire Orange
      "rgba(252, 212, 0, ", // Electric Yellow-Gold
      "rgba(255, 69, 0, ",  // Deep Red-Orange
      "rgba(255, 240, 180, " // Bright Spark White-Gold
    ];

    const spawnEmbers = (rect: DOMRect) => {
      if (!isHovered) return;
      
      // Gentle ambient sparks drifting up from the bottom boundary of the card
      if (Math.random() < 0.12) {
        particles.push({
          x: Math.random() * rect.width,
          y: rect.height + 4,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(0.4 + Math.random() * 0.9),
          size: 0.8 + Math.random() * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.5 + Math.random() * 0.5,
          decay: 0.006 + Math.random() * 0.008,
          gravity: -0.01 // light hot-air float upward
        });
      }
    };

    const spawnSpark = (x: number, y: number) => {
      // Tiny cluster of micro-sparks on cursor trace
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3, // Upward drag
          size: 0.7 + Math.random() * 1.4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.7 + Math.random() * 0.3,
          decay: 0.016 + Math.random() * 0.018, // micro-embers dissolve faster
          gravity: 0.02 // slight weight gravity downward fall
        });
      }
    };

    const drawParticles = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      ctx.clearRect(0, 0, rect.width, rect.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        // Clean up out of bounds or invisible items
        if (p.alpha <= 0 || p.x < -10 || p.x > rect.width + 10 || p.y < -10 || p.y > rect.height + 10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color + "1)";
        ctx.shadowBlur = 4;
        ctx.shadowColor = p.color + "0.8)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const tick = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = parent.getBoundingClientRect();
      spawnEmbers(rect);
      drawParticles(ctx, rect);

      // Animation loop only spins if mouse is hovered OR there are particles physically active on screen
      if (isHovered || particles.length > 0) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
        animationFrameId = null;
      }
    };

    const onMouseEnter = () => {
      isHovered = true;
      hasMoved = false;
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    const onMouseLeave = () => {
      isHovered = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only ignite sparks if cursor actually moves to save resources
      if (!hasMoved) {
        lastX = x;
        lastY = y;
        hasMoved = true;
        return;
      }

      const dist = Math.hypot(x - lastX, y - lastY);
      if (dist > 3) { // 3px threshold
        spawnSpark(x, y);
        lastX = x;
        lastY = y;
      }

      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    parent.addEventListener("mouseenter", onMouseEnter, { passive: true });
    parent.addEventListener("mouseleave", onMouseLeave, { passive: true });
    parent.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      parent.removeEventListener("mouseenter", onMouseEnter);
      parent.removeEventListener("mouseleave", onMouseLeave);
      parent.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-3xl"
      style={{ mixBlendMode: "screen", backfaceVisibility: "hidden" }}
    />
  );
}
