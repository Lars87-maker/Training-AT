
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from './common'
export default function Home(){
  const [offline, setOffline] = useState(!navigator.onLine)
  useEffect(()=>{ const upd=()=> setOffline(!navigator.onLine); window.addEventListener('online',upd); window.addEventListener('offline',upd); return ()=>{window.removeEventListener('online',upd); window.removeEventListener('offline',upd)} },[])
  return (<div className="space-y-6">{offline && <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs shadow">Offline modus geactiveerd</div>}
    <Card title="Welkom" subtitle="Snel overzicht"><ul className="list-disc pl-5 space-y-1 text-sm">
      <li>Volgende training: <Link to="/fase/1/dag/d1" className="underline">Fase 1 – Dag 1</Link></li><li>Laatste test: —</li><li>Tip: blijf hydrateren 💧</li></ul></Card>
    <Card title="Naar je fases"><div className="flex flex-wrap gap-3"><Link className="btn-primary" to="/fase/1">Fase 1</Link><Link className="btn-primary" to="/fase/2">Fase 2</Link><Link className="btn-primary" to="/fase/3">Fase 3</Link><Link className="btn-ghost" to="/test">Testmodule</Link></div></Card>
  </div>) }
export function Card({ title, subtitle, children }:{title?:string; subtitle?:string; children:React.ReactNode}){ return (<div className="card p-5">{(title||subtitle)&&<div className="mb-3">{title&&<h2 className="text-xl font-semibold">{title}</h2>}{subtitle&&<p className="text-sm text-gray-500">{subtitle}</p>}</div>}{children}</div>) }
