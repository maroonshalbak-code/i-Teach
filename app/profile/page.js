'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { resetProgress, levelFromAge } from '../../lib/progress';

const LEVELS = [
  { value: 'beginner', label: '🌱 Beginner', desc: 'Ages 10 and under' },
  { value: 'intermediate', label: '🌿 Intermediate', desc: 'Age 11' },
  { value: 'advanced', label: '🌳 Advanced', desc: 'Age 12+' },
];

export default function ProfilePage() {
  const { user, profile, refreshProfile, loading } = useAuth();
  const router = useRouter();
  const fileRef = useRef();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [level, setLevel] = useState('beginner');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.display_name ?? '');
      setAge(profile.age ?? '');
      setLevel(profile.level ?? levelFromAge(profile.age));
      setAvatarUrl(profile.avatar_url ?? '');
    }
  }, [profile]);

  // Auto-suggest level from age
  const handleAgeChange = (val) => {
    setAge(val);
    const suggested = levelFromAge(parseInt(val));
    setLevel(suggested);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);
    setError('');
    const ext = file.name.split('.').pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
    if (uploadErr) { setError('Upload failed: ' + uploadErr.message); setUploading(false); return; }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    setAvatarUrl(data.publicUrl + '?t=' + Date.now());
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError('');
    const updates = {
      id: user.id,
      display_name: name,
      age: age ? parseInt(age) : null,
      level,
      avatar_url: avatarUrl || null,
    };
    const { error: err } = await supabase.from('profiles').upsert(updates);
    if (err) { setError(err.message); setSaving(false); return; }
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleResetProgress = async () => {
    if (!confirm('Reset all your progress? This cannot be undone.')) return;
    await resetProgress(user?.id);
    alert('Progress reset!');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-gray-400">Loading…</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="p-5 pb-16">
      <button onClick={() => router.back()} className="text-gray-400 text-sm mb-4">← Back</button>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">My Profile</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={() => fileRef.current?.click()}
          className="relative w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-4 border-indigo-300 mb-2"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">{name?.[0]?.toUpperCase() ?? '👤'}</span>
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-bold">Change</span>
          </div>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        {uploading && <p className="text-xs text-indigo-500">Uploading…</p>}
        <p className="text-xs text-gray-400 mt-1">Tap photo to change</p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-400 bg-gray-50"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => handleAgeChange(e.target.value)}
            placeholder="e.g. 11"
            min="6"
            max="18"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
          />
          <p className="text-xs text-gray-400 mt-1">We use your age to suggest the right word difficulty.</p>
        </div>

        {/* Level */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-2 block">Learning Level</label>
          <div className="flex flex-col gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                onClick={() => setLevel(l.value)}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all ${
                  level === l.value
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex-1">
                  <div className={`font-bold text-sm ${level === l.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                    {l.label}
                  </div>
                  <div className="text-xs text-gray-400">{l.desc}</div>
                </div>
                {level === l.value && <span className="text-indigo-500">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className={`w-full py-4 rounded-2xl font-bold text-base mb-3 transition-all ${
          saved ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white disabled:opacity-60'
        }`}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
      </button>

      <button
        onClick={handleResetProgress}
        className="w-full py-3 rounded-2xl border-2 border-orange-300 text-orange-500 font-semibold text-sm mb-3"
      >
        🔄 Reset Learning Progress
      </button>

      <button
        onClick={handleSignOut}
        className="w-full py-3 rounded-2xl border-2 border-red-300 text-red-500 font-semibold text-sm"
      >
        Sign Out
      </button>
    </div>
  );
}
