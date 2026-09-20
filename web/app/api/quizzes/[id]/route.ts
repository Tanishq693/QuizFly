import { NextRequest, NextResponse } from 'next/server';
import { MOCK_QUIZZES } from '@/lib/mock-data';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Quiz } from '@/lib/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const quizId = resolvedParams.id;

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, quiz: data });
      }
    }

    // Fallback to mock data
    const matchedQuiz = MOCK_QUIZZES.find((q) => q.id === quizId);

    if (matchedQuiz) {
      return NextResponse.json({
        success: true,
        quiz: matchedQuiz
      });
    }

    // Default fallback to first quiz if not matched
    return NextResponse.json({
      success: true,
      quiz: MOCK_QUIZZES[0]
    });

  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Quiz not found' },
      { status: 404 }
    );
  }
}
