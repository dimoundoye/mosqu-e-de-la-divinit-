import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowUp } from 'lucide-react'
import { ease } from '../../lib/motion'
import { useT } from '../../utils/useT'
import s from './BackToTop.module.css'

// Bouton flottant « retour en haut » : apparaît après défilement, son anneau
// doré suit la progression dans la page.
export default function BackToTop() {
  const t = useT()
  const lenis = useLenis()
  const reduce = useReducedMotion()
  const { scrollY, scrollYProgress } = useScroll()
  const [show, setShow] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 600))

  const remonter = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 })
    else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className={s.button}
          onClick={remonter}
          aria-label={t('Revenir en haut de page')}
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.9 }}
          transition={{ duration: 0.45, ease: ease.out }}
        >
          <svg className={s.ring} viewBox="0 0 52 52" aria-hidden="true">
            <circle className={s.track} cx="26" cy="26" r="24" />
            <motion.circle className={s.progress} cx="26" cy="26" r="24" style={{ pathLength: scrollYProgress }} />
          </svg>
          <ArrowUp size={18} strokeWidth={1.8} aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
