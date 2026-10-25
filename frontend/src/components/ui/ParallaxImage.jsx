import Img from './Img'
import { cx } from '../../utils/helpers'
import s from './ParallaxImage.module.css'

// Photo cadrée, fixe au défilement : posée dans la page, sans effet de flottement.
// (Le nom est conservé pour ne pas toucher aux nombreux appels.)
export default function ParallaxImage({
  src,
  alt = '',
  ratio,
  priority = false,
  fit = 'cover',
  position,
  className,
  children,
}) {
  return (
    <div className={cx(s.frame, className)} style={{ aspectRatio: ratio }}>
      <div className={s.clip}>
        <div className={s.inner}>
          <Img src={src} alt={alt} priority={priority} fit={fit} position={position} />
        </div>
      </div>
      {children}
    </div>
  )
}
