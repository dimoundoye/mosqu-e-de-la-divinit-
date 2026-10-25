import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import Pattern from '../ui/Pattern'
import { FOOTER_NAV, SOCIAL_LINKS } from '../../data/content'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Footer.module.css'

export default function Footer() {
  const t = useT()

  return (
    <footer className={cx(s.footer, 'on-dark')}>
      <Pattern fade="top" className={s.pattern} />

      <div className={cx('container', s.grid)}>
        <div className={s.brand}>
          <Logo variant="full" className={s.logo} label="Mosquée de la Divinité" />
          <p className={s.tagline}>{t('Masdjidou Rabbani · Ouakam · Corniche-Ouest · Dakar · Sénégal')}</p>
        </div>

        {/* Link et non <a> : depuis une autre page, une ancre nue ajoute le
            hash sans jamais ramener sur l'accueil. */}
        <div className={s.col}>
          <h2 className={s.heading}>{t('Navigation')}</h2>
          <ul className={s.list}>
            {FOOTER_NAV.map(([label, href]) => (
              <li key={href + label}>
                <Link to={`/${href}`} className={s.link}>
                  {t(label)}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/patrimoine" className={s.link}>
                {t('Patrimoine')}
              </Link>
            </li>
          </ul>
        </div>

        <div className={s.col}>
          <h2 className={s.heading}>{t('Suivez-nous sur')}</h2>
          <ul className={s.list}>
            {SOCIAL_LINKS.map(({ Icon, label, url }) => (
              <li key={label}>
                <a href={url} target="_blank" rel="noreferrer" className={s.social}>
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={cx(s.col, s.support)}>
          <h2 className={s.heading}>{t('Rénovation')}</h2>
          <p className={s.supportText}>
            {t('Découvrez le projet de rénovation et les façons de participer à sa réalisation.')}
          </p>
          <div className={s.supportActions}>
            <Button to="/dons" variant="gold" size="sm">
              {t('Faire un don')}
            </Button>
            <Button to="/renovation" variant="linkLight" size="sm">
              {t('Découvrir le projet')}
            </Button>
          </div>
        </div>
      </div>

      <div className={cx('container', s.bottom)}>
        <p>
          mosqueedeladivinite.org · {t('Site officiel')} · {t('Mouvement Naby Allah')}
        </p>
        <p>© 2026 {t('Mouvement Naby Allah')}</p>
      </div>
    </footer>
  )
}
