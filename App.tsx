
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, SessionStats } from './types';
import { TimerCircle } from './TimerCircle';
import { BreakOverlay } from './BreakOverlay';
import { useAudio } from './useAudio';

const WORK_DURATION = 20 * 60; // 20 minutes
const BREAK_DURATION = 20; // 20 seconds

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [stats, setStats] = useState<SessionStats>({
    breaksCompleted: 0,
    totalWorkTimeMinutes: 0,
    streak: 0
  });
  
  const { playBeep } = useAudio();
  const timerRef = useRef<any>(null);

  const requestNotifPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

  const startTimer = useCallback(() => {
    setAppState(AppState.RUNNING);
    playBeep(440, 0.1); 
  }, [playBeep]);

  const pauseTimer = useCallback(() => {
    setAppState(AppState.PAUSED);
  }, []);

  const triggerQuickTest = useCallback(() => {
    setAppState(AppState.RUNNING);
    setTimeLeft(5); 
    playBeep(440, 0.1);
  }, [playBeep]);

  const completeBreak = useCallback(() => {
    setAppState(AppState.RUNNING);
    setTimeLeft(WORK_DURATION);
    setStats(prev => ({
      ...prev,
      breaksCompleted: prev.breaksCompleted + 1,
      streak: prev.streak + 1,
      totalWorkTimeMinutes: prev.totalWorkTimeMinutes + 20
    }));
    playBeep(880, 0.4); 
    if (notifPermission === 'granted') {
      new Notification("VisionGuard", { body: "Break complete! Your eyes are rested." });
    }
  }, [playBeep, notifPermission]);

  useEffect(() => {
    if (appState === AppState.RUNNING) {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      document.title = `${mins}:${secs.toString().padStart(2, '0')} • VisionGuard`;
    } else if (appState === AppState.ON_BREAK) {
      document.title = "Resting Eyes...";
    } else {
      document.title = "VisionGuard";
    }
  }, [timeLeft, appState]);

  useEffect(() => {
    if (appState === AppState.RUNNING) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setAppState(AppState.ON_BREAK);
            playBeep(660, 0.3);
            if (notifPermission === 'granted') {
              new Notification("Time for a Vision Break!", { 
                body: "Look at something 20ft away for 20 seconds.", 
                silent: true
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [appState, playBeep, notifPermission]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col relative overflow-hidden select-none">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 opacity-50 z-50"></div>
      
      <header className="p-8 flex justify-between items-center max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
             <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-slate-800">VisionGuard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {notifPermission !== 'granted' && (
            <button onClick={requestNotifPermission} className="text-[10px] font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
              Allow Notifications
            </button>
          )}
          <div className="bg-white/70 px-4 py-2 rounded-xl border border-white shadow-sm">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Breaks Today: {stats.breaksCompleted}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10">
        <div className="bg-white rounded-[3rem] shadow-xl p-12 w-full max-w-4xl flex flex-col md:flex-row items-center gap-12 border border-white">
          <TimerCircle 
            progress={timeLeft / WORK_DURATION} 
            timeLeft={timeLeft} 
            label={appState === AppState.PAUSED ? "PAUSED" : "FOCUSING"}
            color={appState === AppState.PAUSED ? "stroke-amber-400" : "stroke-blue-600"}
            size={240}
          />
          <div className="flex-1 text-center md:text-left space-y-6">
            <h2 className="text-3xl font-black text-slate-900">Protect your vision.</h2>
            <p className="text-slate-500 font-medium">Auto-reminders every 20 minutes to prevent eye strain.</p>
            <div className="flex gap-3 justify-center md:justify-start">
              <button onClick={appState === AppState.RUNNING ? pauseTimer : startTimer} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg active:scale-95">
                {appState === AppState.RUNNING ? "Pause" : "Start Session"}
              </button>
              <button onClick={triggerQuickTest} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold active:scale-95">
                Quick Test
              </button>
            </div>
          </div>
        </div>
      </main>

      {appState === AppState.ON_BREAK && (
        <BreakOverlay duration={BREAK_DURATION} onFinish={completeBreak} />
      )}
    </div>
  );
};

export default App;
