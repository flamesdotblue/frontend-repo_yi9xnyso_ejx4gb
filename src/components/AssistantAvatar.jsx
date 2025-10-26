import React from 'react';
import { Bot } from 'lucide-react';

export default function AssistantAvatar({ speaking = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 shadow-lg flex items-center justify-center text-white">
        <Bot size={24} />
        {speaking && (
          <span className="absolute inset-0 rounded-2xl ring-2 ring-violet-400/60 animate-ping"></span>
        )}
      </div>
      <div className="leading-tight">
        <p className="text-white font-semibold">Nova-style Assistant</p>
        <p className="text-white/70 text-sm">Your real-time voice companion</p>
      </div>
    </div>
  );
}
