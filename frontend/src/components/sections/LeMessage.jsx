import LineReveal from '../ui/LineReveal'
import Pattern from '../ui/Pattern'
import Reveal from '../ui/Reveal'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './LeMessage.module.css'

// LE MESSAGE — « Un Message de Vérité » : Jub / Ragal Yàlla / Sellal
const PILLARS = [
  ['الهُدَى', 'emerald', 'Jub', '(Droiture)', 'La rectitude du comportement. Être droit envers Dieu et envers les hommes.', false],
  ['تَقْوَى', 'red', 'Ragal Yàlla', '(Taqwa)', 'La conscience du Créateur. Nourrir en son cœur une crainte révérencielle.', true],
  ['أَصْلَح', 'hollow', 'Sellal', '(Réforme)', 'La pureté de l’âme. Un processus continu de transformation intérieure.', false],
]

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
        </header>

        <ol className={s.pillars}>
          {PILLARS.map(([ar, color, name, trans, body, mid], i) => (
            <Reveal as="li" className={cx(s.pillar, mid && s.mid)} key={name} delay={i * 0.12}>
              <p className={cx(s.ar, s[color])} lang="ar" dir="rtl">
                {ar}
              </p>
              <h3 className={s.name}>{name}</h3>
              <p className={s.trans}>{t(trans)}</p>
              <p className={s.body}>{t(body)}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
