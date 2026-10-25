import { images } from '../../data/content'
import LineReveal from '../ui/LineReveal'
import ParallaxImage from '../ui/ParallaxImage'
import Reveal from '../ui/Reveal'
import ScrollWords from '../ui/ScrollWords'
import { useT } from '../../utils/useT'
import s from './Histoire.module.css'

// Découpe une citation en phrases : la dernière est mise en accent.
function enPhrases(texte) {
  const phrases = texte.split(/(?<=[.!?])\s+/)
  if (phrases.length < 2) return [texte]
  return [...phrases.slice(0, -1), { em: phrases[phrases.length - 1] }]
}

// HISTOIRE — « Née d'un rêve divin » : récit, mosaïque d'archives, citation qui s'illumine.
export default function Histoire() {
  const t = useT()

  return (
    <section id="histoire" className={s.section} aria-labelledby="histoire-title">
      <div className="container">
        <header className={s.head}>
          <LineReveal as="h2" id="histoire-title" className={s.title}>
            <span>{t('Née d’un rêve')}</span>
            <em>{t('divin')}</em>
          </LineReveal>
        </header>

        <div className={s.grid}>
          <div className={s.story}>
            <Reveal as="p" className={s.lead}>
              {t('Une mosquée sur la Corniche de Ouakam. Deux minarets de 45 mètres face à l’océan. Une coupole de 80 tonnes suspendue dans l’air marin.')}
            </Reveal>
            <div className={s.body}>
              <Reveal as="p">{t('Elle existe parce qu’un homme a reçu un message, un ordre, une vision, et a choisi de ne pas le garder pour lui.')}</Reveal>
              <Reveal as="p">
                {t('Cet homme s’appelle')} <strong>Mouhamed Gorgui Seyni Gueye</strong>
                {t(', dit Sangabi.')}
              </Reveal>
              <Reveal as="p">{t('Depuis sa révélation de 1973, Sangabi a dessiné la mosquée telle qu’il l’avait vue. Cheikh Ngom, architecte de renom, a traduit fidèlement ses esquisses en plans.')}</Reveal>
              <Reveal as="p">{t('Mais la construction elle-même, chaque pierre posée, chaque minaret érigé, chaque sac de ciment porté, c’est la communauté qui l’a faite. De ses mains. Quartier par quartier. Famille par famille.')}</Reveal>
              <Reveal as="p">{t('Cette même communauté l’a aussi financée. Chacun selon ses moyens. Étape par étape.')}</Reveal>
            </div>
          </div>

          <div className={s.gallery}>
            <ParallaxImage
              src={images.khalifeJeune}
              alt={t('Le Khalife jeune')}
              ratio="583 / 958"
              className={s.tall}
              position="50% 20%"
            />
            <div className={s.stack}>
              <ParallaxImage
                src={images.khalifeReco}
                alt={t('Le Khalife en reconnaissance sur le site')}
                ratio="4 / 3"
              />
              <ParallaxImage
                src={images.avantMosquee}
                alt={t('Le site avant la construction de la mosquée')}
                ratio="4 / 3"
              />
            </div>
          </div>
        </div>

        <figure className={s.quote}>
          <span className={s.mark} aria-hidden="true">
            “
          </span>
          <ScrollWords
            as="blockquote"
            className={s.quoteText}
            parts={enPhrases(t('La vision venait d’en haut. Les esquisses venaient de Sangabi. L’édifice venait de la communauté.'))}
          />
        </figure>
      </div>
    </section>
  )
}
