import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header';
import TranscriptionPanel from './components/TranscriptionPanel';
import CoachPanel from './components/CoachPanel';
import RecorderControls from './components/RecorderControls';

function useSpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
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
  }, []);

  const toggle = async () => {
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

  return { isRecording, transcript, toggle, setTranscript };
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

  return { tips, keyPoints };
}

export default function App() {
  const { isRecording, transcript, toggle, setTranscript } = useSpeechToText();
  const { tips, keyPoints } = useCoach(transcript);

  const insertMock = () => {
    const samples = [
      'Can you tell me about yourself?',
      'What are your strengths and weaknesses?',
      'Describe a time you led a project or resolved a conflict.',
      'How would you design a real-time chat system?',
    ];
    setTranscript((prev) => [...prev, samples[Math.floor(Math.random() * samples.length)]]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-4">
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
            <li>Use the sample button to try common interview questions.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
