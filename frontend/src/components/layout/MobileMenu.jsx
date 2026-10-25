import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import Button from '../ui/Button'
import Pattern from '../ui/Pattern'
import LangSwitch from './LangSwitch'
import { SOCIAL_LINKS } from '../../data/content'
import { ease } from '../../lib/motion'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './MobileMenu.module.css'

// Menu plein écran pour mobile et tablette.
export default function MobileMenu({ open, onClose, links }) {
  const t = useT()
  const lenis = useLenis()
  const location = useLocation()
  const firstLink = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const root = document.documentElement
    lenis?.stop()
    root.style.overflow = 'hidden'
    const timer = window.setTimeout(() => firstLink.current?.focus({ preventScroll: true }), 400)
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', onKeyDown)
      root.style.overflow = ''
      lenis?.start()
    }
  }, [open, lenis, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          className={cx(s.overlay, 'on-dark')}
          data-lenis-prevent
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.6, ease: ease.inOut, delay: 0.1 } }}
          transition={{ duration: 0.75, ease: ease.inOut }}
        >
          <Pattern fade="bottom" className={s.pattern} />
          <div className={cx('container', s.inner)}>
            <nav aria-label={t('Navigation principale')}>
              <ul className={s.links}>
                {links.map(([label, href], index) => {
                  const current = !href.includes('#') && location.pathname === href
                  return (
                    <li key={href} className={s.item}>
                      <motion.span
                        className={s.itemInner}
                        initial={{ y: '115%' }}
                        animate={{ y: '0%', transition: { duration: 0.9, ease: ease.out, delay: 0.3 + index * 0.06 } }}
                        exit={{ y: '115%', transition: { duration: 0.35, ease: ease.inOut } }}
                      >
                        <Link
                          ref={index === 0 ? firstLink : undefined}
                          to={href}
                          onClick={onClose}
                          className={cx(s.link, current && s.active)}
                          aria-current={current ? 'page' : undefined}
                        >
                          {t(label)}
                        </Link>
                      </motion.span>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <motion.div
              className={s.footer}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: ease.out, delay: 0.65 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className={s.meta}>
                <div className={s.lang}>
                  <span className={s.metaLabel}>{t('Langue')}</span>
                  <LangSwitch />
                </div>
                <div className={s.socials}>
                  {SOCIAL_LINKS.map(({ Icon, label, url }) => (
                    <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label}>
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
              <Button to="/dons" variant="gold" size="lg" onClick={onClose}>
                {t('Faire un don')}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
