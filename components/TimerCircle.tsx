
import React from 'react';

interface TimerCircleProps {
  progress: number; // 0 to 1
  timeLeft: number;
  label: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const TimerCircle: React.FC<TimerCircleProps> = ({ 
  progress, 
  timeLeft, 
  label, 
  size = 280, 
  strokeWidth = 12,
  color = "stroke-blue-500"
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - progress * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Dynamically scale text based on size
  const timeTextSize = size < 200 ? 'text-2xl' : 'text-5xl';
  const labelTextSize = size < 200 ? 'text-[8px]' : 'text-sm';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="stroke-slate-100"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`${color} transition-all duration-300 ease-linear`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className={`${timeTextSize} font-bold text-slate-800 tracking-tighter`}>
          {minutes > 0 ? `${minutes}:` : ''}{seconds.toString().padStart(2, '0')}
        </span>
        <span className={`${labelTextSize} font-bold text-slate-400 mt-0.5 uppercase tracking-widest`}>
          {label}
        </span>
      </div>
    </div>
  );
};
