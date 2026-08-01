import { supabase } from './supabase';
import { CATEGORIES } from './content';

const LOCAL_KEY = 'english_app_progress_v2';
const WORDS_PER_PHASE = 6;

// ─── Default structures ───────────────────────────────────────────────────────
function defaultPhaseSlot() {
  const slot = { flashcards: {}, pronunciations: {}, quizScores: {} };
  for (const cat of CATEGORIES) {
    slot.flashcards[cat.id]     = [];
    slot.pronunciations[cat.id] = [];
  }
  return slot;
}

function defaultProgress() {
  return {
    currentPhase: 0,
    totalXP: 0,
    streak: 0,
    lastActivity: null,
    phases: { 0: defaultPhaseSlot() },
  };
}

function ensurePhase(progress, phase) {
  if (!progress.phases) progress.phases = {};
  if (!progress.phases[phase]) progress.phases[phase] = defaultPhaseSlot();
  const slot = progress.phases[phase];
  for (const cat of CATEGORIES) {
    if (!slot.flashcards[cat.id])     slot.flashcards[cat.id]     = [];
    if (!slot.pronunciations[cat.id]) slot.pronunciations[cat.id] = [];
    if (!slot.quizScores)             slot.quizScores              = {};
  }
  return slot;
}

// Migrate old flat structure (no phases) to new phase-based one
function migrate(raw) {
  if (raw.phases) return raw;
  const slot = defaultPhaseSlot();
  if (raw.completedFlashcards) slot.flashcards = raw.completedFlashcards;
  if (raw.quizScores)          slot.quizScores  = raw.quizScores;
  return {
    currentPhase: 0,
    totalXP: raw.totalXP ?? 0,
    streak: raw.streak ?? 0,
    lastActivity: raw.lastActiveDate ?? raw.lastActivity ?? null,
    phases: { 0: slot },
  };
}

// ─── Load / Save ──────────────────────────────────────────────────────────────
export async function loadProgress(userId) {
  if (userId) {
    try {
      const { data } = await supabase
        .from('user_progress')
        .select('data')
        .eq('user_id', userId)
        .single();
      if (data?.data) return migrate(data.data);
    } catch (_) {}
  }
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) return migrate(JSON.parse(raw));
      // Also try old key
      const old = localStorage.getItem('english_app_progress');
      if (old) return migrate(JSON.parse(old));
    } catch (_) {}
  }
  return defaultProgress();
}

export async function saveProgress(progress, userId) {
  if (typeof window !== 'undefined') {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(progress)); } catch (_) {}
  }
  if (userId) {
    await supabase.from('user_progress').upsert({
      user_id: userId,
      data: progress,
      updated_at: new Date().toISOString(),
    });
  }
}

export async function resetProgress(userId) {
  const fresh = defaultProgress();
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_KEY);
      localStorage.removeItem('english_app_progress');
    } catch (_) {}
  }
  if (userId) {
    await supabase.from('user_progress').upsert({
      user_id: userId,
      data: fresh,
      updated_at: new Date().toISOString(),
    });
  }
}

// ─── XP & streak ──────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }

function addXP(progress, amount) {
  progress.totalXP = (progress.totalXP ?? 0) + amount;
  const today = todayStr();
  if (progress.lastActivity !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    progress.streak = progress.lastActivity === yesterday ? (progress.streak ?? 0) + 1 : 1;
    progress.lastActivity = today;
  }
}

// ─── Completion checks ─────────────────────────────────────────────────────────
export function isCategoryComplete(progress, phase, categoryId) {
  const slot = progress.phases?.[phase];
  if (!slot) return false;
  const f = (slot.flashcards?.[categoryId]?.length     ?? 0) >= WORDS_PER_PHASE;
  const p = (slot.pronunciations?.[categoryId]?.length ?? 0) >= WORDS_PER_PHASE;
  const qData = slot.quizScores?.[categoryId];
  const q = qData && qData.score >= qData.total; // perfect score required
  return f && p && q;
}

export function isPhaseComplete(progress, phase) {
  return CATEGORIES.every(cat => isCategoryComplete(progress, phase, cat.id));
}

export function getCompletedCategoryCount(progress, phase) {
  return CATEGORIES.filter(cat => isCategoryComplete(progress, phase, cat.id)).length;
}

// Overall progress % for a category in the current phase (flashcards + pronunciation + quiz = 3 components)
export function getCategoryProgress(progress, phase, categoryId) {
  const slot = progress.phases?.[phase];
  if (!slot) return 0;
  const f = Math.min((slot.flashcards?.[categoryId]?.length     ?? 0) / WORDS_PER_PHASE, 1);
  const p = Math.min((slot.pronunciations?.[categoryId]?.length ?? 0) / WORDS_PER_PHASE, 1);
  const qData = slot.quizScores?.[categoryId];
  const q = qData && qData.score >= qData.total ? 1 : 0;
  return Math.round(((f + p + q) / 3) * 100);
}

// ─── Actions ──────────────────────────────────────────────────────────────────
export async function markFlashcardSeen(phase, categoryId, wordIndex, userId) {
  const progress = await loadProgress(userId);
  const slot = ensurePhase(progress, phase);
  if (!slot.flashcards[categoryId].includes(wordIndex)) {
    slot.flashcards[categoryId].push(wordIndex);
    addXP(progress, 5);
    await saveProgress(progress, userId);
  }
  return progress;
}

export async function markWordPronounced(phase, categoryId, wordIndex, userId) {
  const progress = await loadProgress(userId);
  const slot = ensurePhase(progress, phase);
  if (!slot.pronunciations[categoryId].includes(wordIndex)) {
    slot.pronunciations[categoryId].push(wordIndex);
    addXP(progress, 2);
    await saveProgress(progress, userId);
  }
  return progress;
}

export async function saveQuizScore(phase, categoryId, score, total, userId) {
  const progress = await loadProgress(userId);
  const slot = ensurePhase(progress, phase);
  slot.quizScores[categoryId] = { score, total, date: todayStr() };
  addXP(progress, score * 10);
  await saveProgress(progress, userId);
  return progress;
}

export async function advancePhase(userId) {
  const progress = await loadProgress(userId);
  if (progress.currentPhase < 99) {
    progress.currentPhase += 1;
    addXP(progress, 100);
    ensurePhase(progress, progress.currentPhase);
    await saveProgress(progress, userId);
  }
  return progress;
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export function levelFromAge(age) {
  if (!age || age <= 10) return 'beginner';
  if (age <= 11) return 'intermediate';
  return 'advanced';
}
