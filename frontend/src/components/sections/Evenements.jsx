import { useCallback, useEffect, useRef, useState } from 'react'
import marsImg from '../../assets/photo/Fayfaat.jpg'
import juinImg from '../../assets/photo/DJI_0419.jpg'
import laylatImg from '../../assets/photo/Leylatul Qadr.jpg'
import maouloudImg from '../../assets/photo/Malwloud.jpg'
import octobreImg from '../../assets/photo/1er Octobre.jpg'
import decembreImg from '../../assets/photo/Journées prieres.jpg'
import Img from '../ui/Img'
import LineReveal from '../ui/LineReveal'
import Motif from '../ui/Motif'
import { useT } from '../../utils/useT'
import s from './Evenements.module.css'

// ÉVÉNEMENTS — « Un calendrier vivant » : grandes photos verticales qui défilent
// vers la droite, le texte posé dessous sur le fond de la section.
const FEATURED = [
  {
    img: marsImg,
    tag: 'Dernier samedi de mars',
    title: 'Commémoration de Mars',
    text: 'Commémoration de la descente spirituelle de Sangabi — Khalife de Dieu sur Terre. Un rassemblement annuel de recueillement, de mémoire et de fraternité.',
  },
  {
    img: juinImg,
    tag: 'Dernier samedi de juin',
    title: 'Commémoration de Juin',
    text: 'Commémoration de la descente spirituelle de la Mosquée de la Divinité — la nuit fondatrice du 28 au 29 juin 1973. Le moment le plus solennel du calendrier Naby Allah.',
  },
]

const NOCTURNES = [
  {
    img: laylatImg,
    position: '50% 30%', // cadrée sur le visage
    tag: 'Nuit sacrée · Ramadan',
    title: 'Laylatul Qadr',
    text: 'Nuit du Destin · la nuit la plus sacrée du Ramadan · à partir de 23h00',
  },
  {
    img: maouloudImg,
    position: '60% 50%',
    tag: 'Nuit de célébration',
    title: 'Maouloud',
    text: 'Naissance du Prophète Muhammad ﷺ · à partir de 23h00',
  },
]

const AUTRES = [
  {
    img: octobreImg,
    position: '65% 50%',
    tag: 'Commémoration annuelle',
    title: '1er Octobre',
    text: 'Commémoration de l’inauguration de la Mosquée · 1997',
  },
  {
    img: decembreImg,
    tag: 'Journées de prières · Décembre',
    title: 'Journées de Décembre',
    text: 'Dernier ou avant-dernier vendredi de décembre · après le Jumaah',
  },
]

// Ordre d'affichage : les deux commémorations majeures d'abord.
const EVENTS = [...FEATURED, ...NOCTURNES, ...AUTRES]

function Arrow({ dir }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={dir === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Evenements() {
  const t = useT()
  const railRef = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  // Met à jour l'état des flèches selon la position du défilement
  const measure = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    setEdges({ start: rail.scrollLeft <= 4, end: rail.scrollLeft >= max - 4 })
  }, [])

  useEffect(() => {
    const rail = railRef.current
    measure()
    rail.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      rail.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  // Une flèche fait avancer d'une carte
  const step = (dir) => {
    const rail = railRef.current
    const card = rail.firstElementChild
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0
    rail.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: 'smooth' })
  }

  return (
    <section id="evenements" className={s.section} aria-labelledby="evenements-title">
      <div className="container">
        <header className={s.head}>
          <LineReveal as="h2" id="evenements-title" className={s.title}>
            <span>{t('Un calendrier vivant.')}</span>
          </LineReveal>
          <div className={s.arrows}>
            <button type="button" className={s.arrow} onClick={() => step(-1)} disabled={edges.start} aria-label={t('Précédent')}>
              <Arrow dir="prev" />
            </button>
            <button type="button" className={s.arrow} onClick={() => step(1)} disabled={edges.end} aria-label={t('Suivant')}>
              <Arrow dir="next" />
            </button>
          </div>
        </header>

        <ul ref={railRef} className={s.rail}>
          {EVENTS.map((ev) => (
            <li className={s.card} key={ev.title}>
              <div className={s.media}>
                <Img src={ev.img} alt={t(ev.title)} position={ev.position} />
              </div>
              <div className={s.text}>
                <h3 className={s.cardTitle}>{t(ev.title)}</h3>
                <p className={s.when}>
                  <Motif name="rosette" className={s.star} />
                  {t(ev.tag)}
                </p>
                <p className={s.body}>{t(ev.text)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
