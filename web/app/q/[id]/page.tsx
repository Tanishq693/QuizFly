'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Quiz } from '@/lib/types';
import { QuizPlayer } from '@/components/QuizPlayer';
import { MOCK_QUIZZES } from '@/lib/mock-data';
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizTakePage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuiz() {
      setLoading(true);
      try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.quiz) {
            setQuiz(data.quiz);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('API fetch failed, checking local mock data:', err);
      }

      // Fallback search in mock data
      const mockMatch = MOCK_QUIZZES.find((q) => q.id === quizId);
      if (mockMatch) {
        setQuiz(mockMatch);
      } else if (MOCK_QUIZZES.length > 0) {
        // Fallback to first quiz if not found so demo never breaks
        setQuiz(MOCK_QUIZZES[0]);
      } else {
        setError('Quiz not found');
      }

      setLoading(false);
    }

    loadQuiz();
  }, [quizId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="bg-white border-4 border-black p-8 shadow-brutal-lg text-center space-y-4 max-w-md">
          <Loader2 className="w-10 h-10 animate-spin text-black mx-auto" />
          <h2 className="font-display font-black text-2xl uppercase">LOADING ACTIVE-RECALL QUIZ</h2>
          <p className="font-mono text-xs text-gray-600">
            Preparing questions, citations, and source verification...
          </p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="bg-white border-4 border-black p-8 shadow-brutal-lg text-center space-y-4 max-w-md">
          <AlertTriangle className="w-12 h-12 text-nb-pink mx-auto stroke-[2.5]" />
          <h2 className="font-display font-black text-2xl uppercase">QUIZ NOT FOUND</h2>
          <p className="font-mono text-xs text-gray-700">
            We couldn't locate a quiz with ID <span className="font-bold text-black">{quizId}</span>.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-nb-yellow text-black border-2 border-black font-mono font-bold text-xs px-4 py-2 shadow-brutal hover:shadow-brutal-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" /> BACK TO COMMUNITY FEED
          </Link>
        </div>
      </div>
    );
  }

  return <QuizPlayer quiz={quiz} />;
}
