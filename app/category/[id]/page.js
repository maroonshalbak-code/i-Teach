'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { CATEGORIES } from '../../../lib/content';

const ACTIVITIES = [
  { id: 'flashcard', label: 'Flashcards', desc: 'Learn vocabulary with flip cards', emoji: '🃏' },
  { id: 'pronunciation', label: 'Pronunciation', desc: 'Listen and practice speaking', emoji: '🎙️' },
  { id: 'quiz', label: 'Quiz', desc: 'Test your knowledge', emoji: '📝' },
];

export default function CategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const cat = CATEGORIES.find((c) => c.id === id);

  if (!cat) return <div className="p-8 text-center text-gray-500">Category not found.</div>;

  return (
    <div>
      {/* Hero */}
      <div className="p-6 pt-10" style={{ backgroundColor: cat.color }}>
        <button onClick={() => router.back()} className="text-white/80 text-sm mb-4">← Back</button>
        <div className="text-4xl mb-2">{cat.emoji}</div>
        <h1 className="text-2xl font-extrabold text-white">{cat.title}</h1>
        <p className="text-white/80 text-sm mt-1">Choose an activity</p>
      </div>

      {/* Activities */}
      <div className="p-5 flex flex-col gap-3">
        {ACTIVITIES.map((act) => (
          <Link
            key={act.id}
            href={`/${act.id}/${id}`}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm active:scale-95 transition-transform"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: cat.color + '20' }}
            >
              {act.emoji}
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900">{act.label}</div>
              <div className="text-sm text-gray-500 mt-0.5">{act.desc}</div>
            </div>
            <span className="text-gray-300 text-lg">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
