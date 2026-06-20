/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { CELESTIAL_BODIES, CelestialBody } from "../data";

interface SolarSystemCanvasProps {
  onSelectPlanet: (planet: CelestialBody) => void;
}

interface PlanetRenderConfig {
  id: string;
  name: string;
  color: string;
  radius: number;
  orbitRadius: number;
  orbitalSpeed: number; // Radian increment per frame
  angle: number;
  hasRings?: boolean;
}

export default function SolarSystemCanvas({ onSelectPlanet }: SolarSystemCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [simSpeed, setSimSpeed] = useState<number>(1); // Speed wrap: 0, 0.5, 1, 3, 10
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetRenderConfig | null>(null);
  const [showOrbitLines, setShowOrbitLines] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setHudCollapsed(false);
    }
  }, []);

  // Define scale renders
  // We place orbits sequentially for visual clarity (not strictly linear scale to avoid spacing out Uranus too far)
  const planetConfigs = useRef<PlanetRenderConfig[]>([
    { id: "mercury", name: "Mercury", color: "#a5a5a5", radius: 5, orbitRadius: 65, orbitalSpeed: 0.03, angle: Math.random() * Math.PI * 2 },
    { id: "earth", name: "Earth", color: "#3a82f6", radius: 8, orbitRadius: 105, orbitalSpeed: 0.015, angle: Math.random() * Math.PI * 2 },
    { id: "mars", name: "Mars", color: "#ef4444", radius: 6, orbitRadius: 140, orbitalSpeed: 0.011, angle: Math.random() * Math.PI * 2 },
    { id: "jupiter", name: "Jupiter", color: "#eab308", radius: 18, orbitRadius: 200, orbitalSpeed: 0.007, angle: Math.random() * Math.PI * 2 },
    { id: "saturn", name: "Saturn", color: "#fcd34d", radius: 15, orbitRadius: 260, orbitalSpeed: 0.005, angle: Math.random() * Math.PI * 2, hasRings: true },
    { id: "uranus", name: "Uranus", color: "#22d3ee", radius: 11, orbitRadius: 310, orbitalSpeed: 0.0035, angle: Math.random() * Math.PI * 2 },
    { id: "neptune", name: "Neptune", color: "#3b82f6", radius: 10, orbitRadius: 355, orbitalSpeed: 0.0025, angle: Math.random() * Math.PI * 2 },
    { id: "pluto", name: "Pluto", color: "#c4c5d6", radius: 4, orbitRadius: 395, orbitalSpeed: 0.0018, angle: Math.random() * Math.PI * 2 }
  ]);

  // Star patterns
  const stars = useRef<{ x: number; y: number; size: number; alpha: number }[]>([]);

  // Initialize background stars
  useEffect(() => {
    const starCount = 150;
    const tempStars = [];
    for (let i = 0; i < starCount; i++) {
      tempStars.push({
        x: Math.random() * 1200,
        y: Math.random() * 800,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.7 + 0.3
      });
    }
    stars.current = tempStars;
  }, []);

  // Sync canvas width & height with container bounds safely
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };

    handleResize();
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Core Render loop animation
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let localAngleIncrement = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const centerX = w / 2;
      const centerY = h / 2;

      // Calculate responsive orbit scale dynamically
      const responsiveScale = w < 768 ? Math.max(0.42, w / 920) : 1.0;

      // Clear with radial cosmic overlay
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, w, h);

      // Draw faint nebula background glow
      const nebulaGlow = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, Math.max(w, h) * 0.6);
      nebulaGlow.addColorStop(0, "rgba(79, 70, 229, 0.12)");
      nebulaGlow.addColorStop(0.5, "rgba(8, 10, 25, 0.55)");
      nebulaGlow.addColorStop(1, "rgba(2, 4, 10, 0.98)");
      ctx.fillStyle = nebulaGlow;
      ctx.fillRect(0, 0, w, h);

      // Draw twinkling background stars
      stars.current.forEach((star) => {
        star.alpha += (Math.random() - 0.5) * 0.08;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 0.9) star.alpha = 0.9;

        // scale positions relative to size
        const starX = (star.x / 1200) * w;
        const starY = (star.y / 800) * h;

        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(starX, starY, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Sun in the middle
      ctx.save();
      const sunBaseRadius = w < 768 ? 10 : 15;
      const sunBaseGlow = w < 768 ? 25 : 40;
      const sunGlow = ctx.createRadialGradient(centerX, centerY, 5 * zoom, centerX, centerY, sunBaseGlow * zoom);
      sunGlow.addColorStop(0, "rgba(254, 203, 0, 1)");
      sunGlow.addColorStop(0.3, "rgba(249, 115, 22, 0.8)");
      sunGlow.addColorStop(0.7, "rgba(239, 68, 68, 0.35)");
      sunGlow.addColorStop(1, "rgba(239, 68, 68, 0)");

      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunBaseGlow * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Sun Core Solid
      ctx.fillStyle = "#ffdd55";
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunBaseRadius * zoom, 0, Math.PI * 2);
      ctx.fill();

      // Sun flares sparkle effect
      ctx.strokeStyle = "rgba(254, 203, 0, 0.3)";
      ctx.lineWidth = 1.5;
      localAngleIncrement += 0.004;

      for (let i = 0; i < 8; i++) {
        const flareAngle = (i * Math.PI) / 4 + localAngleIncrement;
        const flareLength = ((w < 768 ? 14 : 20) + Math.sin(localAngleIncrement * 10 + i) * 6) * zoom;
        const fx = centerX + Math.cos(flareAngle) * flareLength;
        const fy = centerY + Math.sin(flareAngle) * flareLength;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(fx, fy);
        ctx.stroke();
      }
      ctx.restore();

      // Draw orbits & planets
      planetConfigs.current.forEach((planet) => {
        // Update angle based on state simulation speed
        if (simSpeed > 0) {
          planet.angle += planet.orbitalSpeed * simSpeed * 0.45;
        }

        const scaledOrbitRadius = planet.orbitRadius * zoom * responsiveScale * (0.6 + zoom * 0.1);

        // Draw orbital trail path
        if (showOrbitLines) {
          ctx.strokeStyle = hoveredPlanet?.id === planet.id ? "rgba(183, 196, 255, 0.35)" : "rgba(255, 255, 255, 0.08)";
          ctx.lineWidth = hoveredPlanet?.id === planet.id ? 2 : 1;
          ctx.beginPath();
          ctx.arc(centerX, centerY, scaledOrbitRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Calculate planet's coordinates
        const px = centerX + Math.cos(planet.angle) * scaledOrbitRadius;
        const py = centerY + Math.sin(planet.angle) * scaledOrbitRadius;

        // Pre-save coords for click actions
        (planet as any).renderX = px;
        (planet as any).renderY = py;
        (planet as any).scaledRadius = planet.radius * Math.max(0.6, zoom) * (w < 768 ? 0.75 : 1.0);

        // Draw Orbiting Earth's moon!
        if (planet.id === "earth") {
          const moonOrbitDist = (w < 768 ? 12 : 18) * Math.max(0.7, zoom);
          const moonAngle = planet.angle * 4 + localAngleIncrement * 2;
          const mx = px + Math.cos(moonAngle) * moonOrbitDist;
          const my = py + Math.sin(moonAngle) * moonOrbitDist;

          // Moon path
          if (showOrbitLines) {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.beginPath();
            ctx.arc(px, py, moonOrbitDist, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Moon Sphere
          ctx.fillStyle = "#8a90a0";
          ctx.beginPath();
          ctx.arc(mx, my, (w < 768 ? 1.8 : 2.5) * Math.max(0.7, zoom), 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw planetary rings (Saturn / Uranus / Jupiter faint)
        if (planet.hasRings) {
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(0.2); // Tilted flat rings

          // Rings
          ctx.strokeStyle = "rgba(240, 200, 100, 0.5)";
          ctx.lineWidth = (w < 768 ? 2.5 : 4) * Math.max(0.7, zoom);
          ctx.beginPath();
          ctx.ellipse(0, 0, planet.radius * 2 * Math.max(0.7, zoom) * (w < 768 ? 0.75 : 1.0), planet.radius * 0.7 * Math.max(0.7, zoom) * (w < 768 ? 0.75 : 1.0), 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Draw Planet Body Sphere
        ctx.save();
        const planetRad = planet.radius * Math.max(0.65, zoom) * (w < 768 ? 0.75 : 1.0);

        // Gradient depth
        const depthGrad = ctx.createRadialGradient(px - planetRad * 0.3, py - planetRad * 0.3, planetRad * 0.1, px, py, planetRad);
        depthGrad.addColorStop(0, "#ffffff");
        depthGrad.addColorStop(0.3, planet.color);
        depthGrad.addColorStop(1, "#020308");

        ctx.fillStyle = depthGrad;
        ctx.beginPath();
        ctx.arc(px, py, planetRad, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glow glow outline
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = w < 768 ? 6 : 10;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
        ctx.lineWidth = 0.5;
        ctx.stroke();
        ctx.restore();

        // Draw labeling directly on orbits if hovered or zoom-level allows
        if (hoveredPlanet?.id === planet.id) {
          ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1;
          const textMsg = `${planet.name}`;
          ctx.font = "bold 11px Space Grotesk, sans-serif";
          const measure = ctx.measureText(textMsg);

          // Draw speech bubble background
          const rx = px + 12;
          const ry = py - 12;
          ctx.beginPath();
          ctx.roundRect(rx, ry - 14, measure.width + 16, 20, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.fillText(textMsg, rx + 8, ry);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [simSpeed, zoom, showOrbitLines, hoveredPlanet]);

  // Click handler to open planetary modal
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Check click on actual planets or Sun center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const sunTargetDist = Math.hypot(clickX - centerX, clickY - centerY);
    if (sunTargetDist < 35 * zoom) {
      const sunData = CELESTIAL_BODIES.find((p) => p.id === "sun");
      if (sunData) onSelectPlanet(sunData);
      return;
    }

    // Check each planet config
    let clickedPlanet: PlanetRenderConfig | null = null;
    planetConfigs.current.forEach((planet) => {
      const rx = (planet as any).renderX;
      const ry = (planet as any).renderY;
      const radius = (planet as any).scaledRadius || planet.radius;

      if (rx !== undefined && ry !== undefined) {
        // give 15px extra touch target buffer for nice micro interaction
        const distance = Math.hypot(clickX - rx, clickY - ry);
        if (distance < radius + 15) {
          clickedPlanet = planet;
        }
      }
    });

    if (clickedPlanet) {
      const pData = CELESTIAL_BODIES.find((cd) => cd.id === (clickedPlanet as PlanetRenderConfig).id);
      if (pData) onSelectPlanet(pData);
    }
  };

  // Track cursor coordinates for responsive orbit highlights
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let activeHover: PlanetRenderConfig | null = null;
    planetConfigs.current.forEach((planet) => {
      const rx = (planet as any).renderX;
      const ry = (planet as any).renderY;
      const radius = (planet as any).scaledRadius || planet.radius;

      if (rx !== undefined && ry !== undefined) {
        const distance = Math.hypot(mouseX - rx, mouseY - ry);
        if (distance < radius + 15) {
          activeHover = planet;
        }
      }
    });

    setHoveredPlanet(activeHover);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] md:h-[620px] rounded-[36px] overflow-hidden glass-panel border border-white/10" ref={containerRef}>
      
      {/* Simulation Command HUD panel overlay */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex flex-col gap-2 max-w-[280px] sm:max-w-sm pointer-events-auto">
        <div className="bg-slate-950/85 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setHudCollapsed(prev => !prev)}>
            <h4 className="text-xs font-label text-primary tracking-widest uppercase flex items-center gap-1.5 select-none font-bold">
              <span>📡</span> Telemetry Sensor
            </h4>
            <span className="text-[10px] text-primary/70">{hudCollapsed ? "▼ Info" : "▲ Hide"}</span>
          </div>
          {!hudCollapsed && (
            <p className="text-[11px] sm:text-[13px] text-on-surface-variant leading-tight mt-2 animate-fade-in">
              Left-click on any orbiting orbital body or the central Sun core to trigger detailed spectral analysis and core mapping.
            </p>
          )}
        </div>

        {/* Orbit configuration buttons */}
        <div className="bg-slate-950/85 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/10 flex flex-wrap gap-2">
          <button
            onClick={() => setShowOrbitLines((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-label transition-all ${
              showOrbitLines ? "bg-primary/20 text-primary border border-primary/30 font-bold" : "bg-white/5 text-on-surface-variant hover:text-white"
            }`}
          >
            {showOrbitLines ? "Hide Orbits" : "Show Orbits"}
          </button>
          
          <button
            onClick={() => setZoom((prev) => (prev === 1.2 ? 0.7 : prev === 0.7 ? 1.0 : 1.2))}
            className="px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-label bg-white/5 text-on-surface-variant hover:text-white transition-all border border-transparent hover:border-white/10"
          >
            Scale: {zoom === 1.2 ? "120%" : zoom === 0.7 ? "70%" : "100%"}
          </button>
        </div>
      </div>

      {/* Speed Warp control overlay (Bottom center-right) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 bg-slate-950/85 backdrop-blur-md p-2 sm:p-3 rounded-2xl border border-white/10 shadow-lg flex items-center gap-3 sm:gap-4">
        <span className="text-[9px] sm:text-[10px] font-label text-primary tracking-wider uppercase font-bold hidden xs:inline">WARP:</span>
        <div className="flex items-center gap-1.5">
          {[
            { label: "PAUSE", val: 0 },
            { label: "1x", val: 1 },
            { label: "5x", val: 5 },
            { label: "15x", val: 15 }
          ].map((sp) => (
            <button
              key={sp.label}
              onClick={() => setSimSpeed(sp.val)}
              className={`px-2 py-1 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-label transition-all ${
                simSpeed === sp.val ? "bg-primary text-on-primary font-bold shadow-md" : "bg-white/5 text-on-surface-variant hover:bg-white/10"
              }`}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        className="block w-full h-full cursor-crosshair"
        title="Interactive Solar System Journey Canvas Map"
      />

      {/* Hover telemetry telemetry details */}
      {hoveredPlanet && (
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 bg-slate-950/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl max-w-[240px] sm:max-w-xs animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredPlanet.color }}></span>
            <h5 className="font-label text-xs sm:text-sm text-white font-bold">{hoveredPlanet.name}</h5>
          </div>
          <p className="text-[10px] sm:text-[11px] text-on-surface-variant font-mono leading-tight">
            Angle: {(hoveredPlanet.angle % (Math.PI * 2)).toFixed(2)} rad <br />
            Orbit: {Math.round(hoveredPlanet.orbitRadius * 1.49)} M.km <br />
            Speed: {(hoveredPlanet.orbitalSpeed * 1000).toFixed(1)} relative
          </p>
          <div className="mt-1.5 text-[9px] sm:text-[10px] text-primary font-label flex items-center gap-1 font-bold">
            <span>Scan Specimen</span>
            <span>✦</span>
          </div>
        </div>
      )}
    </div>
  );
}
