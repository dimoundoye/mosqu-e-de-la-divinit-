import Button from '../components/ui/Button'
import LineReveal from '../components/ui/LineReveal'
import Pattern from '../components/ui/Pattern'
import Reveal from '../components/ui/Reveal'
import { cx } from '../utils/helpers'
import { useT } from '../utils/useT'
import s from './NotFound.module.css'

// Page 404
export default function NotFound() {
  const t = useT()

  return (
    <section className={cx(s.page, 'on-dark')} aria-labelledby="nf-title">
      <Pattern className={s.pattern} />
      <div className={`container ${s.inner}`}>
        <LineReveal as="h1" id="nf-title" onMount className={s.title}>
          <span>{t('Page')}</span>
          <em>{t('introuvable')}</em>
        </LineReveal>
        <Reveal as="p" className={s.text} delay={0.2}>
          {t('La page que vous cherchez n’existe pas ou a été déplacée.')}
        </Reveal>
        <Reveal className={s.actions} delay={0.3}>
          <Button to="/" variant="gold" size="lg">
            {t('Retour à l’accueil')}
          </Button>
          <Button to="/renovation" variant="outlineLight" size="lg">
            {t('Découvrir la rénovation')}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
