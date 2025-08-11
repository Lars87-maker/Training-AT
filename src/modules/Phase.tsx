
import { useParams, Link } from 'react-router-dom'
import phases from '../data/phases.json'
import { Card } from './common'
function normalizeDays(phase:any){ const out:any[]=[]; for(const d of phase.days){ const groups:Record<string,any>={}; let current=d.id; groups[current]={id:d.id, title:d.title, items:[] as any[]}; for(const it of d.items){ const m=/^Dag\s*(\d+)\b(.*)$/i.exec(it.label||''); if(m){ current=`d${m[1]}`; groups[current]={id:current, title:`Dag ${m[1]}${m[2]||''}`, items:[]}; continue } groups[current].items.push(it) } const arr=Object.values(groups) as any[]; if(arr.length===1) out.push(arr[0]); else out.push(...arr) } return out.map((d,i)=> ({...d, id:d.id||`d${i+1}`})) }
export default function Phase(){ const { num } = useParams(); const phase=(phases as any)[`fase${num}`]; const days=normalizeDays(phase);
  return (<div className="space-y-6"><Card title={`Fase ${num} – Trainingsdagen`} subtitle={`${days.length} dagen`}><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{days.map((day:any)=>(<div key={day.id} className="card p-4 flex flex-col hover:shadow transition-shadow"><div className="mb-1 font-medium">{day.title}</div><Link to={`/fase/${num}/dag/${day.id}`} className="btn-primary w-max">Open dag</Link></div>))}</div></Card></div>) }
