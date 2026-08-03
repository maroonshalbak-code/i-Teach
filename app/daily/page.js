'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadProgress, getLearnedWords, saveDailyChallenge } from '../../lib/progress';
import { useAuth } from '../../lib/AuthContext';

const TOTAL_QUESTIONS = 5;
const XP_PER_CORRECT = 20;

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateQuestions(learnedWords) {
  const pool = shuffle(learnedWords).slice(0, TOTAL_QUESTIONS);
  return pool.map((word) => {
    const others = learnedWords.filter((w) => w.word !== word.word);
    const distractors = shuffle(others).slice(0, 3).map((w) => w.word);
    while (distractors.length < 3) distractors.push('—');
    const options = shuffle([word.word, ...distractors]);
    return {
      arabic: word.arabic,
      arabicDefinition: word.arabicDefinition,
      options,
      answer: options.indexOf(word.word),
    };
  });
}

export default function DailyChallengePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [todayScore, setTodayScore] = useState(null);
  const [notEnoughWords, setNotEnoughWords] = useState(false);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProgress(user?.id).then((p) => {
      const dc = p.dailyChallenge;
      if (dc?.lastDate === todayStr()) {
        setAlreadyDone(true);
        setTodayScore(dc.score);
        return;
      }
      const learned = getLearnedWords(p);
      if (learned.length < TOTAL_QUESTIONS) {
        setNotEnoughWords(true);
        return;
      }
      setQuestions(generateQuestions(learned));
    });
  }, [user]);

  const question = questions[qIndex];

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers((prev) => [...prev, { correct: i === question.answer }]);
  };

  const handleNext = async () => {
    const isLast = qIndex + 1 >= questions.length;
    if (isLast) {
      const finalScore = answers.filter((a) => a.correct).length + (selected === question.answer ? 1 : 0);
      setSaving(true);
      await saveDailyChallenge(finalScore, user?.id);
      setSaving(false);
      setFinished(true);
    } else {
      setQIndex((q) => q + 1);
      setSelected(null);
    }
  };

  const optionStyle = (i) => {
    if (selected === null) return 'bg-white border-gray-200 text-gray-900';
    if (i === question.answer) return 'bg-green-50 border-green-400 text-gray-900';
    if (i === selected) return 'bg-red-50 border-red-400 text-gray-900 opacity-80';
    return 'bg-white border-gray-200 text-gray-400 opacity-40';
  };

  // ── Already done today ────────────────────────────────────────────────────
  if (alreadyDone) {
    const xpEarned = todayScore * XP_PER_CORRECT;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Already done today!</h2>
        <p className="text-gray-500 mb-6">Come back tomorrow for a new challenge.</p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-6 w-full max-w-sm">
          <p className="text-yellow-700 font-bold text-lg">Today's score: {todayScore} / {TOTAL_QUESTIONS}</p>
          <p className="text-yellow-600 text-sm mt-1">+{xpEarned} XP earned ⚡</p>
        </div>
        <button
          onClick={() => { window.location.href = '/'; }}
          className="w-full max-w-sm py-4 bg-indigo-500 text-white font-bold rounded-2xl"
        >
          🏠 Back to Home
        </button>
      </div>
    );
  }

  // ── Not enough words ──────────────────────────────────────────────────────
  if (notEnoughWords) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-6xl mb-4">📖</div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Keep studying first!</h2>
        <p className="text-gray-500 mb-6">You need at least 5 learned words to unlock the daily challenge.</p>
        <button
          onClick={() => { window.location.href = '/'; }}
          className="w-full max-w-sm py-4 bg-indigo-500 text-white font-bold rounded-2xl"
        >
          🏠 Back to Home
        </button>
      </div>
    );
  }

  // ── Finished screen ───────────────────────────────────────────────────────
  if (finished) {
    const score = answers.filter((a) => a.correct).length;
    const xpEarned = score * XP_PER_CORRECT;
    const emoji = score === 5 ? '🏆' : score >= 3 ? '💪' : '📖';
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-7xl mb-4">{emoji}</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {score === 5 ? 'Perfect!' : score >= 3 ? 'Good job!' : 'Keep practicing!'}
        </h2>
        <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-4 ${
          score === 5 ? 'bg-green-500' : score >= 3 ? 'bg-indigo-500' : 'bg-gray-400'
        }`}>
          {score} / {TOTAL_QUESTIONS} correct
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 w-full max-w-sm">
          <p className="text-yellow-600 font-bold text-lg">+{xpEarned} XP earned ⚡</p>
          <p className="text-yellow-500 text-sm mt-1">Come back tomorrow for a new challenge!</p>
        </div>
        <button
          onClick={() => { window.location.href = '/'; }}
          className="w-full max-w-sm py-4 bg-indigo-500 text-white font-bold rounded-2xl"
        >
          🏠 Back to Home
        </button>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-pulse">⚡</div>
      </div>
    );
  }

  // ── Quiz screen ───────────────────────────────────────────────────────────
  return (
    <div className="p-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="text-gray-400 text-sm">← Back</button>
        <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-full">
          <span className="text-sm">⚡</span>
          <span className="text-xs font-bold text-yellow-600">+{XP_PER_CORRECT} XP per correct</span>
        </div>
      </div>

      <div className="mb-1">
        <h1 className="text-xl font-extrabold text-gray-900">⭐ Daily Challenge</h1>
        <p className="text-xs text-gray-400 mt-0.5">Question {qIndex + 1} of {TOTAL_QUESTIONS}</p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden my-4">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${((qIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-indigo-500 rounded-2xl p-6 mb-5 text-center">
        <p className="text-white/70 text-xs font-semibold mb-2">What is the English word for:</p>
        <p className="text-white text-3xl font-extrabold mb-2" dir="rtl">{question.arabic}</p>
        {question.arabicDefinition && (
          <p className="text-white/80 text-sm leading-6" dir="rtl">{question.arabicDefinition}</p>
        )}
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3 mb-5">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${optionStyle(i)}`}
          >
            <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
              {String.fromCharCode(65 + i)}
            </span>
            <span className="font-semibold text-sm flex-1">{opt}</span>
            {selected !== null && i === question.answer && <span className="text-green-500">✓</span>}
            {selected !== null && i === selected && i !== question.answer && <span className="text-red-500">✗</span>}
          </button>
        ))}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          disabled={saving}
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold disabled:opacity-60"
        >
          {saving ? 'Saving...' : qIndex + 1 === TOTAL_QUESTIONS ? 'See Results →' : 'Next →'}
        </button>
      )}
    </div>
  );
}
