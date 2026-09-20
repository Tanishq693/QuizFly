import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, quizzes: data });
      }
    }

    // Fallback to in-memory + mock quizzes
    return NextResponse.json({
      success: true,
      quizzes: inMemoryQuizzes
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      quizzes: inMemoryQuizzes
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const quiz: Quiz = await req.json();

    if (!quiz || !quiz.title || !quiz.questions) {
      return NextResponse.json(
        { success: false, error: 'Invalid quiz payload' },
        { status: 400 }
      );
    }

    await saveQuizToStore(quiz);

    return NextResponse.json({
      success: true,
      quiz
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed saving quiz' },
      { status: 500 }
    );
  }
}
