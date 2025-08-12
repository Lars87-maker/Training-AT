import * as React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import phases from '../data/phases.json'
import { useLocalState } from '../utils/storage'
import RestTimer from '../widgets/RestTimer'
import FloatingTimers from '../widgets/FloatingTimers'
import { setRestSecondsFor, exerciseRestSecondsFor } from '../utils/restLogic'
import { Card } from './common'

type Item = { id: string; type: 'check' | 'note' | string; label: string }
type Day = { id: string; title: string; items: Item[] }
type Phase = { days: Day[] }
type Phases = Record<string, Phase>

function getDays(phase: any): Day[] {
  if (!phase) return []
  const days: any[] = Array.isArray(phase.days) ? phase.days : []
  return days.map((d, i) => ({
    id: d.id || `d${i+1}`,
    title: d.title || `Dag ${i+1}`,
    items: Array.isArray(d.items) ? d.items : []
  }))
}

export default function PhaseDay(){
  const { num, dayId } = useParams<{num:string; dayId:string}>()
  const navigate = useNavigate()

  // Resolve phase & days
  const phase: Phase | undefined = (phases as Phases)[`fase${num}`] as any
  const days = getDays(phase)
  const index = Math.max(0, days.findIndex(d =>
    (d.id && d.id.toLowerCase() === String(dayId||'').toLowerCase())
    || (d.title && d.title.toLowerCase().includes(String(dayId||'').toLowerCase()))
  ))
  const day = days[index] || days[0]

  // local state
  const [checks, setChecks] = useLocalState<Record<string, boolean>>(`checks:fase${num}:day:${day?.id}`, {})
  const [note, setNote] = useLocalState<string>(`note:fase${num}:day:${day?.id}`, '')
  const [keys, setKeys] = React.useState<Record<string, number>>({})
  const [autoStart, setAutoStart] = React.useState<string>('')

  React.useEffect(() => {
    // reset when day changes
    setAutoStart('')
    setKeys({})
  }, [day?.id])

  if (!day) {
    return (
      <div className="container py-6">
        <Card title={`Fase ${num}`} subtitle="Geen dag gevonden">
          <div className="flex gap-3">
            <button className="btn" onClick={() => navigate(`/fase/${num}`)}>Terug naar fase</button>
          </div>
        </Card>
      </div>
    )
  }

  const toggleCheck = (id: string, label: string) => {
    const next = { ...checks, [id]: !checks[id] }
    setChecks(next)
    // Auto start exercise rest when exercise is checked
    if (!checks[id]) {
      const key = `${day.id}:${id}`
      setKeys(k => ({ ...k, [`ex:${key}`]: (k[`ex:${key}`]||0)+1 }))
      setAutoStart(`ex:${key}`)
    }
  }

  return (<>
    <div className="container py-6">
      <Card title={day.title} subtitle={`Fase ${num} — Dag ${day.id}`}>
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
                    onChange={() => toggleCheck(it.id, it.label)}
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

        <div className="mt-4">
          <textarea
            className="w-full rounded-xl bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 p-3 text-sm"
            rows={3}
            placeholder="Notities voor deze dag…"
            value={note}
            onChange={e=> setNote(e.target.value)}
          />
        </div>
      </Card>
    </div>
    <FloatingTimers />
  </>)
}
