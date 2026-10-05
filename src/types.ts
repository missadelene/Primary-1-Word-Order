/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppMode = 
  | 'lesson'           // Step-by-step scaffolded lesson
  | 'train'            // Sentence Train Express
  | 'scramble'         // Word Scramble Challenge
  | 'team-relay'       // Whole class 2-team showdown
  | 'doctor'           // Sentence Doctor (Fix the errors)
  | 'silly-lab';       // Creative Silly Sentence Laboratory

export type DifficultyLevel = 'starter' | 'explorer' | 'champion';

export interface SentenceItem {
  id: string;
  original: string; // e.g., "The cat sat on the mat."
  words: string[]; // Correct ordered words: ["The", "cat", "sat", "on", "the", "mat."]
  scrambled: string[]; // Shuffled words: ["on", "cat", "The", "mat.", "sat", "the"]
  hint: string;
  theme: 'animals' | 'school' | 'food' | 'nature' | 'fun';
  icon: string;
  difficulty: DifficultyLevel;
  subject: string; // "The cat"
  predicate: string; // "sat on the mat."
}

export interface SickSentence {
  id: string;
  displayed: string;
  words: string[];
  corrected: string;
  errorType: 'capitalization' | 'punctuation' | 'scramble' | 'both';
  explanation: string;
  hint: string;
  icon: string;
}

export interface TeamScore {
  name: string;
  score: number;
  color: string;
  avatar: string;
  stars: number;
}
