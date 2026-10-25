import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cx } from '../../utils/helpers'
import s from './Button.module.css'

// Bouton/lien : `to` (route interne ou ancre « #id »), `href` (lien externe) ou bouton natif.
// Variantes : primary, gold, red, light, outline, outlineLight, link, linkLight.
// `icon` : true (flèche), false (aucune) ou un élément d'icône. `block` : pleine largeur.
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  block = false,
  children,
  className,
  type = 'button',
  ...rest
}) {
  const glyph = icon === true ? <ArrowUpRight size={16} strokeWidth={1.8} /> : icon
  const classes = cx(s.button, s[variant], s[size], block && s.block, !glyph && s.noIcon, className)
  const label = typeof children === 'string' ? children : undefined
  const content = (
    <>
      <span className={cx(s.label, label && s.rolls)}>
        <span className={s.text}>{children}</span>
        {/* Copie qui « roule » au survol : vrai élément masqué aux lecteurs
            d'écran (un ::after serait lu et doublerait le libellé). */}
        {label && (
          <span className={s.textClone} aria-hidden="true">
            {label}
          </span>
        )}
      </span>
      {glyph && (
        <span className={s.icon} aria-hidden="true">
          {glyph}
        </span>
      )}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  )
}
