
import React, { useEffect, useState } from 'react';
import { EyeCareTip } from './types';
import { TimerCircle } from './TimerCircle';
import { fetchEyeCareTip } from './geminiService';

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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Vision Break</span>
          <h3 className="text-2xl font-black text-slate-800">Look Away Now</h3>
        </div>

        <TimerCircle 
          progress={timeLeft / duration} 
          timeLeft={timeLeft} 
          label="REST" 
          color="stroke-green-500"
          size={160}
          strokeWidth={10}
        />

        <div className="bg-slate-50 rounded-2xl p-5 w-full">
          {tip ? (
            <p className="text-sm text-slate-600 font-medium italic text-center">"{tip.tip}"</p>
          ) : (
            <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
          )}
        </div>
        
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">20 Seconds Remaining</p>
      </div>
    </div>
  );
};
