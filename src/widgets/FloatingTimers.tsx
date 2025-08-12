// src/widgets/FloatingTimers.tsx
import { useEffect, useState } from 'react';
import { subscribeTimer, TimerEvent } from '../utils/timerBus';

type TState = { running: boolean; remaining: number; total: number };
const zero: TState = { running: false, remaining: 0, total: 0 };

function fmt(sec: number) {
  const s = Math.max(0, Math.round(sec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function FloatingTimers(){
  const [setT, setSetT] = useState<TState>(zero);
  const [exT,  setExT]  = useState<TState>(zero);

  useEffect(() => {
    const unsub = subscribeTimer((ev: TimerEvent) => {
      if (ev.kind === 'set') setSetT({ running: ev.running, remaining: ev.remaining, total: ev.total });
      if (ev.kind === 'ex')  setExT ({ running: ev.running, remaining: ev.remaining, total: ev.total });
    });
    return unsub;
  }, []);

  const active = setT.running || exT.running;

  useEffect(() => {
    if (active) {
      document.body.classList.add('has-floating-timer');
      return () => document.body.classList.remove('has-floating-timer');
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="floating-timer" role="status" aria-live="polite">
      <div className="pill"><span className="label">Set</span><span className="time">{fmt(setT.remaining)}</span></div>
      <div className="pill"><span className="label">Next</span><span className="time">{fmt(exT.remaining)}</span></div>
    </div>
  );
}
