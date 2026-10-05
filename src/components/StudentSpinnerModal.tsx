/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audio';
import { X, Sparkles, UserPlus, Trash2, RotateCcw } from 'lucide-react';

interface StudentSpinnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_STUDENTS = [
  'Emma', 'Leo', 'Maya', 'Noah', 'Mia', 
  'Lucas', 'Ava', 'Ethan', 'Sophia', 'Oliver', 
  'Chloe', 'Liam', 'Zoe', 'Mason', 'Ella'
];

export const StudentSpinnerModal: React.FC<StudentSpinnerModalProps> = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sentence_safari_students');
      return saved ? JSON.parse(saved) : DEFAULT_STUDENTS;
    } catch {
      return DEFAULT_STUDENTS;
    }
  });

  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [showEditList, setShowEditList] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);

  if (!isOpen) return null;

  const saveStudents = (newList: string[]) => {
    setStudents(newList);
    try {
      localStorage.setItem('sentence_safari_students', JSON.stringify(newList));
    } catch {}
  };

  const spinPicker = () => {
    if (students.length === 0 || isSpinning) return;
    setIsSpinning(true);
    setSelectedStudent(null);

    let speed = 60;
    let ticks = 0;
    const totalTicks = 25 + Math.floor(Math.random() * 12);
    let currentIndex = 0;

    const interval = () => {
      currentIndex = (currentIndex + 1) % students.length;
      setHighlightIndex(currentIndex);
      soundFX.playPop();
      ticks++;

      if (ticks < totalTicks) {
        speed = Math.floor(speed * 1.07);
        setTimeout(interval, speed);
      } else {
        const winner = students[currentIndex];
        setSelectedStudent(winner);
        setIsSpinning(false);
        soundFX.playFanfare();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    };

    setTimeout(interval, speed);
  };

  const addStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStudentName.trim();
    if (!trimmed) return;
    if (!students.includes(trimmed)) {
      const updated = [...students, trimmed];
      saveStudents(updated);
      setNewStudentName('');
    }
  };

  const removeStudent = (name: string) => {
    const updated = students.filter(s => s !== name);
    saveStudents(updated);
  };

  const resetDefaultStudents = () => {
    saveStudents(DEFAULT_STUDENTS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-2xl overflow-hidden animate-soft-bounce-once">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h2 className="text-2xl font-bold tracking-wide">Who's Next at the Smartboard?</h2>
              <p className="text-amber-100 text-sm font-medium">Random student picker for classroom turns</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white"
            aria-label="Close modal"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center space-y-6">
          {/* Winner announcement or placeholder */}
          <div className="min-h-36 flex flex-col items-center justify-center bg-amber-50 rounded-2xl border-3 border-dashed border-amber-300 p-4 relative overflow-hidden">
            {selectedStudent ? (
              <div className="space-y-2 animate-bounce">
                <span className="text-5xl">⭐</span>
                <p className="text-amber-700 font-semibold text-lg uppercase tracking-wider">Please come to the Smartboard:</p>
                <div className="text-4xl sm:text-5xl font-extrabold text-indigo-700 bg-white px-8 py-3 rounded-2xl shadow-md border-2 border-indigo-200 inline-block">
                  {selectedStudent} 🌟
                </div>
              </div>
            ) : isSpinning ? (
              <div className="space-y-3">
                <div className="text-5xl animate-spin inline-block">🎲</div>
                <div className="text-3xl font-bold text-amber-800">
                  {students[highlightIndex] || 'Picking...'}
                </div>
                <p className="text-amber-600 font-medium animate-pulse">Rolling through the class roster...</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-500">
                <span className="text-5xl">🪄</span>
                <p className="text-xl font-bold text-slate-700">Ready to call a student?</p>
                <p className="text-sm text-slate-500">Tap the big green button below to pick fairly!</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={spinPicker}
              disabled={isSpinning || students.length === 0}
              className="flex-1 min-w-[200px] py-4 px-8 bg-gradient-to-b from-emerald-400 to-emerald-600 text-white font-extrabold text-2xl rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
            >
              <Sparkles className="w-8 h-8 text-yellow-200 animate-spin" />
              {isSpinning ? 'Picking Student...' : 'SPIN FOR A STUDENT!'}
            </button>

            <button
              onClick={() => setShowEditList(!showEditList)}
              className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl border-2 border-slate-300 text-lg flex items-center gap-2 cursor-pointer"
            >
              {showEditList ? 'Hide Class List' : `Class List (${students.length})`}
            </button>
          </div>

          {/* Student roster management */}
          {showEditList && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-700 flex items-center gap-2">
                  <span>👥</span> Class Roster ({students.length} students)
                </h3>
                <button
                  onClick={resetDefaultStudents}
                  className="text-xs text-amber-700 hover:text-amber-900 flex items-center gap-1 font-semibold underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Defaults
                </button>
              </div>

              {/* Add form */}
              <form onSubmit={addStudent} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter student first name..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="flex-1 px-4 py-2 border-2 border-slate-300 rounded-xl font-medium focus:outline-none focus:border-amber-500 bg-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" /> Add
                </button>
              </form>

              {/* Student pills */}
              <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-1">
                {students.map((student, i) => (
                  <span
                    key={`${student}-${i}`}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-semibold border ${
                      highlightIndex === i
                        ? 'bg-amber-400 text-white border-amber-500 scale-105'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <span>{student}</span>
                    <button
                      onClick={() => removeStudent(student)}
                      className="text-slate-400 hover:text-rose-600 ml-1 p-0.5"
                      title="Remove student"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
