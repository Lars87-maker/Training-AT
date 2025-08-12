
import { useEffect, useRef, useState } from 'react'
import { getSettingBool } from '../utils/storage'
import { publishTimer } from '../utils/timerBus'
import { requestWake, releaseWake } from '../utils/wakelock'
function beep(freq=880, duration=200){
  if(!getSettingBool('sound', true)) return
  try{ const ctx=new (window.AudioContext||(window as any).webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain(); o.type='sine'; o.frequency.value=freq; g.gain.value=.05; o.connect(g); g.connect(ctx.destination); o.start(); setTimeout(()=>{o.stop(); ctx.close()}, duration)}catch{}
  if(getSettingBool('vibrate', true) && navigator.vibrate) navigator.vibrate(100)
}
export default function RestTimer({seconds, autostart=false, label, onDone}:{seconds:number; autostart?:boolean; label?:string; onDone?:()=>void}){
  const [t,setT]=useState(seconds); const [run,setRun]=useState(false); const ref=useRef<number|null>(null)
  useEffect(()=>{ setT(seconds); if(autostart) setRun(true) },[seconds,autostart])
  useEffect(()=>{ if(busKind){ publishTimer({ kind: busKind as any, running: run, remaining: t, total: seconds, id: busId }); }
  if(!run){ if(ref.current){clearInterval(ref.current); ref.current=null}; return } requestWake(); const start=Date.now(); const startT=t;
    ref.current=window.setInterval(()=>{ const el=Math.floor((Date.now()-start)/1000); const n=Math.max(0,startT-el); setT(n); if(n===0){ clearInterval(ref.current!); ref.current=null; setRun(false); beep(660,120); setTimeout(()=>beep(880,200),180); releaseWake(); onDone&&onDone() }},250) as any
    return ()=>{ if(ref.current) clearInterval(ref.current); releaseWake() } },[run])
  const fmt=(n:number)=>`${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`
  return (<div className="flex items-center gap-2"><span className="tabular-nums text-sm font-mono" aria-live="polite">{fmt(t)}</span>
    <button onClick={()=>setRun(r=>!r)} className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs">{run?'Pause':'Start'}</button>
    <button onClick={()=>{setRun(false); setT(seconds)}} className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">Reset</button></div>)
}

// publish on time update
useEffect(()=>{ if(busKind){ publishTimer({ kind: busKind as any, running: !!(t>0 && (typeof window!=='undefined')), remaining: t, total: seconds, id: busId }); } }, [t, seconds, busKind, busId]);

useEffect(()=>{ if(busKind && t<=0){ publishTimer({ kind: busKind as any, running: false, remaining: 0, total: seconds, id: busId }); } }, [t, seconds, busKind, busId]);
