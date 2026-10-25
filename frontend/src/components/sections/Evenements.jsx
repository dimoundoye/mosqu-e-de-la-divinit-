import marsImg from '../../assets/photo/Fayfaat.jpg'
import juinImg from '../../assets/photo/DJI_0419.jpg'
import laylatImg from '../../assets/photo/Leylatul Qadr.jpg'
import maouloudImg from '../../assets/photo/Malwloud.jpg'
import octobreImg from '../../assets/photo/1er Octobre.jpg'
import decembreImg from '../../assets/photo/Journées prieres.jpg'
import Img from '../ui/Img'
import LineReveal from '../ui/LineReveal'
import Reveal from '../ui/Reveal'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Evenements.module.css'

// ÉVÉNEMENTS — « Un calendrier vivant » : chaque événement en bloc texte + photo, côtés alternés
const FEATURED = [
  {
    img: marsImg,
    fit: 'contain',
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
    tag: 'Nuit sacrée · Ramadan',
    title: 'Laylatul Qadr',
    text: 'Nuit du Destin · la nuit la plus sacrée du Ramadan · à partir de 23h00',
  },
  {
    img: maouloudImg,
    tag: 'Nuit de célébration',
    title: 'Maouloud',
    text: 'Naissance du Prophète Muhammad ﷺ · à partir de 23h00',
  },
]

const AUTRES = [
  {
    img: octobreImg,
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

// Un événement = un bloc texte d'un côté, sa photo de l'autre (côtés alternés).
function EventRow({ ev, index, major }) {
  const t = useT()
  const contain = ev.fit === 'contain'

  return (
    <Reveal as="article" className={cx(s.row, index % 2 === 1 && s.rowReverse, major && s.rowMajor)}>
      <div className={s.rowText}>
        <h3 className={s.rowTitle}>{t(ev.title)}</h3>
        <p className={s.rowWhen}>{t(ev.tag)}</p>
        <p className={s.rowBody}>{t(ev.text)}</p>
      </div>
      <div className={cx(s.rowMedia, contain && s.rowMediaContain)}>
        <Img src={ev.img} alt={t(ev.title)} fit={contain ? 'contain' : 'cover'} />
      </div>
    </Reveal>
  )
}

export default function Evenements() {
  const t = useT()

  return (
    <section id="evenements" className={s.section} aria-labelledby="evenements-title">
      <div className="container">
        <header className={s.head}>
          <LineReveal as="h2" id="evenements-title" className={s.title}>
            <span>{t('Un calendrier vivant.')}</span>
          </LineReveal>
        </header>

        <div className={s.rows}>
          {EVENTS.map((ev, i) => (
            <EventRow ev={ev} index={i} major={i < FEATURED.length} key={ev.title} />
          ))}
        </div>
      </div>
    </section>
  )
}
