import React from 'react';
import { Mic, Square, Wand2 } from 'lucide-react';

export default function RecorderControls({ isRecording, onToggle, onMock }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow ${
            isRecording
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
          }`}
        >
          {isRecording ? <Square size={16} /> : <Mic size={16} />}
          {isRecording ? 'Stop' : 'Start'} Listening
        </button>
        <p className="text-slate-300 text-sm hidden md:block">
          Your audio stays on-device. We use the browser’s speech API for transcription.
        </p>
      </div>
      <button
        onClick={onMock}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow shadow-indigo-600/30"
      >
        <Wand2 size={14} /> Insert sample question
      </button>
    </div>
  );
}
