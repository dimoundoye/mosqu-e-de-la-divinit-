import visuelMosquee from '../../assets/photo/DJI_0681.jpg'
import LineReveal from '../ui/LineReveal'
import ParallaxImage from '../ui/ParallaxImage'
import Pattern from '../ui/Pattern'
import Reveal from '../ui/Reveal'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Visiter.module.css'

// VISITER — « Un lieu ouvert à tous » : grande vue aérienne, carte d'infos pratiques, 3 points clés
const INFOS = [
  ['Adresse', 'Corniche-Ouest, Ouakam, Dakar'],
  ['Accès', 'Taxi · Applications de covoiturage · Marche depuis la Corniche-Ouest'],
  ['Tenue', 'Tenue modeste requise'],
  ['Coordonnées', '14°44’N · 17°31’W'],
]

const HIGHLIGHTS = [
  [
    'Vue sur l’Atlantique',
    'Deux minarets de 45 mètres face à l’océan. Un panorama unique, particulièrement au coucher du soleil sur la Corniche-Ouest.',
  ],
  [
    'Architecture divine',
    'Chaque détail fidèlement construit depuis la maquette révélée en songe en 1973. Mosaïques blanc et vert de l’Islam, une coupole suspendue en béton armé de 80 tonnes, deux minarets de 45 mètres face à l’Atlantique.',
  ],
  [
    'Accès non-musulmans',
    'Les non-musulmans sont bienvenus sur l’esplanade et dans les couloirs. La salle de prière est réservée aux musulmans. À travers les fenêtres, les visiteurs peuvent admirer l’architecture intérieure. Tenue modeste requise.',
  ],
]

export default function Visiter() {
  const t = useT()

  return (
    <section id="visiter" className={s.section} aria-labelledby="visiter-title">
      <div className="container">
        <header className={s.head}>
          <LineReveal as="h2" id="visiter-title" className={s.title}>
            <span>{t('Un lieu ouvert à tous.')}</span>
          </LineReveal>
        </header>

        <ParallaxImage
          src={visuelMosquee}
          alt={t('Vue aérienne de la Mosquée de la Divinité sur la baie de Ouakam')}
          ratio="21 / 9"
          className={s.photo}
          position="50% 55%"
        />

        {/* Carte sombre — informations pratiques, posée sur la photo */}
        <Reveal className={cx(s.card, 'on-dark')} y={40}>
          <Pattern fade="right" className={s.cardPattern} />
          <div className={s.cardMain}>
            <h3 className={s.place}>
              {t('Corniche-Ouest,')}
              <br />
              <em>Ouakam.</em>
            </h3>
            <p className={s.cardText}>
              {t('Perchée entre les falaises et l’Atlantique, la Mosquée de la Divinité est l’un des monuments les plus photographiés du Sénégal. Elle accueille fidèles et voyageurs du monde entier.')}
            </p>
          </div>
          <dl className={s.facts}>
            {INFOS.map(([k, v]) => (
              <div className={s.fact} key={k}>
                <dt>{t(k)}</dt>
                <dd>{t(v)}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 3 points clés */}
        <ol className={s.highlights}>
          {HIGHLIGHTS.map(([title, body], i) => (
            <Reveal as="li" className={s.highlight} key={title} delay={i * 0.1}>
              <h4 className={s.hlTitle}>{t(title)}</h4>
              <p className={s.hlBody}>{t(body)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
