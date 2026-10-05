/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LESSON_STEPS } from '../data/lessons';
import { AppMode } from '../types';
import { soundFX, speakSentence } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown,
  RotateCcw,
  Rocket
} from 'lucide-react';

interface LessonModeProps {
  onStartExercises: (mode: AppMode) => void;
  isLargeFont: boolean;
}

export const LessonMode: React.FC<LessonModeProps> = ({ onStartExercises, isLargeFont }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStep = LESSON_STEPS[currentStepIndex];

  const handleNextStep = () => {
    soundFX.playClick();
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }
    if (currentStepIndex < LESSON_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setQuizAnswered(null);
      setQuizFeedback(null);
    }
  };

  const handlePrevStep = () => {
    soundFX.playClick();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
      setQuizAnswered(null);
      setQuizFeedback(null);
    }
  };

  const handleQuizAnswer = (userSaidYes: boolean) => {
    if (!currentStep.content.quizItem) return;
    const isCorrect = userSaidYes === currentStep.content.quizItem.isSentence;
    setQuizAnswered(isCorrect);

    if (isCorrect) {
      soundFX.playChime();
      setQuizFeedback(currentStep.content.quizItem.feedbackCorrect);
      if (!completedSteps.includes(currentStepIndex)) {
        setCompletedSteps([...completedSteps, currentStepIndex]);
      }
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } else {
      soundFX.playBoing();
      setQuizFeedback(currentStep.content.quizItem.feedbackWrong);
    }
  };

  const readSentence = (text: string) => {
    soundFX.playPop();
    speakSentence(text);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Step Progress Tracker for Whole Class */}
      <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-amber-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <div>
            <h2 className="font-extrabold text-slate-800 text-lg">Scaffolded Lesson Walkthrough</h2>
            <p className="text-xs text-slate-500 font-semibold">Teacher & Class direct instruction</p>
          </div>
        </div>

        {/* 4 Step Pills */}
        <div className="flex items-center gap-2">
          {LESSON_STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isDone = completedSteps.includes(idx);
            return (
              <button
                key={step.id}
                onClick={() => {
                  soundFX.playClick();
                  setCurrentStepIndex(idx);
                  setQuizAnswered(null);
                  setQuizFeedback(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-white shadow-md scale-105'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span>{step.id}</span>
                )}
                <span className="hidden md:inline">{step.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lesson Stage Card */}
      <div className="bg-white rounded-3xl shadow-xl border-4 border-amber-300 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 text-white flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-block bg-white/25 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              {currentStep.badge}
            </div>
            <h2 className={`font-black tracking-tight ${isLargeFont ? 'text-4xl' : 'text-3xl'}`}>
              {currentStep.title}
            </h2>
            <p className="text-amber-100 font-bold text-lg mt-1">
              {currentStep.subtitle}
            </p>
          </div>

          <button
            onClick={() => readSentence(`${currentStep.title}. ${currentStep.subtitle}. ${currentStep.content.explanation}`)}
            className="flex items-center gap-2 bg-white text-amber-800 hover:bg-amber-50 px-4 py-2.5 rounded-2xl font-black shadow-md border-2 border-amber-200 transition-all cursor-pointer text-sm"
          >
            <Volume2 className="w-5 h-5 text-amber-600" />
            <span>Read Lesson Aloud</span>
          </button>
        </div>

        {/* Lesson Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Explanation Callout */}
          <div className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-5 text-slate-800">
            <h3 className="text-xl font-black text-amber-900 mb-1 flex items-center gap-2">
              <span>📢</span> {currentStep.content.heading}
            </h3>
            <p className={`font-medium text-slate-700 leading-relaxed ${isLargeFont ? 'text-xl' : 'text-lg'}`}>
              {currentStep.content.explanation}
            </p>
          </div>

          {/* Key Visual Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentStep.content.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border-3 shadow-sm transition-all hover:-translate-y-1 ${point.color}`}
              >
                <div className="text-4xl mb-2">{point.icon}</div>
                <h4 className="font-black text-lg mb-1">{point.title}</h4>
                <p className="font-semibold text-sm opacity-90 leading-snug">{point.desc}</p>
              </div>
            ))}
          </div>

          {/* Side-by-side: Healthy Sentence vs Broken Sentence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Good Example */}
            <div className="bg-emerald-50 border-3 border-emerald-300 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Healthy Sentence (Thumbs Up 👍)
                </div>
                <div className={`font-black text-emerald-950 bg-white p-4 rounded-xl border border-emerald-200 shadow-sm ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
                  "{currentStep.content.exampleGood}"
                </div>
              </div>
              <button
                onClick={() => readSentence(currentStep.content.exampleGood)}
                className="mt-3 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Listen to healthy sentence
              </button>
            </div>

            {/* Bad Example */}
            <div className="bg-rose-50 border-3 border-rose-300 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm uppercase mb-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  Broken Sentence (Thumbs Down 👎)
                </div>
                <div className={`font-black text-rose-950 bg-white p-4 rounded-xl border border-rose-200 shadow-sm ${isLargeFont ? 'text-2xl' : 'text-xl'}`}>
                  "{currentStep.content.exampleBad}"
                </div>
              </div>
              <button
                onClick={() => readSentence(currentStep.content.exampleBad)}
                className="mt-3 text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Listen to broken words
              </button>
            </div>
          </div>

          {/* Interactive Smartboard Check */}
          {currentStep.content.quizItem && (
            <div className="bg-gradient-to-b from-indigo-50 to-blue-50 border-4 border-indigo-300 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-md">
              <div className="flex items-center justify-center gap-2 text-indigo-900 font-extrabold text-base uppercase tracking-wider">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Classroom Smartboard Check</span>
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>

              <p className="text-slate-700 font-bold text-lg">
                {currentStep.content.quizItem.prompt}
              </p>

              {/* Giant Candidate Sentence to Inspect on Smartboard */}
              <div className="relative inline-block bg-white px-8 py-5 rounded-2xl border-3 border-indigo-400 shadow-md">
                <span className={`font-black tracking-wide text-indigo-950 ${isLargeFont ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'}`}>
                  "{currentStep.content.quizItem.candidate}"
                </span>
                <button
                  onClick={() => readSentence(currentStep.content.quizItem!.candidate)}
                  className="absolute -top-3 -right-3 p-2 bg-amber-400 hover:bg-amber-500 text-white rounded-full shadow-md cursor-pointer"
                  title="Listen to this sentence"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbs Up / Thumbs Down Smartboard Touch Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                <button
                  onClick={() => handleQuizAnswer(true)}
                  className="flex-1 min-w-[220px] max-w-xs py-5 px-6 bg-gradient-to-b from-emerald-500 to-emerald-600 text-white font-black text-2xl rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border-3 border-emerald-300"
                >
                  <ThumbsUp className="w-8 h-8 text-yellow-200" />
                  <span>YES! Sentence</span>
                </button>

                <button
                  onClick={() => handleQuizAnswer(false)}
                  className="flex-1 min-w-[220px] max-w-xs py-5 px-6 bg-gradient-to-b from-rose-500 to-rose-600 text-white font-black text-2xl rounded-2xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border-3 border-rose-300"
                >
                  <ThumbsDown className="w-8 h-8 text-white" />
                  <span>NO! Broken</span>
                </button>
              </div>

              {/* Feedback Alert */}
              {quizFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 font-bold text-lg flex items-center justify-center gap-3 animate-soft-bounce ${
                    quizAnswered
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                      : 'bg-amber-100 border-amber-400 text-amber-900'
                  }`}
                >
                  <span className="text-3xl">{quizAnswered ? '🎉' : '🧐'}</span>
                  <span>{quizFeedback}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 px-6 py-4 border-t-2 border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-slate-700 bg-white border-2 border-slate-300 hover:bg-slate-100 disabled:opacity-40 transition-all cursor-pointer text-base"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous Step</span>
          </button>

          {currentStepIndex < LESSON_STEPS.length - 1 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md transition-all cursor-pointer text-base active:scale-95"
            >
              <span>Next Lesson Step</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => {
                soundFX.playFanfare();
                onStartExercises('train');
              }}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 shadow-xl transition-all cursor-pointer text-lg animate-pulse"
            >
              <Rocket className="w-6 h-6 text-yellow-300" />
              <span>Let's Play Sentence Games!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
