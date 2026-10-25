import { useCallback, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useLenis } from 'lenis/react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import LangSwitch from './LangSwitch'
import MobileMenu from './MobileMenu'
import { NAV_LINKS as links } from '../../data/navigation'
import { ease } from '../../lib/motion'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Navbar.module.css'

// Barre de navigation : transparente en haut de page, se masque à la descente
// et réapparaît à la remontée. `overDarkHero` : la page commence par un fond
// sombre, le texte passe en clair tant qu'on est en haut.
export default function Navbar({ overDarkHero = false }) {
  const t = useT()
  const location = useLocation()
  const lenis = useLenis()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lastPath, setLastPath] = useState(location.pathname)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const previous = scrollY.getPrevious() ?? 0
    setScrolled(y > 24)
    setHidden(y > previous && y > 320)
  })

  // Ferme le menu mobile quand on change de page (navigation, retour navigateur…)
  if (location.pathname !== lastPath) {
    setLastPath(location.pathname)
    setMenuOpen(false)
  }

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const onDark = menuOpen || (overDarkHero && !scrolled)

  // Le logo ramène à l'accueil ; déjà sur l'accueil, il remonte en haut.
  const handleBrand = (event) => {
    closeMenu()
    if (location.pathname === '/') {
      event.preventDefault()
      if (lenis) lenis.scrollTo(0, { duration: 1.4 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.header
        className={cx(s.header, scrolled && !menuOpen && s.scrolled, onDark && s.onDark)}
        animate={{ y: hidden && !menuOpen ? '-110%' : '0%' }}
        transition={{ duration: 0.55, ease: ease.out }}
      >
        <div className={cx('container', s.bar)}>
          <Link to="/" className={s.brand} onClick={handleBrand}>
            <Logo variant={onDark ? 'frame' : 'tile'} className={s.logo} />
            <span className={s.brandText}>
              <span className={s.brandName}>Mosquée de la Divinité</span>
              <span className={s.brandSub}>Masdjidou Rabbani</span>
            </span>
          </Link>

          <nav className={s.nav} aria-label={t('Navigation principale')}>
            <ul className={s.links}>
              {links.map(([label, href]) => {
                const current = !href.includes('#') && location.pathname === href
                return (
                  <li key={href}>
                    <Link
                      to={href}
                      className={cx(s.link, current && s.active)}
                      aria-current={current ? 'page' : undefined}
                    >
                      {t(label)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className={s.actions}>
            <LangSwitch className={s.lang} />
            <Button to="/dons" variant="gold" size="sm" className={s.donate}>
              {t('Faire un don')}
            </Button>
            <button
              type="button"
              className={s.menuButton}
              aria-expanded={menuOpen}
              aria-controls="menu-mobile"
              aria-label={menuOpen ? t('Fermer le menu') : t('Ouvrir le menu')}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={s.menuLabel} aria-hidden="true">
                {menuOpen ? t('Fermer') : 'Menu'}
              </span>
              <span className={cx(s.burger, menuOpen && s.burgerOpen)} aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu open={menuOpen} onClose={closeMenu} links={links} />
    </>
  )
}
