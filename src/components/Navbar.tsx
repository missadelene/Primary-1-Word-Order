/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppMode } from '../types';
import { soundFX } from '../utils/audio';
import { 
  GraduationCap, 
  Train, 
  Puzzle, 
  Trophy, 
  Stethoscope, 
  FlaskConical, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  HelpCircle,
  Users
} from 'lucide-react';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenSpinner: () => void;
  onOpenTeacherGuide: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isLargeFont: boolean;
  onToggleLargeFont: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  onOpenSpinner,
  onOpenTeacherGuide,
  soundEnabled,
  onToggleSound,
  isLargeFont,
  onToggleLargeFont,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const modes: { id: AppMode; label: string; icon: React.ReactNode; color: string }[] = [
    { id: 'lesson', label: '1. Lesson', icon: <GraduationCap className="w-5 h-5" />, color: 'from-amber-500 to-orange-500' },
    { id: 'train', label: '2. Train Express', icon: <Train className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
    { id: 'scramble', label: '3. Word Scramble', icon: <Puzzle className="w-5 h-5" />, color: 'from-emerald-500 to-teal-500' },
    { id: 'team-relay', label: '4. Team Relay', icon: <Trophy className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
    { id: 'doctor', label: '5. Sentence Doctor', icon: <Stethoscope className="w-5 h-5" />, color: 'from-rose-500 to-red-500' },
    { id: 'silly-lab', label: '6. Silly Lab', icon: <FlaskConical className="w-5 h-5" />, color: 'from-amber-600 to-yellow-500' },
  ];

  const handleModeClick = (mode: AppMode) => {
    soundFX.playClick();
    onSelectMode(mode);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-md border-b-4 border-amber-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-inner border-2 border-white">
            🦁
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">
                Sentence Safari
              </h1>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                Grade 1 Smartboard
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold hidden sm:block">
              Interactive Whole-Class Sentence Builder
            </p>
          </div>
        </div>

        {/* Smartboard Tool Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Who's Next Student Spinner */}
          <button
            onClick={() => {
              soundFX.playPop();
              onOpenSpinner();
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-bold rounded-xl shadow-md border-2 border-amber-300 text-sm transition-all cursor-pointer"
            title="Random Student Picker for Smartboard"
          >
            <Users className="w-4 h-4 text-yellow-100 animate-pulse" />
            <span className="font-extrabold hidden md:inline">Who's Next?</span>
            <span className="md:hidden">Picker</span>
          </button>

          {/* Teacher Guide */}
          <button
            onClick={() => {
              soundFX.playClick();
              onOpenTeacherGuide();
            }}
            className="flex items-center gap-1 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border-2 border-indigo-200 text-sm transition-all cursor-pointer"
            title="Teacher Lesson Guide & Pedagogy"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden lg:inline">Teacher Guide</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl border-2 font-bold text-sm transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-slate-100 border-slate-300 text-slate-400'
            }`}
            title={soundEnabled ? 'Sound is ON' : 'Sound is MUTED'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Large text toggle for smartboard */}
          <button
            onClick={onToggleLargeFont}
            className={`px-2.5 py-1.5 rounded-xl border-2 font-black text-xs transition-all cursor-pointer ${
              isLargeFont
                ? 'bg-purple-100 border-purple-400 text-purple-800'
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
            title="Toggle Giant Text for Smartboard"
          >
            {isLargeFont ? 'A++' : 'A+'}
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 transition-all cursor-pointer"
            title="Toggle Smartboard Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mode navigation bar - Large touch-friendly pills for smartboard */}
      <div className="bg-amber-100/70 px-2 sm:px-6 py-1.5 overflow-x-auto scrollbar-none border-t border-amber-200">
        <nav className="flex items-center gap-1.5 sm:gap-2 max-w-7xl mx-auto min-w-max">
          {modes.map((mode) => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => handleModeClick(mode.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? `bg-gradient-to-r ${mode.color} text-white shadow-md scale-102 ring-2 ring-white`
                    : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-amber-200'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
