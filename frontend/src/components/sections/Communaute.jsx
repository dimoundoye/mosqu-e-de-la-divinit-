import actionNdogou from '../../assets/photo/Korite.jpg'
import actionSchool from '../../assets/photo/Fayfaat.jpg'
import actionBlood from '../../assets/photo/1er Octobre.jpg'
import actionMedical from '../../assets/photo/659156031_18319742143264052_4431240640787869140_n.jpg'
import actionSetSetal from '../../assets/photo/Journées prieres.jpg'
import actionSolidarity from '../../assets/photo/Exposition-2.jpg'
import Img from '../ui/Img'
import LineReveal from '../ui/LineReveal'
import Reveal from '../ui/Reveal'
import { useT } from '../../utils/useT'
import s from './Communaute.module.css'

const ACTIONS = [
  {
    title: 'Ndogou gratuit — Ramadan',
    body: 'Du lundi au vendredi pendant le Ramadan. Rupture du jeûne offerte sur place. 150 personnes accueillies en moyenne chaque soir.',
    image: actionNdogou,
    alt: 'Tables de rupture du jeûne pendant le Ramadan'
  },
  {
    title: 'Soutien scolaire',
    body: "Organisé par CEEMNA, le collectif des élèves et étudiants du mouvement Naby Allah. 300 kits scolaires à chaque rentrée depuis 2012. Plus de 3 600 enfants accompagnés. Soutien tout au long de l'année.",
    image: actionSchool,
    alt: 'Enfants accompagnés dans le cadre du soutien scolaire'
  },
  {
    title: 'Don de sang',
    body: 'Organisé par CEEMNA en partenariat avec les Scouts et Guides Musulmans du Sénégal. Chaque mars depuis 2013. 100 poches par édition. Plus de 1 000 poches au total.',
    image: actionBlood,
    alt: 'Don de sang organisé par la communauté'
  },
  {
    title: 'Consultation médicale gratuite',
    body: 'Organisée par la Commission Médicale Naby Allah et le Club Médical de Ouakam. Chaque mars, des soins gratuits sont offerts à la communauté et aux habitants du quartier.',
    image: actionMedical,
    alt: 'Consultation médicale gratuite pour les habitants du quartier'
  },
  {
    title: 'Set Setal',
    body: "Organisé par UFMNA, l'union des femmes musulmanes du mouvement Naby Allah. Chaque 2e week-end de décembre, la communauté se mobilise pour nettoyer la mosquée et ses alentours.",
    image: actionSetSetal,
    alt: 'Mobilisation communautaire pour nettoyer la mosquée'
  },
  {
    title: 'Solidarité Communautaire',
    body: "Aide aux plus démunis tout au long de l'année. Un soutien discret et continu, au cœur de la pratique Naby Allah.",
    image: actionSolidarity,
    alt: 'Solidarité et entraide au sein de la communauté'
  }
]

// COMMUNAUTÉ — actions communautaires menées toute l'année
export default function Communaute() {
  const t = useT()

  return (
    <section id="communaute" className={s.section} aria-labelledby="communaute-title">
      <div className="container">
        <header className={s.head}>
          <LineReveal as="h2" id="communaute-title" className={s.title}>
            <span>{t('Actions communautaires')}</span>
          </LineReveal>
        </header>

        <ol className={s.actions}>
          {ACTIONS.map((action, i) => (
            <Reveal as="li" className={s.action} key={action.title} delay={(i % 3) * 0.1}>
              <div className={s.media}>
                <Img src={action.image} alt={t(action.alt)} />
              </div>
              <div className={s.body}>
                <h3 className={s.actionTitle}>{t(action.title)}</h3>
                <p className={s.actionText}>{t(action.body)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
