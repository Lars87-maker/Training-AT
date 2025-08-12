
import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import rawPhases from '../data/phases.json'
import { useLocalState } from '../utils/storage'
import RestTimer from '../widgets/RestTimer'
import FloatingTimers from '../widgets/FloatingTimers'
import { setRestSecondsFor, exerciseRestSecondsFor } from '../utils/restLogic'
import { Card } from './common'
function normalizeDays(phase:any){ const out:any[]=[]; for(const d of phase.days){ const groups:Record<string,any>={}; let current=d.id; groups[current]={id:d.id, title:d.title, items:[] as any[]}; for(const it of d.items){ const m=/^Dag\s*(\d+)\b(.*)$/i.exec(it.label||''); if(m){ current=`d${m[1]}`; groups[current]={id:current, title:`Dag ${m[1]}${m[2]||''}`, items:[]}; continue } groups[current].items.push(it) } const arr=Object.values(groups) as any[]; if(arr.length===1) out.push(arr[0]); else out.push(...arr) } return out.map((d,i)=> ({...d, id:d.id||`d${i+1}`})) }
export default function PhaseDay(){
  const { num, dayId } = useParams(); const navigate = useNavigate()
  const phase=(rawPhases as any)[`fase${num}`]; const days=normalizeDays(phase)
  const dayIndex=Math.max(0, days.findIndex((d:any)=> String(d.id)===String(dayId) || String(d.title).toLowerCase().includes(String(dayId).toLowerCase())))
  const day=days[dayIndex] || days[0]
  const [checks, setChecks] = useLocalState<Record<string, boolean>>(`checks:fase${num}:day:${day.id}`, {})
  const [note, setNote] = useLocalState<string>(`notes:fase${num}:day:${day.id}`, '')
  const [setRest, setSetRest] = React.useState<Record<string, number>>({})
  const [exRest, setExRest] = React.useState<Record<string, number>>({})
  const [keys, setKeys] = React.useState<Record<string, number>>({})
  const [autoStart, setAutoStart] = React.useState<string>('')
  const toggle = (id:string, label?:string) => { setChecks(s=>({...s, [id]: !s[id]})); if(!checks[id] && label){ const sec=exerciseRestSecondsFor(label); setExRest(s=>({...s,[id]:sec})); setKeys(k=>({...k,[`ex:${id}`]:(k[`ex:${id}`]||0)+1})); setAutoStart(`ex:${id}`) } }
  const checkItems = day.items.filter((i:any)=> i.type === 'check'); const done = checkItems.filter((it:any)=> checks[`${day.id}:${it.id}`]).length; const progress = checkItems.length ? Math.round(100*done/checkItems.length) : 0
  return (<div className="space-y-4"><button className="text-sm text-gray-500 underline" onClick={()=> navigate(`/fase/${num}`)}>← Terug naar {`Fase ${num}`}</button>
    <Card title={day.title} subtitle={`Voortgang: ${progress}%`}>
      <div className="space-y-3">{day.items.map((it:any)=>{ const key=`${day.id}:${it.id}`; const defaultSet=setRest[key] ?? setRestSecondsFor(it.label); const defaultEx=exRest[key] ?? exerciseRestSecondsFor(it.label);
        return (<div key={it.id} className="flex flex-col gap-2">
          <label className="flex items-start gap-2 text-sm leading-6"><input type="checkbox" className="mt-1.5 h-4 w-4" checked={!!checks[key]} onChange={()=> toggle(key, it.label)} /><span>{it.label}</span></label>
          <div className="flex items-center justify-between gap-4 pl-6">
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-xs" onClick={()=> { setSetRest(s=> ({...s, [key]: defaultSet})); setKeys(k=> ({...k, [`set:${key}`]: (k[`set:${key}`]||0)+1})); setAutoStart(`set:${key}`) }}>Rust (sets)</button>
              <span className="chip">{defaultSet}s</span>
              <RestTimer key={`${keys[`set:${key}`]||0}`} seconds={defaultSet} autostart={autoStart===`set:${key}`} label="Rust tussen sets" busKind='set' busId={key} onDone={()=> setAutoStart('')} />
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-xs" onClick={()=> { setExRest(s=> ({...s, [key]: defaultEx})); setKeys(k=> ({...k, [`ex:${key}`]: (k[`ex:${key}`]||0)+1})); setAutoStart(`ex:${key}`) }}>Rust (oef.)</button>
              <span className="chip">{defaultEx}s</span>
              <RestTimer key={`ex-${keys[`ex:${key}`]||0}`} seconds={defaultEx} autostart={autoStart===`ex:${key}`} label="Rust tussen oefeningen" busKind='ex' busId={key} onDone={()=> setAutoStart('')} />
            </div>
          </div></div>)})}
      </div>
      <div className="mt-4"><textarea className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 p-3 text-sm" rows={3} placeholder="Notities voor deze dag…" value={note} onChange={e=> setNote(e.target.value)} /></div>
    </Card></div>) } 

  return (<>
    {/* existing render above */}
    <FloatingTimers />
  </>)



// floating timers visible on mobile
// Render at the end of the page
; (function(){})
