import * as React from 'react'

type Props = {
  seconds: number
  label?: string
  autostart?: boolean
  onDone?: () => void
  busKind?: 'set' | 'ex'
  busId?: string
}

export default function RestTimer(props: Props) {
  const { seconds, label, autostart, onDone } = props
  const [remaining, setRemaining] = React.useState<number>(seconds)
  const [running, setRunning] = React.useState<boolean>(!!autostart)
  const intervalRef = React.useRef<number | null>(null)

  // Reset to new default seconds if prop changes
  React.useEffect(() => {
    setRemaining(seconds)
    // do not auto-start here; that is handled by autostart effect
  }, [seconds])

  // Start automatically if requested
  React.useEffect(() => {
    if (autostart) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autostart])

  React.useEffect(() => {
    return () => clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function start() {
    if (intervalRef.current !== null) return
    setRunning(true)
    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clear()
          if (onDone) onDone()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  function pause() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }

  function reset() {
    pause()
    setRemaining(seconds)
  }

  function clear() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setRunning(false)
  }

  return (
    <div className="rest-timer inline-flex items-center gap-2">
      {label ? <span className="text-xs opacity-70">{label}</span> : null}
      <span className="font-mono tabular-nums">{formatTime(remaining)}</span>
      {!running ? (
        <button className="btn-ghost text-xs" onClick={start}>Start</button>
      ) : (
        <button className="btn-ghost text-xs" onClick={pause}>Pause</button>
      )}
      <button className="btn-ghost text-xs" onClick={reset}>Reset</button>
    </div>
  )
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return m + ':' + String(r).padStart(2, '0')
}
