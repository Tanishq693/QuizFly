import { MOCK_QUIZZES } from '@/lib/mock-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Quiz } from '@/lib/types';

// In-memory store fallback for new quizzes during current runtime session
export const inMemoryQuizzes: Quiz[] = [...MOCK_QUIZZES];

export async function saveQuizToStore(quiz: Quiz) {
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('quizzes').insert([
        {
          id: quiz.id,
          title: quiz.title,
          source_url: quiz.sourceUrl,
          source_domain: quiz.sourceDomain,
          category: quiz.category,
          avg_score: quiz.avgScore,
          est_minutes: quiz.estMinutes,
          questions: quiz.questions,
          created_at: quiz.createdAt
        }
      ]);
    } catch (e) {
      console.warn('Supabase insert warning:', e);
    }
  }

  // Prevent duplicate insertion
  if (!inMemoryQuizzes.some((q) => q.id === quiz.id)) {
    inMemoryQuizzes.unshift(quiz);
  }
}
