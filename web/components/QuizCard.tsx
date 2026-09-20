'use client';

import React from 'react';
import Link from 'next/link';
import { Quiz } from '@/lib/types';
import { Clock, Award, HelpCircle, ExternalLink, ArrowRight, Globe } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
}

const CATEGORY_COLORS: Record<string, string> = {
  'AI & ML': 'bg-nb-yellow text-black',
  'Web Dev': 'bg-nb-green text-black',
  'Neuroscience': 'bg-nb-pink text-white',
  'System Design': 'bg-nb-purple text-white',
  'Science': 'bg-nb-blue text-white',
  'Engineering': 'bg-nb-orange text-black',
};

export const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const categoryColorClass = CATEGORY_COLORS[quiz.category] || 'bg-nb-yellow text-black';

  return (
    <div className="group relative bg-white border-4 border-black p-5 shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between h-full">
      {/* Top Bar: Category & Source Domain */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 text-xs font-mono font-black border-2 border-black uppercase tracking-wider shadow-brutal-sm ${categoryColorClass}`}>
            {quiz.category}
          </span>

          <div className="flex items-center gap-1.5 bg-nb-bg px-2 py-0.5 border border-black text-xs font-mono font-bold text-gray-700">
            <Globe className="w-3 h-3 text-black" />
            <span className="truncate max-w-[120px]">{quiz.sourceDomain}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg leading-tight text-black group-hover:underline underline-offset-4 mb-3 line-clamp-2">
          {quiz.title}
        </h3>
      </div>

      {/* Middle & Stats Section */}
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-2 bg-nb-bg p-2.5 border-2 border-black text-center font-mono">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-600 uppercase font-bold flex items-center gap-0.5">
              <Clock className="w-3 h-3" /> EST TIME
            </span>
            <span className="text-sm font-black text-black">{quiz.estMinutes} MIN</span>
          </div>

          <div className="flex flex-col items-center justify-center border-x-2 border-black px-1">
            <span className="text-[10px] text-gray-600 uppercase font-bold flex items-center gap-0.5">
              <HelpCircle className="w-3 h-3" /> ITEMS
            </span>
            <span className="text-sm font-black text-black">{quiz.questions.length} Qs</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-[10px] text-gray-600 uppercase font-bold flex items-center gap-0.5">
              <Award className="w-3 h-3" /> AVG SCORE
            </span>
            <span className="text-sm font-black text-nb-blue">{quiz.avgScore}%</span>
          </div>
        </div>

        {/* Bottom Bar & Action Link */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-black/10">
          <span className="text-xs font-mono font-bold text-gray-500">
            Added {quiz.timeAgo}
          </span>

          <Link
            href={`/q/${quiz.id}`}
            className="inline-flex items-center gap-1.5 bg-black hover:bg-nb-yellow hover:text-black text-white font-mono font-bold text-xs px-3 py-2 border-2 border-black shadow-brutal-sm hover:shadow-none transition-all"
          >
            <span>TAKE QUIZ</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
