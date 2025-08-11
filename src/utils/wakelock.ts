
let lock:any=null, count=0
export async function requestWake(){ try{ // @ts-ignore
  const wl=navigator.wakeLock; if(!wl) return; if(!lock) lock=await wl.request('screen'); count++ }catch{} }
export function releaseWake(){ try{ if(count>0) count--; if(count===0 && lock){ lock.release(); lock=null } }catch{} }
