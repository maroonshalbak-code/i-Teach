'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadProgress, getLearnedWords } from '../../lib/progress';
import { useAuth } from '../../lib/AuthContext';

export const GIFTS = [
  { id: 'stickers',   name: 'Star Face Stickers',   arabicName: 'ملصقات نجوم',        image: '/gifts/stickers.jpg',   xp: 1000, desc: 'Colorful star stickers set' },
  { id: 'basketball', name: 'Mini Basketball Game', arabicName: 'لعبة كرة السلة',     image: '/gifts/basketball.jpg', xp: 1500, desc: 'Desktop basketball shooting game' },
  { id: 'keychain',   name: 'Six Seven Keychain',   arabicName: 'ميدالية مفاتيح',     image: '/gifts/keychain.jpg',   xp: 2000, desc: 'Colorful graffiti-style keychain' },
  { id: 'stitch',     name: 'Stitch Stationery Set',arabicName: 'طقم قرطاسية ستيتش', image: '/gifts/stitch.jpg',     xp: 2500, desc: '6-piece Stitch themed school set' },
  { id: 'pillow',     name: 'Travel Neck Pillow',   arabicName: 'وسادة رقبة سفر',     image: '/gifts/pillow.jpg',     xp: 3000, desc: 'Comfortable inflatable neck pillow' },
  { id: 'dartboard',  name: 'Dart Board',           arabicName: 'لعبة السهام',        image: '/gifts/dartboard.jpg',  xp: 3500, desc: 'Sticky ball dart board game' },
  { id: 'tosscatch',  name: 'Toss & Catch Set',     arabicName: 'لعبة التقاط الكرة', image: '/gifts/tosscatch.jpg',  xp: 4000, desc: 'Velcro paddle & ball game set' },
  { id: 'jellyfish',  name: 'Jellyfish LED Lamp',   arabicName: 'مصباح قنديل البحر', image: '/gifts/jellyfish.jpg',  xp: 4500, desc: 'Glowing jellyfish aquarium lamp' },
  { id: 'rgblamp',    name: 'RGB Lamp with Clock',  arabicName: 'مصباح ذكي بساعة',   image: '/gifts/rgblamp.jpg',    xp: 5000, desc: 'Color-changing smart lamp & clock' },
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
                <div className="w-16 h-16 rounded-2xl flex-shrink-0 overflow-hidden bg-gray-100">
                  <img src={gift.image} alt={gift.name} className="w-full h-full object-cover" />
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
