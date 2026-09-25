import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * React Bits - Interactive Floating Particles & Constellation Background
 * Inspired by reactbits.dev/backgrounds/particles
 * Ultra-smooth 60fps canvas animation with cursor reactivity and theme adaptation
 */
export function ReactBitsBackground({
  quantity = 45,
  staticity = 50,
  ease = 50,
  className = '',
}) {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const context = useRef(null);
  const circles = useRef([]);
  const mousePosition = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  const { isDark } = useTheme();

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext('2d');
    }
    initCanvas();
    animate();
    window.addEventListener('resize', initCanvas);

    return () => {
      window.removeEventListener('resize', initCanvas);
    };
  }, [isDark]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.current.x, mousePosition.current.y]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.current.x - rect.left - w / 2;
      const y = mousePosition.current.y - rect.top - h / 2;
      const inside = mousePosition.current.x < rect.right && mousePosition.current.x > rect.left && mousePosition.current.y < rect.bottom && mousePosition.current.y > rect.top;
      if (inside) {
        mouse.current.x = x;
        mouse.current.y = y;
      }
    }
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current.length = 0;
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const translateX = 0;
    const translateY = 0;
    const pSize = Math.floor(Math.random() * 2) + 1.2;
    const alpha = 0;
    const targetAlpha = parseFloat((Math.random() * 0.5 + 0.15).toFixed(2));
    const dx = (Math.random() - 0.5) * 0.4;
    const dy = (Math.random() - 0.5) * 0.4;
    const magnetism = 0.1 + Math.random() * 4;
    return {
      x,
      y,
      translateX,
      translateY,
      size: pSize,
      alpha,
      targetAlpha,
      dx,
      dy,
      magnetism,
    };
  };

  const drawParticles = () => {
    circles.current.length = 0;
    for (let i = 0; i < quantity; i++) {
      circles.current.push(circleParams());
    }
  };

  const drawCircle = (circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);
      
      // Color based on theme: emerald in dark mode, teal/slate in light mode
      if (isDark) {
        context.current.fillStyle = `rgba(52, 211, 153, ${alpha * 0.8})`;
      } else {
        context.current.fillStyle = `rgba(16, 185, 129, ${alpha * 0.55})`;
      }
      
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  const clearContext = () => {
    if (context.current) {
      context.current.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
    }
  };

  const drawLines = () => {
    if (!context.current) return;
    const length = circles.current.length;
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        const c1 = circles.current[i];
        const c2 = circles.current[j];
        const dist = Math.hypot(
          (c1.x + c1.translateX) - (c2.x + c2.translateX),
          (c1.y + c1.translateY) - (c2.y + c2.translateY)
        );
        if (dist < 85) {
          const lineAlpha = (1 - dist / 85) * (isDark ? 0.15 : 0.08);
          context.current.beginPath();
          context.current.moveTo(c1.x + c1.translateX, c1.y + c1.translateY);
          context.current.lineTo(c2.x + c2.translateX, c2.y + c2.translateY);
          context.current.strokeStyle = isDark
            ? `rgba(52, 211, 153, ${lineAlpha})`
            : `rgba(16, 185, 129, ${lineAlpha})`;
          context.current.lineWidth = 0.8;
          context.current.stroke();
        }
      }
    }
  };

  const animate = () => {
    clearContext();
    drawLines();
    circles.current.forEach((circle, i) => {
      // Edge collision check
      const edge = [
        circle.x + circle.translateX - circle.size,
        canvasSize.current.w - circle.x - circle.translateX - circle.size,
        circle.y + circle.translateY - circle.size,
        canvasSize.current.h - circle.y - circle.translateY - circle.size,
      ];
      const closestEdge = edge.reduce((a, b) => Math.min(a, b));
      const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
      if (remapClosestEdge > 1) {
        circle.alpha += 0.02;
        if (circle.alpha > circle.targetAlpha) {
          circle.alpha = circle.targetAlpha;
        }
      } else {
        circle.alpha = circle.targetAlpha * remapClosestEdge;
      }
      circle.x += circle.dx;
      circle.y += circle.dy;
      circle.translateX += ((mouse.current.x / (staticity / circle.magnetism)) - circle.translateX) / ease;
      circle.translateY += ((mouse.current.y / (staticity / circle.magnetism)) - circle.translateY) / ease;

      // Wrap around screen
      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current[i] = circleParams();
      } else {
        drawCircle(circle, true);
      }
    });
    window.requestAnimationFrame(animate);
  };

  const remapValue = (value, start1, stop1, start2, stop2) => {
    const rel = (value - start1) / (stop1 - start1);
    return start2 + rel * (stop2 - start2);
  };

  const handlePointerMove = (e) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      ref={canvasContainerRef}
      onMouseMove={handlePointerMove}
      className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Subtle Dot Grid overlay for tactile depth */}
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.18]"
        style={{
          backgroundImage: isDark
            ? `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`
            : `radial-gradient(rgba(16,185,129,0.2) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Floating subtle aurora ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-emerald-500/10 via-teal-400/8 to-indigo-500/10 dark:from-emerald-500/15 dark:via-cyan-500/10 dark:to-indigo-500/15 rounded-full blur-[120px]" />
      
      {/* 60fps Interactive Canvas Particles */}
      <canvas ref={canvasRef} />
    </div>
  );
}
