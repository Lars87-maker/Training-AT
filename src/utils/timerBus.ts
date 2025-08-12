// src/utils/timerBus.ts
export type TimerKind = 'set' | 'ex';
export type TimerEvent = {
  kind: TimerKind;
  running: boolean;
  remaining: number; // seconds
  total: number;     // seconds
  id?: string;
};

const bus = new EventTarget();

export function publishTimer(ev: TimerEvent) {
  try {
    bus.dispatchEvent(new CustomEvent('timer', { detail: ev }));
  } catch {}
}

export function subscribeTimer(cb: (ev: TimerEvent) => void) {
  const handler = (e: Event) => {
    const ce = e as CustomEvent<TimerEvent>;
    cb(ce.detail);
  };
  bus.addEventListener('timer', handler as any);
  return () => bus.removeEventListener('timer', handler as any);
}
