import { ReactLenis } from 'lenis/react'
import { useReducedMotion } from 'motion/react'

// Défilement amorti (Lenis) sur tout le site, désactivé si l'utilisateur réduit les animations.
export default function SmoothScroll({ children }) {
  const reduce = useReducedMotion()
  if (reduce) return children

  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
