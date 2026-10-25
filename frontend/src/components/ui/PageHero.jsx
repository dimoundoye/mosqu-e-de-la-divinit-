import LineReveal from './LineReveal'
import ParallaxImage from './ParallaxImage'
import Reveal from './Reveal'
import { cx } from '../../utils/helpers'
import s from './PageHero.module.css'

// En-tête des pages intérieures : grand titre ligne par ligne, chapeau,
// actions et photo panoramique facultative.
export default function PageHero({
  title,
  intro,
  children,
  photo,
  photoAlt = '',
  photoRatio = '21 / 9',
  photoPosition,
  className,
}) {
  return (
    <header className={cx(s.hero, className)}>
      <div className="container">
        <div className={s.head}>
          <LineReveal as="h1" onMount className={s.title}>
            {title.map((line, index) => (
              <span key={index}>{line}</span>
            ))}
          </LineReveal>
          {(intro || children) && (
            <div className={s.below}>
              {intro && (
                <Reveal as="p" className={s.intro} delay={0.3}>
                  {intro}
                </Reveal>
              )}
              {children && (
                <Reveal className={s.actions} delay={0.4}>
                  {children}
                </Reveal>
              )}
            </div>
          )}
        </div>
        {photo && (
          <ParallaxImage
            src={photo}
            alt={photoAlt}
            ratio={photoRatio}
            priority
            position={photoPosition}
            className={s.photo}
          />
        )}
      </div>
    </header>
  )
}
