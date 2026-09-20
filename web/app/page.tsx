'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Quiz } from '@/lib/types';
import { QuizCard } from '@/components/QuizCard';
import { MOCK_QUIZZES } from '@/lib/mock-data';
import { 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Brain, 
  CheckCircle2, 
  Globe, 
  BookOpen, 
  Layers, 
  Flame,
  Loader2,
  TrendingUp,
  AlertTriangle,
  XCircle
} from 'lucide-react';

const CATEGORIES = ['All', 'AI & ML', 'Web Dev', 'Neuroscience', 'System Design', 'Science'];

const SAMPLE_URLS = [
  { label: '🤖 Attention Is All You Need', url: 'https://arxiv.org/abs/1706.03762' },
  { label: '⚛️ React Server Components', url: 'https://react.dev/blog/2023/03/22/react-labs' },
  { label: '🧠 Neuroscience of Memory', url: 'https://nature.com/articles/neuro-memory-retention' },
];

export default function LandingPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES);
  const [urlInput, setUrlInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'score' | 'time'>('recent');

  const GENERATION_LOGS = [
    'Connecting to source URL and fetching article context...',
    'Analyzing text structure and highlighting core thesis...',
    'Formulating 3-5 active recall question prompts...',
    'Synthesizing exact source quotes & page location citations...',
    'Finalizing Neo-Brutalist QuizFly bundle...'
  ];

  // Fetch quizzes from API or fallback
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await fetch('/api/quizzes');
        if (res.ok) {
          const data = await res.json();
          if (data.quizzes && data.quizzes.length > 0) {
            setQuizzes(data.quizzes);
          }
        }
      } catch (err) {
        console.error('Failed fetching quizzes from API, using mock data:', err);
      }
    }
    fetchQuizzes();
  }, []);

  const handleGenerateQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim() || isGenerating) return;

    setIsGenerating(true);
    setApiError(null);
    setGenerationStep(0);

    // Simulate progress log step updates
    const logInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < GENERATION_LOGS.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput })
      });

      clearInterval(logInterval);
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.quiz && data.quiz.id) {
        router.push(`/q/${data.quiz.id}`);
        return;
      }

      // Display explicit error banner when API returns error or missing key
      setIsGenerating(false);
      setApiError(data.error || 'Failed generating AI active recall quiz from the server.');

    } catch (err: any) {
      console.error('Generation request failed:', err);
      clearInterval(logInterval);
      setIsGenerating(false);
      setApiError(err.message || 'Unable to reach local QuizFly API server at /api/generate');
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
  };

  // Filter & Sort Quizzes
  const filteredQuizzes = quizzes
    .filter((q) => {
      const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
      const matchesSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.sourceDomain.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'score') return b.avgScore - a.avgScore;
      if (sortBy === 'time') return a.estMinutes - b.estMinutes;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-16 py-4">
      {/* SECTION 1: HERO / URL QUIZ GENERATOR */}
      <section id="generator" className="relative bg-white border-4 border-black p-6 sm:p-10 shadow-brutal-xl overflow-hidden">
        {/* Background Hazard Stripe Banner Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 hazard-stripe" />

        <div className="max-w-3xl mx-auto text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 bg-nb-yellow border-2 border-black px-3.5 py-1 text-xs font-mono font-black shadow-brutal-sm uppercase">
            <Sparkles className="w-4 h-4 text-black fill-black" />
            <span>ACTIVE RECALL ENGINE 2.0</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-[1.05] text-black">
            TURN ANY ARTICLE INTO AN{' '}
            <span className="bg-nb-yellow px-2 border-2 border-black inline-block -rotate-1 shadow-brutal-sm">
              ACTIVE-RECALL
            </span>{' '}
            QUIZ IN 5 SECONDS
          </h1>

          <p className="font-mono text-sm sm:text-base text-gray-800 leading-relaxed max-w-2xl mx-auto">
            Stop passive reading. Paste any URL or article link below to instantly generate interactive multiple-choice questions with verified source context citations.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleGenerateQuiz} className="space-y-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Globe className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none stroke-[2.5]" />
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Paste article URL (e.g. https://wikipedia.org/...)"
                  className="w-full bg-nb-bg border-4 border-black py-3.5 pl-11 pr-4 text-sm font-mono text-black font-bold placeholder-gray-500 focus:outline-none focus:bg-white shadow-brutal focus:shadow-brutal-lg transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="bg-nb-green hover:bg-emerald-400 text-black border-4 border-black px-6 py-3.5 font-mono font-black text-sm uppercase shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>FLYING...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-black stroke-black" />
                    <span>FLY & GENERATE</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Sample Preset Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono">
            <span className="font-bold text-gray-600 uppercase">TRY EXAMPLES:</span>
            {SAMPLE_URLS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(sample.url)}
                className="bg-nb-bg hover:bg-nb-yellow border-2 border-black px-2.5 py-1 font-bold transition-all shadow-brutal-sm cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Explicit Error Banner Alert */}
          {apiError && (
            <div className="mt-6 bg-nb-pink text-white border-4 border-black p-5 shadow-brutal text-left space-y-2 animate-fadeIn relative">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 uppercase flex items-center gap-1.5 border border-white">
                  <AlertTriangle className="w-4 h-4 text-nb-yellow" /> GENERATION ERROR
                </span>
                <button
                  onClick={() => setApiError(null)}
                  className="font-mono text-xs font-bold bg-white text-black px-2 py-0.5 border border-black hover:bg-nb-yellow"
                >
                  DISMISS
                </button>
              </div>
              <p className="font-mono text-xs font-bold text-white border-l-4 border-black pl-3 py-1 bg-black/40">
                {apiError}
              </p>
            </div>
          )}

          {/* Real-time LLM Generation Loader Drawer */}
          {isGenerating && !apiError && (
            <div className="mt-6 bg-nb-purple/10 border-4 border-black p-6 shadow-brutal text-left space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="bg-nb-purple text-white font-mono text-xs font-black px-2.5 py-1 border border-black uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI QUIZ GENERATOR RUNNING
                </span>
                <span className="font-mono text-xs font-bold text-black">
                  {generationStep + 1} / {GENERATION_LOGS.length}
                </span>
              </div>

              {/* Hazard Loading Progress Line */}
              <div className="w-full bg-gray-200 border-2 border-black h-3 overflow-hidden">
                <div
                  className="h-full bg-nb-yellow hazard-stripe transition-all duration-300"
                  style={{ width: `${((generationStep + 1) / GENERATION_LOGS.length) * 100}%` }}
                />
              </div>

              <p className="font-mono text-xs font-bold text-black border-l-4 border-black pl-3 py-1 bg-white">
                → {GENERATION_LOGS[generationStep]}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: HOW IT WORKS BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-3 hover:-translate-y-1 transition-all">
          <div className="w-10 h-10 bg-nb-yellow border-2 border-black flex items-center justify-center font-mono font-black text-lg shadow-brutal-sm">
            01
          </div>
          <h3 className="font-display font-black text-xl uppercase text-black">
            1. PASTE ANY ARTICLE URL
          </h3>
          <p className="font-mono text-xs text-gray-800 leading-relaxed">
            Feed QuizFly any blog post, Wikipedia page, or research paper link or use our Chrome extension directly while browsing.
          </p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-3 hover:-translate-y-1 transition-all">
          <div className="w-10 h-10 bg-nb-green border-2 border-black flex items-center justify-center font-mono font-black text-lg shadow-brutal-sm">
            02
          </div>
          <h3 className="font-display font-black text-xl uppercase text-black">
            2. AI GENERATES ACTIVE RECALL Qs
          </h3>
          <p className="font-mono text-xs text-gray-800 leading-relaxed">
            Our LLM extracts core concepts, creates tricky distractors, and maps precise source quote citations for instant verification.
          </p>
        </div>

        <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-3 hover:-translate-y-1 transition-all">
          <div className="w-10 h-10 bg-nb-pink border-2 border-black text-white flex items-center justify-center font-mono font-black text-lg shadow-brutal-sm">
            03
          </div>
          <h3 className="font-display font-black text-xl uppercase text-black">
            3. TEST & BOOST RETENTION
          </h3>
          <p className="font-mono text-xs text-gray-800 leading-relaxed">
            Active retrieval testing locks information into long-term memory with up to 94% higher retention than passive reading.
          </p>
        </div>
      </section>

      {/* SECTION 3: COMMUNITY QUIZ FEED */}
      <section className="space-y-6">
        {/* Header & Controls */}
        <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-4 border-black pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-nb-green text-black px-2 py-0.5 text-xs font-mono font-bold border border-black uppercase">
                  COMMUNITY HUB
                </span>
                <span className="text-xs font-mono font-bold text-gray-600">
                  {filteredQuizzes.length} Quizzes Available
                </span>
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                EXPLORE COMMUNITY QUIZZES
              </h2>
            </div>

            {/* Sort & Search Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter community..."
                  className="bg-nb-bg border-2 border-black py-1.5 pl-9 pr-3 text-xs font-mono font-bold text-black focus:outline-none focus:bg-white shadow-brutal-sm"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-nb-bg border-2 border-black py-1.5 px-3 text-xs font-mono font-bold text-black focus:outline-none shadow-brutal-sm cursor-pointer"
              >
                <option value="recent">Sort: Most Recent</option>
                <option value="score">Sort: Highest Avg Score</option>
                <option value="time">Sort: Quickest (Min Time)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 font-mono text-xs font-black border-2 border-black uppercase transition-all cursor-pointer ${
                    isActive
                      ? 'bg-nb-yellow text-black shadow-brutal'
                      : 'bg-nb-bg text-black hover:bg-white shadow-brutal-sm'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz Grid */}
        {filteredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="bg-white border-4 border-black p-12 text-center shadow-brutal space-y-4">
            <Brain className="w-12 h-12 text-black mx-auto stroke-[2]" />
            <h3 className="font-display font-black text-2xl uppercase">NO QUIZZES FOUND</h3>
            <p className="font-mono text-sm text-gray-700 max-w-md mx-auto">
              No quizzes match your current category or search query. Try clearing filters or generate a new quiz from any URL above!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="bg-nb-yellow text-black border-2 border-black font-mono font-bold text-xs px-4 py-2 shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              RESET ALL FILTERS
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
