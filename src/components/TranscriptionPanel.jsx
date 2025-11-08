import React from 'react';
import { FileText } from 'lucide-react';

export default function TranscriptionPanel({ transcript, isRecording }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 md:p-6 h-[38vh] md:h-[44vh] flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-indigo-400" />
          <h2 className="text-white font-semibold">Live Transcript</h2>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full border ${isRecording ? 'border-emerald-400/50 text-emerald-300 bg-emerald-400/10' : 'border-slate-500/40 text-slate-300'}`}>
          {isRecording ? 'Listening…' : 'Idle'}
        </span>
      </div>
      <div className="relative flex-1 overflow-auto rounded-xl bg-slate-900/50 border border-white/5 p-3">
        {transcript.length === 0 ? (
          <p className="text-slate-400 text-sm">Speak into your mic to see real-time transcription here.</p>
        ) : (
          <div className="space-y-2">
            {transcript.map((line, idx) => (
              <p key={idx} className="text-slate-100/90 leading-relaxed text-sm">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
