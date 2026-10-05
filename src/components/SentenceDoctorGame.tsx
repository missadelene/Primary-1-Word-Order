/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SICK_SENTENCES } from '../data/sentences';
import { SickSentence } from '../types';
import { soundFX, speakSentence } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Stethoscope, 
  RotateCcw, 
  Heart, 
  Sparkles, 
  Volume2, 
  Lightbulb, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface SentenceDoctorGameProps {
  isLargeFont: boolean;
}

export const SentenceDoctorGame: React.FC<SentenceDoctorGameProps> = ({ isLargeFont }) => {
  const [caseIndex, setCaseIndex] = useState(0);
  const currentCase = SICK_SENTENCES[caseIndex];

  // Current working state of the patient sentence (words array)
  const [workingWords, setWorkingWords] = useState<string[]>(() => [...currentCase.words]);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [isHealed, setIsHealed] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [curedCount, setCuredCount] = useState(0);

  const resetCurrentCase = (c: SickSentence) => {
    setWorkingWords([...c.words]);
    setSelectedWordIndex(null);
    setIsHealed(false);
    setFeedback(null);
    setShowHint(false);
  };

  // Tool 1: Capitalize First Word
  const applyCapitalizeTool = () => {
    soundFX.playPop();
    const updated = [...workingWords];
    if (updated.length > 0) {
      updated[0] = updated[0].charAt(0).toUpperCase() + updated[0].slice(1);
      setWorkingWords(updated);
    }
  };

  // Tool 2: Add or Change Punctuation
  const applyPunctuation = (mark: string) => {
    soundFX.playPop();
    const updated = [...workingWords];
    if (updated.length > 0) {
      const lastIdx = updated.length - 1;
      // Strip any existing punctuation
      const clean = updated[lastIdx].replace(/[.!?]+$/, '');
      updated[lastIdx] = clean + mark;
      setWorkingWords(updated);
    }
  };

  // Tool 3: Tap two words to swap their order
  const handleWordTap = (index: number) => {
    soundFX.playClick();
    if (selectedWordIndex === null) {
      setSelectedWordIndex(index);
    } else {
      if (selectedWordIndex === index) {
        setSelectedWordIndex(null);
      } else {
        // Swap words
        const updated = [...workingWords];
        const temp = updated[selectedWordIndex];
        updated[selectedWordIndex] = updated[index];
        updated[index] = temp;
        setWorkingWords(updated);
        setSelectedWordIndex(null);
        soundFX.playPop();
      }
    }
  };

  // Check if healed!
  const diagnoseAndHeal = () => {
    const currentStr = workingWords.join(' ').trim();
    const targetStr = currentCase.corrected.trim();

    if (currentStr.toLowerCase() === targetStr.toLowerCase() && currentStr === targetStr) {
      setIsHealed(true);
      soundFX.playFanfare();
      setCuredCount(prev => prev + 1);
      setFeedback('🩺 PATIENT HEALED! The sentence is now strong, healthy, and correct!');
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
      speakSentence(currentCase.corrected);
    } else {
      soundFX.playBoing();
      setIsHealed(false);
      setFeedback('Still feeling a little sick! Check Rule 1 (Capital letter), Rule 2 (Word order), and Rule 3 (Stop sign)!');
    }
  };

  const handleNextCase = () => {
    soundFX.playClick();
    const nextIdx = (caseIndex + 1) % SICK_SENTENCES.length;
    setCaseIndex(nextIdx);
    resetCurrentCase(SICK_SENTENCES[nextIdx]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Clinic Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-rose-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-3xl shadow">
            🩺
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              Sentence Doctor Clinic
              <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full border border-rose-300">
                Patient {caseIndex + 1} of {SICK_SENTENCES.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Fix the broken capital, scrambled words, or missing stop sign!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl font-black text-rose-800 text-sm">
            <Heart className="w-4 h-4 text-rose-600 fill-rose-500 animate-pulse" />
            <span>{curedCount} Sentences Cured</span>
          </div>

          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold border border-amber-300 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>{showHint ? 'Hide Clue' : 'Doctor Clue'}</span>
          </button>
        </div>
      </div>

      {/* Main Clinic Exam Room */}
      <div className="bg-gradient-to-b from-rose-50/50 via-white to-rose-50/30 rounded-3xl border-4 border-rose-300 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Hint banner */}
        {showHint && (
          <div className="bg-amber-100 border-2 border-amber-300 rounded-2xl p-4 text-amber-950 text-sm font-bold flex items-center gap-3 animate-soft-bounce">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-extrabold">Doctor's Diagnosis Hint:</p>
              <p>{currentCase.hint}</p>
            </div>
          </div>
        )}

        {/* Patient Exam Table */}
        <div className="bg-white rounded-3xl p-6 border-3 border-rose-300 shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-rose-700">
            <span className="flex items-center gap-1">
              <span>🛏️</span> Patient on the Exam Table
            </span>
            <span className="text-slate-500 font-bold">
              Tap any two words to swap their order!
            </span>
          </div>

          {/* Interactive Word Strips */}
          <div className="flex flex-wrap items-center justify-center gap-3 min-h-24 p-3 bg-rose-50/40 rounded-2xl border-2 border-dashed border-rose-200">
            {workingWords.map((word, idx) => {
              const isSelected = selectedWordIndex === idx;
              return (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleWordTap(idx)}
                  className={`py-4 px-6 rounded-2xl font-black shadow-md border-3 transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-amber-300 border-amber-600 text-amber-950 scale-110 ring-4 ring-amber-300'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-rose-400 hover:scale-105'
                  } ${isLargeFont ? 'text-3xl' : 'text-2xl'}`}
                >
                  <span>{word}</span>
                  {isSelected && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full shadow">
                      Tap another to swap!
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Doctor Medicine Kit Tools */}
        <div className="bg-slate-100 rounded-3xl p-6 border-2 border-slate-300 space-y-4">
          <h3 className="text-sm font-black uppercase text-slate-600 tracking-wider flex items-center gap-2">
            <span>🧰</span> Doctor Medical Tools: Tap a Tool to Treat the Sentence!
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Tool 1: Capitalize First Letter */}
            <button
              onClick={applyCapitalizeTool}
              className="p-4 bg-white hover:bg-emerald-50 border-3 border-emerald-300 text-emerald-950 rounded-2xl font-black flex items-center gap-3 text-left transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <span className="text-3xl">👑</span>
              <div>
                <div className="text-base font-black">Capital Crown</div>
                <div className="text-xs font-semibold text-emerald-700">Make first letter CAPITAL</div>
              </div>
            </button>

            {/* Tool 2: Add Period */}
            <button
              onClick={() => applyPunctuation('.')}
              className="p-4 bg-white hover:bg-blue-50 border-3 border-blue-300 text-blue-950 rounded-2xl font-black flex items-center gap-3 text-left transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <span className="text-3xl">🛑</span>
              <div>
                <div className="text-base font-black">Add Period ( . )</div>
                <div className="text-xs font-semibold text-blue-700">Attach stop sign to the end</div>
              </div>
            </button>

            {/* Tool 3: Add Question Mark */}
            <button
              onClick={() => applyPunctuation('?')}
              className="p-4 bg-white hover:bg-amber-50 border-3 border-amber-300 text-amber-950 rounded-2xl font-black flex items-center gap-3 text-left transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <span className="text-3xl">❓</span>
              <div>
                <div className="text-base font-black">Add Question Mark ( ? )</div>
                <div className="text-xs font-semibold text-amber-700">For asking sentences</div>
              </div>
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl border-3 font-black text-center flex items-center justify-center gap-2 ${
              isHealed
                ? 'bg-emerald-100 border-emerald-400 text-emerald-900 text-xl'
                : 'bg-rose-100 border-rose-300 text-rose-900 text-lg'
            }`}
          >
            <span>{feedback}</span>
          </div>
        )}

        {/* Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => resetCurrentCase(currentCase)}
              className="px-4 py-3 bg-white hover:bg-slate-100 text-slate-700 rounded-2xl border-2 border-slate-300 font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Patient</span>
            </button>

            <button
              onClick={() => speakSentence(workingWords.join(' '))}
              className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-2xl border-2 border-rose-300 font-bold text-sm flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-rose-600" />
              <span>Stethoscope Read Aloud</span>
            </button>
          </div>

          <div>
            {!isHealed ? (
              <button
                onClick={diagnoseAndHeal}
                className="px-8 py-3.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-black text-xl rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Heart className="w-6 h-6 text-yellow-200 fill-white" />
                <span>Heal Sentence!</span>
              </button>
            ) : (
              <button
                onClick={handleNextCase}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-black text-xl rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce"
              >
                <span>Next Patient!</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
