'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CATEGORIES, getPhaseVocabulary } from '../../../lib/content';
import { markFlashcardSeen, markWordPronounced, loadProgress } from '../../../lib/progress';
import { useAuth } from '../../../lib/AuthContext';

function speak(text) {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

export default function FlashcardPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const cat = CATEGORIES.find((c) => c.id === id);
  const color = cat?.color ?? '#6C63FF';

  const [phase, setPhase] = useState(0);
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done, setDone] = useState(false);
  const [heardWords, setHeardWords] = useState(new Set());

  useEffect(() => {
    loadProgress(user?.id).then((p) => {
      const ph = p.currentPhase ?? 0;
      setPhase(ph);
      setWords(getPhaseVocabulary(ph)[id] ?? []);
    });
  }, [user, id]);

  const word = words[index];

  const handleFlip = () => {
    if (!flipped) markFlashcardSeen(phase, id, index, user?.id);
    setFlipped(!flipped);
  };

  const handleSpeak = () => {
    speak(word.word);
    if (!heardWords.has(index)) {
      const next = new Set(heardWords);
      next.add(index);
      setHeardWords(next);
      markWordPronounced(phase, id, index, user?.id);
    }
  };

  const handleNext = () => {
    if (index + 1 >= words.length) { setDone(true); return; }
    setFlipped(false);
    setTimeout(() => setIndex(index + 1), 150);
  };

  const handlePrev = () => {
    if (index === 0) return;
    setFlipped(false);
    setTimeout(() => setIndex(index - 1), 150);
  };

  if (!word) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  if (done) {
    const heardAll = heardWords.size >= words.length;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Well done!</h2>
        <p className="text-gray-500 mb-2">You reviewed all {words.length} flashcards.</p>
        {!heardAll && (
          <p className="text-amber-500 text-sm font-semibold mb-6">
            🔊 Tap the sound button on each card to hear all words!
          </p>
        )}
        {heardAll && (
          <p className="text-green-500 text-sm font-semibold mb-6">
            ✓ You heard all words — pronunciation complete!
          </p>
        )}
        <button
          onClick={() => { setIndex(0); setDone(false); setFlipped(false); }}
          className="px-8 py-3 rounded-2xl text-white font-bold text-base mb-3"
          style={{ backgroundColor: color }}
        >
          Review Again
        </button>
        <button onClick={() => router.back()} className="text-gray-400 text-sm py-2">
          ← Back to category
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="text-gray-400 text-sm">← Back</button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
          Phase {phase + 1}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 font-semibold mb-1">
          <span>{index + 1} / {words.length}</span>
          <span>🔊 {heardWords.size}/{words.length} heard</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / words.length) * 100}%`, backgroundColor: color }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flip-card w-full" style={{ height: 340 }}>
          <div className={`flip-card-inner w-full h-full relative ${flipped ? 'flipped' : ''}`}>
            <div
              className="flip-card-front absolute inset-0 rounded-3xl p-8 flex flex-col items-center justify-center border"
              style={{ backgroundColor: color + '12', borderColor: color + '40' }}
            >
              <div className="text-3xl font-extrabold mb-6" style={{ color }}>{word.word}</div>
              <button
                onClick={handleSpeak}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ backgroundColor: color + '20', color }}
              >
                {heardWords.has(index) ? '✓ Heard' : '🔊 Hear it'}
              </button>
              <p className="text-gray-300 text-xs mt-6">Tap card to reveal definition</p>
            </div>

            <div
              className="flip-card-back absolute inset-0 rounded-3xl p-5 flex flex-col items-center justify-center overflow-y-auto"
              style={{ backgroundColor: color }}
            >
              <p className="text-white/70 text-xs font-semibold mb-1">بالعربية</p>
              <p className="text-white text-2xl font-extrabold text-center mb-3" dir="rtl">{word.arabicWord}</p>
              <div className="w-16 h-px bg-white/30 mb-3" />
              <p className="text-white/70 text-xs font-semibold mb-1" dir="rtl">التعريف</p>
              <p className="text-white text-sm font-semibold text-center leading-6 mb-3" dir="rtl">{word.arabicDefinition}</p>
              <div className="w-16 h-px bg-white/30 mb-3" />
              <p className="text-white/70 text-xs font-semibold mb-1" dir="rtl">مثال</p>
              <p className="text-white/90 text-sm text-center">{word.example}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleFlip}
          className="mt-5 px-6 py-2.5 rounded-full border-2 text-sm font-semibold"
          style={{ borderColor: color, color }}
        >
          {flipped ? '↩ Show word' : '↩ Show definition'}
        </button>
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={handlePrev}
          disabled={index === 0}
          className="flex-1 py-4 rounded-2xl bg-gray-100 font-bold text-gray-700 disabled:opacity-30"
        >
          ← Prev
        </button>
        <button
          onClick={handleNext}
          className="flex-1 py-4 rounded-2xl text-white font-bold"
          style={{ backgroundColor: color }}
        >
          {index + 1 === words.length ? 'Finish ✓' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
