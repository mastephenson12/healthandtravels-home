// components/TrailSafetyCard.tsx
import React from 'react';

export interface TrailCardProps {
  title: string;
  location: string;
  description: string;
  shadeLevel: 'High' | 'Moderate' | 'Exposed';
  hasRestrooms: boolean;
  isStrollerFriendly: boolean;
  recommendedTime: string;
  href: string;
}

export default function TrailSafetyCard({
  title,
  location,
  description,
  shadeLevel,
  hasRestrooms,
  isStrollerFriendly,
  recommendedTime,
  href,
}: TrailCardProps) {
  const shadeBadge =
    shadeLevel === 'High'
      ? 'bg-emerald-100 text-emerald-800'
      : shadeLevel === 'Moderate'
      ? 'bg-amber-100 text-amber-800'
      : 'bg-red-100 text-red-800';

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all p-6">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-amber-700 tracking-wide uppercase">
          {location}
        </span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${shadeBadge}`}>
          Shade: {shadeLevel}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-4 line-clamp-2">{description}</p>

      {/* Safety & Logistics Badges */}
      <div className="mt-auto pt-4 border-t border-slate-100 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
        <span className="px-2 py-1 bg-slate-100 rounded-md">
          ⏱️ Best Window: {recommendedTime}
        </span>
        {hasRestrooms && (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md">
            🚻 Restrooms
          </span>
        )}
        {isStrollerFriendly && (
          <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md">
            👶 Stroller Friendly
          </span>
        )}
      </div>

      <a
        href={href}
        className="mt-4 w-full text-center py-2.5 bg-slate-900 hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition-colors"
      >
        View Family Notes →
      </a>
    </div>
  );
}
