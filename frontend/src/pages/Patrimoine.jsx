import { ArrowRight, Image as ImageIcon, Mic } from 'lucide-react'
import sangabiImg from '../assets/photo/Khalife de Dieu.jpg'
import Button from '../components/ui/Button'
import Img from '../components/ui/Img'
import LineReveal from '../components/ui/LineReveal'
import PageHero from '../components/ui/PageHero'
import Pattern from '../components/ui/Pattern'
import Reveal from '../components/ui/Reveal'
import { cx } from '../utils/helpers'
import { useT } from '../utils/useT'
import s from './Patrimoine.module.css'

// Chiffres-clés de l'archive (compteurs architecturaux)
const STATS = [
  ['1926', 'Naissance', "Début de l'archive"],
  ['1977', 'Message', 'Premier appel public'],
  ['50+', 'Années', "D'archives documentées"],
  ['∞', 'Vies', 'Témoignages à préserver'],
]

// Page Patrimoine — Archives & Mémoire de la Mosquée de la Divinité.
// La navigation et le pied de page sont fournis par la coquille (SiteLayout).
export default function PatrimoinePage() {
  const t = useT()

  return (
    <>
      {/* ---------- EN-TÊTE ---------- */}
      <PageHero
        title={[t('Pour ceux qui ne l’ont pas connu.'), <em key="em">{t('Et pour ceux qui ne sont pas encore nés.')}</em>]}
        intro={t('La Mosquée de la Divinité est un lieu de mémoire autant qu’un lieu de culte. Plus de 50 ans d’archives documentées. Des témoignages oraux, des photos, des documents fondateurs, un patrimoine unique en cours de numérisation et de préservation.')}
      />

      {/* ---------- L'HÉRITAGE DE SANGABI ---------- */}
      <section className={s.legacy} aria-label={t('L’héritage de Sangabi')}>
        <div className={`container ${s.legacyGrid}`}>
          <Reveal as="figure" className={s.legacyFigure} y={40}>
            <div className={s.print}>
              <Img
                src={sangabiImg}
                alt={t('Mouhamed Seyni Gueye, dit Sangabi — documents et héritage fondateurs')}
                position="50% 30%"
              />
            </div>
          </Reveal>
          <div className={s.legacyText}>
            <Reveal as="blockquote" className={s.legacyQuote} delay={0.1}>
              «&nbsp;{t('Pour ceux qui ne l’ont jamais rencontré, pour ceux qui n’ont pas vu la mosquée se construire.')}&nbsp;»
            </Reveal>
            <div className={s.legacyBody}>
              <Reveal as="p" delay={0.15}>
                {t('Dans vingt ans, d’autres le porteront, des gens qui ne l’ont jamais rencontré, qui n’ont pas vu la mosquée se construire, qui n’ont pas entendu sa voix.')}
              </Reveal>
              <Reveal as="p" delay={0.2}>
                {t('Préserver cette mémoire, c’est transmettre aux générations futures une part du patrimoine religieux, architectural et humain de Dakar et du Sénégal.')}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- COMPTEURS ---------- */}
      <section className={s.stats} aria-label={t('Archive numérique')}>
        <ul className={`container ${s.statsGrid}`}>
          {STATS.map(([num, label, sub], i) => (
            <Reveal as="li" className={s.stat} key={label} delay={i * 0.08} y={24}>
              <span className={s.statNum}>{num}</span>
              <span className={s.statLabel}>{t(label)}</span>
              <span className={s.statSub}>{t(sub)}</span>
            </Reveal>
          ))}
          <Reveal as="li" className={cx(s.stat, s.statLive)} delay={0.32} y={24}>
            <span className={cx(s.statNum, s.pulse)}>↻</span>
            <span className={s.statLabel}>{t('En cours')}</span>
            <span className={s.statSub}>{t('Archive numérique')}</span>
          </Reveal>
        </ul>
      </section>

      {/* ---------- MÉDIATHÈQUE ---------- */}
      <section className={cx(s.media, 'on-dark')} aria-labelledby="mediatheque-title">
        <Pattern className={s.mediaPattern} />
        <div className={`container ${s.mediaInner}`}>
          <header className={s.mediaHead}>
            <div className={s.mediaHeadMain}>
              <LineReveal as="h2" id="mediatheque-title" className={s.mediaTitle}>
                <span>{t('Les voix de l’histoire.')}</span>
              </LineReveal>
            </div>
            <Reveal as="p" className={s.mediaNote} delay={0.15}>
              {t('Les photographies montrent un visage. Les archives racontent une histoire. Mais la voix transmet quelque chose d’autre.')}
            </Reveal>
          </header>

          <div className={s.mediaGrid}>
            {/* Vidéo principale (playlist) */}
            <Reveal className={s.mediaMain} y={40}>
              <iframe
                src="https://www.youtube.com/embed/videoseries?si=_9N7G3DxA4oE-3TC&list=PLn-4i5RmTZrEngicK9AUtKRHQrU-WS1Ya"
                title={t('Archives vidéo de la Mosquée de la Divinité')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                allowFullScreen
              />
            </Reveal>

            {/* Cartes audio / galerie */}
            <div className={s.mediaSide}>
              <Reveal className={s.mediaCard} delay={0.1}>
                <Mic className={s.mediaCardIcon} size={26} strokeWidth={1.5} aria-hidden="true" />
                <h3>{t('Sermon Historique')}</h3>
                <p>{t('Le premier appel public du 1er Juillet 1977. Restauration numérique haute fidélité.')}</p>
                <div className={s.progress}>
                  <i />
                </div>
              </Reveal>
              <Reveal className={s.mediaCard} delay={0.2}>
                <ImageIcon className={s.mediaCardIcon} size={26} strokeWidth={1.5} aria-hidden="true" />
                <h3>{t('Galerie Photos')}</h3>
                <p>{t('420 clichés argentiques numérisés illustrant la ferveur de la communauté Ouakamoise.')}</p>
                <a className={s.mediaCardLink} href="#">
                  {t('Consulter l’album')} <ArrowRight size={15} strokeWidth={1.8} aria-hidden="true" />
                </a>
              </Reveal>
            </div>

            {/* Vignettes vidéo secondaires */}
            {[
              ['AVHTdd3obBI', 1],
              ['j7pBLJyXjZA', 2],
              ['GMaNQHtJ6to', 3],
            ].map(([id, n], i) => (
              <Reveal className={s.mediaThumb} key={id} delay={i * 0.1} y={30}>
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  title={`${t('Archive vidéo')} ${n}`}
                  loading="lazy"
                  allowFullScreen
                />
              </Reveal>
            ))}
          </div>

          <Reveal className={s.mediaCta}>
            <Button href="#" variant="outlineLight" size="lg">
              {t('Voir toutes les vidéos')}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  )
}
