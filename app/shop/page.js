'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadProgress, getLearnedWords } from '../../lib/progress';
import { useAuth } from '../../lib/AuthContext';

export const GIFTS = [
  { id: 'stationery', name: 'Stationery Set',      arabicName: 'طقم قرطاسية',      emoji: '✏️', xp: 500,  desc: 'Pencils, pens, ruler & eraser' },
  { id: 'storybook',  name: 'English Story Book',   arabicName: 'كتاب قصة إنجليزي', emoji: '📚', xp: 800,  desc: 'A fun illustrated story book' },
  { id: 'artset',     name: 'Art & Coloring Set',   arabicName: 'طقم رسم وتلوين',   emoji: '🎨', xp: 1000, desc: 'Colors, markers & drawing pads' },
  { id: 'boardgame',  name: 'Board Game',            arabicName: 'لعبة ألواح',        emoji: '🎲', xp: 1500, desc: 'A fun family board game' },
  { id: 'backpack',   name: 'School Backpack',       arabicName: 'حقيبة مدرسية',     emoji: '🎒', xp: 2000, desc: 'A cool school backpack' },
];

export default function ShopPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    loadProgress(user?.id).then((p) => {
      setProgress(p);
      setLearnedCount(getLearnedWords(p).length);
    });
  }, [user]);

  const xp = progress?.totalXP ?? 0;

  return (
    <div className="p-5 pb-16">
      <button onClick={() => router.back()} className="text-gray-400 text-sm mb-4">← Back</button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🎁</div>
        <h1 className="text-2xl font-extrabold text-gray-900">Gift Shop</h1>
        <p className="text-sm text-gray-400" dir="rtl">متجر الهدايا</p>
      </div>

      {/* XP balance */}
      <div className="bg-gray-900 rounded-2xl p-4 mb-5 flex items-center justify-between">
        <div>
          <p className="text-white/60 text-xs font-semibold">Your Balance</p>
          <p className="text-yellow-400 text-2xl font-extrabold">⚡ {xp} XP</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs font-semibold">Words Learned</p>
          <p className="text-white text-xl font-extrabold">📖 {learnedCount}</p>
        </div>
      </div>

      {/* Learned words warning */}
      {learnedCount < 20 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mb-5">
          <p className="text-amber-700 font-bold text-sm">⚠️ You need at least 20 learned words to redeem a gift.</p>
          <p className="text-amber-600 text-xs mt-1">You have {learnedCount}/20. Keep studying flashcards!</p>
        </div>
      )}

      {/* Gift grid */}
      <div className="flex flex-col gap-4">
        {GIFTS.map((gift) => {
          const canAfford = xp >= gift.xp;
          const canRedeem = canAfford && learnedCount >= 20;
          return (
            <div
              key={gift.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border-2 ${canAfford ? 'border-indigo-100' : 'border-gray-100'}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl w-14 h-14 flex items-center justify-center bg-indigo-50 rounded-2xl flex-shrink-0">
                  {gift.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-gray-900">{gift.name}</p>
                  <p className="text-xs text-gray-400" dir="rtl">{gift.arabicName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{gift.desc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-extrabold text-sm ${canAfford ? 'text-yellow-500' : 'text-gray-300'}`}>
                    ⚡ {gift.xp}
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push(`/redeem/${gift.id}`)}
                disabled={!canRedeem}
                className={`w-full mt-3 py-3 rounded-xl font-bold text-sm transition-all ${
                  canRedeem
                    ? 'bg-indigo-500 text-white active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!canAfford ? `Need ${gift.xp - xp} more XP` : !canRedeem ? 'Need 20 learned words' : '🎁 Redeem'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
