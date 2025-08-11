
import { useState } from 'react'
import { Card } from './common'
import { getSettingBool, setSettingBool, exportAll, importAll } from '../utils/storage'
export default function Settings(){
  const [sound, setSound] = useState(getSettingBool('sound', true))
  const [vibrate, setVibrate] = useState(getSettingBool('vibrate', true))
  const [msg, setMsg] = useState('')
  function handleExport(){ const data=exportAll(); const blob=new Blob([data],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='at-trainer-backup.json'; a.click(); URL.revokeObjectURL(url) }
  function handleImport(e: React.ChangeEvent<HTMLInputElement>){ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ importAll(String(r.result)); setMsg('Gegevens geïmporteerd. Herlaad de app.') }catch{ setMsg('Import mislukt')} }; r.readAsText(f) }
  return (<div className="space-y-6"><Card title="Instellingen"><div className="space-y-3">
    <label className="flex items-center gap-2"><input type="checkbox" checked={sound} onChange={(e)=>{ setSound(e.target.checked); setSettingBool('sound', e.target.checked) }}/>Geluid bij timers</label>
    <label className="flex items-center gap-2"><input type="checkbox" checked={vibrate} onChange={(e)=>{ setVibrate(e.target.checked); setSettingBool('vibrate', e.target.checked) }}/>Trillen (haptics)</label>
  </div></Card>
  <Card title="Data"><div className="flex flex-wrap gap-2"><button className="btn-primary" onClick={handleExport}>Exporteren</button><label className="btn-ghost cursor-pointer">Importeren<input type="file" accept="application/json" className="hidden" onChange={handleImport}/></label>{msg && <div className="text-xs text-gray-500">{msg}</div>}</div></Card></div>) }
