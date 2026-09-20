'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Brain,
  Layers,
  ExternalLink,
  MousePointer,
  FileText,
  ShieldCheck,
  Rocket,
  HelpCircle,
  PlayCircle
} from 'lucide-react';

export default function WalkthroughPage() {
  const [activeTab, setActiveTab] = useState<'website' | 'extension' | 'science'>('website');

  return (
    <div className="space-y-12 py-4 max-w-5xl mx-auto">
      {/* Top Banner Header */}
      <section className="bg-white border-4 border-black p-6 sm:p-10 shadow-brutal-xl relative overflow-hidden text-center space-y-6">
        <div className="absolute top-0 left-0 right-0 h-2 hazard-stripe" />

        <div className="inline-flex items-center gap-2 bg-nb-yellow border-2 border-black px-4 py-1.5 text-xs font-mono font-black shadow-brutal-sm uppercase">
          <Sparkles className="w-4 h-4 text-black fill-black" />
          <span>QUIZFLY USER GUIDE & TUTORIAL</span>
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-black leading-tight">
          HOW TO USE <span className="bg-nb-pink text-white px-2 border-2 border-black inline-block -rotate-1 shadow-brutal-sm">QUIZFLY</span> & EXTENSION
        </h1>

        <p className="font-mono text-sm sm:text-base text-gray-800 leading-relaxed max-w-2xl mx-auto">
          Master long-term retention by converting dense web articles, documentation, and research papers into interactive active-recall quizzes in seconds.
        </p>

        {/* Tab Selection Navigation */}
        <div className="flex flex-wrap justify-center items-center gap-3 pt-4">
          <button
            onClick={() => setActiveTab('website')}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-xs sm:text-sm font-black border-4 border-black uppercase transition-all cursor-pointer ${activeTab === 'website'
                ? 'bg-nb-green text-black shadow-brutal -translate-y-1'
                : 'bg-nb-bg text-black hover:bg-white shadow-brutal-sm'
              }`}
          >
            <Globe className="w-4 h-4 stroke-[2.5]" />
            <span>1. WEB APP GUIDE</span>
          </button>

          <button
            onClick={() => setActiveTab('extension')}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-xs sm:text-sm font-black border-4 border-black uppercase transition-all cursor-pointer ${activeTab === 'extension'
                ? 'bg-nb-yellow text-black shadow-brutal -translate-y-1'
                : 'bg-nb-bg text-black hover:bg-white shadow-brutal-sm'
              }`}
          >

            <span>2. CHROME EXTENSION</span>
          </button>

          <button
            onClick={() => setActiveTab('science')}
            className={`flex items-center gap-2 px-5 py-2.5 font-mono text-xs sm:text-sm font-black border-4 border-black uppercase transition-all cursor-pointer ${activeTab === 'science'
                ? 'bg-nb-purple text-white shadow-brutal -translate-y-1'
                : 'bg-nb-bg text-black hover:bg-white shadow-brutal-sm'
              }`}
          >
            <Brain className="w-4 h-4 stroke-[2.5]" />
            <span>3. ACTIVE RECALL SCIENCE</span>
          </button>
        </div>
      </section>

      {/* TAB CONTENT 1: WEBSITE TUTORIAL */}
      {activeTab === 'website' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-nb-bg border-4 border-black p-4 shadow-brutal flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-nb-green border-2 border-black p-2 font-mono font-black text-sm">
                01
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase">
                WEB APPLICATION WALKTHROUGH
              </h2>
            </div>
            <span className="bg-black text-nb-yellow px-2 py-1 text-xs font-mono font-bold uppercase hidden sm:inline-block">
              NO INSTALLATION NEEDED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-nb-yellow border-2 border-black flex items-center justify-center font-mono font-black text-lg shadow-brutal-sm">
                  1
                </div>
                <h3 className="font-display font-black text-lg uppercase text-black">
                  COPY ARTICLE URL
                </h3>
                <p className="font-mono text-xs text-gray-800 leading-relaxed">
                  Find any public article, documentation page, Wikipedia entry, ArXiv research paper, or blog post that you want to master.
                </p>
              </div>
              <div className="bg-nb-bg border-2 border-black p-3 font-mono text-xs space-y-1">
                <span className="font-bold text-gray-600 block">SUPPORTED URLS:</span>
                <p className="text-[11px] text-gray-800 font-semibold">• arxiv.org/abs/...<br />• wikipedia.org/wiki/...<br />• medium.com/@author/...<br />• dev.to/article/...</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-nb-pink border-2 border-black text-white flex items-center justify-center font-mono font-black text-lg shadow-brutal-sm">
                  2
                </div>
                <h3 className="font-display font-black text-lg uppercase text-black">
                  PASTE & FLY
                </h3>
                <p className="font-mono text-xs text-gray-800 leading-relaxed">
                  Paste the link into the QuizFly URL bar on the homepage and click <span className="font-bold bg-nb-green px-1">FLY & GENERATE</span>.
                </p>
              </div>
              <div className="bg-nb-bg border-2 border-black p-3 font-mono text-xs space-y-1">
                <span className="font-bold text-gray-600 block">AI PROCESS:</span>
                <p className="text-[11px] text-gray-800 font-semibold">1. Context extraction<br />2. Distractor synthesis<br />3. Source quote alignment</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-nb-green border-2 border-black flex items-center justify-center font-mono font-black text-lg shadow-brutal-sm">
                  3
                </div>
                <h3 className="font-display font-black text-lg uppercase text-black">
                  SOLVE & VERIFY
                </h3>
                <p className="font-mono text-xs text-gray-800 leading-relaxed">
                  Take the interactive quiz, receive instant score feedback, and expand source citations to double-check key facts.
                </p>
              </div>
              <div className="bg-nb-bg border-2 border-black p-3 font-mono text-xs space-y-1">
                <span className="font-bold text-gray-600 block">KEY BENEFIT:</span>
                <p className="text-[11px] text-gray-800 font-semibold">Verifiable citations eliminate AI hallucinations & build deep understanding.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EXTENSION TUTORIAL */}
      {activeTab === 'extension' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-nb-bg border-4 border-black p-4 shadow-brutal flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-nb-yellow border-2 border-black p-2 font-mono font-black text-sm">
                02
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase">
                CHROME EXTENSION TUTORIAL
              </h2>
            </div>
            <span className="bg-black text-nb-yellow px-2 py-1 text-xs font-mono font-bold uppercase hidden sm:inline-block">
              ONE-CLICK BROWSER INTEGRATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extension Step A */}
            <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-black pb-3">
                <div className="w-8 h-8 bg-nb-yellow border-2 border-black flex items-center justify-center font-mono font-black text-sm">
                  A
                </div>
                <h3 className="font-display font-black text-lg uppercase">
                  INSTALL FROM CHROME WEB STORE
                </h3>
              </div>
              <p className="font-mono text-xs text-gray-800 leading-relaxed">
                Add QuizFly to your browser extensions bar. It operates securely using Manifest V3 and requires zero complex configuration.
              </p>
              <div className="bg-nb-bg border-2 border-black p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>PERMISSION SCOPE:</span>
                  <span className="text-nb-green">ActiveTab & Storage</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>LOCAL DASHBOARD SYNC:</span>
                  <span className="text-nb-blue font-black">AUTO-ENABLED</span>
                </div>
              </div>
            </div>

            {/* Extension Step B */}
            <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-4">
              <div className="flex items-center gap-3 border-b-2 border-black pb-3">
                <div className="w-8 h-8 bg-nb-green border-2 border-black flex items-center justify-center font-mono font-black text-sm">
                  B
                </div>
                <h3 className="font-display font-black text-lg uppercase">
                  ONE-CLICK QUIZ GENERATION
                </h3>
              </div>
              <p className="font-mono text-xs text-gray-800 leading-relaxed">
                While reading any article in Chrome, click the QuizFly icon in your toolbar. The extension captures tab context and generates questions right away!
              </p>
              <div className="bg-nb-bg border-2 border-black p-4 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between font-bold">
                  <span>ACTION:</span>
                  <span className="bg-black text-white px-1.5 py-0.5">GENERATE FROM CURRENT TAB</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span>PLAYBACK:</span>
                  <span className="text-black font-black">POPUP OR WEB DASHBOARD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SCIENCE OF ACTIVE RECALL */}
      {activeTab === 'science' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-nb-bg border-4 border-black p-4 shadow-brutal flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-nb-purple text-white border-2 border-black p-2 font-mono font-black text-sm">
                03
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase">
                WHY ACTIVE RECALL WORKS
              </h2>
            </div>
            <span className="bg-nb-green text-black px-2 py-1 text-xs font-mono font-bold uppercase border border-black hidden sm:inline-block">
              +94% RETENTION GAIN
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-4">
              <h3 className="font-display font-black text-lg uppercase text-nb-pink border-b-2 border-black pb-2">
                ❌ PASSIVE READING (FLAWED)
              </h3>
              <ul className="font-mono text-xs space-y-2.5 text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>Highlighting & re-reading text creates an illusion of competence without neural retention.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✗</span>
                  <span>70% of read content is forgotten within 24 hours (The Ebbinghaus Forgetting Curve).</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-brutal space-y-4">
              <h3 className="font-display font-black text-lg uppercase text-nb-green border-b-2 border-black pb-2">
                ⚡ ACTIVE RECALL (QUIZFLY)
              </h3>
              <ul className="font-mono text-xs space-y-2.5 text-gray-800">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Forcing the brain to retrieve information strengthens neural pathways and memory consolidation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Exact source citations allow immediate correction of knowledge gaps.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CTA: LET'S START BUTTON DIRECTING BACK TO LANDING PAGE */}
      <section className="bg-white border-4 border-black p-8 sm:p-12 shadow-brutal-xl text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 hazard-stripe" />

        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-nb-green border-2 border-black px-3.5 py-1 text-xs font-mono font-black shadow-brutal-sm uppercase">
            <Zap className="w-4 h-4 text-black fill-black" />
            <span>READY TO TEST YOUR KNOWLEDGE?</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
            START GENERATING ACTIVE-RECALL QUIZZES NOW
          </h2>

          <p className="font-mono text-sm text-gray-700 leading-relaxed">
            Head back to the landing page, pick a sample quiz or paste your favorite article link to experience QuizFly in action!
          </p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-nb-yellow hover:bg-amber-300 text-black border-4 border-black px-8 py-4 font-mono font-black text-base uppercase shadow-brutal hover:shadow-brutal-lg hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            >
              <Rocket className="w-6 h-6 fill-black stroke-black" />
              <span>LET'S START</span>
              <ArrowRight className="w-6 h-6 stroke-[3]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
