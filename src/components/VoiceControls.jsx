import React from 'react';
import { Mic, Square, Send, Loader2 } from 'lucide-react';

function Bars({ active }) {
  return (
    <div className="flex items-end gap-1 h-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-1.5 rounded-full bg-emerald-400/80 ${
            active ? 'animate-[pulse_0.9s_ease-in-out_infinite]' : 'h-1.5'
          }`}
          style={{
            animationDelay: `${i * 0.08}s`,
            height: active ? `${6 + (i % 3) * 6}px` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export default function VoiceControls({
  isListening,
  interimText,
  onStart,
  onStop,
  onSend,
  loading,
}) {
  return (
    <div className="w-full bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-3 flex items-center gap-3">
      <div className="hidden md:block"><Bars active={isListening} /></div>
      <input
        value={interimText}
        readOnly
        placeholder="Tap the mic and speak..."
        className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-sm"
      />
      <div className="flex items-center gap-2">
        {!isListening ? (
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white bg-emerald-500 hover:bg-emerald-600 transition border border-emerald-400/30"
          >
            <Mic size={18} />
            <span className="hidden sm:inline">Speak</span>
          </button>
        ) : (
          <button
            onClick={onStop}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white bg-rose-500 hover:bg-rose-600 transition border border-rose-400/30"
          >
            <Square size={18} />
            <span className="hidden sm:inline">Stop</span>
          </button>
        )}
        <button
          onClick={onSend}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-white bg-violet-500 hover:bg-violet-600 transition border border-violet-400/30 disabled:opacity-60"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
}
