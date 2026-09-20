'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Search, PlusCircle, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onScrollToGenerator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSearchChange,
  searchQuery = '',
  onScrollToGenerator,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      {/* Top Hazard Marquee Banner */}
      <div className="w-full bg-nb-yellow border-b-2 border-black py-1 px-4 flex items-center justify-between text-xs font-mono uppercase font-bold tracking-wider overflow-hidden">
        <div className="flex items-center gap-3 animate-pulse">
          <span className="bg-black text-nb-yellow px-1.5 py-0.5 rounded-none font-black text-[10px]">NEW</span>
          <span>⚡ AI ACTIVE RECALL ENGINE V2.0 LIVE</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <span>🧠 94% Retention vs Passive Reading</span>
          <span>🚀 Instant Chrome Extension Sync</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="bg-nb-yellow border-2 border-black p-2 shadow-brutal-sm group-hover:bg-nb-green group-hover:rotate-6 transition-all duration-200">
            <Zap className="w-6 h-6 text-black fill-black" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tighter text-black uppercase font-display leading-none">
                QUIZ<span className="bg-nb-pink text-white px-1 ml-0.5 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">FLY</span>
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-gray-700 font-bold uppercase">
              Active-Recall Hub
            </span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-black pointer-events-none stroke-[3]" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchInput}
              placeholder="Search quizzes, categories or articles..."
              className="w-full bg-nb-bg border-2 border-black py-1.5 pl-9 pr-4 text-sm font-mono text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white shadow-brutal-sm transition-all"
            />
            {localSearch && (
              <button
                onClick={() => {
                  setLocalSearch('');
                  if (onSearchChange) onSearchChange('');
                }}
                className="absolute right-2 text-xs font-mono font-bold bg-black text-white px-1.5 py-0.5 hover:bg-nb-pink"
              >
                CLEAR
              </button>
            )}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-3">
          {/* Walkthrough / Tutorial CTA */}
          <Link
            href="/walkthrough"
            className="hidden md:flex items-center gap-1.5 bg-nb-green hover:bg-emerald-400 text-black border-2 border-black px-3.5 py-1.5 text-xs font-mono font-bold shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 stroke-[2.5]" />
            <span>WALKTHROUGH / TUTORIAL</span>
          </Link>

          {/* Chrome Extension CTA */}
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-nb-yellow hover:bg-amber-300 text-black border-2 border-black px-3.5 py-1.5 text-xs font-mono font-bold shadow-brutal hover:shadow-brutal-lg hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all"
          >

            <span className="hidden sm:inline">CHROME EXTENSION</span>
            <span className="bg-black text-white text-[9px] px-1 py-0.2 rounded-none font-mono uppercase">FREE</span>
          </a>
        </div>
      </div>
    </header>
  );
};
