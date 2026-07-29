// components/HeroHeader.tsx
import React from 'react';
import Link from 'next/link';

export default function HeroHeader() {
  return (
    <header className="relative bg-gradient-to-b from-amber-50 to-orange-100/40 pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-amber-100">
      <div className="max-w-4xl mx-auto text-center">
        
        {/* Value Badge */}
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-200/70 text-amber-900 mb-6">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
          Arizona Family Adventure & Safety Planner
        </span>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Plan Safer Arizona Family Trips <br className="hidden sm:inline" />
          <span className="text-amber-700">Without the 47-Tab Research Fatigue.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Sage helps you find kid-friendly trails, heat-safe timing, bathroom stops, and simple day itineraries in minutes.
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://sage.healthandtravels.com"
            className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-xl text-white bg-amber-600 hover:bg-amber-700 shadow-sm hover:shadow-md transition-all"
          >
            ⚡ Open Sage Trip Planner
          </a>
          <Link
            href="/guides/kids-hikes"
            className="inline-flex items-center justify-center px-6 py-3.5 text-base font-medium rounded-xl text-amber-950 bg-white border border-amber-200 hover:bg-amber-50 transition-all"
          >
            🥾 Explore Kid-Friendly Trails
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-6 border-t border-amber-200/50 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">✓</span> Heat & Shade Ratings
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">✓</span> Restroom & Water Notes
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-600 font-bold">✓</span> Stroller & Toddler Fit
          </div>
        </div>

      </div>
    </header>
  );
}
