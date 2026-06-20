/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Quiz, QuizQuestion } from "../data";

interface InteractiveQuizModuleProps {
  quiz: Quiz;
  onClose: () => void;
  onCompleted: (xpEarned: number, badge: string) => void;
  isAiQuiz?: boolean;
}

// Custom light-weight Markdown formatter for polished terminal outputs
function SimpleMarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2.5 font-body text-sm text-slate-300 text-left max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("###")) {
          return (
            <h5 key={i} className="text-secondary font-headline font-bold text-xs mt-3 uppercase tracking-wider">
              {trimmed.replace("###", "").trim()}
            </h5>
          );
        }
        if (trimmed.startsWith("##")) {
          return (
            <h4 key={i} className="text-primary font-headline font-bold text-sm mt-3 uppercase tracking-wide border-b border-white/5 pb-1">
              {trimmed.replace("##", "").trim()}
            </h4>
          );
        }
        if (trimmed.startsWith("#")) {
          return (
            <h3 key={i} className="text-white font-headline font-bold text-base mt-4">
              {trimmed.replace("#", "").trim()}
            </h3>
          );
        }
        if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
          return (
            <div key={i} className="flex gap-2 items-start pl-1 text-slate-300 leading-relaxed text-xs">
              <span className="text-indigo-400 mt-1 select-none">✦</span>
              <span>{trimmed.substring(1).trim()}</span>
            </div>
          );
        }
        if (trimmed === "") {
          return <div key={i} className="h-1.5" />;
        }
        return <p key={i} className="leading-relaxed text-xs">{trimmed}</p>;
      })}
    </div>
  );
}

