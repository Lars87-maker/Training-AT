
import { useEffect, useState } from 'react'
export function useLocalState<T>(key:string, initial:T){
  const [v,setV] = useState<T>(()=>{ try{const r=localStorage.getItem(key); return r? JSON.parse(r): initial}catch{return initial} })
  useEffect(()=>{ try{localStorage.setItem(key, JSON.stringify(v))}catch{} },[key,v])
  return [v,setV] as const
}
export function getSettingBool(key:string,fallback=true){ try{const r=localStorage.getItem('settings:'+key); return r===null? fallback: JSON.parse(r)}catch{return fallback} }
export function setSettingBool(key:string,val:boolean){ try{localStorage.setItem('settings:'+key, JSON.stringify(val))}catch{} }
export function exportAll(){ const o:Record<string,string>={}; for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)!; o[k]=localStorage.getItem(k)!} return JSON.stringify(o,null,2) }
export function importAll(json:string){ const o=JSON.parse(json) as Record<string,string>; Object.entries(o).forEach(([k,v])=> localStorage.setItem(k,v)) }
