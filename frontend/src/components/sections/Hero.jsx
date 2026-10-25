import { motion, useReducedMotion } from 'motion/react'
import { VIDEO } from '../../data/content'
import heroPoster from '../../assets/photo/DJI_0681.jpg'
import LineReveal from '../ui/LineReveal'
import Reveal from '../ui/Reveal'
import { usePage } from '../layout/pageContext'
import { ease } from '../../lib/motion'
import { cx } from '../../utils/helpers'
import s from './Hero.module.css'

// HERO — vidéo aérienne plein écran, titre révélé ligne par ligne.
// Vidéo et texte restent fixes au défilement (pas de parallaxe).
export default function Hero() {
  const reduce = useReducedMotion()
  const { enterDelay } = usePage()

  return (
    <section id="hero" className={cx(s.hero, 'on-dark')} aria-labelledby="hero-title">
      <div className={s.media} aria-hidden="true">
        <motion.video
          className={s.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          initial={reduce ? false : { scale: 1.14 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.8, ease: ease.out, delay: enterDelay }}
        >
          <source src={VIDEO} type="video/mp4" />
        </motion.video>
      </div>
      <div className={s.shade} aria-hidden="true" />

      <div className={cx('container', s.content)}>
        <div className={s.copy}>
          <LineReveal as="h1" id="hero-title" onMount className={s.title} stagger={0.12}>
            <span>Mosquée de la</span>
            <em>Divinité</em>
          </LineReveal>

          {/* Sous-titre déjà bilingue par nature : il ne passe pas par t(). */}
          <Reveal as="p" className={s.subtitle} delay={0.3} y={16}>
            Masdjidou Rabbani · Mosque of the Divinity
          </Reveal>
        </div>
      </div>
    </section>
  )
}
