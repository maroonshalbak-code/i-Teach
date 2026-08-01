'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CATEGORIES, getPhaseVocabulary } from '../../../lib/content';
import { loadProgress, markWordPronounced } from '../../../lib/progress';
import { useAuth } from '../../../lib/AuthContext';

export default function PronunciationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const cat = CATEGORIES.find((c) => c.id === id);
  const color = cat?.color ?? '#6C63FF';

  const [phase, setPhase] = useState(0);
  const [words, setWords] = useState([]);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState('normal');
  const [speaking, setSpeaking] = useState(false);
  const [heardWords, setHeardWords] = useState(new Set());

  useEffect(() => {
    loadProgress(user?.id).then((p) => {
      const ph = p.currentPhase ?? 0;
      setPhase(ph);
      setWords(getPhaseVocabulary(ph)[id] ?? []);
      // Pre-populate already-heard words
      const heard = p.phases?.[ph]?.pronunciations?.[id] ?? [];
      setHeardWords(new Set(heard));
    });
  }, [user, id]);

  const word = words[index];

  const handleSpeak = (text, rate) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = rate;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);

    // Mark as heard (only first time)
    if (!heardWords.has(index)) {
      const next = new Set(heardWords);
      next.add(index);
      setHeardWords(next);
      markWordPronounced(phase, id, index, user?.id);
    }
  };

  if (!word) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  const heardAll = heardWords.size >= words.length;

  return (
    <div className="p-5 pb-10">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.back()} className="text-gray-400 text-sm">← Back</button>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-500">
          Stage {phase + 1}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 flex-wrap mb-2">
        {words.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className="w-2.5 h-2.5 rounded-full transition-all"
            style={{ backgroundColor: heardWords.has(i) ? color : i === index ? color + '80' : '#e5e7eb' }}
          />
        ))}
      </div>
      <p className="text-xs text-gray-400 font-semibold mb-4">
        🔊 {heardWords.size} / {words.length} heard
        {heardAll && <span className="text-green-500 ml-2">✓ All done!</span>}
      </p>

      {/* Word card */}
      <div
        className="bg-white rounded-3xl p-6 shadow-sm border mb-4 text-center"
        style={{ borderColor: color + '30' }}
      >
        <div className="text-3xl font-extrabold mb-2" style={{ color }}>{word.word}</div>
        <p className="text-gray-500 text-base font-semibold mb-1" dir="rtl">{word.arabic}</p>
        <p className="text-gray-400 text-sm" dir="rtl">{word.arabicDefinition}</p>
        {heardWords.has(index) && (
          <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: color }}>
            ✓ Heard
          </div>
        )}
      </div>

      {/* Speed toggle */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-500 font-semibold">Speed:</span>
        {['slow', 'normal'].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            className="px-4 py-1.5 rounded-full border-2 text-sm font-semibold transition-all"
            style={
              speed === s
                ? { backgroundColor: color, borderColor: color, color: '#fff' }
                : { borderColor: '#e5e7eb', color: '#6b7280' }
            }
          >
            {s === 'slow' ? '🐢 Slow' : '🐇 Normal'}
          </button>
        ))}
      </div>

      {/* Speak buttons */}
      <button
        onClick={() => handleSpeak(word.word, speed === 'slow' ? 0.5 : 0.85)}
        disabled={speaking}
        className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 mb-3 disabled:opacity-60"
        style={{ backgroundColor: color }}
      >
        🔊 {speaking ? 'Playing…' : 'Hear the word'}
      </button>
      <button
        onClick={() => handleSpeak(word.example, speed === 'slow' ? 0.5 : 0.85)}
        disabled={speaking}
        className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 mb-4 border-2 disabled:opacity-60"
        style={{ borderColor: color, color }}
      >
        💬 Hear example sentence
      </button>

      {/* Example */}
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: color + '10' }}>
        <p className="text-xs text-gray-400 font-semibold mb-1">Example:</p>
        <p className="text-gray-700 italic text-sm leading-6">"{word.example}"</p>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 rounded-2xl p-4 mb-6">
        <p className="text-yellow-700 font-bold text-sm mb-2">💡 Practice tips</p>
        <p className="text-yellow-600 text-sm">• Listen first, then repeat out loud.</p>
        <p className="text-yellow-600 text-sm">• Try slow speed to hear each syllable clearly.</p>
        <p className="text-yellow-600 text-sm">• Say the word 3 times for better memory.</p>
      </div>

      {/* Nav */}
      <div className="flex gap-3">
        <button
          onClick={() => setIndex((i) => i - 1)}
          disabled={index === 0}
          className="flex-1 py-4 rounded-2xl bg-gray-100 font-bold text-gray-700 disabled:opacity-30"
        >
          ← Prev
        </button>
        <button
          onClick={() => setIndex((i) => i + 1)}
          disabled={index + 1 === words.length}
          className="flex-1 py-4 rounded-2xl text-white font-bold disabled:opacity-30"
          style={{ backgroundColor: color }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}