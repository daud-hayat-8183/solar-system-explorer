/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { CelestialBody } from "../data";

interface VirtualMissionSimulatorProps {
  initialTarget?: CelestialBody | null;
  onClose: () => void;
  onCompleted: (xpRating: number) => void;
}

export default function VirtualMissionSimulator({ initialTarget, onClose, onCompleted }: VirtualMissionSimulatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Targets: default to Mars or Moon if target doesn't fit standard landing
  const [selectedDest, setSelectedDest] = useState<string>(
    initialTarget?.id === "sun" || initialTarget?.id === "jupiter" || initialTarget?.id === "saturn"
      ? "jupiter"
      : initialTarget?.id || "mars"
  );

  // Simulation play state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simResult, setSimResult] = useState<"landing_safe" | "crash" | "playing">("playing");
  
  // Game telemetry states
  const [fuel, setFuel] = useState<number>(100);
  const [altitude, setAltitude] = useState<number>(450);
  const [vSpeed, setVSpeed] = useState<number>(2.0); // vertical speed m/s
  const [hSpeed, setHSpeed] = useState<number>(0.0); // horizontal speed m/s
  const [score, setScore] = useState<number>(0);

  // Keyboard controls refs
  const controls = useRef({ left: false, right: false, up: false });

  // Physics simulation values
  const physics = useRef({
    x: 250,              // ship x
    y: 80,               // ship y
    vx: 0.8,             // horizontal velocity
    vy: 1.0,             // vertical velocity
    gravity: 0.08,       // planet gravity pull factor
    thrust: 0.18,        // engine upgrade acceleration
    fuelLeft: 100,
    safeY: 380,          // ground landing level
    currentTime: 0
  });

  // Level characteristics depending on planet selection
  useEffect(() => {
    // Reset state mechanics
    setSimResult("playing");
    setIsPlaying(true);
    setFuel(100);
    setAltitude(450);
    setVSpeed(1.5);
    setHSpeed(0.5);

    // Dynamic physics configurations relative to planet weight
    let grav = 0.07;
    let startX = 250 + Math.random() * 80;
    
    if (selectedDest === "moon") grav = 0.035; // lower gravity on Moon
    if (selectedDest === "jupiter") grav = 0.16; // extreme gravity inside storm clouds!
    if (selectedDest === "mars") grav = 0.08;

    physics.current = {
      x: startX,
      y: 60,
      vx: Math.random() * 1.5 - 0.75,
      vy: 0.8,
      gravity: grav,
      thrust: 0.18,
      fuelLeft: 100,
      safeY: 380,
      currentTime: 0
    };
  }, [selectedDest]);

  // Set up resize hook
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas || !containerRef.current) return;
      canvas.width = containerRef.current.clientWidth;
      canvas.height = Math.min(420, containerRef.current.clientHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for navigation keystrokes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === " ") controls.current.up = true;
      if (e.key === "ArrowLeft") controls.current.left = true;
      if (e.key === "ArrowRight") controls.current.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === " ") controls.current.up = false;
      if (e.key === "ArrowLeft") controls.current.left = false;
      if (e.key === "ArrowRight") controls.current.right = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Simulator Canvas Draw & Physics Animation loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gameLoop = () => {
      const ph = physics.current;
      const ctrl = controls.current;

      const w = canvas.width;
      const h = canvas.height;
      ph.currentTime += 0.016;

      // Ensure lander is bound horizontally inside canvas wraps
      if (ph.x < 15) { ph.x = 15; ph.vx = -ph.vx * 0.3; }
      if (ph.x > w - 15) { ph.x = w - 15; ph.vx = -ph.vx * 0.3; }

      // Clear Frame with atmospheric gradient
      ctx.fillStyle = selectedDest === "mars" 
        ? "#221111" 
        : selectedDest === "jupiter" 
        ? "#1e1a2d" 
        : "#080912"; // Deep black space for Moon
      ctx.fillRect(0, 0, w, h);

      // Stars/Sparks twinkle
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(i + ph.currentTime) * 0.5 + 0.5) * w;
        const sy = (Math.cos(i * 3 + ph.currentTime * 0.5) * 0.5 + 0.5) * h;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw planetary back-wash horizon terrain
      ctx.fillStyle = selectedDest === "mars" 
        ? "#d35400" 
        : selectedDest === "jupiter" 
        ? "#c0392b" 
        : "#4b5563"; // grey basalt for lunar basins
      
      ctx.beginPath();
      ctx.moveTo(0, h);
      
      // Draw procedural jagged canyon mountain line
      for (let x = 0; x <= w; x += 30) {
        let elevationY = h - 25;
        if (selectedDest === "mars") {
          elevationY -= Math.sin(x * 0.01) * 35 + Math.cos(x * 0.05) * 8;
        } else if (selectedDest === "jupiter") {
          elevationY -= Math.sin(x * 0.015) * 45 + Math.cos(x * 0.03) * 15; // giant swirling storms clouds shape
        } else {
          elevationY -= Math.cos(x * 0.02) * 20 + Math.sin(x * 0.08) * 6; // low rolling craters
        }
        ctx.lineTo(x, elevationY);
      }
      ctx.lineTo(w, h);
      ctx.fill();

      // Render Flat safe target landing pad zones (Green neon glowing structure rect)
      const padWidth = 80;
      const padX = w / 2 - padWidth / 2;
      const padY = h - 35;
      ph.safeY = padY; // lock ground collision

      ctx.fillStyle = "#10b981"; // green
      ctx.fillRect(padX, padY, padWidth, 6);
      ctx.shadowColor = "#10b981";
      ctx.shadowBlur = 15;
      ctx.fillRect(padX + 5, padY, padWidth - 10, 8);
      ctx.shadowBlur = 0; // reset shadow

      // Draw pad coordinates labels
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px Space Grotesk, sans-serif";
      ctx.fillText("CRADLE APEX TARGET RANGE", padX - 25, padY + 20);

      // PHYSICS loop calculations only if game is running active
      if (simResult === "playing" && isPlaying) {
        // Evaluate user controls
        let applyXThrust = 0;
        let applyYThrust = 0;

        if (ph.fuelLeft > 0) {
          if (ctrl.up) {
            applyYThrust = -ph.thrust;
            ph.fuelLeft -= 0.28;
          }
          if (ctrl.left) {
            applyXThrust = -ph.thrust * 0.45;
            ph.fuelLeft -= 0.08;
          }
          if (ctrl.right) {
            applyXThrust = ph.thrust * 0.45;
            ph.fuelLeft -= 0.08;
          }
        }

        // Apply forces
        ph.vx += applyXThrust;
        ph.vy += ph.gravity + applyYThrust;

        // Apply friction drag
        ph.vx *= 0.985;
        ph.vy *= 0.985;

        // Translate coords
        ph.x += ph.vx;
        ph.y += ph.vy;

        // Track live hooks for UI panels
        setFuel(Math.max(0, Math.floor(ph.fuelLeft)));
        const calculatedAlt = Math.max(0, Math.floor((ph.safeY - ph.y) * 1.5));
        setAltitude(calculatedAlt);
        setVSpeed(parseFloat((ph.vy * 4.5).toFixed(1)));
        setHSpeed(parseFloat((ph.vx * 4.5).toFixed(1)));

        // Evaluate Landing Bounds trigger
        if (ph.y >= ph.safeY - 14) {
          ph.y = ph.safeY - 14;

          // Check if ship is inside the Green cradle boundaries
          const isOverPad = ph.x >= padX - 8 && ph.x <= padX + padWidth + 8;
          const isSafeVerticalVelocity = Math.abs(ph.vy * 4.5) < 5.0;
          const isSafeHorizontalVelocity = Math.abs(ph.vx * 4.5) < 3.0;

          if (isOverPad && isSafeVerticalVelocity && isSafeHorizontalVelocity) {
            setSimResult("landing_safe");
            setIsPlaying(false);
            onCompleted(350 + Math.floor(ph.fuelLeft * 2.5));
          } else {
            setSimResult("crash");
            setIsPlaying(false);
          }
        }
      }

      // DRAW LANDER MODULE VESSEL (Holographic space HUD design)
      ctx.save();
      ctx.translate(ph.x, ph.y);

      // Jet exhaust flames animation when pressing up
      if (ctrl.up && ph.fuelLeft > 0 && simResult === "playing") {
        ctx.fillStyle = "rgba(239, 68, 68, 0.9)";
        ctx.beginPath();
        ctx.moveTo(-6, 12);
        ctx.lineTo(0, 12 + Math.random() * 18 + 6);
        ctx.lineTo(6, 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "rgba(254, 203, 0, 0.9)";
        ctx.beginPath();
        ctx.moveTo(-3, 12);
        ctx.lineTo(0, 12 + Math.random() * 10 + 3);
        ctx.lineTo(3, 12);
        ctx.closePath();
        ctx.fill();
      }

      // Draw lateral retro-jet sparks
      if (ctrl.left && ph.fuelLeft > 0 && simResult === "playing") {
        ctx.fillStyle = "rgba(106, 137, 255, 0.85)";
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.lineTo(16 + Math.random() * 8, 0);
        ctx.lineTo(8, 2);
        ctx.fill();
      }
      if (ctrl.right && ph.fuelLeft > 0 && simResult === "playing") {
        ctx.fillStyle = "rgba(106, 137, 255, 0.85)";
        ctx.beginPath();
        ctx.moveTo(-8, -2);
        ctx.lineTo(-16 - Math.random() * 8, 0);
        ctx.lineTo(-8, 2);
        ctx.fill();
      }

      // Draw spaceship structure capsule
      // Left leg pad
      ctx.strokeStyle = "#e2e1ec";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 4);
      ctx.lineTo(-12, 12);
      ctx.lineTo(-15, 12);
      ctx.stroke();

      // Right leg pad
      ctx.beginPath();
      ctx.moveTo(4, 4);
      ctx.lineTo(12, 12);
      ctx.lineTo(15, 12);
      ctx.stroke();

      // Core pod hull
      ctx.fillStyle = "rgba(30, 41, 59, 0.95)";
      ctx.strokeStyle = simResult === "landing_safe" 
        ? "#10b981" 
        : simResult === "crash" 
        ? "#ef4444" 
        : "#b7c4ff";
      ctx.lineWidth = 1.5;
      
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dome canopy glass window
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(0, -2, 4, 0, Math.PI * 2);
      ctx.fill();

      // Antenna beacon
      ctx.strokeStyle = "#8e90a0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.lineTo(0, -14);
      ctx.stroke();

      ctx.fillStyle = simResult === "playing" ? "#6a89ff" : simResult === "landing_safe" ? "#10b981" : "#ef4444";
      ctx.beginPath();
      ctx.arc(0, -14, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw interactive tutorial prompt of keystrokes
      if (simResult === "playing") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
        ctx.font = "10px space-grotesk, sans-serif";
        ctx.fillText("SPACEBAR/↑ THRUSTERS | ← / → STEER SENSOR", 18, h - 22);
      }

      if (isPlaying || simResult !== "playing") {
        animId = requestAnimationFrame(gameLoop);
      }
    };

    gameLoop();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedDest, isPlaying, simResult]);

  // Tactile button thrusters for easy tablet action
  const fireEngineThrust = (direction: "left" | "right" | "up", action: boolean) => {
    controls.current[direction] = action;
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      {/* Dark space backdrop blur */}
      <div className="absolute inset-0 bg-background/95 backdrop-blur-3xl" onClick={onClose}></div>

      {/* Main console board */}
      <div className="relative glass-panel w-full max-w-3xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(106,137,255,0.25)] flex flex-col md:flex-row" ref={containerRef}>
        
        {/* Left Section: Active Lander Screen Screen */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-headline text-white flex items-center gap-2">
                <span>🛸</span> Space Probe Simulator
              </h3>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                title="Exit simulator"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-on-surface-variant font-body">Pilot the diagnostic lander down to the cradle pad.</p>
          </div>

          {/* Active Level Target selector bar */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1 my-4">
            <button
              onClick={() => setSelectedDest("moon")}
              className={`flex-1 py-2 rounded-lg text-[11px] font-label transition-all uppercase ${
                selectedDest === "moon" ? "bg-primary text-on-primary font-bold shadow-lg" : "text-on-surface-variant hover:text-white"
              }`}
            >
              Moon (Low Gravity)
            </button>
            <button
              onClick={() => setSelectedDest("mars")}
              className={`flex-1 py-2 rounded-lg text-[11px] font-label transition-all uppercase ${
                selectedDest === "mars" ? "bg-primary text-on-primary font-bold shadow-lg" : "text-on-surface-variant hover:text-white"
              }`}
            >
              Mars (Standard)
            </button>
            <button
              onClick={() => setSelectedDest("jupiter")}
              className={`flex-1 py-2 rounded-lg text-[11px] font-label transition-all uppercase ${
                selectedDest === "jupiter" ? "bg-primary text-on-primary font-bold shadow-lg" : "text-on-surface-variant hover:text-white"
              }`}
            >
              Jupiter (Stormy/Heavy)
            </button>
          </div>

          {/* Simulator canvas boundary box */}
          <div className="relative w-full h-[280px] bg-[#05060b] rounded-2xl border border-white/10 overflow-hidden">
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Crash or Success HUD banner overlays inside canvas */}
            {simResult === "landing_safe" && (
              <div className="absolute inset-0 bg-green-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 space-y-4">
                <span className="text-4xl">🛰️</span>
                <h4 className="text-2xl font-headline text-green-400">Voyage Successful!</h4>
                <p className="text-xs text-white max-w-sm">
                  Lander achieved stable, safe impact coordinates (<span className="text-green-300 font-bold">{vSpeed} m/s</span>) within the green safety basin cradle. Sensor grid synchronization locked!
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      physics.current.y = 80;
                      physics.current.x = 250 + Math.random() * 80;
                      physics.current.vx = Math.random() * 1.5 - 0.75;
                      physics.current.vy = 1.0;
                      physics.current.fuelLeft = 100;
                      setSimResult("playing");
                      setIsPlaying(true);
                    }}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-slate-950 text-xs font-bold font-label uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
                  >
                    Relaunch Tour
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-label uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                  >
                    Mission Complete
                  </button>
                </div>
              </div>
            )}

            {simResult === "crash" && (
              <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 space-y-4">
                <span className="text-4xl text-red-500 animate-pulse">💥</span>
                <h4 className="text-2xl font-headline text-red-400">Telemetry Lost: Hull Fracture</h4>
                <p className="text-xs text-white max-w-sm">
                  The probe exceeded the structured structural landing threshold velocity. Vertical Descent Speed was <span className="text-red-400 font-bold">{vSpeed} m/s</span> (safety limit is under 5.0 m/s).
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      physics.current.y = 80;
                      physics.current.x = 250 + Math.random() * 80;
                      physics.current.vx = Math.random() * 1.5 - 0.75;
                      physics.current.vy = 1.0;
                      physics.current.fuelLeft = 100;
                      setSimResult("playing");
                      setIsPlaying(true);
                    }}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold font-label uppercase tracking-wider rounded-lg shadow-lg transition-all cursor-pointer"
                  >
                    Calibrate and Retry
                  </button>
                  <button
                    onClick={() => setSelectedDest("moon")}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-label uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                  >
                    Switch to Moon
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Touchscreen arcade keys for portable devices and accessibility */}
          <div className="flex gap-4 items-center justify-between mt-4">
            <div className="flex gap-2">
              <button
                onMouseDown={() => fireEngineThrust("left", true)}
                onMouseUp={() => fireEngineThrust("left", false)}
                onTouchStart={() => fireEngineThrust("left", true)}
                onTouchEnd={() => fireEngineThrust("left", false)}
                className="w-12 h-10 rounded-xl bg-white/10 active:bg-primary/30 flex items-center justify-center text-white border border-white/10 text-lg hover:bg-white/20 select-none cursor-pointer"
                title="Steer capsule Left"
              >
                ◀
              </button>
              <button
                onMouseDown={() => fireEngineThrust("right", true)}
                onMouseUp={() => fireEngineThrust("right", false)}
                onTouchStart={() => fireEngineThrust("right", true)}
                onTouchEnd={() => fireEngineThrust("right", false)}
                className="w-12 h-10 rounded-xl bg-white/10 active:bg-primary/30 flex items-center justify-center text-white border border-white/10 text-lg hover:bg-white/20 select-none cursor-pointer"
                title="Steer capsule Right"
              >
                ▶
              </button>
            </div>
            
            <button
              onMouseDown={() => fireEngineThrust("up", true)}
              onMouseUp={() => fireEngineThrust("up", false)}
              onTouchStart={() => fireEngineThrust("up", true)}
              onTouchEnd={() => fireEngineThrust("up", false)}
              className="px-8 h-12 rounded-xl bg-primary text-on-primary font-bold active:scale-95 flex items-center justify-center gap-2 border border-primary/30 text-xs font-label uppercase tracking-widest hover:shadow-[0_0_15px_rgba(183,196,255,0.4)] select-none cursor-pointer"
            >
              🚀 Fire Retro Engine
            </button>
          </div>
        </div>

        {/* Right Section: Sensor Readout Data HUD Column */}
        <div className="w-full md:w-64 bg-slate-950/70 border-t md:border-t-0 md:border-l border-white/10 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h5 className="text-[10px] font-label text-primary uppercase tracking-widest font-bold">Lander telemetry metrics</h5>
              <p className="text-xs text-on-surface-variant font-mono mt-1">LOCK STATUS: HIGH VELOCITY</p>
            </div>

            {/* Simulated Telemetry HUD charts */}
            <div className="space-y-4">
              
              {/* Dial 1: Fuel Tank */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-label text-white/70">Propellant Fuel</span>
                  <span className={`font-mono font-bold ${fuel < 25 ? "text-red-400 animate-pulse" : "text-primary"}`}>{fuel}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-100 ${
                      fuel < 25 ? "bg-red-500 shadow-[0_0_10px_#ef4444]" : "bg-primary shadow-[0_0_10px_#b7c4ff]"
                    }`} 
                    style={{ width: `${fuel}%` }}
                  ></div>
                </div>
              </div>

              {/* Dial 2: Descent speed */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-label text-white/70">Descent Velocity</span>
                  <span className={`font-mono font-bold ${Math.abs(vSpeed) >= 5.0 ? "text-red-400 animate-pulse" : "text-green-400"}`}>
                    {vSpeed} m/s
                  </span>
                </div>
                <div className="text-[10px] text-on-surface-variant font-mono">
                  {Math.abs(vSpeed) >= 5.0 ? "⚠️ APPROACH RETRO LIMIT!" : "✓ SAFE ENTRY LIMIT LOCKED"}
                </div>
              </div>

              {/* Dial 3: Lateral horizontal velocity */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-label text-white/70 font-bold">Lateral Velocity</span>
                  <span className="font-mono text-white/90">{hSpeed} m/s</span>
                </div>
              </div>

              {/* Dial 4: Height */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-label text-white/70 font-bold">Core Altitude</span>
                  <span className="font-mono text-white/90">{altitude} m</span>
                </div>
              </div>

            </div>
          </div>

          {/* Instructional box */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-[11px] text-on-surface-variant leading-relaxed">
            <span className="text-secondary font-bold font-label block mb-1">MISSION RULES</span>
            1. Keep <span className="text-green-400">Descent velocity</span> below 5.0 m/s when contact is triggered. <br />
            2. Guide probe horizontally to contact the glowing green target landing pad. <br />
            3. Conserve propellants to avoid falling with zero steering.
          </div>
        </div>

      </div>
    </div>
  );
}
