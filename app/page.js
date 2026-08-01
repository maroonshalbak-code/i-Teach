'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, TOTAL_PHASES } from '../lib/content';
import { loadProgress, getCategoryProgress, isCategoryComplete, getCompletedCategoryCount } from '../lib/progress';
import { useAuth } from '../lib/AuthContext';

export default function Home() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState(null);
  const [showXPInfo, setShowXPInfo] = useState(false);

  useEffect(() => {
    if (!loading && !user) { router.push('/login'); return; }
    if (user) loadProgress(user.id).then(setProgress);
  }, [user, loading]);

  // Reload progress whenever the page becomes visible (e.g. returning from quiz)
  useEffect(() => {
    if (!user) return;
    const onFocus = () => loadProgress(user.id).then(setProgress);
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-pulse">📚</div>
      </div>
    );
  }

  const firstName = profile?.display_name?.split(' ')[0] ?? 'Learner';
  const levelEmoji = { beginner: '🌱', intermediate: '🌿', advanced: '🌳' }[profile?.level ?? 'beginner'];
  const phase = progress?.currentPhase ?? 0;
  const completedCats = progress ? getCompletedCategoryCount(progress, phase) : 0;
  const phaseComplete = completedCats === CATEGORIES.length;

  return (
    <div className="p-5 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pt-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Hello, {firstName}! 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {levelEmoji} {profile?.level ?? 'beginner'}
            {profile?.age ? ` · Age ${profile.age}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {progress && (
            <button
              onClick={() => setShowXPInfo(true)}
              className="flex items-center gap-1 bg-gray-900 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold"
            >
              ⚡ {progress.totalXP} XP
            </button>
          )}
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-indigo-300">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-base font-bold text-indigo-600">{firstName[0]?.toUpperCase()}</span>
              )}
            </div>
          </Link>
        </div>
      </div>

      {/* Streak */}
      {progress?.streak > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 rounded-xl p-3 mb-4">
          <p className="text-orange-700 font-semibold text-sm">🔥 {progress.streak}-day streak! Keep it up!</p>
        </div>
      )}

      {/* Phase banner */}
      <div className="rounded-2xl p-4 mb-5 bg-indigo-500">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-white/80 text-xs font-semibold">CURRENT PHASE</p>
            <p className="text-white text-2xl font-extrabold">Phase {phase + 1} <span className="text-white/60 text-sm font-semibold">/ {TOTAL_PHASES}</span></p>
          </div>
          <div className="text-right">
            <p className="text-white/80 text-xs font-semibold">CATEGORIES</p>
            <p className="text-white text-2xl font-extrabold">{completedCats}<span className="text-white/60 text-sm font-semibold"> / 6</span></p>
          </div>
        </div>
        {/* Phase progress bar */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(completedCats / CATEGORIES.length) * 100}%` }}
          />
        </div>
        {phaseComplete && (
          <p className="text-white text-xs font-bold mt-2 text-center">
            🏆 Phase complete! Finish the last quiz to advance →
          </p>
        )}
      </div>

      {/* Nav */}
      <div className="flex gap-2 mb-3">
        <Link href="/progress" className="flex-1 text-center text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl py-2">
          📊 My Progress
        </Link>
        <Link href="/leaderboard" className="flex-1 text-center text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl py-2">
          🏆 Top 5
        </Link>
        <Link href="/profile" className="flex-1 text-center text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl py-2">
          👤 Profile
        </Link>
      </div>
      <button
        onClick={() => {
          const url = window.location.origin;
          const msg = encodeURIComponent(`🎓 أنا أتعلم الإنجليزية مع هذا التطبيق الرائع!\nانضم إليّ: ${url}`);
          window.open(`https://wa.me/?text=${msg}`, '_blank');
        }}
        className="w-full py-2.5 rounded-xl text-sm font-semibold mb-5 flex items-center justify-center gap-2"
        style={{ backgroundColor: '#25D366', color: '#fff' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        Invite a Friend on WhatsApp
      </button>

      {/* Category grid */}
      <h2 className="text-lg font-bold text-gray-900 mb-3">Phase {phase + 1} Topics</h2>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((cat) => {
          const pct      = progress ? getCategoryProgress(progress, phase, cat.id) : 0;
          const complete = progress ? isCategoryComplete(progress, phase, cat.id) : false;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="block rounded-2xl p-4 border transition-transform active:scale-95 relative"
              style={{ backgroundColor: cat.color + '15', borderColor: complete ? cat.color : cat.color + '40' }}
            >
              {complete && (
                <div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: cat.color }}
                >
                  ✓
                </div>
              )}
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <div className="text-sm font-bold mb-3" style={{ color: cat.color }}>{cat.title}</div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
              </div>
              <div className="text-xs font-semibold" style={{ color: cat.color }}>{pct}% done</div>
            </Link>
          );
        })}
      </div>

      {/* XP Info Modal */}
      {showXPInfo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={() => setShowXPInfo(false)}
        >
          <div
            className="bg-white rounded-t-3xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">⚡</div>
              <h2 className="text-xl font-extrabold text-gray-900">How to earn XP</h2>
            </div>
            <div className="flex flex-col gap-3 mb-6">
              {[
                { icon: '📖', action: 'Study a flashcard',    xp: '+10 XP' },
                { icon: '🔊', action: 'Hear a pronunciation', xp: '+10 XP' },
                { icon: '✅', action: 'Correct quiz answer',  xp: '+20 XP' },
                { icon: '🏆', action: 'Complete a category',  xp: '+50 XP' },
              ].map((item) => (
                <div key={item.action} className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="flex-1 text-sm font-semibold text-gray-700">{item.action}</span>
                  <span className="text-sm font-bold text-yellow-500">{item.xp}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowXPInfo(false)}
              className="w-full py-3 bg-indigo-500 text-white font-bold rounded-2xl"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}