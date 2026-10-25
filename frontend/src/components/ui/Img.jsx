import { cx } from '../../utils/helpers'
import s from './Img.module.css'

// Image qui remplit son cadre, affichée dès qu'elle est chargée (sans fondu).
export default function Img({
  src,
  alt = '',
  priority = false,
  fit = 'cover',
  position,
  className,
  style,
  ...rest
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={cx(s.img, className)}
      style={{ objectFit: fit, objectPosition: position, ...style }}
      {...rest}
    />
  )
}
