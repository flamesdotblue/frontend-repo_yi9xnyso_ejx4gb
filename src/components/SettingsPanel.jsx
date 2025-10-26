import React from 'react';
import { Settings, Volume2 } from 'lucide-react';

export default function SettingsPanel({
  voices,
  selectedVoice,
  onVoiceChange,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  volume,
  onVolumeChange,
  autoSpeak,
  onAutoSpeakChange,
}) {
  return (
    <div className="w-full bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-white/80">
        <Settings size={18} />
        <span className="font-medium">Voice Settings</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label className="text-sm text-white/80">
          Voice
          <select
            className="mt-1 w-full bg-white/10 text-white rounded-xl px-3 py-2 outline-none border border-white/20"
            value={selectedVoice || ''}
            onChange={(e) => onVoiceChange(e.target.value)}
          >
            <option value="" className="bg-slate-900">System Default</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name} className="bg-slate-900">
                {v.name} {v.lang ? `(${v.lang})` : ''}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-white/80">
          Rate: {rate.toFixed(2)}
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={rate}
            onChange={(e) => onRateChange(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
        </label>

        <label className="text-sm text-white/80">
          Pitch: {pitch.toFixed(2)}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.05"
            value={pitch}
            onChange={(e) => onPitchChange(parseFloat(e.target.value))}
            className="w-full mt-1"
          />
        </label>

        <label className="text-sm text-white/80">
          Volume: {Math.round(volume * 100)}%
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-white/60" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full mt-1"
            />
          </div>
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-white/90 pt-1">
        <input
          type="checkbox"
          checked={autoSpeak}
          onChange={(e) => onAutoSpeakChange(e.target.checked)}
          className="accent-violet-500"
        />
        Auto-speak assistant replies
      </label>
    </div>
  );
}
