import { Suspense, useEffect, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Footer from './Footer'
import Logo from '../ui/Logo'
import Pattern from '../ui/Pattern'
import { PageContext } from './pageContext'
import { curtain, ease, pageEnterDelay } from '../../lib/motion'
import s from './PageShell.module.css'

const SUBTITLE = 'Masdjidou Rabbani'

// Rideau d'ouverture, au premier chargement : le logo s'installe, puis le
// rideau vert sapin se lève sur la page.
function IntroCurtain({ onLifted }) {
  return (
    <motion.div
      className={s.curtain}
      initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      transition={{ duration: curtain.reveal, ease: ease.inOut, delay: curtain.introHold }}
      onAnimationComplete={onLifted}
      aria-hidden="true"
    >
      <Pattern className={s.pattern} />
      <div className={s.mark}>
        <motion.span
          className={s.logoWrap}
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.95, ease: ease.out, delay: 0.1 }}
        >
          <Logo variant="full" className={s.logoFull} />
        </motion.span>
        <span className={s.word}>
          {SUBTITLE.split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.8, ease: ease.out, delay: 0.45 + index * 0.03 }}
            >
              {letter === ' ' ? ' ' : letter}
            </motion.span>
          ))}
        </span>
      </div>
    </motion.div>
  )
}

// Enveloppe des pages. Au premier chargement, le rideau d'ouverture se lève sur
// la page ; ensuite, on passe d'une page à l'autre sans transition.
export default function PageShell({ children, onIntroDone }) {
  const reduce = useReducedMotion()
  const [opening, setOpening] = useState(!reduce)
  const context = useMemo(() => ({ ready: !opening, enterDelay: pageEnterDelay(opening) }), [opening])

  useEffect(() => {
    if (!opening) onIntroDone?.()
  }, [opening, onIntroDone])

  return (
    <PageContext.Provider value={context}>
      <motion.div
        className={s.content}
        initial={opening ? { y: 90 } : false}
        animate={{ y: 0 }}
        transition={{ duration: 1.2, ease: ease.out, delay: curtain.introHold + 0.05 }}
      >
        <main id="contenu">
          <Suspense fallback={<div className={s.fallback} aria-busy="true" />}>{children}</Suspense>
        </main>
        <Footer />
      </motion.div>

      {opening && <IntroCurtain onLifted={() => setOpening(false)} />}
    </PageContext.Provider>
  )
}
