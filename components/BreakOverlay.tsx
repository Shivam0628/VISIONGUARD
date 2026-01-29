
import React, { useEffect, useState } from 'react';
import { EyeCareTip } from '../types';
import { TimerCircle } from './TimerCircle';
import { fetchEyeCareTip } from '../services/geminiService';

interface BreakOverlayProps {
  onFinish: () => void;
  duration: number;
}

export const BreakOverlay: React.FC<BreakOverlayProps> = ({ onFinish, duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [tip, setTip] = useState<EyeCareTip | null>(null);

  useEffect(() => {
    const loadTip = async () => {
      const newTip = await fetchEyeCareTip();
      setTip(newTip);
    };
    loadTip();
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-right-full duration-500 ease-out">
      <div className="w-[320px] bg-white/95 backdrop-blur-xl border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] p-6 flex flex-col items-center gap-4">
        
        {/* Header Section */}
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Vision Break</span>
            <h3 className="text-lg font-bold text-slate-800">Look Away!</h3>
          </div>
          <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {/* Compact Timer */}
        <div className="py-2">
          <TimerCircle 
            progress={timeLeft / duration} 
            timeLeft={timeLeft} 
            label="Rest" 
            color="stroke-green-500"
            size={140}
            strokeWidth={10}
          />
        </div>

        {/* AI Tip Section (Compact) */}
        <div className="w-full bg-slate-50 rounded-2xl p-4 min-h-[80px] flex flex-col justify-center">
          {tip ? (
            <div className="animate-in fade-in duration-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{tip.category} hint</p>
              <p className="text-sm text-slate-600 leading-tight font-medium italic">"{tip.tip}"</p>
            </div>
          ) : (
            <div className="space-y-2 animate-pulse">
              <div className="h-2 bg-slate-200 rounded w-1/2"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
          20-20-20 Rule Active
        </p>
      </div>
    </div>
  );
};
