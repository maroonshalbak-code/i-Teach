'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CATEGORIES, getPhaseQuiz } from '../../../lib/content';
import {
  loadProgress,
  saveQuizScore,
  advancePhase,
  isCategoryComplete,
  isPhaseComplete,
  getCompletedCategoryCount,
} from '../../../lib/progress';
import { useAuth } from '../../../lib/AuthContext';

function speak(text) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const cat = CATEGORIES.find((c) => c.id === id);
  const color = cat?.color ?? '#6C63FF';

  const [phase, setPhase] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [phaseJustCompleted, setPhaseJustCompleted] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [finalProgress, setFinalProgress] = useState(null);
  const [alreadyComplete, setAlreadyComplete] = useState(false);

  useEffect(() => {
    loadProgress(user?.id).then((p) => {
      const ph = p.currentPhase ?? 0;
      setPhase(ph);
      setProgress(p);
      setQuestions(getPhaseQuiz(ph, id));
      if (isCategoryComplete(p, ph, id)) setAlreadyComplete(true);
    });
  }, [user, id]);

  const question = questions[qIndex];

  const handleSelect = (i) => {
    if (selected !== null || !question) return;
    setSelected(i);
    const correct = i === question.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, { correct, selected: i, answer: question.answer }]);
  };

  const handleNext = async () => {
    if (qIndex + 1 >= questions.length) {
      const lastCorrect = selected === question.answer;
      const finalScore = answers.filter((a) => a.correct).length + (lastCorrect ? 1 : 0);
      const updatedProgress = await saveQuizScore(phase, id, finalScore, questions.length, user?.id);
      setProgress(updatedProgress);
      setFinalProgress(updatedProgress);

      // Check if the entire phase is now complete
      if (isPhaseComplete(updatedProgress, phase)) {
        setPhaseJustCompleted(true);
      }
      setFinished(true);
    } else {
      setQIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handleAdvancePhase = async () => {
    setAdvancing(true);
    await advancePhase(user?.id);
    window.location.href = '/';
  };

  const optionStyle = (i) => {
    if (selected === null) return 'bg-white border-gray-200 text-gray-900';
    if (i === question.answer) return 'bg-green-50 border-green-400 text-gray-900';
    if (i === selected) return 'bg-red-50 border-red-400 text-gray-900 opacity-90';
    return 'bg-white border-gray-200 text-gray-400 opacity-50';
  };

  if (!question && !finished) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  // ── Already complete screen ───────────────────────────────────────────────
  if (alreadyComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Quiz Already Complete!</h2>
        <p className="text-gray-500 mb-6">You've already passed this quiz with a perfect score.</p>
        <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-4 mb-8 w-full max-w-sm">
          <p className="text-green-700 font-bold text-sm">🏆 Perfect score achieved</p>
          <p className="text-green-600 text-xs mt-1">Complete the other categories to advance to the next stage.</p>
        </div>
        <button
          onClick={() => { window.location.href = '/'; }}
          className="w-full max-w-sm py-4 rounded-2xl text-white font-bold text-base mb-3"
          style={{ backgroundColor: color }}
        >
          🏠 Back to Home
        </button>
        <button onClick={() => router.back()} className="text-gray-400 text-sm py-2">
          Back to Category
        </button>
      </div>
    );
  }

  // ── Phase complete screen ──────────────────────────────────────────────────
  if (finished && phaseJustCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-8xl mb-4">🏆</div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Stage {phase + 1} Complete!</h2>
        <p className="text-gray-500 mb-1">You finished all 6 categories!</p>
        <p className="text-indigo-500 font-bold text-lg mb-8">+100 Bonus XP 🎊</p>
        {phase < 99 ? (
          <>
            <div className="bg-indigo-50 rounded-3xl p-6 mb-6 w-full max-w-sm">
              <p className="text-indigo-700 font-bold text-lg mb-1">Next: Stage {phase + 2}</p>
              <p className="text-indigo-500 text-sm">6 brand-new words per category await you!</p>
            </div>
            <button
              onClick={handleAdvancePhase}
              disabled={advancing}
              className="w-full max-w-sm py-4 rounded-2xl bg-indigo-500 text-white font-bold text-lg disabled:opacity-60 mb-3"
            >
              {advancing ? 'Advancing...' : `Start Stage ${phase + 2} →`}
            </button>
          </>
        ) : (
          <div className="bg-yellow-50 rounded-3xl p-6 mb-6 w-full max-w-sm">
            <p className="text-yellow-700 font-bold">🎓 You completed all 100 stages!</p>
          </div>
        )}
        <button onClick={() => { window.location.href = '/'; }} className="text-gray-400 text-sm py-2">
          Back to home
        </button>
      </div>
    );
  }

  // ── Results screen ────────────────────────────────────────────────────────
  if (finished) {
    const finalScore = answers.filter((a) => a.correct).length;
    const perfect = finalScore === questions.length;
    const resultProgress = finalProgress ?? progress;
    const WORDS_PER_PHASE = 6;

    // Check individual components for THIS category
    const slot = resultProgress?.phases?.[phase];
    const flashcardsDone = (slot?.flashcards?.[id]?.length ?? 0) >= WORDS_PER_PHASE;
    const pronunciationDone = (slot?.pronunciations?.[id]?.length ?? 0) >= WORDS_PER_PHASE;
    const categoryComplete = flashcardsDone && pronunciationDone && perfect;

    // Count completed categories — use local `perfect` for the current one to avoid timing issues
    const completedCount = resultProgress ? CATEGORIES.filter((cat) => {
      const s = resultProgress?.phases?.[phase];
      if (!s) return false;
      const f = (s.flashcards?.[cat.id]?.length ?? 0) >= WORDS_PER_PHASE;
      const p = (s.pronunciations?.[cat.id]?.length ?? 0) >= WORDS_PER_PHASE;
      const quizOk = cat.id === id
        ? perfect
        : (() => { const qd = s.quizScores?.[cat.id]; return qd && qd.score === qd.total; })();
      return f && p && quizOk;
    }).length : 0;

    return (
      <div className="p-5 pb-10">
        <button onClick={() => router.back()} className="text-gray-400 text-sm mb-4">← Back</button>
        <div className="text-center mb-6">
          <div className="text-7xl mb-3">{perfect ? '🏆' : finalScore >= Math.ceil(questions.length * 0.6) ? '💪' : '📖'}</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-3">
            {perfect ? 'Perfect score!' : 'Not quite!'}
          </h2>
          <div
            className="inline-block px-6 py-3 rounded-full text-white font-bold text-lg mb-3"
            style={{ backgroundColor: perfect ? '#22c55e' : color }}
          >
            {finalScore} / {questions.length} correct
          </div>

          {/* Perfect-score requirement callout */}
          {!perfect && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-3 mb-2">
              <p className="text-amber-700 font-bold text-sm">⭐ You need a perfect score to complete this category.</p>
              <p className="text-amber-600 text-xs mt-1">Review the flashcards, then try again!</p>
            </div>
          )}
          {perfect && (
            <div className={`border rounded-2xl px-4 py-3 mb-2 ${categoryComplete ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-200'}`}>
              <p className={`font-bold text-sm mb-2 ${categoryComplete ? 'text-green-700' : 'text-blue-700'}`}>
                {categoryComplete ? '✅ Category complete!' : '✅ Quiz done! Still needed:'}
              </p>
              {!categoryComplete && (
                <div className="flex flex-col gap-1">
                  <p className={`text-xs font-semibold ${flashcardsDone ? 'text-green-600' : 'text-gray-500'}`}>
                    {flashcardsDone ? '✓' : '○'} Flashcards {flashcardsDone ? '(done)' : `(${slot?.flashcards?.[id]?.length ?? 0}/${WORDS_PER_PHASE} seen)`}
                  </p>
                  <p className={`text-xs font-semibold ${pronunciationDone ? 'text-green-600' : 'text-gray-500'}`}>
                    {pronunciationDone ? '✓' : '○'} Pronunciation {pronunciationDone ? '(done)' : `(${slot?.pronunciations?.[id]?.length ?? 0}/${WORDS_PER_PHASE} heard)`}
                  </p>
                  <p className="text-xs font-semibold text-green-600">✓ Quiz (perfect score)</p>
                </div>
              )}
              {categoryComplete && (
                <p className="text-green-600 text-xs">Stage {phase + 1} — {completedCount} / 6 categories done</p>
              )}
            </div>
          )}
        </div>

        <h3 className="font-bold text-gray-900 mb-3">Review</h3>
        <div className="flex flex-col gap-3 mb-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 border ${answers[i]?.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}
            >
              <p className="text-gray-600 text-xs mb-1 text-right" dir="rtl">{q.question}</p>
              <p className={`font-bold text-sm ${answers[i]?.correct ? 'text-green-700' : 'text-red-700'}`}>
                {answers[i]?.correct ? '✓ ' : '✗ '}{q.options[q.answer]}
              </p>
              {!answers[i]?.correct && (
                <p className="text-red-400 text-xs mt-1">Your answer: {q.options[answers[i]?.selected]}</p>
              )}
            </div>
          ))}
        </div>

        {categoryComplete ? (
          <button
            onClick={() => { window.location.href = '/'; }}
            className="w-full py-4 rounded-2xl text-white font-bold mb-3 text-lg"
            style={{ backgroundColor: color }}
          >
            🏠 Back to Home
          </button>
        ) : (
          <button
            onClick={() => { setQIndex(0); setSelected(null); setScore(0); setAnswers([]); setFinished(false); setPhaseJustCompleted(false); }}
            className="w-full py-4 rounded-2xl text-white font-bold mb-3"
            style={{ backgroundColor: color }}
          >
            {perfect ? 'Take Again' : 'Try Again 🔁'}
          </button>
        )}
        <button onClick={() => { window.location.href = '/'; }} className="w-full py-3 text-gray-400 text-sm font-semibold">
          Back to Home
        </button>
      </div>
    );
  }

  // ── Quiz screen ────────────────────────────────────────────────────────────
  return (
    <div className="p-5 pb-10">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => router.back()} className="text-gray-400 text-sm">← Back</button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">Stage {phase + 1}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-semibold">Question {qIndex + 1} of {questions.length}</span>
        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: color + '20', color }}>
          Score: {score}
        </span>
      </div>
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${((qIndex + 1) / questions.length) * 100}%`, backgroundColor: color }}
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border mb-5" style={{ borderColor: color + '30' }}>
        <p className="text-lg font-bold text-gray-900 leading-8 text-right" dir="rtl">{question.question}</p>
      </div>

      <div className="flex flex-col gap-3 mb-5">
        {question.options.map((opt, i) => (
          <div key={i} className={`flex items-center rounded-2xl border-2 transition-all ${optionStyle(i)}`}>
            <button
              onClick={() => handleSelect(i)}
              className="flex items-center gap-3 flex-1 p-4 text-left active:scale-95"
            >
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="font-semibold text-sm flex-1">{opt}</span>
              {selected !== null && i === question.answer && <span className="text-green-500 text-base">✓</span>}
              {selected !== null && i === selected && i !== question.answer && <span className="text-red-500 text-base">✗</span>}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); speak(opt); }}
              className="pr-4 text-lg flex-shrink-0 opacity-60 hover:opacity-100"
            >
              🔊
            </button>
          </div>
        ))}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl text-white font-bold"
          style={{ backgroundColor: color }}
        >
          {qIndex + 1 === questions.length ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}