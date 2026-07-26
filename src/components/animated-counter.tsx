import { useEffect, useRef, useState } from "react"

type AnimatedCounterProps = {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 900,
  prefix = "",
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const previousValue = useRef(value)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (frame.current !== null) {
      window.cancelAnimationFrame(frame.current)
    }

    const start = performance.now()
    const initial = previousValue.current

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - (1 - progress) ** 3
      const nextValue = Math.round(initial + (value - initial) * eased)
      setDisplayValue(nextValue)

      if (progress < 1) {
        frame.current = window.requestAnimationFrame(animate)
        return
      }

      previousValue.current = value
      frame.current = null
    }

    frame.current = window.requestAnimationFrame(animate)

    return () => {
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current)
      }
    }
  }, [duration, value])

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}
