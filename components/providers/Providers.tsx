'use client'

import { createContext, useContext, useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

export function Providers({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduced) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenisRef.current = lenis

      // Sync Lenis scroll events into ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)

      // Drive Lenis via gsap ticker so they share a clock
      const onTick = (time: number) => { lenis.raf(time * 1000) }
      gsap.ticker.add(onTick)
      gsap.ticker.lagSmoothing(0)

      return () => {
        lenis.destroy()
        gsap.ticker.remove(onTick)
        lenisRef.current = null
      }
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}
