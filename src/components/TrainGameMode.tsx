/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SENTENCE_DATABASE } from '../data/sentences';
import { SentenceItem, DifficultyLevel } from '../types';
import { soundFX, speakWord, speakSentence } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Train, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ChevronRight,
  Star,
  Award
} from 'lucide-react';

interface TrainGameModeProps {
  isLargeFont: boolean;
}

export const TrainGameMode: React.FC<TrainGameModeProps> = ({ isLargeFont }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('starter');
  const [filteredSentences, setFilteredSentences] = useState<SentenceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hookedCars, setHookedCars] = useState<string[]>([]);
  const [stationCars, setStationCars] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [scoreStars, setScoreStars] = useState(0);

  // Filter sentences by selected difficulty
  useEffect(() => {
    const list = SENTENCE_DATABASE.filter(s => s.difficulty === difficulty);
    setFilteredSentences(list);
    setCurrentIndex(0);
    loadSentence(list[0]);
  }, [difficulty]);

  const currentSentence = filteredSentences[currentIndex];

  const loadSentence = (item?: SentenceItem) => {
    if (!item) return;
    setHookedCars([]);
    // Shuffled cars
    setStationCars([...item.scrambled]);
    setIsSuccess(false);
    setFeedbackMsg(null);
    setShowHint(false);
  };

  const handleHookCar = (word: string, indexInStation: number) => {
    soundFX.playPop();
    speakWord(word);

    const newStation = [...stationCars];
    newStation.splice(indexInStation, 1);
    setStationCars(newStation);

    const newHooked = [...hookedCars, word];
    setHookedCars(newHooked);
    setFeedbackMsg(null);

    // Auto-check if all cars are placed
    if (newStation.length === 0 && currentSentence) {
      checkSentence(newHooked);
    }
  };

  const handleUnhookCar = (word: string, indexInHooked: number) => {
    soundFX.playClick();
    const newHooked = [...hookedCars];
    newHooked.splice(indexInHooked, 1);
    setHookedCars(newHooked);

    setStationCars([...stationCars, word]);
    setIsSuccess(false);
    setFeedbackMsg(null);
  };

  const checkSentence = (currentHooked: string[] = hookedCars) => {
    if (!currentSentence) return;
    const isCorrect = currentSentence.words.every((w, i) => w === currentHooked[i]);

    if (isCorrect && currentHooked.length === currentSentence.words.length) {
      setIsSuccess(true);
      soundFX.playTrainWhistle();
      setTimeout(() => soundFX.playFanfare(), 400);
      setScoreStars(prev => prev + 1);
      setFeedbackMsg('CHOO-CHOO! All cars in order! What a wonderful sentence!');
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.65 },
      });
      speakSentence(currentSentence.original);
    } else {
      soundFX.playBoing();
      setIsSuccess(false);
      setFeedbackMsg('Oops! Listen to the words. Does that order make sense? Tap a car to unhook it!');
    }
  };

  const listenToTrack = () => {
    if (hookedCars.length === 0) return;
    const text = hookedCars.join(' ');
    speakSentence(text);
  };

  const handleNext = () => {
    soundFX.playClick();
    const nextIdx = (currentIndex + 1) % filteredSentences.length;
    setCurrentIndex(nextIdx);
    loadSentence(filteredSentences[nextIdx]);
  };

  const handleReset = () => {
    soundFX.playClick();
    loadSentence(currentSentence);
  };

  if (!currentSentence) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header and Level Selector */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-blue-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center text-3xl shadow">
            🚂
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              Sentence Train Express
              <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-300">
                Train {currentIndex + 1} of {filteredSentences.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Tap cars in order to hook them to the locomotive!
            </p>
          </div>
        </div>

        {/* Stars counter and Difficulty tabs */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl font-black text-amber-900 text-sm">
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <span>{scoreStars} Stars</span>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['starter', 'explorer', 'champion'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  difficulty === lvl
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'starter' ? '3 Words' : lvl === 'explorer' ? '4 Words' : '5-6 Words'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Train Track Board */}
      <div className="bg-gradient-to-b from-sky-100 via-sky-50 to-amber-50 rounded-3xl border-4 border-blue-300 shadow-xl overflow-hidden p-6 sm:p-8 space-y-8 relative">
        {/* Sky Theme Elements */}
        <div className="flex items-center justify-between text-slate-400 text-sm font-bold">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce">☀️</span>
            <span className="bg-white/80 px-3 py-1 rounded-full text-slate-700 border border-sky-200">
              Theme: {currentSentence.theme.toUpperCase()} {currentSentence.icon}
            </span>
          </div>
          <div className="text-right">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3.5 py-1.5 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-xl font-bold border border-amber-400 text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Lightbulb className="w-4 h-4 text-amber-700" />
              <span>{showHint ? 'Hide Hint' : 'Need a Clue?'}</span>
            </button>
          </div>
        </div>

        {/* Hint banner if requested */}
        {showHint && (
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-3 text-amber-950 text-sm font-bold flex items-center gap-2 animate-soft-bounce">
            <span className="text-xl">💡</span>
            <span>{currentSentence.hint}</span>
          </div>
        )}

        {/* THE TRAIN TRACK & HOOKED CARS */}
        <div className="relative py-8 px-4 bg-slate-800/10 rounded-3xl border-3 border-dashed border-slate-300 overflow-x-auto">
          {/* Iron Rails line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 bg-slate-600 rounded-full shadow-inner flex items-center justify-between px-2">
            {/* Railroad Ties */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="w-1.5 h-6 bg-amber-900 rounded-sm" />
            ))}
          </div>

          <div className="relative z-10 flex items-center gap-3 min-w-max">
            {/* Cute Locomotive Engine */}
            <div className="relative group shrink-0">
              {/* Puff of smoke */}
              <div className="absolute -top-8 left-4 text-2xl animate-smoke select-none">
                💨
              </div>
              <div className="w-28 sm:w-32 h-24 bg-gradient-to-tr from-rose-600 via-rose-500 to-red-400 rounded-2xl border-4 border-rose-800 shadow-xl flex flex-col items-center justify-center text-white text-center p-2 relative">
                <span className="text-3xl">🚂</span>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-100">
                  Safari #1
                </span>
                <div className="absolute -bottom-2.5 flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-300 shadow" />
                  <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-300 shadow" />
                </div>
              </div>
            </div>

            {/* Hooked Cars on the Track */}
            {hookedCars.map((word, index) => {
              const isFirst = index === 0;
              const isLast = index === currentSentence.words.length - 1;
              return (
                <div key={`${word}-${index}`} className="flex items-center gap-2 animate-soft-bounce">
                  {/* Coupler link */}
                  <div className="w-3 h-2 bg-slate-700 rounded-full" />

                  {/* Word Wagon */}
                  <button
                    onClick={() => handleUnhookCar(word, index)}
                    className={`h-24 px-5 rounded-2xl border-4 shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 relative group ${
                      isFirst
                        ? 'bg-emerald-500 border-emerald-800 text-white'
                        : isLast
                        ? 'bg-indigo-500 border-indigo-800 text-white'
                        : 'bg-amber-400 border-amber-700 text-amber-950'
                    }`}
                  >
                    {/* Crown badge if first letter is capital */}
                    {isFirst && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-sm bg-yellow-300 rounded-full px-1.5 py-0.5 border border-yellow-500 shadow-sm font-black text-amber-950">
                        👑 1st
                      </span>
                    )}

                    {/* Stop sign badge if has punctuation */}
                    {word.match(/[.!?]$/) && (
                      <span className="absolute -top-3.5 right-1 text-sm bg-rose-500 text-white rounded-full px-1.5 py-0.5 border border-white shadow-sm font-black">
                        🛑 Stop
                      </span>
                    )}

                    <span className={`font-black tracking-wide ${isLargeFont ? 'text-3xl' : 'text-2xl'}`}>
                      {word}
                    </span>
                    <span className="text-[10px] opacity-80 font-bold uppercase mt-1">
                      (Tap to unhook)
                    </span>

                    {/* Train Wheels */}
                    <div className="absolute -bottom-2.5 flex gap-4">
                      <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-300 shadow" />
                      <div className="w-5 h-5 rounded-full bg-slate-900 border-2 border-slate-300 shadow" />
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Empty Wagon Slot Placeholders */}
            {Array.from({ length: Math.max(0, currentSentence.words.length - hookedCars.length) }).map((_, i) => (
              <div key={`empty-${i}`} className="flex items-center gap-2 opacity-50">
                <div className="w-3 h-2 bg-slate-400 rounded-full" />
                <div className="w-24 sm:w-28 h-24 rounded-2xl border-3 border-dashed border-slate-400 bg-white/40 flex flex-col items-center justify-center text-slate-400 font-bold text-xs">
                  <span>Car {hookedCars.length + i + 1}</span>
                  <span className="text-[10px]">waiting...</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEEDBACK CALLOUT */}
        {feedbackMsg && (
          <div
            className={`p-4 rounded-2xl border-3 font-black text-center flex items-center justify-center gap-3 ${
              isSuccess
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 text-xl'
                : 'bg-rose-100 border-rose-300 text-rose-900 text-lg'
            }`}
          >
            <span className="text-3xl">{isSuccess ? '🏆' : '🤔'}</span>
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* TRAIN STATION (WORD BANK OF WAGONS WAITING) */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border-3 border-blue-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-700 flex items-center gap-2">
              <span>🚉</span> Train Station: Tap a Word Car to Hook it Up!
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {stationCars.length} cars left in station
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 min-h-24 p-2">
            {stationCars.map((word, idx) => (
              <button
                key={`${word}-${idx}`}
                onClick={() => handleHookCar(word, idx)}
                className={`py-4 px-6 rounded-2xl border-4 font-black shadow-lg transition-all hover:scale-108 active:scale-95 cursor-pointer relative ${
                  word.match(/^[A-Z]/)
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 hover:bg-emerald-100'
                    : 'bg-white border-blue-300 text-blue-950 hover:bg-blue-50'
                } ${isLargeFont ? 'text-3xl' : 'text-2xl'}`}
              >
                <span>{word}</span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Tap to Hook</span>
              </button>
            ))}

            {stationCars.length === 0 && !isSuccess && (
              <p className="text-slate-500 font-bold text-sm">
                All cars hooked! Tap <strong className="text-blue-600">"Check Train"</strong> below!
              </p>
            )}
          </div>
        </div>

        {/* BOTTOM SMARTBOARD TOOLBAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl border-2 border-slate-300 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear Track</span>
            </button>

            <button
              onClick={listenToTrack}
              disabled={hookedCars.length === 0}
              className="px-4 py-3 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-2xl border-2 border-sky-300 font-bold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-sky-700" />
              <span>Listen to Train</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {!isSuccess ? (
              <button
                onClick={() => checkSentence()}
                disabled={hookedCars.length === 0}
                className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xl rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-6 h-6 text-yellow-300" />
                <span>Check Train!</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-black text-xl rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce"
              >
                <span>Next Train!</span>
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
