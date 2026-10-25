import { Children } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { usePage } from '../layout/pageContext'
import { ease } from '../../lib/motion'
import s from './LineReveal.module.css'

// Titre dont chaque ligne (chaque enfant) monte depuis un masque.
// Seul le titre d'ouverture (`onMount`) est animé, à l'arrivée sur la page ;
// les autres titres s'affichent tels quels, sans animation au défilement.
export default function LineReveal({
  as: Tag = 'h2',
  children,
  className,
  delay = 0,
  stagger = 0.09,
  onMount = false,
  id,
}) {
  const reduce = useReducedMotion()
  const { ready, enterDelay } = usePage()
  const lines = Children.toArray(children)
  const start = delay + (ready ? 0 : enterDelay)
  const animated = onMount && !reduce

  return (
    <Tag className={className} id={id}>
      <motion.span className={s.lines} initial={animated ? 'hidden' : false} animate={animated ? 'show' : undefined}>
        {lines.map((line, index) => (
          <span className={s.line} key={index}>
            <motion.span
              className={s.inner}
              variants={{
                hidden: { y: '118%', rotate: 2 },
                show: {
                  y: '0%',
                  rotate: 0,
                  transition: { duration: 1.15, ease: ease.out, delay: start + index * stagger },
                },
              }}
            >
              {line}
            </motion.span>
            {/* Espace lu par les lecteurs d'écran entre deux lignes */}
            {index < lines.length - 1 && ' '}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
