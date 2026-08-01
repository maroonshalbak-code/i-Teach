'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, TOTAL_PHASES } from '../../lib/content';
import {
  loadProgress,
  resetProgress,
  getCategoryProgress,
  isCategoryComplete,
  getCompletedCategoryCount,
} from '../../lib/progress';
import { useAuth } from '../../lib/AuthContext';

const WORDS_PER_PHASE = 6;

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    loadProgress(user?.id).then(setProgress);
  }, [user]);

  if (!progress) return null;

  const phase = progress.currentPhase ?? 0;
  const slot = progress.phases?.[phase] ?? {};

  // Total flashcards seen across all categories this phase
  const totalSeen = CATEGORIES.reduce(
    (s, c) => s + (slot.flashcards?.[c.id]?.length ?? 0), 0
  );
  const totalPossible = CATEGORIES.length * WORDS_PER_PHASE;
  const overallPct = Math.round((totalSeen / totalPossible) * 100);
  const completedCats = getCompletedCategoryCount(progress, phase);

  const handleReset = async () => {
    if (confirm('Reset all progress? This cannot be undone.')) {
      await resetProgress(user?.id);
      loadProgress(user?.id).then(setProgress);
    }
  };

  return (
    <div className="p-5 pb-16">
      <button onClick={() => router.back()} className="text-gray-400 text-sm mb-4">← Back</button>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Your Progress</h1>
      <p className="text-sm text-gray-400 mb-5">Phase {phase + 1} of {TOTAL_PHASES}</p>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: '⚡ Total XP',   value: progress.totalXP ?? 0,        bg: '#6C63FF15' },
          { label: '🔥 Streak',     value: `${progress.streak ?? 0}d`,   bg: '#FF980015' },
          { label: '✅ Categories', value: `${completedCats}/6`,          bg: '#4CAF5015' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center" style={{ backgroundColor: s.bg }}>
            <div className="text-2xl font-extrabold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 font-semibold mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Phase overview bar */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-5 text-center">
        <p className="text-xs text-gray-400 font-semibold mb-2">Phase {phase + 1} Flashcards</p>
        <div className="text-5xl font-extrabold text-indigo-500 mb-3">{overallPct}%</div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
        </div>
        <p className="text-xs text-gray-400">{totalSeen} of {totalPossible} words seen this phase</p>
      </div>

      {/* By category */}
      <h2 className="font-bold text-gray-900 mb-3">Phase {phase + 1} — By Category</h2>
      <div className="flex flex-col gap-3 mb-5">
        {CATEGORIES.map((cat) => {
          const pct      = getCategoryProgress(progress, phase, cat.id);
          const complete = isCategoryComplete(progress, phase, cat.id);
          const cards    = slot.flashcards?.[cat.id]?.length ?? 0;
          const heard    = slot.pronunciations?.[cat.id]?.length ?? 0;
          const qData    = slot.quizScores?.[cat.id];

          return (
            <Link key={cat.id} href={`/category/${cat.id}`} className="bg-white rounded-2xl p-4 shadow-sm block">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{cat.title}</span>
                    <span className="text-xs text-gray-400" dir="rtl">{cat.arabic}</span>
                    {complete && (
                      <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.color }}>
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex gap-3">
                    <span>📖 {cards}/{WORDS_PER_PHASE} cards</span>
                    <span>🔊 {heard}/{WORDS_PER_PHASE} heard</span>
                    <span>🎯 {qData ? `${qData.score}/${qData.total}` : '—'}</span>
                  </div>
                </div>
                <span className="font-extrabold text-sm" style={{ color: cat.color }}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
              </div>
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleReset}
        className="w-full py-3 rounded-2xl border-2 border-red-300 text-red-500 font-semibold text-sm"
      >
        🔄 Reset all progress
      </button>
    </div>
  );
}