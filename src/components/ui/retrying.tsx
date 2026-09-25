"use client";

import React, { useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import * as THREE from 'three';

// --- Main Hero Component ---
export const GravitationalMeshHero = ({
  headline = "Retrying Digital",
  subtitle = "“Let’s keep that cinematic backdrop energy, but move the mouse ‘vibe’ for something with a ‘Reteyinh burn’ intensity.”"
}: {
  headline?: string;
  subtitle?: string;
}) => {
  const textControls = useAnimation();
  const buttonControls = useAnimation();

  useEffect(() => {
    textControls.start(i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04 + 0.3,
        duration: 1.0,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }));
    buttonControls.start({
      opacity: 1,
      transition: { delay: 1.2, duration: 0.8 }
    });
  }, [textControls, buttonControls]);

  return (
    <div className="relative flex min-h-[580px] h-[75vh] w-full flex-col items-center justify-center overflow-hidden bg-[#070b14] text-white rounded-3xl border border-slate-800/80 shadow-2xl my-6">
      <MeshCanvas />
      
      {/* Subtle overlay gradient to ensure text readability */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#070b14]/40 to-[#070b14]/80 pointer-events-none z-[1]" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none select-none">
        
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Interactive 3D WebGL Gravitational Field
        </div>

        <h1 
          className="text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl" 
          style={{ textShadow: '0 0 40px rgba(16, 185, 129, 0.35)' }}
        >
          {headline.split("").map((char, i) => (
            <motion.span key={i} custom={i} initial={{ opacity: 0, y: 50 }} animate={textControls} style={{ display: 'inline-block' }}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          custom={headline.length}
          initial={{ opacity: 0, y: 30 }}
          animate={textControls}
          className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-300 font-medium leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={buttonControls}
          className="mt-8 flex items-center justify-center gap-3 text-xs text-emerald-400/90 font-mono tracking-wide"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Hover or move your cursor to bend the 3D gravitational vertex field
        </motion.div>
      </div>
    </div>
  );
};

// --- Three.js Canvas Component ---
const MeshCanvas = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 1000);
    camera.position.set(0, -2, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    container.appendChild(renderer.domElement);

    const mouse = new THREE.Vector2(0, 0);
    const targetMouse = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    // --- Gravitational Mesh with baseline visibility and dynamic warp crest ---
    const geometry = new THREE.PlaneGeometry(35, 35, 60, 60);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Color(0x10b981) }, // Radiant Emerald wireframe
        uGlowColor: { value: new THREE.Color(0x38bdf8) } // Cyan peak glow
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vIntensity;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Distance from vertex to mouse position in world space
          float mouseDist = distance(pos.xy, uMouse * 14.0);
          
          // Gravitational warp peak (stronger and wider radius)
          float warp = 1.0 - smoothstep(0.0, 7.5, mouseDist);
          pos.z += warp * 4.2;
          vIntensity = warp;

          // Undulating ambient wave ripples across the entire plane
          pos.z += sin(pos.x * 0.4 + uTime * 1.2) * cos(pos.y * 0.4 + uTime * 1.0) * 0.65;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uGlowColor;
        varying float vIntensity;
        varying vec2 vUv;

        void main() {
          // Guaranteed baseline visibility (0.35) so the 3D grid is ALWAYS visible
          float alpha = clamp(0.35 + vIntensity * 0.65, 0.0, 1.0);
          
          // Color shifts from emerald to bright cyan on gravitational warp
          vec3 finalColor = mix(uColor, uGlowColor, vIntensity);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      wireframe: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -0.65; // Tilted towards the camera for dramatic 3D perspective
    scene.add(mesh);

    // Track mouse within the container or window
    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      targetMouse.set(x, y);
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.lerp(targetMouse, 0.06);

      material.uniforms.uTime.value = elapsedTime;
      material.uniforms.uMouse.value.copy(mouse);

      // Gentle rotation for lively 3D floating effect
      mesh.rotation.z = Math.sin(elapsedTime * 0.2) * 0.05;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth && newHeight) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 w-full h-full overflow-hidden" />;
};
