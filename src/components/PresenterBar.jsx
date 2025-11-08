import React from 'react';
import { Monitor, EyeOff, ExternalLink } from 'lucide-react';

export default function PresenterBar({ presenterMode, onToggle, onOpenControl }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-200 text-sm">
        <Monitor size={18} className="text-indigo-400" />
        <span className="hidden sm:inline">Presenter Mode</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full border ${presenterMode ? 'border-emerald-400/40 text-emerald-300 bg-emerald-400/10' : 'border-slate-500/40 text-slate-300'}`}>{presenterMode ? 'Enabled' : 'Disabled'}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenControl}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow shadow-indigo-600/30"
        >
          <ExternalLink size={14} /> Open control window
        </button>
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${presenterMode ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
        >
          <EyeOff size={14} /> {presenterMode ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
}
