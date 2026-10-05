/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SILLY_LAB_PARTS } from '../data/sentences';
import { soundFX, speakSentence } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  FlaskConical, 
  Sparkles, 
  Volume2, 
  Dices, 
  BookmarkCheck, 
  Trash2,
  Share2
} from 'lucide-react';

interface SavedSentence {
  id: string;
  text: string;
  date: string;
  emoji: string;
}

interface SillySentenceLabProps {
  isLargeFont: boolean;
}

export const SillySentenceLab: React.FC<SillySentenceLabProps> = ({ isLargeFont }) => {
  const [subjectIndex, setSubjectIndex] = useState(0);
  const [verbIndex, setVerbIndex] = useState(0);
  const [placeIndex, setPlaceIndex] = useState(0);
  const [punctuationIndex, setPunctuationIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const [savedSentences, setSavedSentences] = useState<SavedSentence[]>(() => {
    try {
      const saved = localStorage.getItem('safari_saved_sentences');
      return saved ? JSON.parse(saved) : [
        { id: '1', text: 'A giant gorilla juggles bananas on the moon!', date: 'Class Favorite', emoji: '🦍' },
        { id: '2', text: 'Our cheerful teacher rides a skateboard in our classroom.', date: 'Morning Circle', emoji: '👩‍🏫' }
      ];
    } catch {
      return [];
    }
  });

  const currentSubject = SILLY_LAB_PARTS.subjects[subjectIndex];
  const currentVerb = SILLY_LAB_PARTS.verbs[verbIndex];
  const currentPlace = SILLY_LAB_PARTS.places[placeIndex];
  const currentPunc = SILLY_LAB_PARTS.punctuations[punctuationIndex];

  const fullSentence = `${currentSubject.text} ${currentVerb.text} ${currentPlace.text}${currentPunc.mark}`;

  const spinAll = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    soundFX.playPop();

    let ticks = 0;
    const interval = setInterval(() => {
      setSubjectIndex(Math.floor(Math.random() * SILLY_LAB_PARTS.subjects.length));
      setVerbIndex(Math.floor(Math.random() * SILLY_LAB_PARTS.verbs.length));
      setPlaceIndex(Math.floor(Math.random() * SILLY_LAB_PARTS.places.length));
      soundFX.playClick();
      ticks++;

      if (ticks > 12) {
        clearInterval(interval);
        setIsSpinning(false);
        soundFX.playFanfare();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    }, 90);
  };

  const spinSlot = (type: 'subject' | 'verb' | 'place') => {
    soundFX.playPop();
    if (type === 'subject') {
      setSubjectIndex((subjectIndex + 1) % SILLY_LAB_PARTS.subjects.length);
    } else if (type === 'verb') {
      setVerbIndex((verbIndex + 1) % SILLY_LAB_PARTS.verbs.length);
    } else {
      setPlaceIndex((placeIndex + 1) % SILLY_LAB_PARTS.places.length);
    }
  };

  const saveToWall = () => {
    soundFX.playChime();
    const newEntry: SavedSentence = {
      id: Date.now().toString(),
      text: fullSentence,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      emoji: currentSubject.icon,
    };
    const updated = [newEntry, ...savedSentences];
    setSavedSentences(updated);
    try {
      localStorage.setItem('safari_saved_sentences', JSON.stringify(updated));
    } catch {}
    confetti({ particleCount: 40, spread: 50 });
  };

  const removeSaved = (id: string) => {
    soundFX.playClick();
    const updated = savedSentences.filter(s => s.id !== id);
    setSavedSentences(updated);
    try {
      localStorage.setItem('safari_saved_sentences', JSON.stringify(updated));
    } catch {}
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-yellow-300 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center text-3xl shadow">
            🧪
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              Silly Sentence Laboratory
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-300">
                Creative Writing
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Mix and match WHO + ACTION + WHERE to create funny, complete sentences!
            </p>
          </div>
        </div>

        <button
          onClick={spinAll}
          disabled={isSpinning}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black text-lg rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Dices className="w-6 h-6 animate-spin" />
          <span>{isSpinning ? 'Mixing Magic...' : 'SPIN ALL SLOTS!'}</span>
        </button>
      </div>

      {/* 4 Interactive Slots on the Smartboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Slot 1: WHO (Subject) */}
        <div className="bg-purple-50 rounded-3xl border-3 border-purple-300 p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-black uppercase text-purple-800 tracking-wider flex items-center justify-between mb-2">
              <span>1. WHO / SUBJECT</span>
              <span className="text-purple-600">👑 Capital</span>
            </div>
            <div className="text-center py-4 bg-white rounded-2xl border-2 border-purple-200 shadow-inner">
              <span className="text-5xl block mb-2">{currentSubject.icon}</span>
              <span className="font-black text-purple-950 text-xl block px-2">
                {currentSubject.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => spinSlot('subject')}
            className="mt-3 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-4 h-4" /> Next Who
          </button>
        </div>

        {/* Slot 2: ACTION (Verb) */}
        <div className="bg-orange-50 rounded-3xl border-3 border-orange-300 p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-black uppercase text-orange-800 tracking-wider flex items-center justify-between mb-2">
              <span>2. ACTION / VERB</span>
              <span className="text-orange-600">⚡ Does What</span>
            </div>
            <div className="text-center py-4 bg-white rounded-2xl border-2 border-orange-200 shadow-inner">
              <span className="text-5xl block mb-2">{currentVerb.icon}</span>
              <span className="font-black text-orange-950 text-xl block px-2">
                {currentVerb.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => spinSlot('verb')}
            className="mt-3 py-2 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-4 h-4" /> Next Action
          </button>
        </div>

        {/* Slot 3: WHERE / DETAILS */}
        <div className="bg-blue-50 rounded-3xl border-3 border-blue-300 p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-black uppercase text-blue-800 tracking-wider flex items-center justify-between mb-2">
              <span>3. WHERE / HOW</span>
              <span className="text-blue-600">📍 Details</span>
            </div>
            <div className="text-center py-4 bg-white rounded-2xl border-2 border-blue-200 shadow-inner">
              <span className="text-5xl block mb-2">{currentPlace.icon}</span>
              <span className="font-black text-blue-950 text-xl block px-2">
                {currentPlace.text}
              </span>
            </div>
          </div>
          <button
            onClick={() => spinSlot('place')}
            className="mt-3 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Dices className="w-4 h-4" /> Next Where
          </button>
        </div>

        {/* Slot 4: PUNCTUATION STOP SIGN */}
        <div className="bg-rose-50 rounded-3xl border-3 border-rose-300 p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="text-xs font-black uppercase text-rose-800 tracking-wider flex items-center justify-between mb-2">
              <span>4. STOP SIGN</span>
              <span className="text-rose-600">🛑 Punctuation</span>
            </div>
            <div className="text-center py-4 bg-white rounded-2xl border-2 border-rose-200 shadow-inner">
              <span className="text-5xl font-black text-rose-600 block mb-1">
                {currentPunc.mark}
              </span>
              <span className="font-bold text-rose-950 text-xs block px-1">
                {currentPunc.label}
              </span>
            </div>
          </div>
          <div className="mt-3 flex gap-1 justify-center">
            {SILLY_LAB_PARTS.punctuations.map((p, idx) => (
              <button
                key={p.mark}
                onClick={() => {
                  soundFX.playPop();
                  setPunctuationIndex(idx);
                }}
                className={`flex-1 py-1.5 rounded-xl font-black text-sm border cursor-pointer ${
                  punctuationIndex === idx
                    ? 'bg-rose-600 text-white border-rose-700 shadow'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-100'
                }`}
              >
                {p.mark}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Generated Sentence Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 border-4 border-amber-400 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xl">
        <div className="inline-block bg-amber-500 text-white font-extrabold text-xs uppercase px-3 py-1 rounded-full shadow-sm">
          ⭐ Full Sentence Formula: Who + Action + Where + Stop Sign
        </div>

        {/* Giant color-coded sentence */}
        <div className="bg-white p-6 rounded-2xl border-2 border-amber-300 shadow-md">
          <p className={`font-black leading-snug tracking-wide ${isLargeFont ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
            <span className="text-purple-700">{currentSubject.text}</span>{' '}
            <span className="text-orange-600">{currentVerb.text}</span>{' '}
            <span className="text-blue-700">{currentPlace.text}</span>
            <span className="text-rose-600 text-4xl">{currentPunc.mark}</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => speakSentence(fullSentence)}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Volume2 className="w-5 h-5" />
            <span>Read Silly Sentence Aloud!</span>
          </button>

          <button
            onClick={saveToWall}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <BookmarkCheck className="w-5 h-5 text-yellow-300" />
            <span>Pin to Class Sentence Wall!</span>
          </button>
        </div>
      </div>

      {/* Class Sentence Wall (Pinboard) */}
      <div className="bg-amber-50/80 rounded-3xl p-6 border-3 border-dashed border-amber-300 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
            <span>📌</span> Class Sentence Wall ({savedSentences.length} saved)
          </h3>
          <span className="text-xs text-amber-800 font-semibold">
            Great for journal writing & choral reading!
          </span>
        </div>

        {savedSentences.length === 0 ? (
          <p className="text-center py-6 text-slate-400 font-bold text-sm">
            No sentences pinned yet! Tap "Pin to Class Sentence Wall" above!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedSentences.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-sm flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl mt-0.5">{item.emoji}</span>
                  <div>
                    <p className="font-bold text-slate-800 text-base">{item.text}</p>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakSentence(item.text)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 cursor-pointer"
                    title="Read aloud"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeSaved(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
