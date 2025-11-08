import React from 'react';
import { Lightbulb, Target, ThumbsUp } from 'lucide-react';

export default function CoachPanel({ tips, keyPoints }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 md:p-6 h-[38vh] md:h-[44vh] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-amber-400" />
        <h2 className="text-white font-semibold">Coaching Insights</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
        <div className="rounded-xl border border-white/5 p-3 bg-slate-900/50">
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-indigo-400" />
            <h3 className="text-sm font-medium text-white/90">Key Points to Cover</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
            {keyPoints.length === 0 ? (
              <li className="text-slate-400">You'll see suggested points here as the conversation unfolds.</li>
            ) : (
              keyPoints.map((p, i) => <li key={i}>{p}</li>)
            )}
          </ul>
        </div>
        <div className="rounded-xl border border-white/5 p-3 bg-slate-900/50">
          <div className="flex items-center gap-2 mb-1">
            <ThumbsUp size={16} className="text-emerald-400" />
            <h3 className="text-sm font-medium text-white/90">Real-time Tips</h3>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-200">
            {tips.length === 0 ? (
              <li className="text-slate-400">We’ll nudge you with timing, structure, and clarity cues here.</li>
            ) : (
              tips.map((t, i) => <li key={i}>{t}</li>)
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
