import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AssistantAvatar from './components/AssistantAvatar';
import ChatWindow from './components/ChatWindow';
import VoiceControls from './components/VoiceControls';
import SettingsPanel from './components/SettingsPanel';

function supportsSpeech() {
  const sr = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  return Boolean(sr) && Boolean(synth);
}

function useVoices() {
  const [voices, setVoices] = useState([]);

  const load = useCallback(() => {
    const list = window.speechSynthesis?.getVoices?.() || [];
    setVoices(list);
  }, []);

  useEffect(() => {
    load();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, [load]);

  return voices;
}

function generateReply(input) {
  const text = input.trim().toLowerCase();
  const now = new Date();

  if (!text) return "I'm here. How can I help?";

  if (/(hi|hello|hey)\b/.test(text)) {
    return "Hey! I'm listening. What would you like to do?";
  }

  if (/time|date/.test(text)) {
    return `It's ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} on ${now.toLocaleDateString()}.`;
  }

  if (/joke/.test(text)) {
    return "Here you go: I told my computer I needed a break, and it said: 'No problem — I'll go to sleep.'";
  }

  if (/weather/.test(text)) {
    return "I can't check live weather without an internet API here, but you can say a city and I can suggest what to wear!";
  }

  if (/remind|reminder|remember/.test(text)) {
    return "Reminder noted. In this demo, I won't notify you later — but I saved it in this chat so you won't forget.";
  }

  if (/news|update/.test(text)) {
    return "For the latest news I'd normally fetch a feed, but in this demo I can summarize anything you paste here.";
  }

  if (/who are you|your name/.test(text)) {
    return "I'm a Nova-style voice assistant built for the web — fast, friendly, and private.";
  }

  return "Got it. I can answer general questions, tell time, make small talk, and read replies aloud. What next?";
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [interimText, setInterimText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  const voices = useVoices();
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const recognitionRef = useRef(null);
  const speakingRef = useRef(false);

  const voiceObj = useMemo(() => {
    if (!selectedVoice) return null;
    return voices.find((v) => v.name === selectedVoice) || null;
  }, [voices, selectedVoice]);

  const speak = useCallback(
    (text) => {
      if (!window.speechSynthesis) return;
      const utter = new SpeechSynthesisUtterance(text);
      if (voiceObj) utter.voice = voiceObj;
      utter.rate = rate;
      utter.pitch = pitch;
      utter.volume = volume;
      speakingRef.current = true;
      utter.onend = () => {
        speakingRef.current = false;
      };
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    },
    [voiceObj, rate, pitch, volume]
  );

  const addMessage = useCallback((role, text) => {
    setMessages((prev) => [...prev, { role, text }]);
  }, []);

  const onFinalizeTranscript = useCallback(
    async (finalText) => {
      const clean = finalText.trim();
      if (!clean) return;
      addMessage('user', clean);
      setInterimText('');
      setLoading(true);

      // Demo: local reply generator; swap with backend or LLM if desired
      const reply = generateReply(clean);
      addMessage('assistant', reply);
      if (autoSpeak) speak(reply);

      setLoading(false);
    },
    [addMessage, autoSpeak, speak]
  );

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) {
          onFinalizeTranscript(res[0].transcript);
        } else {
          interim += res[0].transcript;
        }
      }
      setInterimText(interim);
    };

    rec.onerror = () => {
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }, [onFinalizeTranscript]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop?.();
  }, []);

  const manualSend = useCallback(() => {
    const clean = interimText.trim();
    if (!clean) return;
    onFinalizeTranscript(clean);
  }, [interimText, onFinalizeTranscript]);

  useEffect(() => {
    if (!supportsSpeech()) {
      addMessage(
        'assistant',
        'This browser may not fully support speech recognition and speech synthesis. Try Chrome on desktop for best results.'
      );
    } else {
      addMessage('assistant', 'Hello! Tap the mic and tell me what you need.');
    }
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-fuchsia-600/10 to-emerald-600/10 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <AssistantAvatar speaking={speakingRef.current} />
          <div className="text-right hidden md:block">
            <p className="text-sm text-white/60">Demo voice assistant</p>
            <p className="text-xs text-white/40">No data leaves your browser</p>
          </div>
        </div>

        <ChatWindow messages={messages} />

        <div className="mt-4">
          <VoiceControls
            isListening={isListening}
            interimText={interimText}
            onStart={startListening}
            onStop={stopListening}
            onSend={manualSend}
            loading={loading}
          />
        </div>

        <div className="mt-4">
          <SettingsPanel
            voices={voices}
            selectedVoice={selectedVoice}
            onVoiceChange={setSelectedVoice}
            rate={rate}
            onRateChange={setRate}
            pitch={pitch}
            onPitchChange={setPitch}
            volume={volume}
            onVolumeChange={setVolume}
            autoSpeak={autoSpeak}
            onAutoSpeakChange={setAutoSpeak}
          />
        </div>

        <footer className="mt-8 text-center text-white/40 text-xs">
          Built for the web — inspired by Nova-style voice interactions
        </footer>
      </div>
    </div>
  );
}
