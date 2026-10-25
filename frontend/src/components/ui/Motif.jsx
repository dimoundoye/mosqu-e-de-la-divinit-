import * as motifs from './motifs'

// Motif graphique de la charte (rosace, coupole, flamme, grappe d'hexagones,
// ruban, emblème…), dessiné en couleur courante (currentColor).
export default function Motif({ name, className, label, preserveAspectRatio, style }) {
  const m = motifs[name]
  if (!m) return null
  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${m.w} ${m.h}`}
      preserveAspectRatio={preserveAspectRatio}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {m.d && <path d={m.d} fill="currentColor" />}
      {m.dEo && <path d={m.dEo} fill="currentColor" fillRule="evenodd" />}
    </svg>
  )
}
