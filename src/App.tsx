/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  CELESTIAL_BODIES,
  SPACE_MISSIONS,
  QUIZZES,
  CelestialBody,
  Quiz
} from "./data";
import SolarSystemCanvas from "./components/SolarSystemCanvas";
import PlanetComparisonLab from "./components/PlanetComparisonLab";
import InteractiveQuizModule from "./components/InteractiveQuizModule";
import VirtualMissionSimulator from "./components/VirtualMissionSimulator";
import CosmosLogo from "./components/CosmosLogo";

export default function App() {
  // Navigation scrolling states
  const [activeTab, setActiveTab] = useState<string>("explorer");
  const [headerScrolled, setHeaderScrolled] = useState<boolean>(false);

  // Active game indicators (persisted locally across browser sessions!)
  const [userXp, setUserXp] = useState<number>(() => {
    const cached = localStorage.getItem("astroquest_user_xp");
    return cached ? parseInt(cached) : 0;
  });
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>(() => {
    const cached = localStorage.getItem("astroquest_badges");
    return cached ? JSON.parse(cached) : [];
  });
  const [completedSims, setCompletedSims] = useState<number>(() => {
    const cached = localStorage.getItem("astroquest_sim_count");
    return cached ? parseInt(cached) : 0;
  });

  // Interactive selectors
  const [selectedPlanet, setSelectedPlanet] = useState<CelestialBody | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  
  // Interactive Overlays
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [isAiQuizActive, setIsAiQuizActive] = useState<boolean>(false);
  const [showAiSetup, setShowAiSetup] = useState<boolean>(false);
  const [aiFocusTopic, setAiFocusTopic] = useState<string>("All Solar System Worlds (General Core)");
  const [customFocusText, setCustomFocusText] = useState<string>("");
  const [includeComparisonTelemetry, setIncludeComparisonTelemetry] = useState<boolean>(true);
  const [includeSimulationTelemetry, setIncludeSimulationTelemetry] = useState<boolean>(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState<boolean>(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [simulatorInitialTarget, setSimulatorInitialTarget] = useState<CelestialBody | null>(null);
  
  // Audio state feedback settings
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Simulated Notification Box feed
  const [showNotificationFeed, setShowNotificationFeed] = useState<boolean>(false);
  const [notifications] = useState<string[]>([
    "Curiosity rover detected clay mineral compounds on Mount Sharp.",
    "Voyager 1 telemetry signals fetched via Madrid tracking dish.",
    "New Solar Storm spot AR3641 directed facing Earth's orbit field.",
    "Daily training calibration active. Verify gaseous loops for +350 XP."
  ]);

  // Sync scroll detection for header effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync user progress scores
  useEffect(() => {
    localStorage.setItem("astroquest_user_xp", userXp.toString());
  }, [userXp]);

  useEffect(() => {
    localStorage.setItem("astroquest_badges", JSON.stringify(unlockedBadges));
  }, [unlockedBadges]);

  useEffect(() => {
    localStorage.setItem("astroquest_sim_count", completedSims.toString());
  }, [completedSims]);

  // Handle section jumping
  const handleScrollToSegment = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Callback completed quizzes
  const handleQuizWin = (xpEarned: number, badge: string) => {
    setUserXp((prev) => prev + xpEarned);
    if (!unlockedBadges.includes(badge)) {
      setUnlockedBadges((prev) => [...prev, badge]);
    }
  };

  // Callback completed probe simulations
  const handleSimulatorSuccess = (xpEarned: number) => {
    setUserXp((prev) => prev + xpEarned);
    setCompletedSims((prev) => prev + 1);
  };

  // POST generate personalized quiz via Gemini dynamic bridge
  const handleGenerateAiQuiz = async () => {
    setIsGeneratingQuiz(true);
    setGenerationLogs([
      "📡 CONNECTING TO GEMINI-3.5-FLASH ACADEMIC CHANNELS...",
    ]);

    // Gather telemetry
    let comparedPlanets: string[] = [];
    try {
      const stored = localStorage.getItem("cosmos_compared_planets");
      if (stored) {
        comparedPlanets = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Telemetry check failed", e);
    }

    setTimeout(() => {
      setGenerationLogs((prev) => [
        ...prev,
        "📂 SCANNING LOCAL LABORATORY STATE FOR HIGHER REFLECTIONS...",
        comparedPlanets.length > 0 
          ? `✓ RECOVERED TELEMETRY MATRIX: ${comparedPlanets.join(" vs ")}`
          : "ℹ LABORATORY STATE NULL (DEFAULTING CANAL CHANNELS)",
      ]);
    }, 600);

    setTimeout(() => {
      setGenerationLogs((prev) => [
        ...prev,
        includeSimulationTelemetry && completedSims > 0
          ? `✓ RETRIEVING ORBITAL VR FLIGHT LOGS: ${completedSims} MISSIONS COMPLETE`
          : "ℹ EXCLUDING VR SIMULATION HISTORY TRACK",
        "🧩 COMPILING CUSTOM PHYSICS EQUATIONS AND MULTIPLE OPTIONS...",
      ]);
    }, 1300);

    try {
      const response = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          focus: aiFocusTopic,
          customFocusText: customFocusText,
          comparedTelemetry: includeComparisonTelemetry ? comparedPlanets : [],
          simCompletedCount: includeSimulationTelemetry ? completedSims : 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Stellar proxy refused connection logic.");
      }

      const generatedData = await response.json();
      
      const fullQuiz: Quiz = {
        id: "ai_quiz",
        title: generatedData.title || "AI Core Calibrator",
        subtitle: generatedData.subtitle || "Synthesized telemetry challenge guided by Gemini.",
        badge: generatedData.badge || "Academic Innovator",
        xpReward: 800,
        level: "Commander",
        icon: "🧠",
        questions: generatedData.questions || [],
      };

      setTimeout(() => {
        setGenerationLogs((prev) => [
          ...prev,
          "✓ DECRYPTED 5 SCIENTIFIC CHALLENGES SUCCESSFULLY",
          "🚀 NEURAL CALIBRATION FINISHED. IGNITING PROBE MOTORS!",
        ]);

        setTimeout(() => {
          setIsGeneratingQuiz(false);
          setShowAiSetup(false);
          setIsAiQuizActive(true);
          setActiveQuiz(fullQuiz);
        }, 800);
      }, 1800);

    } catch (err: any) {
      console.error(err);
      setGenerationLogs((prev) => [
        ...prev,
        "✕ NEURAL TRANSMISSION RECOIL ERROR. RECONNECTING CORES...",
        `ERROR LOGGED: ${err?.message || "Lost connection to the Gemini grid."}`,
      ]);
      setTimeout(() => {
        setIsGeneratingQuiz(false);
      }, 3000);
    }
  };

  // Plan general classification filters available
  const filtersList = ["All", "Star", "Rocky", "Home", "Gas Giant", "Ice Giant", "Satellite", "Dwarf Planet"];

  // Filter lists items matching chosen classification category
  const filteredBodies = selectedFilter === "All"
    ? CELESTIAL_BODIES
    : CELESTIAL_BODIES.filter((p) => p.category === selectedFilter);

  return (
    <div className="relative min-h-screen bg-[#02040a] text-on-surface selection:bg-primary/30 selection:text-primary font-body">
      
      {/* Dynamic Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        headerScrolled 
          ? "bg-slate-950/85 backdrop-blur-2xl py-3 border-b border-white/10 shadow-[0_4px_25px_rgba(0,0,0,0.8)]" 
          : "bg-transparent py-5 border-b border-white/5"
      }`}>
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo element */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-headline text-lg md:text-xl font-bold text-primary tracking-tighter cursor-pointer flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <CosmosLogo size={42} showText={false} />
            <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent font-extrabold uppercase">COSMOS EXPLORERS</span>
          </div>

          {/* Navigation link structures */}
          <nav className="hidden md:flex gap-8 items-center bg-white/[0.02] border border-white/5 px-6 py-2 rounded-full">
            <button
              onClick={() => handleScrollToSegment("missions")}
              className={`text-xs font-label uppercase tracking-widest transition-colors ${
                activeTab === "missions" ? "text-primary font-bold" : "text-on-surface-variant hover:text-white"
              }`}
            >
              Missions
            </button>
            <button
              onClick={() => handleScrollToSegment("explorer")}
              className={`text-xs font-label uppercase tracking-widest transition-colors ${
                activeTab === "explorer" ? "text-primary font-bold" : "text-on-surface-variant hover:text-white"
              }`}
            >
              Explorer
            </button>
            <button
              onClick={() => handleScrollToSegment("compare")}
              className={`text-xs font-label uppercase tracking-widest transition-colors ${
                activeTab === "compare" ? "text-primary font-bold" : "text-on-surface-variant hover:text-white"
              }`}
            >
              Compare
            </button>
            <button
              onClick={() => handleScrollToSegment("quiz")}
              className={`text-xs font-label uppercase tracking-widest transition-colors ${
                activeTab === "quiz" ? "text-primary font-bold" : "text-on-surface-variant hover:text-white"
              }`}
            >
              Quiz
            </button>
          </nav>

          {/* Utilities sidebar launcher buttons */}
          <div className="flex items-center gap-3">
            
            {/* Interactive Launch Mission button */}
            <button 
              onClick={() => {
                setSimulatorInitialTarget(null);
                setShowSimulator(true);
              }}
              className="hidden md:flex bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary transition-all duration-300 font-label text-xs uppercase tracking-widest px-6 py-2.5 rounded-full font-bold shadow-[0_0_15px_rgba(106,137,255,0.4)] cursor-pointer"
            >
              Launch Mission
            </button>

            {/* Audio syntheiser toggle */}
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`p-2 rounded-xl border transition-all ${soundEnabled ? "bg-white/5 border-white/10 text-primary" : "bg-transparent border-white/5 text-white/30"}`}
              title={soundEnabled ? "Mute diagnostics synthesizer" : "Enable diagnostics audio synthesizer"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>

            {/* Notification bell trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowNotificationFeed((prev) => !prev)}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-primary hover:bg-white/10 transition-all flex items-center justify-center cursor-pointer"
                title="System Notifications Feed"
              >
                <span>🔔</span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-ping"></span>
              </button>

              {/* Notification feed overlay pop-over */}
              {showNotificationFeed && (
                <div className="absolute right-0 mt-3 w-80 bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl z-50 animate-fade-in space-y-3">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-[10px] font-label text-primary uppercase tracking-widest font-bold">Orbital Signals Feed</span>
                    <button onClick={() => setShowNotificationFeed(false)} className="text-[10px] text-white/50 hover:text-white">Close</button>
                  </div>
                  <div className="space-y-3 font-mono text-[11px] text-on-surface-variant max-h-52 overflow-y-auto no-scrollbar">
                    {notifications.map((note, i) => (
                      <div key={i} className="flex gap-2 items-start border-l border-primary/40 pl-2">
                        <span className="text-[9px] text-primary">➤</span>
                        <p>{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile XP dashboard badge */}
            <div className="flex items-center gap-2 bg-gradient-to-r from-secondary/10 to-transparent border border-secondary/20 px-3 py-1.5 rounded-xl">
              <span className="text-secondary select-none">🎖️</span>
              <div className="text-left leading-none">
                <div className="text-[8px] font-label text-secondary uppercase tracking-widest font-bold">XP rating</div>
                <div className="text-xs font-mono font-bold text-white">{userXp} XP</div>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Hero Interactive Space Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden px-6">
        <div className="max-w-[1280px] w-full mx-auto grid lg:grid-cols-12 gap-12 items-center z-10">
          
          {/* Hero text descriptor */}
          <div className="lg:col-span-4 text-left space-y-6 lg:border-r lg:border-white/5 lg:pr-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-label text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              <CosmosLogo size={20} showText={false} />
              <span className="font-bold tracking-widest text-[10px]">LEARN • DISCOVER • EXPLORE</span>
            </div>
            
            <h1 className="font-headline text-4xl md:text-6xl text-white leading-tight font-extrabold">
              EXPLORE THE <br/>
              <span className="text-primary italic">COSMOS</span>
            </h1>
            <p className="font-body text-base text-on-surface-variant leading-relaxed max-w-md">
              Embark on an interactive adventure through our planetary neighborhoods. Watch orbiting worlds click-by, calculate physical differences, and pilot telemetry probes to retrieve data.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleScrollToSegment("explorer")}
                className="px-6 py-3.5 bg-primary text-on-primary font-bold rounded-full font-label text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(183,196,255,0.45)] transition-all cursor-pointer"
              >
                Scan Planets
              </button>
              <button
                onClick={() => handleScrollToSegment("quiz")}
                className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-label text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Calibration Quiz
              </button>
            </div>

            {/* Minor telemetry stats ticker */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
              <div>
                <dt className="text-[9px] font-label text-white/50 uppercase tracking-widest font-bold">Orbit Status</dt>
                <dd className="text-sm font-mono font-bold text-white mt-0.5">8 ACTIVE</dd>
              </div>
              <div>
                <dt className="text-[9px] font-label text-white/50 uppercase tracking-widest font-bold">XP Level</dt>
                <dd className="text-sm font-mono font-bold text-secondary mt-0.5">
                  {userXp < 500 ? "NOVICE" : userXp < 1500 ? "COMMANDER" : "SCHOLAR"}
                </dd>
              </div>
              <div>
                <dt className="text-[9px] font-label text-white/50 uppercase tracking-widest font-bold">Missions</dt>
                <dd className="text-sm font-mono font-bold text-primary mt-0.5">{completedSims} SAFE</dd>
              </div>
            </div>
          </div>

          {/* Interactive Live Canvas (the Solar System interactive orbiter) */}
          <div className="lg:col-span-8 w-full">
            <SolarSystemCanvas onSelectPlanet={setSelectedPlanet} />
          </div>

        </div>

        {/* Decorative ambient glowing grids in back fields */}
        <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[140px] pointer-events-none"></div>
      </section>

      {/* Segment 2: Missions Overview ("What is our Space neighborhood?") */}
      <section className="py-24 max-w-[1280px] mx-auto px-6 md:px-12 border-t border-white/5" id="missions">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16">
          <div className="space-y-3">
            <span className="text-xs font-label text-primary uppercase tracking-widest font-bold">Quadrant Index</span>
            <h2 className="font-headline text-3xl md:text-4xl text-white">What is our Space Neighborhood?</h2>
            <div className="w-24 h-1 bg-primary rounded-full"></div>
          </div>
          <p className="font-body text-sm text-on-surface-variant max-w-md leading-relaxed">
            Our solar system is a delicate family of solid rocky terrains and swirling gas clouds bound forever to the central gravitational pull of the Sun.
          </p>
        </div>

        {/* Rocky Worlds and Gas Giants summaries inside beautiful cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="glass-panel p-8 rounded-[32px] border border-white/10 hover:border-primary/40 transition-colors group space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-xl">
              🌋
            </div>
            <h3 className="font-headline text-xl text-white">Inner Rocky Worlds</h3>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Consisting of Mercury, Venus, Earth, and Mars. These smaller planets contain iron cores and hard silicate basalt surfaces suitable for surface landers and rover missions.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded bg-white/5 text-[10px] font-label text-white/60">High Density</span>
              <span className="px-3 py-1 rounded bg-white/5 text-[10px] font-label text-white/60">Metallic Cores</span>
              <span className="px-3 py-1 rounded bg-white/5 text-[10px] font-label text-white/60">Solid Crusts</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[32px] border border-white/10 hover:border-tertiary/40 transition-colors group space-y-4">
            <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary text-xl">
              💨
            </div>
            <h3 className="font-headline text-xl text-white">Outer Atmospheric Giants</h3>
            <p className="text-xs font-body text-on-surface-variant leading-relaxed">
              Jupiter, Saturn, Uranus, and Neptune. Mammoth atmospheres of hydrogen, helium, and ammonia slushes with no solid surface bounds, generating extreme wind speeds and swirling vortex weather patterns.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded bg-white/5 text-[10px] font-label text-white/60">Colossal Mass</span>
              <span className="px-3 py-1 rounded bg-white/5 text-[10px] font-label text-white/60">Gas/Ice Slush</span>
              <span className="px-3 py-1 rounded bg-white/5 text-[10px] font-label text-white/60">Rings & Swarms</span>
            </div>
          </div>
        </div>

        {/* Space probe missions feed */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-label text-xs uppercase tracking-widest text-primary font-bold">Active Space Probe Signals</h4>
            <span className="text-[10px] font-mono text-on-surface-variant">4 CHANNELS FEEDING RAW telemetry</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SPACE_MISSIONS.map((miss) => (
              <div key={miss.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl">{miss.icon}</span>
                  <span className={`text-[9px] font-label uppercase px-2 py-0.5 rounded ${
                    miss.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/40"
                  }`}>
                    {miss.status}
                  </span>
                </div>
                <div>
                  <h5 className="font-label text-sm text-white font-bold">{miss.name}</h5>
                  <p className="text-[10px] text-on-surface-variant uppercase font-mono mt-0.5">LAUNCH: {miss.launchYear} | {miss.type}</p>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-3">
                  {miss.description}
                </p>
                <div className="text-[10px] font-mono bg-white/5 p-2 rounded-lg text-primary truncate">
                  {miss.telemetry}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segment 3: Planet Explorer (Interactive grid with category filters) */}
      <section className="py-24 bg-slate-950/40 border-t border-b border-white/5" id="explorer">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 space-y-12">
          
          {/* Section description */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-2">
              <span className="text-xs font-label text-primary uppercase tracking-widest font-bold">Telemetry Scanning</span>
              <h2 className="font-headline text-3xl md:text-4xl text-white">Planet Explorer</h2>
              <p className="text-xs text-on-surface-variant font-body">Select a cosmic body filter or click a planet card to read composition stats and core composition breakdowns.</p>
            </div>

            {/* List level filter controls */}
            <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2 no-scrollbar">
              {filtersList.map((filt) => (
                <button
                  key={filt}
                  onClick={() => setSelectedFilter(filt)}
                  className={`px-4 py-2 rounded-xl text-xs font-label uppercase tracking-wider transition-all cursor-pointer ${
                    selectedFilter === filt 
                      ? "bg-primary text-on-primary font-bold shadow-md" 
                      : "bg-white/5 border border-white/5 text-on-surface-variant hover:text-white"
                  }`}
                >
                  {filt}
                </button>
              ))}
            </div>
          </div>

          {/* Grid list elements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {filteredBodies.map((planet) => (
              <button
                key={planet.id}
                onClick={() => setSelectedPlanet(planet)}
                className="glass-panel p-5 rounded-[30px] glass-card-hover text-left flex flex-col justify-between h-[360px] group relative focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                
                {/* Visual Image Canopy */}
                <div className="aspect-square w-full rounded-2xl overflow-hidden relative bg-white/[0.02]">
                  {/* Subtle decorative mesh gradient based on classification */}
                  <div className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-all ${
                    planet.category === "Star" ? "bg-amber-400" : planet.category === "Rocky" ? "bg-red-400" : "bg-primary"
                  }`}></div>
                  <img
                    src={planet.image}
                    alt={planet.name}
                    className="w-full h-full object-cover rounded-2xl scale-95 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-label uppercase tracking-widest font-bold ${
                      planet.category === "Star" ? "text-amber-300" : planet.category === "Rocky" ? "text-red-400" : "text-primary"
                    }`}>
                      {planet.category}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">
                      {planet.distanceVal === 0 ? "Core" : `${planet.distanceVal} AU`}
                    </span>
                  </div>

                  <h3 className="font-headline text-xl text-white group-hover:text-primary transition-colors leading-none">
                    {planet.name}
                  </h3>
                </div>

                {/* Tags lists */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {planet.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className={`px-2 py-0.5 rounded text-[9px] font-label tracking-wide uppercase ${
                        tag === "HOTTEST" || tag === "RED PLANET" 
                          ? "bg-red-500/20 text-red-300" 
                          : tag === "HABITABLE" || tag === "WATER" 
                          ? "bg-green-500/10 text-green-300" 
                          : "bg-white/5 text-white/60"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Segment 4: Comparison Lab */}
      <section className="py-24 max-w-[1280px] mx-auto px-6 md:px-12" id="compare">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <span className="text-xs font-label text-primary uppercase tracking-widest font-bold">Interactive comparison</span>
          <h2 className="font-headline text-3xl md:text-4xl text-white leading-tight">Comparison Lab</h2>
          <p className="font-body text-sm text-on-surface-variant">See how worlds measure up against each other. Calculate dimensions, side-by-side scale spheres, and telemetry pulling gravity.</p>
        </div>

        {/* PlanetComparisonLab component */}
        <PlanetComparisonLab />
      </section>

      {/* Segment 5: Quiz Zone */}
      <section className="py-24 bg-[#040612] border-t border-white/5" id="quiz">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left intro details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-label text-primary uppercase tracking-widest font-bold">Galactic Academy</span>
              <h2 className="font-headline text-3xl md:text-4xl text-white">Are You a <br/>Space Expert?</h2>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Unlock achievements and rank high on the galactic index by verifying solar system coordinates and chemical telemetry metrics.
              </p>

              {/* Score breakdown metrics and badges */}
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-2xl">
                    🎖️
                  </div>
                  <div>
                    <div className="text-[10px] font-label text-primary uppercase tracking-widest">Calculated Score</div>
                    <div className="text-lg font-mono font-bold text-white">{userXp} XP Cumulative Points</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-label text-white/50 uppercase tracking-widest">Unlocked Achievement Badges ({unlockedBadges.length})</div>
                  {unlockedBadges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {unlockedBadges.map((badge) => (
                        <span key={badge} className="px-3 py-1.5 rounded-xl bg-secondary/10 border border-secondary/20 text-xs font-label text-secondary flex items-center gap-1.5 animate-fade-in">
                          <span>🏅</span> {badge}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-on-surface-variant italic font-body">No achievements unlocked yet. Finish a quiz calibration below!</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right side lists of available quizzes */}
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              
              {/* Premium AI Dynamic Quiz Card */}
              <div className="sm:col-span-2 bg-gradient-to-br from-[#0c0d24] via-[#050616] to-[#0a0520] border-2 border-indigo-500/15 p-8 rounded-[32px] relative overflow-hidden group hover:border-indigo-500/35 transition-all flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_4px_30px_rgba(99,102,241,0.05)]">
                
                {/* Background neon orb glow */}
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-4 text-center md:text-left flex-1">
                  <div className="flex justify-center md:justify-start items-center gap-3">
                    <span className="text-3xl animate-pulse">🧠</span>
                    <span className="text-[10px] font-mono uppercase px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full tracking-widest font-bold">
                      GEMINI-3.5-FLASH POWERED
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline text-xl sm:text-2xl text-white font-extrabold tracking-tight">AI Personalized Space Tutor</h3>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed max-w-xl">
                      Generate a dynamic 5-question multiple choice challenge curated instantly by Gemini AI on topics of your choosing. Incorporate your real-time laboratory planet comparison history and simulated VR log telemetry for extreme personalization!
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-3 pt-4 md:pt-0 md:border-l md:border-white/5 md:pl-8">
                  <span className="text-xs font-mono text-secondary font-bold">💎 +800 XP Reward</span>
                  <button
                    onClick={() => setShowAiSetup(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white transition-all font-label text-xs uppercase tracking-widest rounded-xl font-bold font-semibold cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.55)] focus:scale-105 active:scale-95"
                  >
                    Calibrate AI Tutor
                  </button>
                </div>
              </div>

              {QUIZZES.map((quiz) => (
                <div key={quiz.id} className="glass-panel p-8 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all flex flex-col justify-between min-h-[240px]">
                  {/* Faint graphics in background */}
                  <div className="absolute right-0 bottom-0 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity text-[100px] font-bold">
                    {quiz.icon}
                  </div>

                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-3xl">{quiz.icon}</span>
                      <span className={`text-[9px] font-label uppercase px-2.5 py-0.5 rounded ${
                        quiz.level === "Novice" ? "bg-green-500/20 text-green-300" : "bg-primary/20 text-primary"
                      }`}>
                        {quiz.level}
                      </span>
                    </div>

                    <h3 className="font-headline text-lg sm:text-xl text-white mt-4 font-bold">{quiz.title}</h3>
                    <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                      {quiz.subtitle}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-4 border-t border-white/5">
                    <span className="text-xs font-mono text-secondary">+{quiz.xpReward} XP Reward</span>
                    <button
                      onClick={() => setActiveQuiz(quiz)}
                      className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-on-primary transition-all font-label text-xs uppercase tracking-wider rounded-xl font-bold cursor-pointer"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* Main Footer */}
      <footer className="border-t border-white/5 bg-slate-950/80 py-16">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <CosmosLogo size={36} showText={false} />
              <h4 className="font-headline text-xl text-primary tracking-tighter font-bold">COSMOS EXPLORERS</h4>
            </div>
            <p className="text-xs text-on-surface-variant font-mono mt-2">
              © 2026 Cosmos Explorers Education Labs. All satellite systems operational.
            </p>
          </div>

          <nav className="flex flex-wrap gap-6 justify-center text-xs font-label uppercase tracking-widest text-on-surface-variant">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-white">Galactic Guide</button>
            <button onClick={() => handleScrollToSegment("missions")} className="hover:text-white">Missions Index</button>
            <button onClick={() => handleScrollToSegment("explorer")} className="hover:text-white">Scan Matrix</button>
            <button onClick={() => handleScrollToSegment("compare")} className="hover:text-white">Compare lab</button>
          </nav>

          <div className="flex gap-4">
            <span className="text-sm font-label text-white/40">Sector: ORBIT-8-L2</span>
          </div>

        </div>
      </footer>

      {/* MODAL VIEW 1: Planet Details Spectral Diagnostic Overlay */}
      {selectedPlanet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={() => setSelectedPlanet(null)}></div>
          
          <div className="relative glass-panel w-full max-w-4xl max-h-[92%] overflow-hidden rounded-[36px] flex flex-col md:flex-row shadow-[0_0_80px_rgba(0,0,0,0.8)]">
            
            {/* Left part: Aesthetic Planet Sphere Showcase */}
            <div className="md:w-1/2 p-8 md:p-12 bg-white/[0.02] flex flex-col justify-center items-center relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
              
              {/* Floating planetary category badge */}
              <div className="absolute top-4 left-6 z-10 text-[10px] font-label text-primary bg-primary/15 border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">
                {selectedPlanet.category} world
              </div>

              {/* Close button for tiny displays */}
              <button 
                onClick={() => setSelectedPlanet(null)} 
                className="md:hidden absolute top-4 right-4 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white"
              >
                ✕
              </button>

              {/* Sphere image canopy */}
              <div className="w-64 h-64 md:w-72 md:h-72 my-6 rounded-full relative z-10 flex items-center justify-center">
                {/* Simulated colorful atmospheric orbit rings behind */}
                <div className={`absolute w-full h-full rounded-full opacity-35 blur-2xl ${
                  selectedPlanet.category === "Star" ? "bg-amber-400" : selectedPlanet.category === "Rocky" ? "bg-red-500" : "bg-primary"
                }`}></div>
                <img 
                  src={selectedPlanet.image} 
                  alt={selectedPlanet.name} 
                  className="w-full h-full object-cover rounded-full relative z-10 animate-orbital"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Name indicator */}
              <h2 className="font-headline text-3xl md:text-4xl text-white relative z-10 text-center">{selectedPlanet.name}</h2>
              <p className="text-xs text-on-surface-variant italic mt-1 relative z-10 text-center max-w-sm">{selectedPlanet.funFact}</p>
            </div>

            {/* Right part: Detailed Spec lists and compos charts */}
            <div className="md:w-1/2 p-8 md:p-12 overflow-y-auto no-scrollbar space-y-8">
              
              {/* Header section with category overview */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-label text-primary uppercase tracking-widest font-bold">SPECTRAL ANALYSIS LOCK</span>
                  <p className="text-xs text-on-surface-variant mt-1">{selectedPlanet.description}</p>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="hidden md:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center hover:bg-white/10 text-white transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Planetary Details Specification Readout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] font-label text-white/40 uppercase tracking-wider mb-1">Outer Diameter</div>
                  <div className="font-headline text-sm font-bold text-white">{selectedPlanet.diameter}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] font-label text-white/40 uppercase tracking-wider mb-1">Core Mass scale</div>
                  <div className="font-headline text-sm font-bold text-white">{selectedPlanet.mass}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] font-label text-white/40 uppercase tracking-wider mb-1">Gravational pull</div>
                  <div className="font-headline text-sm font-bold text-white">{selectedPlanet.gravity}</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-[9px] font-label text-white/40 uppercase tracking-wider mb-1">Mean temperature</div>
                  <div className="font-headline text-sm font-bold text-white">{selectedPlanet.temperature}</div>
                </div>
              </div>

              {/* Chemical composition layered breakdown */}
              <div className="space-y-4">
                <h4 className="font-label text-xs uppercase tracking-widest text-[#9dcaff] font-bold">Inner Core Stratification</h4>
                <div className="space-y-3 max-w-full">
                  {selectedPlanet.coreComposition.map((layer, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-label">{layer.name}</span>
                        <span className="font-mono text-[11px] text-primary">{layer.percentage}% volumic</span>
                      </div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ 
                            width: `${layer.percentage}%`,
                            boxShadow: "0 0 8px #b7c4ff"
                          }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-on-surface-variant italic font-serif pl-2 leading-relaxed">{layer.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atmospheric elements list tags */}
              <div className="space-y-2">
                <h4 className="font-label text-[11px] uppercase tracking-widest text-white/50 font-bold">Atmochemistry trace elements</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPlanet.atmosphere.map((atm) => (
                    <span key={atm} className="px-2.5 py-1 rounded-lg bg-white/5 text-[10px] font-mono text-on-surface-variant border border-white/5">
                      {atm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Elaborated information paragraphs */}
              <div className="p-4 bg-slate-950/40 rounded-xl text-xs text-on-surface-variant leading-relaxed">
                <span className="text-primary font-bold mr-1">FLIGHT LOG:</span> {selectedPlanet.details}
              </div>

              {/* VR/Landing Simulator triggers */}
              <button
                onClick={() => {
                  setSelectedPlanet(null);
                  setSimulatorInitialTarget(selectedPlanet);
                  setShowSimulator(true);
                }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary hover:shadow-[0_0_20px_rgba(183,196,255,0.4)] transition-all font-label text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Launch Lander VR Simulation
              </button>

            </div>

          </div>
        </div>
      )}

      {/* MODAL VIEW 2: Interactive Quiz Module */}
      {activeQuiz && (
        <InteractiveQuizModule 
          quiz={activeQuiz} 
          onClose={() => {
            setActiveQuiz(null);
            setIsAiQuizActive(false);
          }} 
          onCompleted={(xp, badge) => {
            handleQuizWin(xp, badge);
          }}
          isAiQuiz={isAiQuizActive}
        />
      )}

      {/* AI Wizard Setup Overlay */}
      {showAiSetup && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/90 backdrop-blur-2xl" onClick={() => setShowAiSetup(false)}></div>
          
          <div className="relative glass-panel w-full max-w-xl rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.25)] border border-indigo-500/20">
            
            {/* Banner Header */}
            <div className="bg-gradient-to-r from-indigo-500/10 via-primary/5 to-transparent p-6 md:p-8 border-b border-white/10 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧠</span>
                  <span className="text-[10px] font-label text-indigo-300 tracking-widest uppercase bg-indigo-500/25 px-2.5 py-0.5 rounded-full font-bold">
                    NEURAL CALIBRATOR
                  </span>
                </div>
                <h3 className="font-headline text-lg md:text-xl text-white mt-1.5 font-bold">Tutor Parameters Configuration</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Determine topics & bind browser telemetry indicators.</p>
              </div>
              <button 
                onClick={() => setShowAiSetup(false)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Config parameters */}
            <div className="p-6 md:p-8 space-y-6">
              {!isGeneratingQuiz ? (
                <>
                  {/* Select Core Topic */}
                  <div className="space-y-2">
                    <label className="block text-xs font-label text-primary uppercase tracking-widest font-bold">Astronomy Focus Field</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "All Solar System Worlds (General Core)",
                        "Rocky Specimen Focus (Inner Worlds)",
                        "Colossal Gas Giants Exploration",
                        "The Central Reactor (Sun Energetics)",
                        "Custom Focus"
                      ].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAiFocusTopic(val)}
                          className={`p-3 rounded-xl border text-left text-xs font-label transition-all ${
                            aiFocusTopic === val 
                              ? "bg-indigo-500/25 border-indigo-500 text-indigo-200 font-bold" 
                              : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input form if custom focus */}
                  {aiFocusTopic === "Custom Focus" && (
                    <div className="space-y-1.5 animate-fade-in">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">Provide Custom Quadrant Focus Topic</label>
                      <input
                        type="text"
                        value={customFocusText}
                        onChange={(e) => setCustomFocusText(e.target.value)}
                        placeholder="e.g. Jovian satellite orbit loops or Saturn ring debris composition..."
                        className="w-full bg-[#050616] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                      />
                    </div>
                  )}

                  {/* Telemetry Integration Controls */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <h5 className="text-xs font-label text-indigo-300 uppercase tracking-widest font-bold">Laboratory State Binding</h5>
                    
                    {/* Laboratory state compared history */}
                    <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="flex-1 pr-4">
                        <div className="text-xs font-label text-white font-bold">Compared Planet State</div>
                        <p className="text-[10px] text-on-surface-variant leading-snug mt-0.5">Integrate physical gravity & diameter metrics from compared worlds.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIncludeComparisonTelemetry(!includeComparisonTelemetry)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                          includeComparisonTelemetry ? "bg-indigo-600" : "bg-slate-800"
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full bg-white shadow transition-all transform ${
                          includeComparisonTelemetry ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>

                    {/* Flight Sim history telemetry */}
                    <div className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="flex-1 pr-4">
                        <div className="text-xs font-label text-white font-bold">VR Simulated Lander Metrics</div>
                        <p className="text-[10px] text-on-surface-variant leading-snug mt-0.5">Adjust quiz questions depending on your VR mission flight logs count.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIncludeSimulationTelemetry(!includeSimulationTelemetry)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                          includeSimulationTelemetry ? "bg-indigo-600" : "bg-slate-800"
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full bg-white shadow transition-all transform ${
                          includeSimulationTelemetry ? "translate-x-6" : "translate-x-0"
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAiSetup(false)}
                      className="px-5 py-3 rounded-xl border border-white/10 text-white font-label text-xs uppercase tracking-wider hover:bg-white/5 cursor-pointer font-bold"
                    >
                      Abort Calibration
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateAiQuiz}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-bold transition-all shadow-[0_0_15px_rgba(99,102,241,0.25)] font-label text-xs uppercase tracking-widest cursor-pointer focus:scale-105 active:scale-95"
                    >
                      Initiate Neural Connect
                    </button>
                  </div>
                </>
              ) : (
                /* Interactive Log Terminal setup */
                <div className="bg-[#03040f] border border-indigo-500/20 p-6 rounded-2xl text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#a5b4fc] animate-pulse">● SYNAPTIC TRANSMISSION ON AIR</span>
                    <span className="text-[9px] font-mono text-indigo-400">GEMINI-3.5 NETWORK</span>
                  </div>

                  {/* Interactive loading messages */}
                  <div className="space-y-2 h-[200px] overflow-y-auto font-mono text-xs text-indigo-300/90 leading-relaxed no-scrollbar select-none">
                    {generationLogs.map((log, idx) => (
                      <div key={idx} className="animate-fade-in select-none">
                        {log}
                      </div>
                    ))}
                    <div className="flex justify-start items-center gap-1 text-indigo-400 font-bold">
                      <span className="animate-pulse">❯ SYNCING NEURAL CORRIDORS</span>
                      <span className="animate-bounce">...</span>
                    </div>
                  </div>

                  {/* Beautiful orbital space graphic visualizer */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full animate-pulse" style={{ width: "80%" }}></div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODAL VIEW 3: Probe Simulator Module */}
      {showSimulator && (
        <VirtualMissionSimulator 
          initialTarget={simulatorInitialTarget} 
          onClose={() => {
            setShowSimulator(false);
            setSimulatorInitialTarget(null);
          }}
          onCompleted={(xp) => {
            handleSimulatorSuccess(xp);
          }}
        />
      )}

    </div>
  );
}
