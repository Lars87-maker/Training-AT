
import { useState } from 'react'
import RestTimer from '../widgets/RestTimer'
import Stopwatch from '../widgets/Stopwatch'
import { Card } from './common'

type RepsInTime = { kind:'repsInTime'; id:string; name:string; repsTarget:number; timeLimit:number }
type HoldTime = { kind:'holdTime'; id:string; name:string; minSeconds:number }
type TimeUnder = { kind:'timeUnder'; id:string; name:string; timeMax:number } // stopwatch should be <= timeMax
type DistanceInTime = { kind:'distanceInTime'; id:string; name:string; distanceTarget:number; timeLimit:number }
type Cooper = { kind:'cooper'; id:string; name:'Coopertest'; distanceTarget:number; timeLimit:number }
type Rope = { kind:'rope'; id:string; name:string; metersTarget:number; timeLimit:number }
type Item = RepsInTime | HoldTime | TimeUnder | DistanceInTime | Cooper | Rope

const ITEMS: Item[] = [
  { kind:'repsInTime', id:'pufront', name:'Pull-ups front grip', repsTarget:8, timeLimit:30 },
  { kind:'repsInTime', id:'puback',  name:'Pull-ups back grip',  repsTarget:8, timeLimit:30 },
  { kind:'repsInTime', id:'hiphops', name:'Hip-hops', repsTarget:40, timeLimit:60 },
  { kind:'repsInTime', id:'pushhr',  name:'Push-ups (hand release)', repsTarget:30, timeLimit:60 },
  { kind:'repsInTime', id:'situps',  name:'Sit-ups', repsTarget:60, timeLimit:120 },
  { kind:'rope', id:'rope', name:'Touwklimmen', metersTarget:10, timeLimit:90 }, // 2 × 5 m
  { kind:'holdTime', id:'wallsit', name:'One-legged wall sit', minSeconds:53 },
  { kind:'holdTime', id:'hipbridge', name:'Unilateral hip bridge', minSeconds:60 },
  { kind:'timeUnder', id:'sprint60', name:'Sprint 60 m', timeMax:8.6 },
  { kind:'cooper', id:'cooper', name:'Coopertest', distanceTarget:2900, timeLimit:12*60 }
]

export default function Test(){
  return (
    <div className="space-y-6">
      <Card title="AT – Eisentest" subtitle="Start de ingebouwde timers, voer je reps/afstanden in en zie direct of je het haalt.">
        <div className="space-y-4">
          {ITEMS.map(it => <Row key={it.id} item={it} />)}
        </div>
      </Card>
    </div>
  )
}

function Row({ item }: { item: Item }){
  switch(item.kind){
    case 'repsInTime': return <RepsInTimeRow item={item} />
    case 'holdTime': return <HoldTimeRow item={item} />
    case 'timeUnder': return <TimeUnderRow item={item} />
    case 'distanceInTime': return <DistanceInTimeRow item={item} />
    case 'rope': return <RopeRow item={item} />
    case 'cooper': return <CooperRow item={item} />
  }
}

function Section({title, children}:{title:string; children:React.ReactNode}){
  return <div className="card p-3 flex flex-col gap-2">{children}</div>
}

function PassChip({ ok }: { ok: boolean }) {
  return (
    <span
      className={`chip ${ok ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-700'}`}
    >
      {ok ? '✓ gehaald' : 'nog niet'}
    </span>
  );
}


