'use client'

import { useEffect, useRef, ReactNode, ElementType, CSSProperties } from 'react'

interface RevealProps {
  children: ReactNode
  /** Fraction of viewport height at which reveal triggers (default 0.9) */
  threshold?: number
  /** Extra class names for the wrapper */
  className?: string
  /** Inline styles forwarded to the wrapper element */
  style?: CSSProperties
  as?: ElementType
}

/**
 * Scroll-reveal wrapper using a diagonal notch-shaped clip-path wipe.
 * Degrades to immediate display when prefers-reduced-motion is set.
 */
export function Reveal({
  children,
  threshold = 0.9,
  className = '',
  style,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.classList.add('in')
      return
    }

    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * threshold) {
        el.classList.add('in')
        observer.disconnect()
        window.removeEventListener('scroll', check)
      }
    }

    const observer = new IntersectionObserver(check, { threshold: 0.01 })
    observer.observe(el)

    window.addEventListener('scroll', check, { passive: true })
    check()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', check)
    }
  }, [threshold])

  const TagEl = Tag as ElementType

  return (
    <TagEl ref={ref} className={`reveal ${className}`} style={style}>
      {children}
    </TagEl>
  )
}
