import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import TranscriptionPanel from './components/TranscriptionPanel';
import CoachPanel from './components/CoachPanel';
import RecorderControls from './components/RecorderControls';
import PresenterBar from './components/PresenterBar';

function useSpeechToText({ enabled = true } = {}) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!enabled) return; // Control window doesn't initialize mic

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript.trim();
        }
      }
      if (finalText) {
        setTranscript((prev) => [...prev, finalText]);
      }
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;

    return () => {
      try { recognition.stop(); } catch {}
    };
  }, [enabled]);

  const toggle = async () => {
    if (!enabled) return; // ignore in control window
    const rec = recognitionRef.current;
    if (!rec) {
      alert('Your browser does not support live transcription. Try Chrome on desktop.');
      return;
    }
    if (isRecording) {
      rec.stop();
      setIsRecording(false);
    } else {
      try {
        await rec.start();
        setIsRecording(true);
      } catch (e) {
        console.error(e);
        alert('Microphone permission is required.');
      }
    }
  };

  return { isRecording, transcript, toggle, setTranscript, setIsRecording };
}

function useCoach(transcript) {
  const [tips, setTips] = useState([]);
  const [keyPoints, setKeyPoints] = useState([]);

  useEffect(() => {
    if (transcript.length === 0) return;
    const last = transcript[transcript.length - 1].toLowerCase();

    const newTips = [];
    const newPoints = [];

    if (last.includes('tell me about yourself')) {
      newPoints.push('Give a concise 60–90s story: past → present → future.');
      newTips.push('Highlight 2–3 accomplishments relevant to the role.');
      newTips.push('End with why this company excites you.');
    }
    if (last.includes('strength') || last.includes('weakness')) {
      newPoints.push('Use the STAR format with concrete outcomes.');
      newTips.push('For weaknesses, show mitigation and learning.');
    }
    if (last.includes('lead') || last.includes('conflict')) {
      newPoints.push('Emphasize ownership, communication, and impact.');
      newTips.push('Quantify results where possible.');
    }
    if (last.includes('system') || last.includes('design')) {
      newPoints.push('Clarify requirements and constraints first.');
      newTips.push('Talk trade-offs, scaling, and observability.');
    }

    if (newTips.length || newPoints.length) {
      setTips((prev) => [...prev, ...newTips].slice(-8));
      setKeyPoints((prev) => [...prev, ...newPoints].slice(-8));
    }
  }, [transcript]);

  return { tips, keyPoints, setTips, setKeyPoints };
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isControlWindow = params.get('control') === '1';

  const { isRecording, transcript, toggle, setTranscript, setIsRecording } = useSpeechToText({ enabled: !isControlWindow });
  const { tips, keyPoints, setTips, setKeyPoints } = useCoach(transcript);

  const [presenterMode, setPresenterMode] = useState(false);
  const channelRef = useRef(null);

  // Setup BroadcastChannel for main/control window sync
  useEffect(() => {
    const ch = new BroadcastChannel('interview-copilot');
    channelRef.current = ch;

    ch.onmessage = (ev) => {
      const msg = ev.data || {};
      if (isControlWindow) {
        if (msg.type === 'state') {
          // mirror state in control window
          setIsRecording(msg.payload.isRecording);
          setTranscript(msg.payload.transcript);
          setTips(msg.payload.tips);
          setKeyPoints(msg.payload.keyPoints);
        }
      } else {
        if (msg.type === 'toggle') {
          toggle();
        }
      }
    };

    return () => ch.close();
  }, [isControlWindow, toggle, setIsRecording, setTranscript, setTips, setKeyPoints]);

  // Broadcast state from main window
  useEffect(() => {
    if (isControlWindow) return;
    const ch = channelRef.current;
    if (!ch) return;
    ch.postMessage({
      type: 'state',
      payload: { isRecording, transcript, tips, keyPoints },
    });
  }, [isControlWindow, isRecording, transcript, tips, keyPoints]);

  const insertMock = () => {
    const samples = [
      'Can you tell me about yourself?',
      'What are your strengths and weaknesses?',
      'Describe a time you led a project or resolved a conflict.',
      'How would you design a real-time chat system?',
    ];
    const s = samples[Math.floor(Math.random() * samples.length)];
    if (isControlWindow) {
      // send to main to append and rebroadcast
      const ch = channelRef.current;
      ch && ch.postMessage({ type: 'append', payload: s });
    } else {
      setTranscript((prev) => [...prev, s]);
    }
  };

  // Let control window request actions
  useEffect(() => {
    if (isControlWindow) return;
    const ch = channelRef.current;
    if (!ch) return;
    const listener = (ev) => {
      const msg = ev.data || {};
      if (msg.type === 'append' && typeof msg.payload === 'string') {
        setTranscript((prev) => [...prev, msg.payload]);
      }
    };
    ch.addEventListener('message', listener);
    return () => ch.removeEventListener('message', listener);
  }, [isControlWindow, setTranscript]);

  const handleToggleFromControl = () => {
    const ch = channelRef.current;
    ch && ch.postMessage({ type: 'toggle' });
  };

  const openControlWindow = () => {
    const features = 'popup=yes,width=460,height=640,menubar=no,toolbar=no,location=no,status=no';
    window.open(`${window.location.origin}${window.location.pathname}?control=1`, 'Interview Co-Pilot Control', features);
    setPresenterMode(true);
  };

  if (isControlWindow) {
    // Compact control view: no header banner, just controls and insights
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-4 space-y-3">
        <div className="text-center">
          <h1 className="text-lg font-semibold">Co-Pilot Control</h1>
          <p className="text-xs text-slate-400">Use this window while presenting or screen sharing.</p>
        </div>
        <RecorderControls isRecording={isRecording} onToggle={handleToggleFromControl} onMock={insertMock} />
        <CoachPanel tips={tips} keyPoints={keyPoints} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-4">
        <PresenterBar
          presenterMode={presenterMode}
          onToggle={() => setPresenterMode((v) => !v)}
          onOpenControl={openControlWindow}
        />

        {presenterMode && (
          <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-3 text-amber-100 text-sm">
            Tip: Keep this main window minimized or on a different desktop while you share other apps. Use the Control window (which shows in your taskbar) to manage listening and view coaching cues privately.
          </div>
        )}

        <div className="text-center py-2">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Your real-time interview assistant
          </h2>
          <p className="text-slate-300 mt-1 text-sm md:text-base">
            Listen, transcribe, and nudge you with on-point tips while you speak.
          </p>
        </div>

        <RecorderControls isRecording={isRecording} onToggle={toggle} onMock={insertMock} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TranscriptionPanel transcript={transcript} isRecording={isRecording} />
          <CoachPanel tips={tips} keyPoints={keyPoints} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-4 md:p-6">
          <h3 className="text-white font-semibold mb-2">How it works</h3>
          <ol className="list-decimal list-inside text-slate-300 text-sm space-y-1">
            <li>Click Start to allow microphone access and begin live transcription.</li>
            <li>We analyze the latest question and surface concise tips and points.</li>
            <li>Open the control window to keep guidance private during screen sharing.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
