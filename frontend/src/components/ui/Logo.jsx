import Motif from './Motif'
import { cx } from '../../utils/helpers'
import s from './Logo.module.css'

// Logo vectoriel de la charte, teinté par la couleur du texte (currentColor).
// `variant` :
//  - « full »   : minarets, coupole et nom « Mosquée de la Divinité » ;
//  - « emblem » : minarets et coupole seuls ;
//  - « tile »   : emblème blanc dans un carré arrondi sarcelle (icône de la charte) ;
//  - « frame »  : emblème seul, sans cadre (navigation sur fond sombre).
export default function Logo({ variant = 'full', label, className }) {
  if (variant === 'tile' || variant === 'frame') {
    return (
      <span
        className={cx(s.tile, variant === 'frame' && s.frame, className)}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <Motif name="emblem" className={s.tileEmblem} />
      </span>
    )
  }

  return <Motif name={variant === 'emblem' ? 'emblem' : 'logo'} label={label} className={cx(s.logo, className)} />
}
