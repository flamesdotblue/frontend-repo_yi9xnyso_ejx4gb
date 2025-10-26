import React, { useEffect, useRef } from 'react';
import { User, Bot } from 'lucide-react';

export default function ChatWindow({ messages }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="w-full h-[52vh] md:h-[58vh] bg-white/5 backdrop-blur-sm rounded-2xl p-4 overflow-y-auto border border-white/10">
      {messages.length === 0 && (
        <div className="h-full flex items-center justify-center text-center">
          <div>
            <p className="text-white/90 text-lg font-medium">Ask anything. Try:</p>
            <ul className="mt-3 text-white/70 text-sm space-y-1">
              <li>• "What's the weather like?"</li>
              <li>• "Set a reminder for 6 PM"</li>
              <li>• "Tell me a quick joke"</li>
              <li>• "Summarize the latest tech news"</li>
            </ul>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start gap-2 max-w-[85%]`}>
              {m.role !== 'user' && (
                <div className="shrink-0 mt-1 w-7 h-7 rounded-xl bg-violet-500/20 border border-violet-400/30 flex items-center justify-center text-violet-200">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm border ${
                  m.role === 'user'
                    ? 'bg-white text-gray-900 border-white/30'
                    : 'bg-violet-500/10 text-white border-violet-400/20'
                }`}
              >
                {m.text}
              </div>
              {m.role === 'user' && (
                <div className="shrink-0 mt-1 w-7 h-7 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
                  <User size={16} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
}
