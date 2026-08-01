'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
const RANK_COLORS = ['#f59e0b', '#94a3b8', '#b45309', '#6366f1', '#6366f1'];

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      // Fetch all progress records
      const { data: progressRows } = await supabase
        .from('user_progress')
        .select('user_id, data');

      if (!progressRows || progressRows.length === 0) {
        setLoading(false);
        return;
      }

      // Sort by XP descending, take top 5
      const top5 = progressRows
        .map((r) => ({
          user_id: r.user_id,
          xp: r.data?.totalXP ?? 0,
          phase: r.data?.currentPhase ?? 0,
        }))
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 5);

      // Fetch profiles for these users
      const ids = top5.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, level')
        .in('id', ids);

      const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));

      setLeaders(
        top5.map((r, i) => ({
          rank: i + 1,
          ...r,
          profile: profileMap[r.user_id] ?? null,
        }))
      );
      setLoading(false);
    }

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-4xl animate-pulse">🏆</div>
      </div>
    );
  }

  return (
    <div className="p-5 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3 pt-6 mb-2">
        <button onClick={() => router.back()} className="text-gray-400 text-sm">← Back</button>
      </div>
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">🏆</div>
        <h1 className="text-2xl font-extrabold text-gray-900">Top 5</h1>
        <p className="text-sm text-gray-400">Highest XP this season</p>
      </div>

      {/* Leaderboard list */}
      <div className="flex flex-col gap-3">
        {leaders.map((entry, i) => {
          const isMe = entry.user_id === user?.id;
          const name = entry.profile?.display_name ?? 'Student';
          const firstName = name.split(' ')[0];
          const initial = firstName[0]?.toUpperCase() ?? '?';

          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                isMe ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 bg-white'
              }`}
            >
              {/* Rank medal */}
              <div className="text-2xl w-8 text-center flex-shrink-0">{MEDALS[i]}</div>

              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: RANK_COLORS[i] }}
              >
                {entry.profile?.avatar_url ? (
                  <img src={entry.profile.avatar_url} alt={firstName} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>

              {/* Name + phase */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">
                  {firstName}
                  {isMe && <span className="text-indigo-500 font-semibold"> (You)</span>}
                </p>
                <p className="text-xs text-gray-400">Stage {entry.phase + 1}</p>
              </div>

              {/* XP badge */}
              <div className="flex items-center gap-1 bg-gray-900 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-bold flex-shrink-0">
                ⚡ {entry.xp}
              </div>
            </div>
          );
        })}

        {leaders.length === 0 && (
          <div className="text-center text-gray-400 py-16">
            <div className="text-5xl mb-3">📚</div>
            <p className="font-semibold">No scores yet.</p>
            <p className="text-sm mt-1">Start learning to appear here!</p>
          </div>
        )}
      </div>
    </div>
  );
}