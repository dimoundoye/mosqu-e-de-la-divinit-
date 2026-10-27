import { useLayoutEffect, useRef, useState } from 'react'
import LineReveal from '../ui/LineReveal'
import Pattern from '../ui/Pattern'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './LeMessage.module.css'

// LE MESSAGE — « Un Message de Vérité » : Jub / Ragal Yàlla / Sellal.
// Chaque pilier est un « ciel » où le mot apparaît tel que le khalife l'a vu.
const PILLARS = [
  {
    sky: 'day',
    ar: 'الهدى',
    dotUnder: 'د', // point rouge sous la lettre Dal
    translit: 'Al Houda',
    name: 'Jub',
    trans: '(Droiture)',
    quote: 'J’ai vu dans le ciel, écrit en noir avec un point rouge sous la lettre Dal د, le mot Al Houda (la droiture).',
    body: 'La rectitude du comportement. Être droit envers Dieu et envers les hommes.',
  },
  {
    sky: 'night',
    ar: 'تقوى الله',
    translit: 'Takhwâ lâhi',
    name: 'Ragal Yàlla',
    trans: '(Taqwa)',
    quote: 'J’ai vu, dans l’espace, écrit en lettres d’or, l’expression Takhwâ lâhi (la crainte révérencielle en Dieu).',
    body: 'La conscience du Créateur. Nourrir en son cœur une crainte révérencielle.',
  },
  {
    sky: 'space',
    ar: 'أصلح',
    translit: 'Aslaha',
    name: 'Sellal',
    trans: '(Réforme)',
    quote: 'J’ai vu dans l’espace, écrit en blanc, le mot Aslaha (améliorer, réformer).',
    body: 'La pureté de l’âme. Un processus continu de transformation intérieure.',
  },
]

// Mot arabe ; `dotUnder` : lettre sous laquelle poser un point rouge,
// placé d'après la position réelle du glyphe (mesurée après chargement de la police).
function Calligraphy({ text, dotUnder }) {
  const ref = useRef(null)
  const [dot, setDot] = useState(null)

  useLayoutEffect(() => {
    if (!dotUnder) return undefined
    const el = ref.current
    const measure = () => {
      const node = el.firstChild
      const i = node?.textContent.indexOf(dotUnder) ?? -1
      if (i < 0) return
      const range = document.createRange()
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      const glyph = range.getBoundingClientRect()
      const box = el.getBoundingClientRect()
      if (!glyph.width) return
      setDot({ left: glyph.left - box.left + glyph.width / 2, top: glyph.bottom - box.top - glyph.height * 0.25 })
    }
    measure()
    document.fonts?.ready.then(measure)
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [text, dotUnder])

  return (
    <p ref={ref} className={s.ar} lang="ar" dir="rtl">
      {text}
      {dot && <span className={s.dot} style={dot} aria-hidden="true" />}
    </p>
  )
}

export default function LeMessage() {
  const t = useT()

  return (
    <section id="message" className={cx(s.section, 'on-dark')} aria-labelledby="message-title">
      <Pattern className={s.pattern} tile={120} />
      <div className={`container ${s.inner}`}>
        <header className={s.head}>
          <LineReveal as="h2" id="message-title" className={s.title}>
            <span>{t('Un Message de')}</span>
            <em>{t('Vérité')}</em>
          </LineReveal>
          <p className={s.lead}>{t('Le khalife a écrit :')}</p>
        </header>

        <ol className={s.pillars}>
          {PILLARS.map((p) => (
            <li className={s.pillar} key={p.name}>
              <div className={cx(s.sky, s[p.sky])}>
                <Calligraphy text={p.ar} dotUnder={p.dotUnder} />
                <p className={s.translit}>{p.translit}</p>
              </div>
              <blockquote className={s.quote}>
                <p>« {t(p.quote)} »</p>
              </blockquote>
              <div className={s.meaning}>
                <h3 className={s.name}>{p.name}</h3>
                <p className={s.trans}>{t(p.trans)}</p>
                <p className={s.body}>{t(p.body)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