export default function InteractiveQuizModule({ 
  quiz, 
  onClose, 
  onCompleted,
  isAiQuiz = false,
}: InteractiveQuizModuleProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [answersStatus, setAnswersStatus] = useState<boolean[]>([]); // track correct answers
  const [xpScore, setXpScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  // States for dynamic AI feedback
  const [aiFeedback, setAiFeedback] = useState<string>("");
  const [isLoadingFeedback, setIsLoadingFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (quizFinished && isAiQuiz) {
      setIsLoadingFeedback(true);
      fetch("/api/quiz/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quiz.title,
          questions: quiz.questions,
          answersStatus: answersStatus,
          score: xpScore,
          focus: quiz.id === "ai_quiz" ? "AI Generated Specimen Telemetry" : quiz.title,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAiFeedback(data.feedback || "Sensors recorded perfect telemetry coordinates.");
        })
        .catch((err) => {
          console.error("AI Feedback retrieval failed, using local offline generator:", err);
          
          // Generate a premium offline feedback report
          const correctCount = answersStatus.filter(Boolean).length;
          const totalQuestions = quiz.questions.length;
          const pct = Math.round((correctCount / totalQuestions) * 100);
          
          let report = `## Offline Academy Diagnostics\n\n`;
          report += `Telemetry calibration completed with an accuracy of **${pct}%** (${correctCount}/${totalQuestions} challenges resolved).\n\n`;
          
          if (pct === 100) {
            report += `### Stellar Performance Rating\nExcellent! Perfect navigation calculations. Your sensors locked onto all coordinates correctly. You have demonstrated master-level quadrant control.\n\n`;
          } else if (pct >= 60) {
            report += `### High Velocity Competency\nGood work! Most calibration channels are locked in. A few minor telemetry adjustments are recommended for future orbital runs.\n\n`;
          } else {
            report += `### Calibration Warnings\nDiagnostics show orbital drift. Core systems require checking. Review solar telemetry notes on rocky core densities and atmospheric gases.\n\n`;
          }
          
          report += `### Custom Study Tips\n`;
          report += `- **Revise Celestial Densities**: Rocky planets like Mercury feature thick metallic iron cores, while atmospheric giants lack solid bounds.\n`;
          report += `- **Recalibrate Orbit Paths**: Re-run the orbital flight simulations to review AU scales (Astronomical Units) from the central Sun.\n`;
          report += `- **Check Chemistry Telemetries**: Make sure to check key gas elements (hydrogen, helium, ammonia) in outer giant atmospheres.\n`;
          
          setAiFeedback(report);
        })
        .finally(() => {
          setIsLoadingFeedback(false);
        });
    }
  }, [quizFinished, isAiQuiz]);

  const question: QuizQuestion = quiz.questions[currentIdx];

  const handleOptionClick = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOpt(idx);
  };

  // Play browser-synthesized sounds (Web Audio API)
  const playSynthesizedBeep = (type: "correct" | "incorrect" | "victory") => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === "correct") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "incorrect") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(146.83, ctx.currentTime + 0.12); // D3
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "victory") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();

        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15); // E5
        osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3); // G5
        osc1.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.45); // C6

        gain1.gain.setValueAtTime(0.06, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      // Ignored if sound blocked by iframe browser policy
    }
  };

  const handleVerify = () => {
    if (selectedOpt === null || isSubmitted) return;

    setIsSubmitted(true);
    const isCorrect = selectedOpt === question.answer;
    
    // Add point score
    const updatedStatuses = [...answersStatus, isCorrect];
    setAnswersStatus(updatedStatuses);

    if (isCorrect) {
      setXpScore((prev) => prev + Math.floor(quiz.xpReward / quiz.questions.length));
      playSynthesizedBeep("correct");
    } else {
      playSynthesizedBeep("incorrect");
    }
  };

  const handleNext = () => {
    // Reset selection option
    setSelectedOpt(null);
    setIsSubmitted(false);

    if (currentIdx < quiz.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      playSynthesizedBeep("victory");
      onCompleted(xpScore, quiz.badge);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Immersive blur filter backdrop */}
      <div className="absolute inset-0 bg-background/90 backdrop-blur-2xl" onClick={onClose}></div>

      {/* Main Container */}
      <div className={`relative glass-panel w-full rounded-[32px] overflow-hidden shadow-[0_0_80px_rgba(183,196,255,0.2)] transition-all duration-500 ${quizFinished && isAiQuiz ? "max-w-4xl" : "max-w-2xl"}`}>
        
        {/* Banner header with quiz theme colors */}
        <div className="bg-gradient-to-r from-primary/10 via-tertiary/10 to-transparent p-6 md:p-8 border-b border-white/10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{quiz.icon}</span>
              <span className="text-[10px] font-label text-primary tracking-widest uppercase bg-primary/20 px-2.5 py-0.5 rounded-full">
                LEVEL: {quiz.level}
              </span>
            </div>
            <h3 className="font-headline text-lg md:text-xl text-white mt-2 leading-tight">{quiz.title}</h3>
            <p className="text-xs text-on-surface-variant mt-1">{quiz.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content body showing current progress or result */}
        <div className="p-6 md:p-8 space-y-6">
          {!quizFinished ? (
            <>
              {/* Question progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-label">
                  <span className="text-on-surface-variant uppercase">Question {currentIdx + 1} of {quiz.questions.length}</span>
                  <span className="text-primary font-bold">XP Earned: {xpScore} / {quiz.xpReward}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-300" 
                    style={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Bold Headline Question */}
              <h4 className="font-headline text-md md:text-lg text-white leading-snug">
                {question.question}
              </h4>

              {/* Multiple choice selections */}
              <div className="space-y-3">
                {question.options.map((option, idx) => {
                  let buttonStyle = "bg-white/5 border-white/10 text-white hover:bg-white/10";
                  
                  if (selectedOpt === idx) {
                    buttonStyle = "bg-primary/20 border-primary text-primary font-bold";
                  }

                  if (isSubmitted) {
                    if (idx === question.answer) {
                      buttonStyle = "bg-green-500/20 border-green-500 text-green-400 font-bold shadow-[0_0_15px_rgba(34,197,94,0.2)]";
                    } else if (selectedOpt === idx) {
                      buttonStyle = "bg-red-500/20 border-red-500 text-red-400 font-bold";
                    } else {
                      buttonStyle = "bg-white/[0.02] border-white/5 text-white/40";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-label transition-all flex items-center justify-between ${buttonStyle}`}
                    >
                      <span>{option}</span>
                      <span className="text-[11px] uppercase tracking-wider font-mono opacity-55">Option 0{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* Verified explanations expander box */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl border text-xs leading-relaxed transition-all bg-indigo-500/5 border-indigo-500/25 text-indigo-300">
                  <div className="font-bold uppercase tracking-wider text-[10px] mb-1 font-label text-indigo-400">
                    {selectedOpt === question.answer ? "✓ CORRECT RESOLUTION" : "✕ TELEMETRY CORRECTED"}
                  </div>
                  {question.explanation}
                </div>
              )}

              {/* Action trigger footer */}
              <div className="flex justify-end gap-3 pt-2">
                {!isSubmitted ? (
                  <button
                    onClick={handleVerify}
                    disabled={selectedOpt === null}
                    className={`px-8 py-3 rounded-xl font-label text-xs uppercase tracking-widest transition-all ${
                      selectedOpt !== null 
                        ? "bg-primary text-on-primary hover:shadow-[0_0_15px_rgba(183,196,255,0.45)] cursor-pointer focus:scale-[1.02] active:scale-95" 
                        : "bg-white/5 border border-white/10 text-white/20 cursor-not-allowed"
                    }`}
                  >
                    Transmit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all font-label text-xs uppercase tracking-widest cursor-pointer focus:scale-[1.02] active:scale-95"
                  >
                    {currentIdx < quiz.questions.length - 1 ? "Next Challenge" : "Check Diagnostics"}
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Quiz Completed/Certificate Reward Screen */
            <div className={`py-4 space-y-6 ${isAiQuiz ? "text-left" : "text-center"}`}>
              
              {!isAiQuiz ? (
                <>
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto border border-primary/50 animate-bounce">
                    <span className="text-3xl text-primary font-bold">🏆</span>
                  </div>

                  <div className="space-y-2 text-center">
                    <h4 className="font-headline text-2xl text-white font-bold">Solar Challenge Successful!</h4>
                    <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                      You successfully verified gravitational telemetry coordinates on the outer quadrant.
                    </p>
                  </div>

                  {/* XP Tally and Badge Unlocked Panel */}
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-sm mx-auto space-y-4">
                    <div className="grid grid-cols-2 gap-4 divide-x divide-white/10">
                      <div>
                        <div className="text-[10px] font-label text-primary uppercase tracking-widest mb-1">SCORE REWARD</div>
                        <div className="text-2xl font-headline text-white font-bold">+{xpScore} <span className="text-xs text-on-surface-variant">XP</span></div>
                      </div>
                      <div>
                        <div className="text-[10px] font-label text-tertiary uppercase tracking-widest mb-1 font-bold">GALACTIC RADAR</div>
                        <div className="text-lg font-headline text-white font-bold">Rank {answersStatus.filter(Boolean).length}/{quiz.questions.length}</div>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 text-center">
                      <div className="text-[10px] font-label text-secondary uppercase tracking-widest mb-1 font-bold">🏆 EARNED ACHIEVEMENT BADGE</div>
                      <div className="text-lg font-headline text-secondary flex items-center justify-center gap-2 font-bold">
                        <span>🎖️</span> {quiz.badge}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid md:grid-cols-12 gap-8 items-stretch">
                  {/* Left Column stats with badge */}
                  <div className="md:col-span-5 space-y-6 text-center flex flex-col justify-center">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full flex items-center justify-center mx-auto border border-primary/45 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                      <span className="text-3xl">🚀</span>
                    </div>

                    <div>
                      <h4 className="font-headline text-xl text-white font-bold">Evaluation Complete</h4>
                      <p className="text-xs text-on-surface-variant mt-1 leading-snug">Stellar credentials transmitted successfully.</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-3.5">
                      <div className="grid grid-cols-2 gap-2 divide-x divide-white/10">
                        <div>
                          <div className="text-[8px] font-label text-primary uppercase tracking-widest font-bold">XP BOUNTY</div>
                          <div className="text-xl font-headline text-white font-bold">+{xpScore} <span className="text-[10px] text-slate-400">XP</span></div>
                        </div>
                        <div>
                          <div className="text-[8px] font-label text-tertiary uppercase tracking-widest font-bold">ACCURACY</div>
                          <div className="text-md font-headline text-white mt-1.5 font-bold">{Math.round((answersStatus.filter(Boolean).length / quiz.questions.length) * 100)}%</div>
                        </div>
                      </div>

                      <div className="border-t border-white/10 pt-3">
                        <div className="text-[8px] font-label text-secondary uppercase tracking-widest mb-0.5 font-bold">AWARDED CREDENTIAL</div>
                        <div className="text-sm font-headline text-secondary flex items-center justify-center gap-1.5 font-bold">
                          <span>🎖️</span> {quiz.badge}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column feedback */}
                  <div className="md:col-span-7 flex flex-col bg-[#030510]/65 border border-white/10 rounded-2xl p-5 relative overflow-hidden min-h-[300px]">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-3">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 font-bold">🧠 NEURAL AI ACADEMIC REPORT</span>
                    </div>

                    {isLoadingFeedback ? (
                      <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                        <p className="text-xs font-mono text-indigo-300">Decrypting satellite tutor diagnostics...</p>
                      </div>
                    ) : (
                      <SimpleMarkdownRenderer text={aiFeedback} />
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-4 border-t border-white/5">
                <button
                  onClick={() => {
                    // Reset Quiz to initial state and replay
                    setCurrentIdx(0);
                    setSelectedOpt(null);
                    setIsSubmitted(false);
                    setAnswersStatus([]);
                    setXpScore(0);
                    setQuizFinished(false);
                    setAiFeedback("");
                  }}
                  className="px-6 py-3 rounded-xl border border-white/15 hover:bg-white/5 text-white font-label text-xs uppercase tracking-wider transition-all cursor-pointer font-bold"
                >
                  Calibrate Again
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-primary text-on-primary font-bold hover:shadow-[0_0_20px_rgba(183,196,255,0.4)] transition-all font-label text-xs uppercase tracking-wider cursor-pointer"
                >
                  Return to Control
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
