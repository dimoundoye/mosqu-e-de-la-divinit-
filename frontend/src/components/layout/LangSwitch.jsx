import { useLanguage } from '../../context/LanguageContext'
import { useT } from '../../utils/useT'
import { cx } from '../../utils/helpers'
import s from './LangSwitch.module.css'

const LANGUES = ['FR', 'EN']

// Choix de la langue : bascule FR / EN.
export default function LangSwitch({ className }) {
  const { lang, setLang } = useLanguage()
  const t = useT()

  return (
    <div className={cx(s.switch, className)} role="group" aria-label={t('Langue')}>
      {LANGUES.map((code) => (
        <button
          key={code}
          type="button"
          className={cx(s.option, lang === code && s.active)}
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
