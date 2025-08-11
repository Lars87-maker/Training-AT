
import { useEffect, useRef, useState } from 'react'
import { requestWake, releaseWake } from '../utils/wakelock'

export default function Stopwatch({
  autostart=false,
  onStop
}:{ autostart?: boolean; onStop?: (seconds:number)=>void }){
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(()=>{ if(autostart) handleStart() }, [autostart])

  function loop(){
    setElapsed(Math.floor((Date.now() - startRef.current)/1000))
    rafRef.current = requestAnimationFrame(loop)
  }

  function handleStart(){
    if(running) return
    startRef.current = Date.now() - elapsed*1000
    setRunning(true); requestWake()
    rafRef.current = requestAnimationFrame(loop)
  }
  function handleStop(){
    if(!running) return
    setRunning(false); if(rafRef.current) cancelAnimationFrame(rafRef.current); releaseWake()
    onStop && onStop(Math.floor((Date.now() - startRef.current)/1000))
  }
  function handleReset(){
    if(rafRef.current) cancelAnimationFrame(rafRef.current)
    setRunning(false); setElapsed(0); releaseWake()
  }
  const fmt = (n:number)=> `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`

  return (
    <div className="flex items-center gap-2">
      <span className="tabular-nums text-sm font-mono">{fmt(elapsed)}</span>
      {!running ? <button onClick={handleStart} className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs">Start</button>
                : <button onClick={handleStop} className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs">Stop</button>}
      <button onClick={handleReset} className="px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">Reset</button>
    </div>
  )
}
