/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppMode } from './types';
import { soundFX } from './utils/audio';
import { Navbar } from './components/Navbar';
import { LessonMode } from './components/LessonMode';
import { TrainGameMode } from './components/TrainGameMode';
import { WordScrambleGame } from './components/WordScrambleGame';
import { TeamRelayGame } from './components/TeamRelayGame';
import { SentenceDoctorGame } from './components/SentenceDoctorGame';
import { SillySentenceLab } from './components/SillySentenceLab';
import { StudentSpinnerModal } from './components/StudentSpinnerModal';
import { TeacherGuideModal } from './components/TeacherGuideModal';
import { Users, Sparkles, BookOpen, Volume2, Maximize } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('lesson');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);

  // Sync sound settings with audio manager
  useEffect(() => {
    soundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    soundFX.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const handleToggleLargeFont = () => {
    soundFX.playClick();
    setIsLargeFont(prev => !prev);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-100/50 text-slate-800 ${isLargeFont ? 'text-lg' : 'text-base'}`}>
      {/* Top Smartboard Classroom Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        onOpenSpinner={() => setIsSpinnerOpen(true)}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        isLargeFont={isLargeFont}
        onToggleLargeFont={handleToggleLargeFont}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Classroom Facilitator Quick Alert / Banner */}
      <div className="bg-amber-200/60 border-b border-amber-300 py-1.5 px-4 text-center">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-amber-950">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-base">🏫</span>
            <span className="hidden sm:inline font-extrabold">Smartboard Facilitation:</span>
            <span>
              {currentMode === 'lesson'
                ? 'Teach the 3 Golden Rules first with group choral responses!'
                : currentMode === 'train'
                ? 'Invite students up to hook wagons onto the train tracks!'
                : currentMode === 'team-relay'
                ? 'Blue Robins vs Red Foxes: students alternate turns at the board!'
                : currentMode === 'doctor'
                ? 'Who can spot the sick mistake? Tap the doctor tools!'
                : 'Whole class builds silly grammatically sound sentences!'}
            </span>
          </div>

          <button
            onClick={() => setIsSpinnerOpen(true)}
            className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-900 rounded-lg border border-amber-400 font-extrabold text-xs shadow-xs cursor-pointer active:scale-95"
          >
            <Users className="w-3.5 h-3.5 text-amber-600" />
            <span>Call Next Student 🎲</span>
          </button>
        </div>
      </div>

      {/* Main Classroom Activity Area */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {currentMode === 'lesson' && (
          <LessonMode
            onStartExercises={(targetMode) => setCurrentMode(targetMode)}
            isLargeFont={isLargeFont}
          />
        )}

        {currentMode === 'train' && (
          <TrainGameMode isLargeFont={isLargeFont} />
        )}

        {currentMode === 'scramble' && (
          <WordScrambleGame isLargeFont={isLargeFont} />
        )}

        {currentMode === 'team-relay' && (
          <TeamRelayGame
            isLargeFont={isLargeFont}
            onOpenSpinner={() => setIsSpinnerOpen(true)}
          />
        )}

        {currentMode === 'doctor' && (
          <SentenceDoctorGame isLargeFont={isLargeFont} />
        )}

        {currentMode === 'silly-lab' && (
          <SillySentenceLab isLargeFont={isLargeFont} />
        )}
      </main>

      {/* Smartboard Footer with Quick Helper Anchor */}
      <footer className="bg-white/80 border-t-2 border-amber-200 py-4 px-6 text-center text-xs text-slate-500 font-bold">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🦁 Sentence Safari</span>
            <span>•</span>
            <span>Grade 1 ELA Interactive Whiteboard</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsTeacherGuideOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
            >
              Teacher Discussion Prompts & Standards
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSpinnerOpen(true)}
              className="text-amber-700 hover:text-amber-900 underline cursor-pointer"
            >
              Class Student Spinner
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentSpinnerModal
        isOpen={isSpinnerOpen}
        onClose={() => setIsSpinnerOpen(false)}
      />

      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />
    </div>
  );
}
