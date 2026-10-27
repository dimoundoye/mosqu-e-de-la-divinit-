import mainsNuesImg from '../../assets/photo/A mains nues 2.jpg'
import SiratImg from '../../assets/photo/Sirat.jpg'
import LineReveal from '../ui/LineReveal'
import ParallaxImage from '../ui/ParallaxImage'
import Pattern from '../ui/Pattern'
import Reveal from '../ui/Reveal'
import ScrollWords from '../ui/ScrollWords'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Construction.module.css'

// CONSTRUCTION — récit de l'édification de la mosquée en 4 temps
const HANDS = [
  'Refus total de machines de levage lourdes par fidélité au rêve originel.',
  'Chaînes humaines pour acheminer le sable et le ciment depuis le haut de la falaise.',
  'Rôle central des femmes assurant la logistique et le soutien moral constant.',
  'Zéro accident mortel malgré les conditions de travail extrêmes au bord du gouffre.',
]

export default function Construction() {
  const t = useT()

  return (
    <section id="construction" aria-labelledby="construction-title">
      {/* Nuit Fondatrice */}
      <div className={cx(s.night, 'on-dark')}>
        <span className={s.stars} aria-hidden="true" />
        <Pattern className={s.nightPattern} />
        <div className={cx('container', s.nightInner)}>
          <Reveal as="p" className={s.allahu} lang="ar" dir="rtl" y={24}>
            الله أكبر
          </Reveal>
          <LineReveal as="h3" className={s.nightTitle}>
            <span>{t('Nuit Fondatrice')}</span>
          </LineReveal>
          <ScrollWords
            className={s.nightQuote}
            parts={[`« ${t('Sous la voûte étoilée de 1973, l’étincelle divine traça les contours de ce qui allait devenir le phare spirituel de la côte dakaroise. Une nuit où le silence parla plus fort que le ressac.')} »`]}
          />
        </div>
      </div>

      {/* Bâtie à mains nues */}
      <div className={s.hands}>
        <div className={cx('container', s.handsGrid)}>
          <div className={s.handsText}>
            <LineReveal as="h2" id="construction-title" className={s.handsTitle}>
              <span>{t('Bâtie à mains nues.')}</span>
            </LineReveal>
            <Reveal as="p" className={s.handsSub} delay={0.1}>
              {t('Bâtie à mains nues par toute une communauté.')}
            </Reveal>
            <Reveal as="p" className={s.lead} delay={0.15}>
              {t('Le chantier fut une prouesse humaine sans précédent. Hommes, femmes et enfants de la communauté Naby Allah se sont relayés pendant 5 ans et 5 mois.')}
            </Reveal>
            <ol className={s.list}>
              {HANDS.map((txt, i) => (
                <Reveal as="li" key={txt} className={s.listItem} delay={i * 0.06} y={20}>
                  <span>{t(txt)}</span>
                </Reveal>
              ))}
            </ol>
          </div>
          <ParallaxImage
            src={mainsNuesImg}
            alt={t('La mosquée bâtie à mains nues par la communauté')}
            ratio="1152 / 734"
            className={s.handsImage}
          />
        </div>
      </div>

      {/* Pont Al Sirat */}
      <div className={cx(s.sirat, 'on-dark')}>
        <Pattern fade="right" className={s.siratPattern} />
        <div className={cx('container', s.siratHead)}>
          <div className={s.siratHeadMain}>
            <LineReveal as="h2" className={s.siratTitle}>
              <span>{t('Le Pont Al Sirat')}</span>
            </LineReveal>
          </div>
          <Reveal as="p" className={s.siratText} delay={0.15}>
            {t('Reliant les deux minarets à 45 mètres de hauteur, cette passerelle symbolise le passage périlleux vers la félicité éternelle. Construite par de jeunes bâtisseurs au cœur vaillant, elle défie les vents marins et le vertige.')}
          </Reveal>
        </div>
        <div className="container">
          <ParallaxImage
            src={SiratImg}
            alt={t('Passerelle du Pont Al Sirat entre les deux minarets')}
            ratio="1117 / 626"
            className={s.siratImage}
          />
        </div>
      </div>
    </section>
  )
}
