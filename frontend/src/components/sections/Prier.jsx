import { images } from '../../data/content'
import koriteImg from '../../assets/photo/Korite.jpg'
import tabaskiImg from '../../assets/photo/Tabaski.jpg'
import fayfaatImg from '../../assets/photo/Fayfaat.jpg'
import tasbihImg from '../../assets/photo/Journées prieres.jpg'
import Img from '../ui/Img'
import LineReveal from '../ui/LineReveal'
import ParallaxImage from '../ui/ParallaxImage'
import Pattern from '../ui/Pattern'
import Reveal from '../ui/Reveal'
import { cx } from '../../utils/helpers'
import { useT } from '../../utils/useT'
import s from './Prier.module.css'

// PRIER — « Les Heures Sacrées » : les 5 prières, le Jumaah, les prières spéciales et propres
const PRAYERS = [
  ['الفجر', 'Fajr', '05:45', images.fajrImg],
  ['الظهر', 'Dhuhr', '13:15', images.jumaaImg],
  ['العصر', 'Asr', '16:40', images.asrImg],
  ['المغرب', 'Maghrib', '19:30', images.maghribImg],
  ['العشاء', 'Isha', '20:45', images.ishaImg],
]

// Prières spéciales (fêtes)
const SPECIALS = [
  {
    ar: 'صَلَاة الفِطْر',
    name: 'Julli Korité',
    sub: 'Eid al-Fitr',
    time: 'généralement à 9h00',
    img: koriteImg,
    caption: 'Julli Korité · Eid al-Fitr · Familles en tenues de fête · Enfants, adultes, personnes âgées',
  },
  {
    ar: 'صَلَاة الأَضْحَى',
    name: 'Julli Tabaski',
    sub: 'Eid al-Adha',
    time: 'généralement à 9h00',
    img: tabaskiImg,
    caption: 'Julli Tabaski · Eid al-Adha · Rassemblement familial · Toutes générations présentes',
  },
]

// Prières propres à la Mosquée de la Divinité
const PROPRES = [
  {
    img: fayfaatImg,
    ar: 'صَلَاة الفَيْفَات',
    name: 'Salatul Fayfaat',
    when: 'Dernier vendredi du Ramadan, après le Jumaah',
    desc: 'Une prière de réparation. Pour les prières accomplies imparfaitement ou oubliées sans le vouloir, afin de les réparer devant Dieu.',
  },
  {
    img: tasbihImg,
    ar: 'صَلَاة التَّسْبِيح',
    name: 'Salatul Tasbih',
    when: 'Dernier ou avant-dernier vendredi de décembre, après le Jumaah',
    desc: 'La prière de glorification. Allah pardonne vos péchés passés et futurs, grands et petits, oubliés ou intentionnels.',
  },
]

export default function Prier() {
  const t = useT()

  return (
    <section id="prier" className={s.section} aria-labelledby="prier-title">
      <div className="container">
        <header className={s.head}>
          <div className={s.headMain}>
            <LineReveal as="h2" id="prier-title" className={s.title}>
              <span>{t('La prière,')}</span>
              <em>{t('au cœur du lieu.')}</em>
            </LineReveal>
          </div>
          <Reveal as="p" className={s.intro} delay={0.15}>
            {t('La Mosquée de la Divinité accueille les cinq prières quotidiennes et l’ensemble du calendrier islamique. Tous les fidèles sont les bienvenus.')}
          </Reveal>
        </header>

        {/* Les cinq prières quotidiennes */}
        <ol className={s.prayers}>
          {PRAYERS.map(([ar, name, time, img], i) => (
            <Reveal as="li" className={cx(s.prayer, 'on-dark')} key={name} delay={i * 0.07}>
              {img ? <Img src={img} alt={name} className={s.prayerImg} /> : <span className={s.prayerImg} />}
              <span className={s.prayerShade} aria-hidden="true" />
              <p className={s.prayerAr} lang="ar" dir="rtl">
                {ar}
              </p>
              <div className={s.prayerFoot}>
                <p className={s.prayerName}>{name}</p>
                <p className={s.prayerTime}>{time}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Jumaah — prière du vendredi */}
        <div className={s.jumaah}>
          <ParallaxImage
            src={images.jumaaImg}
            alt={t('Prière du vendredi à la Mosquée de la Divinité')}
            ratio="16 / 9"
            className={s.jumaahImg}
          />
          <Reveal className={cx(s.jumaahCard, 'on-dark')} y={40}>
            <Pattern fade="right" className={s.jumaahPattern} />
            <div className={s.jumaahRow}>
              <p className={s.jumaahAr} lang="ar" dir="rtl">
                الجُمُعَة
              </p>
              <div className={s.jumaahContent}>
                <p className={s.jumaahLabel}>Jumaah</p>
                <h3 className={s.jumaahTime}>{t('Chaque vendredi à 14h00')}</h3>
              </div>
            </div>
            <div className={s.jumaahNote}>
              <span>{t('Tenue recommandée')}</span>
              <p>{t('La tenue blanche est de mise pour la prière du vendredi.')}</p>
            </div>
          </Reveal>
        </div>

        {/* Prières spéciales (fêtes) */}
        <div className={s.group}>
          <div className={s.cards}>
            {SPECIALS.map((sp, i) => (
              <Reveal as="article" className={s.card} key={sp.name} delay={i * 0.1}>
                <div className={s.cardMedia}>
                  <Img src={sp.img} alt={sp.name} />
                </div>
                <div className={s.cardBody}>
                  <p className={s.cardAr} lang="ar" dir="rtl">
                    {sp.ar}
                  </p>
                  <h4 className={s.cardName}>{sp.name}</h4>
                  <p className={s.cardSub}>{sp.sub}</p>
                  <p className={s.cardTime}>{t(sp.time)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Prières propres à la Mosquée de la Divinité */}
        <div className={s.group}>
          <div className={s.cards}>
            {PROPRES.map((p, i) => (
              <Reveal as="article" className={s.card} key={p.name} delay={i * 0.1}>
                <div className={s.cardMedia}>
                  <Img src={p.img} alt={p.name} />
                </div>
                <div className={s.cardBody}>
                  <p className={s.cardAr} lang="ar" dir="rtl">
                    {p.ar}
                  </p>
                  <h4 className={s.cardName}>{p.name}</h4>
                  <p className={s.cardWhen}>{t(p.when)}</p>
                  <p className={s.cardDesc}>{t(p.desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
