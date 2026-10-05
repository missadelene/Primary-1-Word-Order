/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SENTENCE_DATABASE } from '../data/sentences';
import { TeamScore } from '../types';
import { soundFX, speakWord, speakSentence } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  RotateCcw, 
  Sparkles, 
  Volume2, 
  Award, 
  ArrowRight,
  Shield,
  Star,
  Users
} from 'lucide-react';

interface TeamRelayGameProps {
  isLargeFont: boolean;
  onOpenSpinner: () => void;
}

const INITIAL_TEAMS: TeamScore[] = [
  { name: 'Blue Robins', score: 0, color: 'from-blue-500 to-indigo-600', avatar: '🐦', stars: 0 },
  { name: 'Red Foxes', score: 0, color: 'from-rose-500 to-red-600', avatar: '🦊', stars: 0 },
];

export const TeamRelayGame: React.FC<TeamRelayGameProps> = ({ isLargeFont, onOpenSpinner }) => {
  const [teams, setTeams] = useState<TeamScore[]>(INITIAL_TEAMS);
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [round, setRound] = useState(1);
  const maxRounds = 6;
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  // Pick sentences sequentially
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const currentSentence = SENTENCE_DATABASE[sentenceIndex % SENTENCE_DATABASE.length];

  const [placedWords, setPlacedWords] = useState<string[]>([]);
  const [bankWords, setBankWords] = useState<string[]>(() => [...currentSentence.scrambled]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const activeTeam = teams[activeTeamIndex];

  const handlePlaceWord = (word: string, index: number) => {
    soundFX.playPop();
    speakWord(word);

    const newBank = [...bankWords];
    newBank.splice(index, 1);
    setBankWords(newBank);

    const newPlaced = [...placedWords, word];
    setPlacedWords(newPlaced);
    setFeedback(null);
  };

  const handleReturnWord = (word: string, index: number) => {
    soundFX.playClick();
    const newPlaced = [...placedWords];
    newPlaced.splice(index, 1);
    setPlacedWords(newPlaced);

    setBankWords([...bankWords, word]);
    setFeedback(null);
  };

  const checkTeamAnswer = () => {
    const isCorrect = currentSentence.words.every((w, i) => w === placedWords[i]);

    if (isCorrect && placedWords.length === currentSentence.words.length) {
      soundFX.playFanfare();
      confetti({
        particleCount: 90,
        spread: 90,
        origin: { y: 0.6 },
      });
      speakSentence(currentSentence.original);

      // Award points & star to active team
      const updatedTeams = teams.map((team, idx) => {
        if (idx === activeTeamIndex) {
          return {
            ...team,
            score: team.score + 100,
            stars: team.stars + 1,
          };
        }
        return team;
      });

      setTeams(updatedTeams);
      setRoundCompleted(true);
      setFeedback(`🎉 SUPERB! +100 points for ${activeTeam.name}!`);
    } else {
      soundFX.playBoing();
      setFeedback('Not quite! Check the sentence order with your team buddies, then try again!');
    }
  };

  const handleNextTurn = () => {
    soundFX.playClick();
    const nextTeamIdx = (activeTeamIndex + 1) % teams.length;
    setActiveTeamIndex(nextTeamIdx);

    // If both teams played, advance round
    if (nextTeamIdx === 0) {
      if (round >= maxRounds) {
        setGameFinished(true);
        soundFX.playFanfare();
        return;
      }
      setRound(round + 1);
    }

    const nextSentenceIdx = sentenceIndex + 1;
    setSentenceIndex(nextSentenceIdx);
    const nextSentence = SENTENCE_DATABASE[nextSentenceIdx % SENTENCE_DATABASE.length];
    setPlacedWords([]);
    setBankWords([...nextSentence.scrambled]);
    setRoundCompleted(false);
    setFeedback(null);
  };

  const restartRelay = () => {
    soundFX.playClick();
    setTeams(INITIAL_TEAMS);
    setActiveTeamIndex(0);
    setRound(1);
    setGameFinished(false);
    setSentenceIndex(0);
    const first = SENTENCE_DATABASE[0];
    setPlacedWords([]);
    setBankWords([...first.scrambled]);
    setRoundCompleted(false);
    setFeedback(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Team Scoreboard Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {teams.map((team, idx) => {
          const isActive = idx === activeTeamIndex && !gameFinished;
          return (
            <div
              key={team.name}
              className={`p-4 rounded-3xl border-4 transition-all ${
                isActive
                  ? 'bg-white shadow-xl scale-102 ring-4 ring-amber-400 border-indigo-400'
                  : 'bg-white/80 opacity-85 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl p-2 rounded-2xl bg-slate-100 shadow-inner">
                    {team.avatar}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-xl text-slate-800">{team.name}</h3>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-black uppercase bg-amber-400 text-amber-950 animate-pulse">
                          Active Turn!
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < team.stars
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-slate-800">{team.score}</span>
                  <span className="block text-[11px] font-bold uppercase text-slate-400">Points</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Game Finished Victory Screen */}
      {gameFinished ? (
        <div className="bg-white rounded-3xl p-8 border-4 border-amber-300 shadow-2xl text-center space-y-6">
          <span className="text-7xl animate-bounce inline-block">🏆</span>
          <h2 className="text-4xl font-black text-slate-800">Class Team Relay Champion!</h2>
          
          <div className="p-6 bg-amber-50 rounded-3xl border-2 border-amber-200 max-w-lg mx-auto">
            {teams[0].score === teams[1].score ? (
              <div>
                <p className="text-2xl font-black text-amber-900">It's a Friendly Tie! 🤝</p>
                <p className="text-slate-600 font-bold mt-1">Both teams are Sentence Masters with {teams[0].score} points!</p>
              </div>
            ) : teams[0].score > teams[1].score ? (
              <div>
                <span className="text-5xl">{teams[0].avatar}</span>
                <p className="text-3xl font-black text-blue-700 mt-2">{teams[0].name} Wins!</p>
                <p className="text-slate-600 font-bold mt-1">Outstanding teamwork on the Smartboard!</p>
              </div>
            ) : (
              <div>
                <span className="text-5xl">{teams[1].avatar}</span>
                <p className="text-3xl font-black text-rose-700 mt-2">{teams[1].name} Wins!</p>
                <p className="text-slate-600 font-bold mt-1">Outstanding teamwork on the Smartboard!</p>
              </div>
            )}
          </div>

          <button
            onClick={restartRelay}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xl rounded-2xl shadow-xl hover:brightness-105 active:scale-95 cursor-pointer"
          >
            Play Another Relay Game!
          </button>
        </div>
      ) : (
        /* Active Relay Board */
        <div className="bg-white rounded-3xl border-4 border-indigo-300 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Round Header & Smartboard Student Spinner Call */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                Round {round} of {maxRounds}
              </span>
              <h2 className="text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
                <span>{activeTeam.avatar}</span>
                <span>It is {activeTeam.name}'s Turn!</span>
              </h2>
            </div>

            <button
              onClick={onOpenSpinner}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-2xl shadow-sm border border-amber-500 text-sm cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>Pick Next Student for {activeTeam.name}</span>
            </button>
          </div>

          {/* Sentence Strip Target */}
          <div className="bg-indigo-50/70 rounded-3xl p-6 border-3 border-dashed border-indigo-300 space-y-2">
            <div className="text-xs font-black uppercase text-indigo-900 tracking-wider flex items-center justify-between">
              <span>Smartboard Sentence Line</span>
              <span>Tap words below to fill the sentence</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 min-h-24 p-2">
              {placedWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleReturnWord(word, idx)}
                  className={`py-4 px-6 rounded-2xl font-black bg-white shadow-md border-3 border-indigo-400 text-indigo-950 hover:bg-rose-50 transition-all cursor-pointer ${
                    isLargeFont ? 'text-3xl' : 'text-2xl'
                  }`}
                >
                  <span>{word}</span>
                </button>
              ))}

              {Array.from({ length: Math.max(0, currentSentence.words.length - placedWords.length) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="h-20 min-w-28 px-4 rounded-2xl border-3 border-dashed border-indigo-300 bg-white/50 flex items-center justify-center text-indigo-400 font-bold text-sm"
                >
                  Word {placedWords.length + i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border-3 font-black text-center flex items-center justify-center gap-2 ${
                roundCompleted
                  ? 'bg-emerald-100 border-emerald-400 text-emerald-900 text-xl'
                  : 'bg-rose-100 border-rose-300 text-rose-900 text-lg'
              }`}
            >
              <span>{feedback}</span>
            </div>
          )}

          {/* Team Word Bank */}
          <div className="bg-slate-50 rounded-3xl p-6 border-2 border-slate-200 space-y-3">
            <h3 className="font-extrabold text-slate-700 text-sm flex items-center gap-2">
              <span>📦</span> Word Bank: Tap tiles in order!
            </h3>

            <div className="flex flex-wrap items-center justify-center gap-4 min-h-20">
              {bankWords.map((word, idx) => (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handlePlaceWord(word, idx)}
                  className={`py-4 px-6 rounded-2xl font-black shadow-md border-3 border-slate-300 bg-white hover:border-indigo-500 hover:scale-105 active:scale-95 transition-all cursor-pointer text-slate-800 ${
                    isLargeFont ? 'text-3xl' : 'text-2xl'
                  }`}
                >
                  {word}
                </button>
              ))}

              {bankWords.length === 0 && !roundCompleted && (
                <p className="text-slate-500 font-bold text-sm">
                  Words all placed! Team representative, press "Check Answer"!
                </p>
              )}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <button
              onClick={() => speakSentence(placedWords.join(' '))}
              disabled={placedWords.length === 0}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border border-slate-300 font-bold text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Sentence Aloud</span>
            </button>

            {!roundCompleted ? (
              <button
                onClick={checkTeamAnswer}
                disabled={placedWords.length === 0}
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-xl rounded-2xl shadow-lg cursor-pointer active:scale-95 disabled:opacity-50"
              >
                Check Answer!
              </button>
            ) : (
              <button
                onClick={handleNextTurn}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-105 text-white font-black text-xl rounded-2xl shadow-xl flex items-center gap-2 cursor-pointer active:scale-95 animate-bounce"
              >
                <span>Pass to Next Team!</span>
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
