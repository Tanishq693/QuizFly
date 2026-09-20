import { createClient } from '@supabase/supabase-js';

// Placeholder Supabase configuration for QuizFly backend integration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-quizfly.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-quizfly-123456789';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function isSupabaseConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder-quizfly.supabase.co' &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
