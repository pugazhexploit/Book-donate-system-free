// components/TubesCursor.tsx
"use client";

import { useEffect, useRef } from "react";

type TubesCursorProps = {
  title?: string;
  subtitle?: string;
  caption?: string;
  initialColors?: string[];   // tubes base colors
  lightColors?: string[];     // lights colors
  lightIntensity?: number;    // lights intensity
  titleSize?: string;         // Tailwind text size classes
  subtitleSize?: string;
  captionSize?: string;
  enableRandomizeOnClick?: boolean;
  className?: string;         // extra classes for wrapper
};

const TubesCursor = ({
  title = "Tubes",
  subtitle = "Cursor",
  caption = "WebGPU / WebGL",
  initialColors = ["#f967fb", "#53bc28", "#6958d5"],
  lightColors = ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
  lightIntensity = 200,
  titleSize = "text-[80px]",
  subtitleSize = "text-[60px]",
  captionSize = "text-base",
  enableRandomizeOnClick = true,
  className = "",
}: TubesCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<any>(null);

  useEffect(() => {
    let removeClick: (() => void) | null = null;
    let destroyed = false;

    (async () => {
      let TubesCursorCtor: any = null;

      try {
        // Primary: Load from CDN with vite ignore
        // @ts-ignore
        const mod = await import(
          /* @vite-ignore */
          /* webpackIgnore: true */
          "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js"
        );
        TubesCursorCtor = (mod as any).default ?? mod;
      } catch (e) {
        try {
          // Offline / Local fallback from installed npm package
          // @ts-ignore
          const localMod = await import("threejs-components/build/cursors/tubes1.min.js");
          TubesCursorCtor = (localMod as any).default ?? localMod;
        } catch (err) {
          console.warn("Failed to load TubesCursor module:", err);
          return;
        }
      }

      if (!canvasRef.current || destroyed || !TubesCursorCtor) return;

      try {
        const app = TubesCursorCtor(canvasRef.current, {
          tubes: {
            colors: initialColors,
            lights: {
              intensity: lightIntensity,
              colors: lightColors,
            },
          },
        });

        appRef.current = app;

        if (enableRandomizeOnClick) {
          const handler = () => {
            const colors = randomColors(initialColors.length);
            const lights = randomColors(lightColors.length);
            app?.tubes?.setColors?.(colors);
            app?.tubes?.setLightsColors?.(lights);
          };
          document.body.addEventListener("click", handler);
          removeClick = () =>
            document.body.removeEventListener("click", handler);
        }
      } catch (initErr) {
        console.warn("Error initializing TubesCursor app:", initErr);
      }
    })();

    return () => {
      destroyed = true;
      if (removeClick) removeClick();
      try {
        appRef.current?.dispose?.();
        appRef.current = null;
      } catch {
        // ignore
      }
    };
  }, [initialColors, lightColors, lightIntensity, enableRandomizeOnClick]);

  return (
    <div className={`relative min-h-[500px] h-[75vh] w-full overflow-hidden rounded-3xl bg-[#070b14] border border-slate-800 shadow-2xl ${className}`}>
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full pointer-events-auto" />

      {/* Hero text */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-2 select-none pointer-events-none px-4 text-center">
        {title && (
          <h1
            className={`m-0 p-0 text-white font-black uppercase leading-none drop-shadow-[0_0_25px_rgba(0,0,0,0.9)] ${titleSize}`}
          >
            {title}
          </h1>
        )}
        {subtitle && (
          <h2
            className={`m-0 p-0 text-emerald-400 font-extrabold uppercase leading-none drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] ${subtitleSize}`}
          >
            {subtitle}
          </h2>
        )}
        {caption && (
          <p
            className={`m-0 p-0 text-slate-300 font-medium leading-none drop-shadow-[0_0_15px_rgba(0,0,0,0.9)] mt-2 ${captionSize}`}
          >
            {caption}
          </p>
        )}
      </div>
    </div>
  );
};

function randomColors(count: number) {
  return new Array(count).fill(0).map(
    () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
  );
}

export { TubesCursor };
