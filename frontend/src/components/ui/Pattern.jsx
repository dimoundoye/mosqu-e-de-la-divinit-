import { pattern } from './motifs'
import { cx } from '../../utils/helpers'
import s from './Pattern.module.css'

// Tuile du motif de la charte : rosaces, grappes d'hexagones et coupole « ع ».
const TILE = `<svg xmlns='http://www.w3.org/2000/svg' width='${pattern.w}' height='${pattern.h}' viewBox='0 0 ${pattern.w} ${pattern.h}'><path d='${pattern.d}' fill='black'/><path d='${pattern.dEo}' fill='black' fill-rule='evenodd'/></svg>`
const PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(TILE)}")`

// Motif décoratif posé en fond de section (couleur = currentColor).
// `fade` : radial (centre), top, bottom, left, right ou none ; `tile` : largeur d'une tuile en px.
export default function Pattern({ className, fade = 'radial', tile = 150 }) {
  const height = Math.round((tile * pattern.h) / pattern.w)
  return (
    <span
      className={cx(s.pattern, s[fade], className)}
      style={{ '--pattern': PATTERN_URL, '--tile-w': `${tile}px`, '--tile-h': `${height}px` }}
      aria-hidden="true"
    />
  )
}
