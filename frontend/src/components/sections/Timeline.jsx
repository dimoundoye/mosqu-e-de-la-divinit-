import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import LineReveal from '../ui/LineReveal'
import Pattern from '../ui/Pattern'
import Reveal from '../ui/Reveal'
import Motif from '../ui/Motif'
import useMediaQuery from '../../hooks/useMediaQuery'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Timeline.module.css'

// TIMELINE — « Le Fil du Temps » : sur grand écran la section se fige
// et la chronologie défile à l'horizontale.
const STEPS = [
  ['1973', 'La révélation en songe', 'Dans la nuit du 28 au 29 juin, Sangabi voit une maquette lumineuse descendre du ciel. Une voix le conduit jusqu’à la baie de Ouakam. Sur la porte de droite : ALLAHOU AKBAR en lettres d’or. Il dessine. Il attend.'],
  ['1977', 'Premier appel public à Ouakam', 'Sangabi sort du silence. Il transmet le message, Jub, Ragal Yàlla, Sellal, et appelle les hommes à revenir vers Dieu. La communauté Naby Allah prend forme.'],
  ['1979', 'Reconnaissance du site', 'Sangabi confirme l’emplacement exact selon les révélations. Le 31 décembre 1979, la première manifestation a lieu sur le site.'],
  ['1992', 'Pose de la première pierre', '29 janvier 1992. Sangabi pose lui-même la première cotisation. « Dieu qui m’a demandé de construire nous donnera les moyens. » Les travaux débutent le 20 mai.'],
  ['1992–1997', 'L’épopée de la construction', 'Sans machines. Toute une communauté au travail. La coupole suspendue de 80 tonnes en béton armé, une prouesse architecturale réalisée à mains nues.'],
  ['1997', 'Inauguration', 'La Mosquée de la Divinité ouvre ses portes le 1er octobre. L’invité d’honneur devait être El Hadji Abdou Aziz Sy, Khalife Général des Tidianes. Son fils Mame Alpha Sy honore la cérémonie.'],
  ['2007', 'Disparition de Sangabi', 'Le 12 mars 2007, Sangabi est rappelé à Dieu. Le message demeure. La mosquée demeure. La communauté demeure.'],
]

// Le défilement vertical consommé vaut 90 % de la course horizontale.
const SCROLL_RATIO = 0.9

export default function Timeline() {
  const t = useT()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 960px)')
  const pinned = wide && !reduce

  useEffect(() => {
    if (!pinned) return undefined
    const track = trackRef.current
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth))
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [pinned])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className={cx(s.section, pinned && s.pinned, 'on-dark')}
      style={pinned ? { height: `calc(100vh + ${Math.round(distance * SCROLL_RATIO)}px)` } : undefined}
      aria-labelledby="timeline-title"
    >
      <div className={s.sticky}>
        <Pattern className={s.pattern} />
        <motion.div ref={trackRef} className={s.track} style={pinned ? { x } : undefined}>
          <div className={s.intro}>
            <LineReveal as="h2" id="timeline-title" className={s.title}>
              <span>{t('Le Fil du')}</span>
              <em>{t('Temps')}</em>
            </LineReveal>
          </div>

          <ol className={s.steps}>
            {STEPS.map(([year, title, body], i) => (
              <Reveal as="li" className={s.step} key={year} delay={Math.min(i, 2) * 0.08} amount={0.1}>
                <p className={s.year}>{t(year)}</p>
                <span className={s.node} aria-hidden="true">
                  <Motif name="rosette" className={s.nodeStar} />
                </span>
                <h3 className={s.stepTitle}>{t(title)}</h3>
                <p className={s.stepBody}>{t(body)}</p>
              </Reveal>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  )
}