function RepsInTimeRow({ item }: { item: RepsInTime }){
  const [reps, setReps] = useState<number>(Number(localStorage.getItem(\`test:\${item.id}:reps\`) || 0))
  const ok = reps >= item.repsTarget
  return (
    <Section title={item.name}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-gray-500">Minimaal {item.repsTarget} in {item.timeLimit}s</div>
          <div className="mt-1"><PassChip ok={ok} /></div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-ghost text-xs" onClick={()=> setReps(r=> { const v=r+1; localStorage.setItem(\`test:\${item.id}:reps\`, String(v)); return v })}>+1 rep</button>
          <input type="number" className="w-20 rounded-lg border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 p-2 text-sm" value={reps} onChange={e=> { const v=Number(e.target.value); setReps(v); localStorage.setItem(\`test:\${item.id}:reps\`, String(v)) }} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Countdown</span>
        <RestTimer seconds={item.timeLimit} />
      </div>
    </Section>
  )
}

function HoldTimeRow({ item }: { item: HoldTime }){
  const [best, setBest] = useState<number>(Number(localStorage.getItem(\`test:\${item.id}:best\`) || 0))
  const ok = best >= item.minSeconds
  return (
    <Section title={item.name}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-gray-500">Minimaal {item.minSeconds}s</div>
          <div className="mt-1"><PassChip ok={ok} /></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Stopwatch</span>
          <Stopwatch onStop={(sec)=> { if(sec>best){ setBest(sec); localStorage.setItem(\`test:\${item.id}:best\`, String(sec)) } }} />
          <span className="chip">{best}s best</span>
        </div>
      </div>
    </Section>
  )
}

function TimeUnderRow({ item }: { item: TimeUnder }){
  const [last, setLast] = useState<number>(Number(localStorage.getItem(\`test:\${item.id}:last\`) || 0))
  const ok = last > 0 && last <= item.timeMax
  return (
    <Section title={item.name}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-gray-500">Maximaal {item.timeMax}s</div>
          <div className="mt-1"><PassChip ok={ok} /></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Stopwatch</span>
          <Stopwatch onStop={(sec)=> { setLast(sec); localStorage.setItem(\`test:\${item.id}:last\`, String(sec)) }} />
          <span className="chip">{last ? \`\${last}s\` : '—'}</span>
        </div>
      </div>
    </Section>
  )
}

function RopeRow({ item }: { item: Rope }){
  const [m, setM] = useState<number>(Number(localStorage.getItem('test:rope:meters') || 0))
  const ok = m >= item.metersTarget
  return (
    <Section title={item.name}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">Touwklimmen</div>
          <div className="text-xs text-gray-500">Doel: {item.metersTarget} meter in ≤ {item.timeLimit}s (bijv. 2×5 m)</div>
          <div className="mt-1"><PassChip ok={ok} /></div>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" className="w-24 rounded-lg border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 p-2 text-sm" value={m} onChange={e=> { const v=Number(e.target.value); setM(v); localStorage.setItem('test:rope:meters', String(v)) }} />
          <span className="text-sm">m</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Countdown</span>
        <RestTimer seconds={item.timeLimit} />
      </div>
    </Section>
  )
}

function DistanceInTimeRow({ item }: { item: DistanceInTime }){
  const [dist, setDist] = useState<number>(Number(localStorage.getItem(\`test:\${item.id}:dist\`) || 0))
  const ok = dist >= item.distanceTarget
  return (
    <Section title={item.name}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-xs text-gray-500">Doel: ≥ {item.distanceTarget} m in {item.timeLimit}s</div>
          <div className="mt-1"><PassChip ok={ok} /></div>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" className="w-24 rounded-lg border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 p-2 text-sm" value={dist} onChange={e=> { const v=Number(e.target.value); setDist(v); localStorage.setItem(\`test:\${item.id}:dist\`, String(v)) }} />
          <span className="text-sm">m</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Countdown</span>
        <RestTimer seconds={item.timeLimit} />
      </div>
    </Section>
  )
}

function CooperRow({ item }: { item: Cooper }){
  const [dist, setDist] = useState<number>(Number(localStorage.getItem('test:cooper:dist') || 0))
  const ok = dist >= item.distanceTarget
  return (
    <Section title="Coopertest">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-medium">Coopertest</div>
          <div className="text-xs text-gray-500">Doel: ≥ {item.distanceTarget} m in 12 min</div>
          <div className="mt-1"><PassChip ok={ok} /></div>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" className="w-28 rounded-lg border border-gray-300 dark:border-white/10 bg-white/70 dark:bg-white/5 p-2 text-sm" value={dist} onChange={e=> { const v=Number(e.target.value); setDist(v); localStorage.setItem('test:cooper:dist', String(v)) }} />
          <span className="text-sm">m</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">Countdown</span>
        <RestTimer seconds={item.timeLimit} />
      </div>
    </Section>
  )
}
