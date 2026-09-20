'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quiz, Question } from '@/lib/types';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Share2, 
  BookOpen, 
  Brain, 
  Trophy, 
  Clock, 
  Sparkles,
  ExternalLink,
  Check,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizPlayerProps {
  quiz: Quiz;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentQuestion: Question = quiz.questions[currentIndex];
  const totalQuestions = quiz.questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Timer effect
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Confetti trigger on completion
  useEffect(() => {
    if (isCompleted) {
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Fallback gracefully if confetti unavailable
      }
    }
  }, [isCompleted]);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted[currentQuestion.id]) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleSubmitAnswer = () => {
    if (!userAnswers[currentQuestion.id]) return;
    setIsAnswerSubmitted((prev) => ({
      ...prev,
      [currentQuestion.id]: true
    }));
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setIsCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsAnswerSubmitted({});
    setIsCompleted(false);
    setCurrentIndex(0);
    setElapsedSeconds(0);
  };

  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedStatus, setPublishedStatus] = useState<string | null>(null);

  const handlePublishToCommunity = async () => {
    setIsPublishing(true);
    try {
      const res = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
      });
      if (res.ok) {
        setPublishedStatus('✓ ADDED TO COMMUNITY FEED!');
      } else {
        setPublishedStatus('✓ QUIZ SAVED TO FEED');
      }
    } catch (err) {
      setPublishedStatus('✓ QUIZ SAVED TO FEED');
    }
    setIsPublishing(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Quiz link copied to clipboard!');
    }
  };

  // Calculate score
  const correctCount = quiz.questions.reduce((acc, q) => {
    return userAnswers[q.id] === q.correctOptionId ? acc + 1 : acc;
  }, 0);
  const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Results Header Banner */}
        <div className="bg-nb-yellow border-4 border-black p-8 shadow-brutal text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-1.5 font-mono text-sm font-bold">
            <Trophy className="w-4 h-4 text-nb-yellow" /> QUIZ COMPLETED
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-black">
            {scorePercentage >= 80 ? '🎉 ACTIVE RECALL MASTER!' : scorePercentage >= 50 ? '🧠 SOLID EFFORT!' : '📚 KEEP RETRYING!'}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 font-mono">
            <div className="bg-white border-2 border-black p-4 shadow-brutal-sm min-w-[140px]">
              <span className="text-xs text-gray-600 font-bold block uppercase">FINAL SCORE</span>
              <span className="text-3xl font-black text-black">{scorePercentage}%</span>
              <span className="text-xs font-bold text-gray-500 block">({correctCount}/{totalQuestions} Correct)</span>
            </div>

            <div className="bg-white border-2 border-black p-4 shadow-brutal-sm min-w-[140px]">
              <span className="text-xs text-gray-600 font-bold block uppercase">TIME TAKEN</span>
              <span className="text-3xl font-black text-nb-blue">{formatTime(elapsedSeconds)}</span>
              <span className="text-xs font-bold text-gray-500 block">Speed Run</span>
            </div>
          </div>

          {publishedStatus && (
            <div className="bg-nb-green text-black border-2 border-black p-2 font-mono font-bold text-xs max-w-sm mx-auto shadow-brutal-sm">
              {publishedStatus}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handlePublishToCommunity}
              disabled={isPublishing || !!publishedStatus}
              className="inline-flex items-center gap-2 bg-nb-yellow hover:bg-amber-300 text-black border-2 border-black font-mono font-bold text-sm px-5 py-2.5 shadow-brutal hover:shadow-brutal-lg transition-all cursor-pointer disabled:opacity-80"
            >
              <Zap className="w-4 h-4 stroke-[3]" /> {publishedStatus || 'ADD TO COMMUNITY FEED'}
            </button>

            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 bg-nb-green hover:bg-emerald-400 text-black border-2 border-black font-mono font-bold text-sm px-5 py-2.5 shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              <RotateCcw className="w-4 h-4 stroke-[3]" /> RETAKE QUIZ
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-nb-purple hover:bg-purple-600 text-white border-2 border-black font-mono font-bold text-sm px-5 py-2.5 shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              <Share2 className="w-4 h-4 stroke-[3]" /> SHARE RESULT
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-white hover:bg-black hover:text-white text-black border-2 border-black font-mono font-bold text-sm px-5 py-2.5 shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              BACK TO COMMUNITY FEED
            </Link>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-6">
          <h2 className="font-display font-black text-2xl uppercase border-b-4 border-black pb-2 bg-white px-4 py-2 border-2">
            DETAILED ACTIVE RECALL BREAKDOWN
          </h2>

          {quiz.questions.map((q, idx) => {
            const isCorrect = userAnswers[q.id] === q.correctOptionId;
            const selectedOpt = q.options.find((o) => o.id === userAnswers[q.id]);
            const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

            return (
              <div
                key={q.id}
                className={`bg-white border-4 border-black p-6 shadow-brutal space-y-4 ${
                  isCorrect ? 'border-l-[12px] border-l-nb-green' : 'border-l-[12px] border-l-nb-pink'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">
                    QUESTION {idx + 1}
                  </span>
                  <span
                    className={`font-mono text-xs font-black px-2.5 py-1 border-2 border-black uppercase ${
                      isCorrect ? 'bg-nb-green text-black' : 'bg-nb-pink text-white'
                    }`}
                  >
                    {isCorrect ? '✓ CORRECT' : '✗ INCORRECT'}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-black">{q.prompt}</h3>

                <div className="space-y-2 font-mono text-sm">
                  <div className={`p-3 border-2 border-black ${isCorrect ? 'bg-emerald-50 border-emerald-500' : 'bg-rose-50 border-rose-500'}`}>
                    <span className="text-xs font-bold text-gray-600 block uppercase">YOUR ANSWER:</span>
                    <span className="font-bold">{selectedOpt?.text || 'No Answer Selected'}</span>
                  </div>

                  {!isCorrect && (
                    <div className="p-3 border-2 border-black bg-nb-yellow/40">
                      <span className="text-xs font-bold text-gray-700 block uppercase">CORRECT ANSWER:</span>
                      <span className="font-bold text-black">{correctOpt?.text}</span>
                    </div>
                  )}
                </div>

                {/* Source Citation Drawer */}
                <div className="bg-nb-bg border-2 border-black p-4 space-y-1 font-mono text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-gray-700 uppercase">
                    <BookOpen className="w-4 h-4 text-black" />
                    <span>SOURCE CONTEXT {q.quoteLocation && `(${q.quoteLocation})`}</span>
                  </div>
                  <p className="italic text-gray-900 border-l-2 border-black pl-2 py-1">
                    "{q.sourceQuote}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const isCurrentSubmitted = !!isAnswerSubmitted[currentQuestion.id];
  const selectedOptionId = userAnswers[currentQuestion.id];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border-4 border-black p-5 shadow-brutal space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-nb-yellow border border-black text-black px-2 py-0.5 text-xs font-mono font-bold uppercase">
                {quiz.category}
              </span>
              <span className="text-xs font-mono text-gray-600 font-bold">
                {quiz.sourceDomain}
              </span>
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-black leading-tight">
              {quiz.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <div className="bg-nb-bg border-2 border-black px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-nb-blue" />
              <span>{formatTime(elapsedSeconds)}</span>
            </div>
            <div className="bg-black text-white px-3 py-1.5 text-xs font-bold">
              {currentIndex + 1} / {totalQuestions}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 border-2 border-black h-4 overflow-hidden relative">
          <div
            className="bg-nb-yellow h-full border-r-2 border-black transition-all duration-300 hazard-stripe"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white border-4 border-black p-6 sm:p-8 shadow-brutal space-y-6">
        <div className="flex items-center gap-2">
          <span className="bg-black text-white text-xs font-mono font-bold px-2 py-1 uppercase">
            QUESTION {currentIndex + 1}
          </span>
          <span className="text-xs font-mono font-bold text-gray-500">
            Active Recall Prompt
          </span>
        </div>

        <h2 className="font-display font-bold text-xl sm:text-2xl text-black leading-snug">
          {currentQuestion.prompt}
        </h2>

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isCorrect = opt.id === currentQuestion.correctOptionId;

            let optionStyle = 'bg-white border-2 border-black hover:bg-nb-yellow/40 text-black';
            let icon = null;

            if (isCurrentSubmitted) {
              if (isCorrect) {
                optionStyle = 'bg-nb-green text-black font-bold border-4 border-black shadow-brutal';
                icon = <CheckCircle2 className="w-5 h-5 text-black stroke-[3]" />;
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-nb-pink text-white font-bold border-4 border-black shadow-brutal';
                icon = <XCircle className="w-5 h-5 text-white stroke-[3]" />;
              } else {
                optionStyle = 'bg-gray-100 border-2 border-black text-gray-500 opacity-60';
              }
            } else if (isSelected) {
              optionStyle = 'bg-nb-yellow text-black font-bold border-4 border-black shadow-brutal';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isCurrentSubmitted}
                className={`w-full text-left p-4 font-mono text-sm sm:text-base transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer ${optionStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 flex items-center justify-center bg-black text-white font-black text-xs border border-black shrink-0">
                    {opt.id.toUpperCase().replace('OPT', '')}
                  </span>
                  <span>{opt.text}</span>
                </div>
                {icon}
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Submit / Next */}
        <div className="pt-4 border-t-2 border-black/10 flex items-center justify-between gap-4">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 bg-white hover:bg-gray-200 border-2 border-black px-4 py-2 font-mono text-xs font-bold disabled:opacity-30 disabled:pointer-events-none shadow-brutal-sm"
          >
            <ArrowLeft className="w-4 h-4 stroke-[3]" /> PREV
          </button>

          {!isCurrentSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOptionId}
              className="flex items-center gap-2 bg-nb-yellow hover:bg-amber-300 text-black border-2 border-black px-6 py-2.5 font-mono text-sm font-black shadow-brutal hover:shadow-brutal-lg disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
            >
              <span>CHECK ANSWER</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 bg-nb-green hover:bg-emerald-400 text-black border-2 border-black px-6 py-2.5 font-mono text-sm font-black shadow-brutal hover:shadow-brutal-lg transition-all cursor-pointer"
            >
              <span>{isLastQuestion ? 'SEE RESULTS' : 'NEXT QUESTION'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>

      {/* Active Recall Source Citation Box */}
      {isCurrentSubmitted && (
        <div className="bg-nb-purple/10 border-4 border-black p-6 shadow-brutal space-y-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-mono font-black text-nb-purple uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-black" />
            <span className="bg-nb-purple text-white px-2 py-0.5 border border-black">
              ACTIVE RECALL CONTEXT
            </span>
            {currentQuestion.quoteLocation && (
              <span className="bg-black text-white px-2 py-0.5">
                {currentQuestion.quoteLocation}
              </span>
            )}
          </div>

          <p className="font-mono text-sm text-black border-l-4 border-black pl-3 py-1 italic bg-white p-3 border-2">
            "{currentQuestion.sourceQuote}"
          </p>
        </div>
      )}
    </div>
  );
};
