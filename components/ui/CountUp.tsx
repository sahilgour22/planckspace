'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  end: number
  prefix?: string
  suffix?: string
  /** Animation duration in ms (default 1600) */
  duration?: number
  className?: string
}

/** Counts a number up from 0 when the element enters the viewport. */
export function CountUp({ end, prefix = '', suffix = '', duration = 1600, className = '' }: CountUpProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setValue(end)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - startTime) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 4)
          setValue(Math.round(ease * end))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  )
}
