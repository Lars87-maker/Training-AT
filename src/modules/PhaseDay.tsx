import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import phases from '../data/phases.json'
import { useLocalState } from '../utils/storage'
import RestTimer from '../widgets/RestTimer'
import FloatingTimers from '../widgets/FloatingTimers'
import { setRestSecondsFor, exerciseRestSecondsFor } from '../utils/restLogic'
import { Card } from './common'

type Item = { id: string; type?: string; label: string }
type Day = { id?: string; title?: string; items?: Item[] }
type Phase = { days?: Day[] }
type Phases = Record<string, Phase>

function normalizeDays(p: Phase | undefined): Required<Day>[] {
  const arr = (p && Array.isArray(p.days) ? p.days : []) as Day[]
  return arr.map((d, i) => ({
    id: (d && d.id ? String(d.id) : String(i+1)),
    title: (d && d.title ? String(d.title) : `Dag ${i+1}`),
    items: Array.isArray(d?.items) ? d!.items! : []
  }))
}

export default function PhaseDay(){
  const { num, dayId } = useParams<{num:string; dayId:string}>()
  const navigate = useNavigate()

  // Resolve phase & days safely
  const phase: Phase | undefined = (phases as unknown as Phases)[`fase${num}`]
  const days = normalizeDays(phase)

  // Pick day robustly:
  // 1) If URL param is a number (e.g. "1"), use as index (1-based)
  // 2) Else try exact id match
  // 3) Fallback to first day
  let index = 0
  if (dayId && /^\d+$/.test(dayId)) {
    const n = Math.max(1, Math.min(days.length, parseInt(dayId, 10)))
    index = n - 1
  } else if (dayId) {
    const i = days.findIndex(d => d.id.toLowerCase() === dayId.toLowerCase())
    index = i >= 0 ? i : 0
  }
  const day = days[index]

  // Local state per dag
  const [checks, setChecks] = useLocalState<Record<string, boolean>>(`checks:fase${num}:day:${day.id}`, {})
  const [note, setNote] = useLocalState<string>(`note:fase${num}:day:${day.id}`, '')
  const [keys, setKeys] = React.useState<Record<string, number>>({})
  const [autoStart, setAutoStart] = React.useState<string>('')

  React.useEffect(() => {
    setAutoStart('')
    setKeys({})
  }, [day.id])

  const toggleCheck = (id: string) => {
    const next = { ...checks, [id]: !checks[id] }
    setChecks(next)
    if (!checks[id]) {
      const key = `${day.id}:${id}`
      setKeys(k => ({ ...k, [`ex:${key}`]: (k[`ex:${key}`]||0)+1 }))
      setAutoStart(`ex:${key}`)
    }
  }

  return (<>
    <div className="container py-6">
      <Card title={day.title} subtitle={`Fase ${num} — Dag ${day.id}`}>
        {day.items.length === 0 ? (
          <div className="text-sm opacity-70">Geen oefeningen voor deze dag.</div>
        ) : (
          <div className="space-y-4">
            {day.items.map((it) => {
              const key = `${day.id}:${it.id}`
              const checked = !!checks[it.id]
              const defaultSet = setRestSecondsFor(it.label)
              const defaultEx = exerciseRestSecondsFor(it.label)
              return (
                <div key={key} className="exercise-row border-b border-gray-200/60 dark:border-white/10 pb-3">
                  <div className="pt-2">
                    <input
                      id={`chk-${key}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCheck(it.id)}
                      className="scale-110 accent-blue-600"
                    />
                  </div>
                  <label htmlFor={`chk-${key}`} className="title font-medium">
                    {it.label}
                  </label>
                  <div className="actions flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="btn-ghost text-xs"
                        onClick={() => { setKeys(k => ({ ...k, [`set:${key}`]: (k[`set:${key}`]||0)+1 })); setAutoStart(`set:${key}`) }}
                      >
                        Rust (sets)
                      </button>
                      <span className="chip">{defaultSet}s</span>
                      <RestTimer
                        key={`set-${keys[`set:${key}`]||0}`}
                        seconds={defaultSet}
                        label="Rust tussen sets"
                        autostart={autoStart === `set:${key}`}
                        busKind='set'
                        busId={key}
                        onDone={() => setAutoStart('')}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="btn-ghost text-xs"
                        onClick={() => { setKeys(k => ({ ...k, [`ex:${key}`]: (k[`ex:${key}`]||0)+1 })); setAutoStart(`ex:${key}`) }}
                      >
                        Rust (oef.)
                      </button>
                      <span className="chip">{defaultEx}s</span>
                      <RestTimer
                        key={`ex-${keys[`ex:${key}`]||0}`}
                        seconds={defaultEx}
                        label="Rust tussen oefeningen"
                        autostart={autoStart === `ex:${key}`}
                        busKind='ex'
                        busId={key}
                        onDone={() => setAutoStart('')}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-4">
          <textarea
            className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 p-3 text-sm"
            rows={3}
            placeholder="Notities voor deze dag…"
            value={note}
            onChange={e=> setNote(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <button className="btn" onClick={() => navigate(`/fase/${num}`)}>Terug naar fase</button>
        </div>
      </Card>
    </div>
    <FloatingTimers />
  </>)
}
