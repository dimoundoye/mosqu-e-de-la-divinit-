import { images, SANGABI_BIO } from '../../data/content'
import LineReveal from '../ui/LineReveal'
import ParallaxImage from '../ui/ParallaxImage'
import Reveal from '../ui/Reveal'
import { useT } from '../../utils/useT'
import s from './Sangabi.module.css'

// SANGABI — portrait fixe à gauche, biographie qui défile à droite.
export default function Sangabi() {
  const t = useT()

  return (
    <section id="sangabi" className={s.section} aria-labelledby="sangabi-nom">
      <div className={`container ${s.grid}`}>
        <div className={s.portraitCol}>
          <div className={s.portraitSticky}>
            <ParallaxImage
              src={images.khalife}
              alt={t('Mouhamed Gorgui Seyni Gueye, dit Sangabi')}
              ratio="738 / 1152"
              className={s.portrait}
            />
          </div>
        </div>

        <div className={s.text}>
          <Reveal as="h2" className={s.dates} y={14}>
            {t('19 juillet 1926 · 12 mars 2007')}
          </Reveal>
          <LineReveal as="h3" id="sangabi-nom" className={s.name}>
            <span>Mouhamed Gorgui</span>
            <span>Seyni Gueye</span>
          </LineReveal>
          <Reveal as="p" className={s.aka} delay={0.1}>
            {t('dit Sangabi · Khalifatou Lahi Fil Ardi')}
          </Reveal>

          <div className={s.bio}>
            {SANGABI_BIO.map((p, i) => (
              <Reveal as="p" key={i} y={24}>
                {t(p)}
              </Reveal>
            ))}
          </div>

          <Reveal as="blockquote" className={s.quote}>
            «&nbsp;{t('Dieu, qui m’a demandé de construire, nous donnera les moyens nécessaires pour réaliser cette Mosquée inchallah.')}&nbsp;»
          </Reveal>
        </div>
      </div>
    </section>
  )
}
