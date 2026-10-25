import { ribbon } from './motifs'
import { cx } from '../../utils/helpers'
import s from './Ribbon.module.css'

// Ruban de la charte (« motif graphique de base ») portant un court libellé.
// `tone` : teal (sarcelle, texte blanc) ou gold (dégradé or, texte sarcelle).
export default function Ribbon({ children, tone = 'teal', className, as: Tag = 'span' }) {
  return (
    <Tag className={cx(s.ribbon, s[tone], className)}>
      <svg className={s.shape} viewBox={`0 0 ${ribbon.w} ${ribbon.h}`} preserveAspectRatio="none" aria-hidden="true">
        {tone === 'gold' && (
          <defs>
            <linearGradient id="ribbon-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fffacb" />
              <stop offset="0.475" stopColor="#edd688" />
              <stop offset="0.92" stopColor="#eaba10" />
            </linearGradient>
          </defs>
        )}
        <path d={ribbon.d} fill={tone === 'gold' ? 'url(#ribbon-gold)' : 'currentColor'} />
      </svg>
      <span className={s.label}>{children}</span>
    </Tag>
  )
}
