import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Quiz } from '@/lib/types';
import { saveQuizToStore, inMemoryQuizzes } from '@/lib/quizStore';


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
