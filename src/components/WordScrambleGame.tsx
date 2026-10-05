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
  Puzzle, 
  RotateCcw, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb, 
  ArrowRight,
  Eye,
  EyeOff,
  Flame
} from 'lucide-react';

interface WordScrambleGameProps {
  isLargeFont: boolean;
}

export const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ isLargeFont }) => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('explorer');
  const [sentences, setSentences] = useState<SentenceItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [colorCoding, setColorCoding] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const list = SENTENCE_DATABASE.filter(s => s.difficulty === difficulty);
    setSentences(list);
    setCurrentIndex(0);
    initRound(list[0]);
  }, [difficulty]);

  const currentSentence = sentences[currentIndex];

  const initRound = (item?: SentenceItem) => {
    if (!item) return;
    setPlacedWords([]);
    setAvailableWords([...item.scrambled]);
    setIsCorrect(false);
    setFeedback(null);
    setShowHint(false);
  };

  const handlePlaceWord = (word: string, index: number) => {
    soundFX.playPop();
    speakWord(word);

    const newAvail = [...availableWords];
    newAvail.splice(index, 1);
    setAvailableWords(newAvail);

    const newPlaced = [...placedWords, word];
    setPlacedWords(newPlaced);

    if (newAvail.length === 0 && currentSentence) {
      verifySentence(newPlaced);
    }
  };

  const handleReturnWord = (word: string, index: number) => {
    soundFX.playClick();
    const newPlaced = [...placedWords];
    newPlaced.splice(index, 1);
    setPlacedWords(newPlaced);

    setAvailableWords([...availableWords, word]);
    setIsCorrect(false);
    setFeedback(null);
  };

  const verifySentence = (current: string[] = placedWords) => {
    if (!currentSentence) return;
    const match = currentSentence.words.every((w, i) => w === current[i]);
    if (match && current.length === currentSentence.words.length) {
      setIsCorrect(true);
      soundFX.playChime();
      setTimeout(() => soundFX.playFanfare(), 300);
      setStreak(prev => prev + 1);
      setFeedback('Sensational! You built a complete, healthy sentence!');
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
      });
      speakSentence(currentSentence.original);
    } else {
      soundFX.playBoing();
      setIsCorrect(false);
      setFeedback('Not quite yet! Read it aloud. Does it make sense from start to finish?');
    }
  };

  const handleNextRound = () => {
    soundFX.playClick();
    const next = (currentIndex + 1) % sentences.length;
    setCurrentIndex(next);
    initRound(sentences[next]);
  };

  const handleReset = () => {
    soundFX.playClick();
    initRound(currentSentence);
  };

  if (!currentSentence) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar with Streak & Settings */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-emerald-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow">
            🧩
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              Word Scramble Playground
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                Level {currentIndex + 1} of {sentences.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Tap tiles in order to build the sentence strip!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Class Streak */}
          <div className="flex items-center gap-1.5 bg-orange-100 border border-orange-300 px-3 py-1.5 rounded-xl font-black text-orange-900 text-sm">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-400 animate-pulse" />
            <span>{streak} Streak!</span>
          </div>

          {/* Difficulty selector */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {(['starter', 'explorer', 'champion'] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl)}
                className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                  difficulty === lvl
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'starter' ? '3W' : lvl === 'explorer' ? '4W' : '5-6W'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Magnetic Board */}
      <div className="bg-gradient-to-b from-slate-50 to-emerald-50/50 rounded-3xl border-4 border-emerald-300 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Helper Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currentSentence.icon}</span>
            <span className="font-bold text-slate-600 text-sm">
              Theme: <span className="text-emerald-700 capitalize">{currentSentence.theme}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Color code helper toggle for Grade 1 */}
            <button
              onClick={() => setColorCoding(!colorCoding)}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs border flex items-center gap-1.5 cursor-pointer transition-all ${
                colorCoding
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
              title="Show color coding for First Letter & Punctuation"
            >
              {colorCoding ? <Eye className="w-3.5 h-3.5 text-purple-600" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Color Clues</span>
            </button>

            {/* Hint toggle */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold border border-amber-300 text-xs flex items-center gap-1 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? 'Hide Clue' : 'Clue'}</span>
            </button>
          </div>
        </div>

        {/* Clue message */}
        {showHint && (
          <div className="bg-amber-100/90 border-2 border-amber-300 rounded-2xl p-3 text-amber-950 text-sm font-bold flex items-center gap-2 animate-soft-bounce">
            <span>💡</span>
            <span>{currentSentence.hint}</span>
          </div>
        )}

        {/* THE SENTENCE STRIP (Target Placed Area) */}
        <div className="bg-white rounded-3xl p-6 border-3 border-emerald-400 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-400">
            <span>Sentence Strip (Read Left to Right ➡️)</span>
            <span className="text-emerald-600 font-bold">
              {placedWords.length} / {currentSentence.words.length} words placed
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 min-h-24 p-2 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-200">
            {placedWords.map((word, idx) => {
              const isFirst = idx === 0;
              const hasPunctuation = word.match(/[.!?]$/);
              return (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleReturnWord(word, idx)}
                  className={`py-4 px-6 rounded-2xl font-black shadow-md border-3 transition-all hover:scale-105 active:scale-95 cursor-pointer relative group ${
                    colorCoding
                      ? isFirst
                        ? 'bg-emerald-500 border-emerald-700 text-white'
                        : hasPunctuation
                        ? 'bg-rose-500 border-rose-700 text-white'
                        : 'bg-white border-slate-300 text-slate-800'
                      : 'bg-white border-emerald-400 text-emerald-950 hover:bg-emerald-50'
                  } ${isLargeFont ? 'text-3xl' : 'text-2xl'}`}
                >
                  <span>{word}</span>
                  <span className="block text-[10px] text-slate-400 group-hover:text-rose-500 uppercase font-bold mt-0.5">
                    Tap to remove
                  </span>
                </button>
              );
            })}

            {/* Empty dotted slots */}
            {Array.from({ length: Math.max(0, currentSentence.words.length - placedWords.length) }).map((_, i) => (
              <div
                key={`empty-slot-${i}`}
                className="h-20 min-w-28 px-4 rounded-2xl border-3 border-dashed border-slate-300 bg-white/70 flex items-center justify-center text-slate-400 font-bold text-sm"
              >
                Slot {placedWords.length + i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border-3 font-black text-center flex items-center justify-center gap-2 ${
              isCorrect
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 text-xl'
                : 'bg-rose-100 border-rose-300 text-rose-900 text-lg'
            }`}
          >
            <span className="text-3xl">{isCorrect ? '🌟' : '🤔'}</span>
            <span>{feedback}</span>
          </div>
        )}

        {/* WORD BANK OF MAGNETIC TILES */}
        <div className="bg-slate-100 rounded-3xl p-6 border-2 border-slate-300 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-700 text-base flex items-center gap-2">
              <span>🧲</span> Magnetic Word Bank: Tap to Place on the Strip!
            </h3>
            <span className="text-xs text-slate-500 font-bold">
              {availableWords.length} words available
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 min-h-24 p-2">
            {availableWords.map((word, index) => {
              const isCapital = word.match(/^[A-Z]/);
              return (
                <button
                  key={`${word}-${index}`}
                  onClick={() => handlePlaceWord(word, index)}
                  className={`py-4 px-6 rounded-2xl border-4 font-black shadow-md transition-all hover:scale-108 active:scale-95 cursor-pointer relative ${
                    colorCoding && isCapital
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-900 hover:bg-emerald-100'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-emerald-400'
                  } ${isLargeFont ? 'text-3xl' : 'text-2xl'}`}
                >
                  {word}
                </button>
              );
            })}

            {availableWords.length === 0 && !isCorrect && (
              <p className="text-slate-500 font-bold text-sm">
                All words placed! Check your sentence below!
              </p>
            )}
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl border-2 border-slate-300 font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Strip</span>
            </button>

            <button
              onClick={() => speakSentence(placedWords.join(' '))}
              disabled={placedWords.length === 0}
              className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-2xl border-2 border-emerald-300 font-bold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Read Aloud</span>
            </button>
          </div>

          <div>
            {!isCorrect ? (
              <button
                onClick={() => verifySentence()}
                disabled={placedWords.length === 0}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xl rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <CheckCircle2 className="w-6 h-6 text-yellow-300" />
                <span>Check Sentence</span>
              </button>
            ) : (
              <button
                onClick={handleNextRound}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-105 text-white font-black text-xl rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce"
              >
                <span>Next Sentence!</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
