/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface LessonStep {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  content: {
    heading: string;
    explanation: string;
    keyPoints: { icon: string; title: string; desc: string; color: string }[];
    exampleGood: string;
    exampleBad: string;
    interactiveType: 'rules' | 'parts' | 'quiz';
    quizItem?: {
      prompt: string;
      candidate: string;
      isSentence: boolean;
      feedbackCorrect: string;
      feedbackWrong: string;
      why: string;
    };
  };
}

export const LESSON_STEPS: LessonStep[] = [
  {
    id: 1,
    title: 'What is a Sentence?',
    subtitle: 'A sentence is a complete thought!',
    badge: 'Step 1 of 4',
    content: {
      heading: 'Every sentence tells a full story!',
      explanation: 'Just like a train needs an engine and cars to roll down the track, a sentence needs all its words connected to make sense.',
      keyPoints: [
        {
          icon: '💡',
          title: 'A Complete Idea',
          desc: 'It gives us all the information so we are not left wondering!',
          color: 'bg-amber-100 border-amber-300 text-amber-900',
        },
        {
          icon: '🧩',
          title: 'Words Stick Together',
          desc: 'When words are scattered like puzzle pieces, they do not make sense yet.',
          color: 'bg-blue-100 border-blue-300 text-blue-900',
        },
      ],
      exampleGood: 'The puppy plays with a ball.',
      exampleBad: 'plays ball the puppy with',
      interactiveType: 'quiz',
      quizItem: {
        prompt: 'Call a student to the smartboard! Is this a complete sentence?',
        candidate: 'The blue bird sings.',
        isSentence: true,
        feedbackCorrect: 'Hooray! It tells WHO (The blue bird) and WHAT IT DOES (sings)!',
        feedbackWrong: 'Look closely! We know who it is and what it is doing.',
        why: 'Complete idea with a capital letter and a period.',
      },
    },
  },
  {
    id: 2,
    title: 'The 3 Golden Rules',
    subtitle: 'The secret recipe of every great sentence!',
    badge: 'Step 2 of 4',
    content: {
      heading: 'Always check these 3 Super Rules:',
      explanation: 'Every superhero sentence wears a crown at the beginning, stays in line in the middle, and stops at the red light!',
      keyPoints: [
        {
          icon: '👑',
          title: 'Rule 1: Big Capital Letter',
          desc: 'The very first word ALWAYS starts tall with a Capital letter (A, B, C...)!',
          color: 'bg-emerald-100 border-emerald-300 text-emerald-900',
        },
        {
          icon: '🚂',
          title: 'Rule 2: Words in Order',
          desc: 'Words must follow each other in order so the sentence makes sense when read aloud.',
          color: 'bg-indigo-100 border-indigo-300 text-indigo-900',
        },
        {
          icon: '🛑',
          title: 'Rule 3: Punctuation Stop Sign',
          desc: 'Every sentence finishes with a period ( . ), question mark ( ? ), or exclamation ( ! ).',
          color: 'bg-rose-100 border-rose-300 text-rose-900',
        },
      ],
      exampleGood: 'We eat fresh cookies.',
      exampleBad: 'we eat fresh cookies',
      interactiveType: 'quiz',
      quizItem: {
        prompt: 'Check the 3 Rules! Is this a correct sentence?',
        candidate: 'frogs can leap high.',
        isSentence: false,
        feedbackCorrect: 'Eagle eyes! "frogs" needs a tall CAPITAL "F"!',
        feedbackWrong: 'Check Rule 1: Look at the very first letter of "frogs"!',
        why: 'The first word must be capitalized: "Frogs can leap high."',
      },
    },
  },
  {
    id: 3,
    title: 'The 2 Big Parts: Who + Action',
    subtitle: 'Who is it, and what are they doing?',
    badge: 'Step 3 of 4',
    content: {
      heading: 'Every sentence has a WHO and an ACTION!',
      explanation: 'If you take away WHO, or take away the ACTION, the sentence breaks down.',
      keyPoints: [
        {
          icon: '👤',
          title: 'Part 1: The WHO or WHAT (Subject)',
          desc: 'The person, animal, or thing the sentence is all about (e.g. "The cat", "Sam", "A big red truck").',
          color: 'bg-purple-100 border-purple-300 text-purple-900',
        },
        {
          icon: '⚡',
          title: 'Part 2: The ACTION (What they do)',
          desc: 'What happens! (e.g. "jumps high", "sleeps all day", "zooms down the hill").',
          color: 'bg-orange-100 border-orange-300 text-orange-900',
        },
      ],
      exampleGood: 'The monkey (WHO) swings on a branch (ACTION).',
      exampleBad: 'On a branch. (Wait, WHO is on the branch? What is happening?)',
      interactiveType: 'quiz',
      quizItem: {
        prompt: 'Tap thumbs up or down! Is this a complete sentence?',
        candidate: 'The fluffy yellow chick.',
        isSentence: false,
        feedbackCorrect: 'Brilliant! It tells WHO (the chick), but WHAT DID IT DO?! The action is missing!',
        feedbackWrong: 'Wait, what did the fluffy chick do? It needs an action like "pecks seeds"!',
        why: 'Missing an action verb! Example fix: "The fluffy yellow chick pecks seeds."',
      },
    },
  },
  {
    id: 4,
    title: 'Sentence Doctor Training',
    subtitle: 'Practice fixing silly broken sentences together!',
    badge: 'Step 4 of 4',
    content: {
      heading: 'Let us become Class Sentence Doctors!',
      explanation: 'When someone writes words in the wrong order or forgets a period, the sentence feels sick. We can fix it!',
      keyPoints: [
        {
          icon: '🩺',
          title: 'Diagnosis Check',
          desc: '1. Is the first letter capital? 2. Do the words make sense in order? 3. Is there a stop sign at the end?',
          color: 'bg-teal-100 border-teal-300 text-teal-900',
        },
        {
          icon: '🌟',
          title: 'Read Aloud Test',
          desc: 'Always read the sentence aloud with your class. If your tongue gets tangled, the words might be scrambled!',
          color: 'bg-yellow-100 border-yellow-300 text-yellow-900',
        },
      ],
      exampleGood: 'The happy children sing.',
      exampleBad: 'Sing the children happy.',
      interactiveType: 'quiz',
      quizItem: {
        prompt: 'Doctor on duty! Read this aloud. Is it a healthy sentence?',
        candidate: 'Swims fast the dolphin in the ocean.',
        isSentence: false,
        feedbackCorrect: 'Doctor approved! The words are jumbled! It should say: "The dolphin swims fast in the ocean."',
        feedbackWrong: 'Read it aloud! Does "Swims fast the dolphin" sound right, or should "The dolphin" come first?',
        why: 'Word order scramble! Put WHO first: "The dolphin swims fast in the ocean."',
      },
    },
  },
];
