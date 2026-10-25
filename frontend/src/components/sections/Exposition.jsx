import { images } from '../../data/content'
import Button from '../ui/Button'
import LineReveal from '../ui/LineReveal'
import ParallaxImage from '../ui/ParallaxImage'
import Reveal from '../ui/Reveal'
import { useT } from '../../utils/useT'
import s from './Exposition.module.css'

// EXPOSITION — « Du Songe à la Mosquée » : texte et mosaïque d'archives
export default function Exposition() {
  const t = useT()

  return (
    <section id="exposition" className={s.section} aria-labelledby="exposition-title">
      <div className="container">
        <div className={s.layout}>
          <div className={s.text}>
            <LineReveal as="h2" id="exposition-title" className={s.title}>
              <span>{t('Du Songe à la Mosquée.')}</span>
            </LineReveal>
            <Reveal as="p" className={s.lead} delay={0.1}>
              {t('Une exposition permanente retrace l’histoire de la mosquée, de la révélation en songe de 1973 à aujourd’hui. Des photographies d’archives officielles du Mouvement Naby Allah témoignent d’une construction hors du commun.')}
            </Reveal>
            <Reveal className={s.cta} delay={0.2}>
              <Button to="#visiter" variant="primary">
                {t('Planifier une visite')}
              </Button>
            </Reveal>
          </div>

          {/* Mosaïque d'archives en deux colonnes décalées */}
          <div className={s.gallery}>
            <div className={s.col}>
              <ParallaxImage src={images.expoImg} alt={t('Exposition de la mosquée')} ratio="3 / 4" />
              <ParallaxImage
                src={images.exposition3}
                alt={t('Photographie d’archive du Mouvement Naby Allah')}
                ratio="4 / 3"
              />
            </div>
            <div className={s.col}>
              <ParallaxImage
                src={images.exposition4}
                alt={t('Le site avant la construction de la mosquée')}
                ratio="4 / 3"
              />
              <ParallaxImage src={images.expo2Img} alt={t('Archives de la mosquée')} ratio="3 / 4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
