import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Trophy, Music, Gamepad2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  const handleGameOver = () => {
    setIsGameOver(true);
  };

  const handleRestart = () => {
    setIsGameOver(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col p-6 selection:bg-neon-magenta/30">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-white/10 pb-4 shrink-0 relative z-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500">
            NEON RHYTHM // V.1.0
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-mono">Synchronized Audio-Kinetic Interface</p>
        </div>
        <div className="flex gap-8 items-end">
          <div className="text-right">
            <span className="block text-[10px] uppercase text-pink-500 font-bold mb-1 font-mono">High Score</span>
            <span className="text-3xl font-mono leading-none">{highScore}</span>
          </div>
          <div className="text-right bg-white/5 p-2 rounded-lg border border-white/10">
            <span className="block text-[10px] uppercase text-cyan-400 font-bold font-mono">Current Session</span>
            <span className="text-3xl font-mono leading-none">{score.toString().padStart(6, '0')}</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 gap-6 min-h-0 relative z-10 overflow-hidden">
        {/* Sidebar: Audio Sequence */}
        <section className="w-72 flex flex-col gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1 flex flex-col overflow-hidden">
            <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold font-mono">Audio Sequence</h2>
            <div className="space-y-2 overflow-y-auto">
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-transparent border border-cyan-500/30 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>
                <div>
                  <p className="text-sm font-bold truncate">SYNTHWAVE DREAMS</p>
                  <p className="text-[10px] text-cyan-400 uppercase font-mono">AI GEN // 128 BPM</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 flex items-center gap-3 transition-colors cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40"></div>
                <div>
                  <p className="text-sm font-medium text-white/60 truncate">NEON PULSE</p>
                  <p className="text-[10px] text-white/30 uppercase font-mono">AI GEN // 142 BPM</p>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-transparent hover:border-white/10 flex items-center gap-3 transition-colors cursor-pointer group">
                <div className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-white/40"></div>
                <div>
                  <p className="text-sm font-medium text-white/60 truncate">DIGITAL VOID</p>
                  <p className="text-[10px] text-white/30 uppercase font-mono">AI GEN // 110 BPM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-32 bg-pink-600/10 border border-pink-500/30 rounded-2xl p-4 relative overflow-hidden shrink-0">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <path d="M0 50 Q 25 20, 50 50 T 100 50" stroke="#ec4899" fill="transparent" strokeWidth="2" />
              </svg>
            </div>
            <p className="text-[10px] uppercase font-bold text-pink-400 mb-2 font-mono">Visualizer</p>
            <div className="flex items-end gap-1 h-12">
              {[12, 28, 16, 36, 18, 32, 24].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [`${h}px`, `${h * 1.5}px`, `${h}px`] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }}
                  className="w-2 bg-pink-500" 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Main Console */}
        <section className="flex-1 flex flex-col items-center justify-center p-4 min-w-0">
          <div className="relative group flex flex-col items-center">
            <div className="absolute top-[-3.5rem] left-1/2 -translate-x-1/2 flex items-center gap-6 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 shadow-[0_0_8px_#ec4899]"></div>
                <span className="text-[10px] uppercase font-bold font-mono text-white/80">Active Snake</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 shadow-[0_0_8px_#facc15]"></div>
                <span className="text-[10px] uppercase font-bold font-mono text-white/80">Data Core</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-2 bg-cyan-500/10 blur-xl opacity-50 pointer-events-none" />
              <SnakeGame 
                onScoreChange={handleScoreChange}
                onGameOver={handleGameOver}
                onRestart={handleRestart}
                isGameOver={isGameOver}
              />
            </div>
            <div className="mt-8 text-center bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <p className="text-[10px] text-white/30 uppercase font-mono tracking-widest">System Ready // ARROW_KEYS TO OPERATE</p>
            </div>
          </div>
        </section>

        {/* Right Stats */}
        <section className="w-48 flex flex-col gap-4 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-colors">
            <p className="text-[10px] uppercase text-white/40 font-bold mb-1 font-mono tracking-wider">Score</p>
            <p className="text-5xl font-black italic text-pink-500 font-mono tracking-tighter">{score}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center group hover:bg-white/10 transition-colors">
            <p className="text-[10px] uppercase text-white/40 font-bold mb-1 font-mono tracking-wider">Multiplier</p>
            <p className="text-3xl font-black text-cyan-400 italic font-mono">x{(1 + Math.floor(score / 50) * 0.5).toFixed(1)}</p>
          </div>
          <div className="flex-1 flex flex-col justify-end gap-2 p-2">
            <div className="h-1 bg-white/10 w-full rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                style={{ width: `${Math.min(score / 5, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-right uppercase text-cyan-400 font-mono font-bold tracking-tight">Sync Level {(Math.floor(score / 100) + 1).toString().padStart(2, '0')}</p>
          </div>
        </section>
      </main>

      {/* Footer Player */}
      <footer className="mt-6 shrink-0 relative z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}
