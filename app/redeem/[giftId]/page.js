'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { loadProgress, getLearnedWords, redeemGift } from '../../../lib/progress';
import { useAuth } from '../../../lib/AuthContext';
import { GIFTS } from '../../shop/page';

const REQUIRED_SCORE = 15;
const TOTAL_QUESTIONS = 20;

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateTest(learnedWords) {
  const pool = shuffle(learnedWords);
  const testWords = pool.slice(0, TOTAL_QUESTIONS);

  return testWords.map((word) => {
    const others = learnedWords.filter((w) => w.word !== word.word);
    const distractors = shuffle(others).slice(0, 3).map((w) => w.word);
    // Pad distractors if not enough unique words
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

export default function RedeemPage() {
  const { giftId } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const gift = GIFTS.find((g) => g.id === giftId);

  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  useEffect(() => {
    loadProgress(user?.id).then((p) => {
      const learned = getLearnedWords(p);
      if (learned.length >= TOTAL_QUESTIONS) {
        setQuestions(generateTest(learned));
      }
    });
  }, [user]);

  if (!gift) return <div className="p-8 text-center text-gray-500">Gift not found.</div>;

  const question = questions[qIndex];

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setAnswers((prev) => [...prev, { correct: i === question.answer, selected: i, answer: question.answer }]);
  };

  const handleNext = async () => {
    if (qIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setQIndex((q) => q + 1);
      setSelected(null);
    }
  };

  const handleRedeem = async () => {
    setRedeeming(true);
    await redeemGift(gift.id, gift.name, gift.xp, user?.id);
    setRedeemed(true);
    setRedeeming(false);
  };

  const optionStyle = (i) => {
    if (selected === null) return 'bg-white border-gray-200 text-gray-900';
    if (i === question.answer) return 'bg-green-50 border-green-400 text-gray-900';
    if (i === selected) return 'bg-red-50 border-red-400 text-gray-900 opacity-80';
    return 'bg-white border-gray-200 text-gray-400 opacity-40';
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-5xl mb-4">📖</div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Not enough words yet</h2>
        <p className="text-gray-500 mb-6">You need to learn at least 20 words before redeeming a gift. Keep studying!</p>
        <button onClick={() => router.push('/shop')} className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-2xl">
          ← Back to Shop
        </button>
      </div>
    );
  }

  // ── Redeemed success ─────────────────────────────────────────────────────────
  if (redeemed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Gift Redeemed!</h2>
        <p className="text-gray-500 mb-1">Your request has been submitted.</p>
        <div className="bg-indigo-50 rounded-2xl p-5 my-6 w-full max-w-sm">
          <img src={gift.image} alt={gift.name} className="w-24 h-24 object-cover rounded-xl mx-auto mb-3" />
          <p className="font-extrabold text-gray-900">{gift.name}</p>
          <p className="text-xs text-gray-400 mt-1" dir="rtl">{gift.arabicName}</p>
          <p className="text-indigo-600 font-bold mt-3">- ⚡ {gift.xp} XP deducted</p>
        </div>
        <p className="text-gray-400 text-sm mb-6">Your teacher will arrange delivery of your gift soon!</p>
        <button
          onClick={() => { window.location.href = '/'; }}
          className="w-full max-w-sm py-4 bg-indigo-500 text-white font-bold rounded-2xl"
        >
          🏠 Back to Home
        </button>
      </div>
    );
  }

  // ── Results screen ───────────────────────────────────────────────────────────
  if (finished) {
    const score = answers.filter((a) => a.correct).length;
    const passed = score >= REQUIRED_SCORE;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-7xl mb-4">{passed ? '🏆' : '😔'}</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
          {passed ? 'You passed!' : 'Not quite!'}
        </h2>
        <div
          className={`inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-4 ${passed ? 'bg-green-500' : 'bg-red-400'}`}
        >
          {score} / {TOTAL_QUESTIONS}
        </div>
        <p className="text-gray-500 mb-6">
          {passed
            ? `Great job! You can now redeem your ${gift.name}.`
            : `You need ${REQUIRED_SCORE}/20 to redeem. You scored ${score}/20. Try again!`}
        </p>

        {passed ? (
          <div className="w-full max-w-sm">
            <div className="bg-indigo-50 rounded-2xl p-4 mb-6 flex items-center gap-4">
              <img src={gift.image} alt={gift.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />
              <div className="text-left">
                <p className="font-extrabold text-gray-900">{gift.name}</p>
                <p className="text-yellow-500 font-bold text-sm">⚡ {gift.xp} XP</p>
              </div>
            </div>
            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="w-full py-4 bg-indigo-500 text-white font-bold rounded-2xl text-lg disabled:opacity-60"
            >
              {redeeming ? 'Redeeming...' : '🎁 Confirm Redeem'}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col gap-3">
            <button
              onClick={() => {
                loadProgress(user?.id).then((p) => {
                  setQuestions(generateTest(getLearnedWords(p)));
                  setQIndex(0); setSelected(null); setAnswers([]); setFinished(false);
                });
              }}
              className="w-full py-4 bg-indigo-500 text-white font-bold rounded-2xl"
            >
              Try Again 🔁
            </button>
            <button onClick={() => router.push('/shop')} className="text-gray-400 text-sm py-2">
              ← Back to Shop
            </button>
          </div>
        )}
      </div>
    );
  }

  // ── Quiz screen ──────────────────────────────────────────────────────────────
  return (
    <div className="p-5 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => router.push('/shop')} className="text-gray-400 text-sm">← Back</button>
        <div className="flex items-center gap-2">
          <span className="text-lg">{gift.emoji}</span>
          <span className="text-xs font-bold text-gray-500">{gift.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-semibold">Question {qIndex + 1} of {TOTAL_QUESTIONS}</span>
        <span className="text-xs font-bold text-indigo-600">
          Need {REQUIRED_SCORE}/{TOTAL_QUESTIONS} to pass
        </span>
      </div>

      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-indigo-500 rounded-full transition-all"
          style={{ width: `${((qIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
        />
      </div>

      {/* Question card */}
      <div className="bg-indigo-500 rounded-2xl p-6 mb-5 text-center">
        <p className="text-white/70 text-xs font-semibold mb-2">What is the English word for:</p>
        <p className="text-white text-3xl font-extrabold mb-2" dir="rtl">{question.arabic}</p>
        <p className="text-white/80 text-sm leading-6" dir="rtl">{question.arabicDefinition}</p>
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
          className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-bold"
        >
          {qIndex + 1 === TOTAL_QUESTIONS ? 'See Results →' : 'Next →'}
        </button>
      )}
    </div>
  );
}
