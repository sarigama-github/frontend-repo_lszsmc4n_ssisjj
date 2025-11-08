import React from 'react';
import { Sparkles, Mic, ShieldCheck } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-900/20 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600/90 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Mic className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white leading-tight">Interview Co-Pilot</h1>
            <p className="text-xs text-slate-300">Real-time coach for live interviews</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <ShieldCheck size={18} className="text-emerald-400" />
          <span>Private • Runs in your browser</span>
        </div>
      </div>
    </header>
  );
}
