import { RefreshCw } from 'lucide-react'
import Button from '../ui/Button'
import LineReveal from '../ui/LineReveal'
import Pattern from '../ui/Pattern'
import Reveal from '../ui/Reveal'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Patrimoine.module.css'

// PATRIMOINE — « Une archive vivante » : texte + encadré de repères, lien vers la page Patrimoine
const ARCHIVE = [
  { k: '1926', v: 'Naissance de Sangabi · début de l’archive' },
  { k: '1977', v: 'Premier appel public' },
  { k: '50+', v: 'Ans d’archives documentées' },
  { k: '∞', v: 'Témoignages à préserver' },
  { k: <RefreshCw className={s.spin} strokeWidth={1.5} />, v: 'Archive numérique en construction' },
]

export default function Patrimoine() {
  const t = useT()

  return (
    <section id="patrimoine" className={cx(s.section, 'on-dark')} aria-labelledby="patrimoine-title">
      <Pattern fade="left" className={s.pattern} />
      <div className={`container ${s.grid}`}>
        <div className={s.left}>
          <LineReveal as="h2" id="patrimoine-title" className={s.title}>
            <span>{t('Une archive vivante.')}</span>
          </LineReveal>
          <Reveal as="p" className={s.lead} delay={0.1}>
            {t('La Mosquée de la Divinité est un lieu de mémoire autant qu’un lieu de culte. Plus de 50 ans d’archives documentées, et une collecte qui remonte jusqu’à la naissance de Sangabi en 1926.')}
          </Reveal>
          <Reveal as="p" className={s.text} delay={0.15}>
            {t('Témoignages oraux, photos d’archives, documents fondateurs — un patrimoine unique en cours de numérisation et de préservation. En partenariat avec Ubbil Innovation Hub, nous construisons une archive numérique de l’histoire et de la mémoire de la mosquée.')}
          </Reveal>
          <Reveal className={s.cta} delay={0.2}>
            <Button to="/patrimoine" variant="gold" size="lg">
              {t('Découvrir le patrimoine')}
            </Button>
          </Reveal>
        </div>

        <ul className={s.box}>
          {ARCHIVE.map((r, i) => (
            <Reveal as="li" className={s.row} key={i} delay={i * 0.07} y={20}>
              <span className={s.k}>{r.k}</span>
              <span className={s.v}>{t(r.v)}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
