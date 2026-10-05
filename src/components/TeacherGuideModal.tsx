/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, Lightbulb, Users, CheckCircle } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-indigo-400 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-soft-bounce-once">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👩‍🏫</span>
            <div>
              <h2 className="text-2xl font-bold tracking-wide">Teacher & Smartboard Facilitator Guide</h2>
              <p className="text-indigo-200 text-sm font-medium">Grade 1 English Language Arts (Sentence Mechanics & Word Order)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 active:scale-95 transition-all text-white"
          >
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Target ELA Standards */}
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4">
            <h3 className="text-indigo-900 font-bold text-lg flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              Primary Learning Standards (CCSS ELA Grade 1)
            </h3>
            <ul className="text-sm space-y-1.5 text-indigo-950 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>CCSS.ELA-LITERACY.L.1.1.J:</strong> Produce and expand complete simple and compound declarative, interrogative, and exclamatory sentences.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>CCSS.ELA-LITERACY.L.1.2.B:</strong> Use end punctuation for sentences (. ? !).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>CCSS.ELA-LITERACY.RF.1.1.A:</strong> Recognize the distinguishing features of a sentence (first word capitalization, ending punctuation).</span>
              </li>
            </ul>
          </div>

          {/* Scaffolded Lesson Flow */}
          <div className="space-y-3">
            <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Recommended Lesson Pacing (30-Minute Class Period)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3">
                <div className="text-amber-800 font-extrabold text-sm uppercase">Phase 1: Direct Instruction</div>
                <div className="text-slate-900 font-bold mt-1">Lesson Mode (7-8 mins)</div>
                <p className="text-xs text-slate-600 mt-1">Walk through the 3 Golden Rules on the Smartboard. Use choral response ("Crown, Train, Stop Sign!").</p>
              </div>
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-3">
                <div className="text-emerald-800 font-extrabold text-sm uppercase">Phase 2: Guided Modeling</div>
                <div className="text-slate-900 font-bold mt-1">Sentence Train (10 mins)</div>
                <p className="text-xs text-slate-600 mt-1">Use the "Who's Next?" spinner to call students up to tap and hook train wagons. Whole class repeats aloud.</p>
              </div>
              <div className="bg-rose-50 border-2 border-rose-200 rounded-xl p-3">
                <div className="text-rose-800 font-extrabold text-sm uppercase">Phase 3: Group Game</div>
                <div className="text-slate-900 font-bold mt-1">Team Relay (12 mins)</div>
                <p className="text-xs text-slate-600 mt-1">Divide the class into 2 teams. Teammates confer from their seats, while one runner comes to the board.</p>
              </div>
            </div>
          </div>

          {/* Whole-Class Smartboard Strategies */}
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
            <h3 className="text-slate-900 font-bold text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Tips for Whole-Class Engagement (Single Smartboard)
            </h3>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>1. Physical Signals:</strong> Ask students on the carpet to put both hands on their heads when they spot the capital letter, or touch their toes for the period.</p>
              <p><strong>2. Peer Whispering:</strong> Before the student at the board touches a word, announce: <em>"Turn to your elbow buddy and whisper which word should go first!"</em></p>
              <p><strong>3. Use the Audio Read Aloud:</strong> Tap the speaker button so emergent readers hear phonics and intonation, modeling natural speech phrasing.</p>
              <p><strong>4. "Silly Sentence Lab" as Cool-Down:</strong> Build sentences together as a fun reward or creative writing prompt for journals!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base shadow cursor-pointer"
          >
            Got it, Let's Teach!
          </button>
        </div>
      </div>
    </div>
  );
};
