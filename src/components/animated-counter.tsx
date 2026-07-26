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
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const initial = displayValue

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start
      const progress = Math.min(1, elapsed / duration)
      const eased = 1 - (1 - progress) ** 3
      setDisplayValue(Math.round(initial + (value - initial) * eased))

      if (progress < 1) {
        frame.current = window.requestAnimationFrame(animate)
      }
    }

    frame.current = window.requestAnimationFrame(animate)

    return () => {
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current)
      }
    }
  }, [duration, value, displayValue])

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  )
}
