/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { CELESTIAL_BODIES, CelestialBody } from "../data";

export default function PlanetComparisonLab() {
  const [planetAId, setPlanetAId] = useState<string>("earth");
  const [planetBId, setPlanetBId] = useState<string>("jupiter");

  const planetA = CELESTIAL_BODIES.find((p) => p.id === planetAId) || CELESTIAL_BODIES[2]; // Earth
  const planetB = CELESTIAL_BODIES.find((p) => p.id === planetBId) || CELESTIAL_BODIES[4]; // Jupiter

  useEffect(() => {
    try {
      localStorage.setItem("cosmos_compared_planets", JSON.stringify([planetA.name, planetB.name]));
    } catch (e) {
      // Ignored
    }
  }, [planetA.name, planetB.name]);

  // Calculate high-fidelity comparison factor
  const maxDiameter = Math.max(...CELESTIAL_BODIES.map((p) => p.diameterVal));
  const maxGravity = Math.max(...CELESTIAL_BODIES.map((p) => p.gravityVal));

  // Determine custom color styling for bar progress
  const getPlanetColor = (category: string) => {
    switch (category) {
      case "Star": return "#f59e0b"; // yellow
      case "Home": return "#3b82f6"; // blue
      case "Rocky": return "#ef4444"; // red
      case "Gas Giant": return "#6a89ff"; // primary/indigo
      case "Ice Giant": return "#22d3ee"; // cyan
      case "Satellite": return "#9ca3af"; // silver gray
      case "Dwarf Planet": return "#c4c5d6"; // off-white
      default: return "#b7c4ff";
    }
  };

  return (
    <div className="glass-panel p-8 md:p-12 rounded-[36px] border border-white/10 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.8)]" id="compare">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Segment: Interactive Dropdown Controls */}
        <div className="lg:col-span-5 space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h4 className="font-headline text-lg text-primary tracking-wide">Comparative Analyzer</h4>
            <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider mt-1">Select targets to map differentials</p>
          </div>

          {/* Planet Selection Controls */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-label text-primary uppercase tracking-widest">Select Celestial Body Alpha</label>
              <div className="relative">
                <select
                  value={planetAId}
                  onChange={(e) => setPlanetAId(e.target.value)}
                  className="w-full bg-white/0.05 border border-white/10 hover:border-white/20 transition-colors rounded-xl px-4 py-3.5 text-sm font-label text-white focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
                >
                  {CELESTIAL_BODIES.map((body) => (
                    <option key={body.id} value={body.id} className="bg-[#040612] text-white">
                      {body.name} ({body.category})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40 text-xs">▼</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-label text-tertiary uppercase tracking-widest">Select Celestial Body Beta</label>
              <div className="relative">
                <select
                  value={planetBId}
                  onChange={(e) => setPlanetBId(e.target.value)}
                  className="w-full bg-white/0.05 border border-white/10 hover:border-white/20 transition-colors rounded-xl px-4 py-3.5 text-sm font-label text-white focus:outline-none focus:ring-1 focus:ring-tertiary appearance-none cursor-pointer"
                >
                  {CELESTIAL_BODIES.map((body) => (
                    <option key={body.id} value={body.id} className="bg-[#040612] text-white">
                      {body.name} ({body.category})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/40 text-xs">▼</div>
              </div>
            </div>
          </div>

          {/* Quick analysis summary paragraph */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-on-surface-variant leading-relaxed">
            <span className="text-secondary font-bold mr-1">ANALYSIS:</span>
            {planetA.name} stands at <span className="text-white font-bold">{planetA.diameter}</span> in diameter compared to {planetB.name}'s <span className="text-white font-bold">{planetB.diameter}</span>. 
            An explorer on {planetA.name} would experience <span className="text-white font-bold">{planetA.gravity}</span> gravity, whereas on {planetB.name} they would encounter <span className="text-white font-bold">{planetB.gravity}</span>.
          </div>
        </div>

        {/* Middle Segment: Side-By-Side Visual Scale Demonstration */}
        <div className="lg:col-span-4 h-64 lg:h-80 flex flex-col items-center justify-center relative bg-gradient-to-b from-white/[0.01] to-white/[0.03] rounded-3xl border border-white/5 p-4 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
          
          <div className="absolute top-3 text-[10px] font-label text-white/40 uppercase tracking-widest">Comparative Visual scale</div>
          
          <div className="flex w-full justify-around items-center h-full z-10 px-4">
            
            {/* Sphere Alpha */}
            <div className="flex flex-col items-center gap-3 transition-all duration-500">
              <div 
                className="rounded-full shadow-2xl relative transition-all duration-500 flex items-center justify-center text-center overflow-hidden"
                style={{
                  width: `${Math.max(20, (planetA.diameterVal / maxDiameter) * 160)}px`,
                  height: `${Math.max(20, (planetA.diameterVal / maxDiameter) * 160)}px`,
                  backgroundColor: getPlanetColor(planetA.category),
                  boxShadow: `0 0 30px ${getPlanetColor(planetA.category)}50, inset -10px -10px 20px rgba(0,0,0,0.6)`
                }}
              >
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
              </div>
              <span className="text-xs font-label text-white bg-white/10 px-2 py-0.5 rounded-full">{planetA.name}</span>
            </div>

            {/* Sphere Beta */}
            <div className="flex flex-col items-center gap-3 transition-all duration-500">
              <div 
                className="rounded-full shadow-2xl relative transition-all duration-500 flex items-center justify-center text-center overflow-hidden"
                style={{
                  width: `${Math.max(20, (planetB.diameterVal / maxDiameter) * 160)}px`,
                  height: `${Math.max(20, (planetB.diameterVal / maxDiameter) * 160)}px`,
                  backgroundColor: getPlanetColor(planetB.category),
                  boxShadow: `0 0 30px ${getPlanetColor(planetB.category)}50, inset -10px -10px 20px rgba(0,0,0,0.6)`
                }}
              >
                <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
              </div>
              <span className="text-xs font-label text-white bg-white/10 px-2 py-0.5 rounded-full">{planetB.name}</span>
            </div>

          </div>
        </div>

        {/* Right Segment: Performance Progress Meters */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Diagnostic 1: Diameter size meter */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <h5 className="text-[11px] font-label text-primary uppercase tracking-widest font-bold">Relative Outer Dimension</h5>
              <span className="text-[10px] font-mono text-on-surface-variant">Max Size Reference</span>
            </div>
            
            <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              {/* Alpha bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-label">
                  <span className="text-white/70">{planetA.name}</span>
                  <span className="text-primary">{planetA.diameter}</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-750" 
                    style={{ 
                      width: `${(planetA.diameterVal / maxDiameter) * 100}%`,
                      backgroundColor: getPlanetColor(planetA.category),
                      boxShadow: `0 0 10px ${getPlanetColor(planetA.category)}`
                    }}
                  ></div>
                </div>
              </div>

              {/* Beta bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-label">
                  <span className="text-white/70">{planetB.name}</span>
                  <span className="text-tertiary">{planetB.diameter}</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-750" 
                    style={{ 
                      width: `${(planetB.diameterVal / maxDiameter) * 100}%`,
                      backgroundColor: getPlanetColor(planetB.category),
                      boxShadow: `0 0 10px ${getPlanetColor(planetB.category)}`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic 2: Surface gravity meter */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <h5 className="text-[11px] font-label text-tertiary uppercase tracking-widest font-bold">Surface Gravity Pull</h5>
              <span className="text-[10px] font-mono text-on-surface-variant">m/s²</span>
            </div>

            <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
              {/* Alpha bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-label">
                  <span className="text-white/70">{planetA.name}</span>
                  <span className="text-primary">{planetA.gravity}</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-750" 
                    style={{ 
                      width: `${(planetA.gravityVal / maxGravity) * 100}%`,
                      backgroundColor: getPlanetColor(planetA.category),
                      boxShadow: `0 0 10px ${getPlanetColor(planetA.category)}`
                    }}
                  ></div>
                </div>
              </div>

              {/* Beta bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-label">
                  <span className="text-white/70">{planetB.name}</span>
                  <span className="text-tertiary">{planetB.gravity}</span>
                </div>
                <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-750" 
                    style={{ 
                      width: `${(planetB.gravityVal / maxGravity) * 100}%`,
                      backgroundColor: getPlanetColor(planetB.category),
                      boxShadow: `0 0 10px ${getPlanetColor(planetB.category)}`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic 3: Temperature comparison data points */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-label text-secondary uppercase tracking-widest font-bold">Atmochemistry Differentials</h5>
            <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[9px] text-white/50 mb-0.5">MOON DEMOGRAPHIC</div>
                <div className="text-white font-bold">{planetA.name}: {planetA.moons}</div>
                <div className="text-white font-bold">{planetB.name}: {planetB.moons}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                <div className="text-[9px] text-white/50 mb-0.5">MEAN TEMP LIMITS</div>
                <div className="text-white font-bold">{planetA.tempVal} °C</div>
                <div className="text-white font-bold">{planetB.tempVal} °C</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
