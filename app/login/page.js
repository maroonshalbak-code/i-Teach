'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

// We use a fake email behind the scenes so Supabase auth works,
// but the user only sees username + password.
function usernameToEmail(username) {
  return `${username.toLowerCase().trim()}@englishapp.local`;
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = usernameToEmail(username);

    if (mode === 'signup') {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); setLoading(false); return; }
      // Save username as display_name
      if (data?.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          display_name: username.trim(),
        });
      }
      // Auto sign in after signup (no email confirmation needed)
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password });
      if (loginErr) { setError(loginErr.message); setLoading(false); return; }
      router.push('/');
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) {
        setError('Wrong username or password.');
        setLoading(false);
        return;
      }
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-indigo-500 to-purple-600">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-3">📚</div>
        <h1 className="text-3xl font-extrabold text-white">English Learn</h1>
        <p className="text-white/80 text-sm mt-1">Vocabulary · Pronunciation · Quizzes</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6">
        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-2xl p-1">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); }}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                mode === m ? 'bg-white shadow text-indigo-600' : 'text-gray-400'
              }`}
            >
              {m === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
              autoCapitalize="none"
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
            />
            {mode === 'signup' && (
              <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-500 text-white font-bold rounded-2xl text-base disabled:opacity-60 mt-1"
          >
            {loading ? '…' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>
      </div>

      <p className="text-white/60 text-xs mt-6">Your progress is saved to your account ☁️</p>
    </div>
  );
}
