'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Brain, Sparkles, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t-4 border-black mt-16 relative">
      {/* Hazard Stripe Top Border Accent */}
      <div className="h-3 hazard-stripe border-b-2 border-black" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-nb-yellow border-2 border-black p-1.5 shadow-brutal-sm">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-black uppercase font-display">
                QUIZ<span className="bg-nb-pink text-white px-1 border border-black ml-0.5">FLY</span>
              </span>
            </div>

            <p className="text-sm font-mono text-gray-800 leading-relaxed max-w-md border-l-4 border-black pl-3 bg-nb-bg py-2">
              AI-Powered Active-Recall Quiz Generator. Convert dense articles, research papers, and technical blogs into high-yield interactive practice questions with exact source context citations.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 bg-nb-green text-black border-2 border-black text-xs font-mono font-bold px-2 py-1 shadow-brutal-sm">
                <Brain className="w-3.5 h-3.5" /> 89% RETENTION BOOST
              </span>
              <span className="inline-flex items-center gap-1 bg-nb-purple text-white border-2 border-black text-xs font-mono font-bold px-2 py-1 shadow-brutal-sm">
                <Sparkles className="w-3.5 h-3.5" /> LLM INSTANT GEN
              </span>
              <span className="inline-flex items-center gap-1 bg-nb-blue text-white border-2 border-black text-xs font-mono font-bold px-2 py-1 shadow-brutal-sm">
                <ShieldCheck className="w-3.5 h-3.5" /> SUPABASE BACKED
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-lg uppercase tracking-wide border-b-2 border-black pb-1 inline-block bg-nb-yellow px-2">
              PLATFORM
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <Link href="/" className="hover:bg-nb-pink hover:text-white px-1 py-0.5 transition-colors font-bold inline-block border border-transparent hover:border-black">
                  → Community Feed
                </Link>
              </li>
              <li>
                <a href="#generator" className="hover:bg-nb-yellow hover:text-black px-1 py-0.5 transition-colors font-bold inline-block border border-transparent hover:border-black">
                  → URL Quiz Generator
                </a>
              </li>
              <li>
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noreferrer" className="hover:bg-nb-green hover:text-black px-1 py-0.5 transition-colors font-bold inline-block border border-transparent hover:border-black">
                  → Chrome Extension
                </a>
              </li>
              <li>
                <Link href="/q/transformers-deep-dive" className="hover:bg-nb-purple hover:text-white px-1 py-0.5 transition-colors font-bold inline-block border border-transparent hover:border-black">
                  → Featured Quiz Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Stack & Socials */}
          <div className="space-y-3">
            <h4 className="font-display font-black text-lg uppercase tracking-wide border-b-2 border-black pb-1 inline-block bg-nb-orange text-white px-2">
              SYSTEM
            </h4>
            <div className="bg-nb-bg border-2 border-black p-3 font-mono text-xs space-y-2 shadow-brutal-sm">
              <div className="flex justify-between border-b border-black/20 pb-1">
                <span>FRAMEWORK:</span>
                <span className="font-bold text-nb-blue">Next.js 16 App Router</span>
              </div>
              <div className="flex justify-between border-b border-black/20 pb-1">
                <span>STYLING:</span>
                <span className="font-bold text-nb-pink">Neo-Brutalist Tailwind</span>
              </div>
              <div className="flex justify-between">
                <span>DATABASE:</span>
                <span className="font-bold text-nb-green">Supabase PG</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-black hover:text-white border-2 border-black p-2 shadow-brutal-sm transition-all"
                aria-label="GitHub"
              >

              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white hover:bg-nb-blue hover:text-white border-2 border-black p-2 shadow-brutal-sm transition-all"
                aria-label="Twitter"
              >

              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t-2 border-black flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
          <p className="font-bold">
            © {new Date().getFullYear()} QUIZFLY. ALL RIGHTS RESERVED. BUILT FOR ACTIVE RECALL MASTERY.
          </p>
        </div>
      </div>
    </footer>
  );
};
