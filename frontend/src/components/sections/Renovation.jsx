import { useEffect, useState } from 'react'
import Button from '../ui/Button'
import LineReveal from '../ui/LineReveal'
import Reveal from '../ui/Reveal'
import { useT } from '../../utils/useT'
import { chargerRenovation } from '../../service/api'
import s from './Renovation.module.css'

// Jauge affichée directement à son niveau (pas de remplissage au défilement).
function Jauge({ pct, color, label }) {
  return (
    <div
      className={s.bar}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <span className={s.fill} style={{ background: color || undefined, transform: `scaleX(${pct / 100})` }} />
    </div>
  )
}

// RÉNOVATION — « Préserver l'Héritage ».
//
// Les chantiers et leur avancement viennent de la base, comme sur la page
// rénovation : les deux écrans doivent annoncer le même chiffre. Les
// 65 % et 15 % qui vivaient ici étaient décoratifs, et contredisaient la
// collecte réelle affichée deux clics plus loin.
export default function Renovation() {
  const t = useT()
  const [campagne, setCampagne] = useState(null)
  const [chantiers, setChantiers] = useState([])

  useEffect(() => {
    let annule = false
    chargerRenovation()
      .then((donnees) => {
        if (annule) return
        setCampagne(donnees?.campagne || null)
        setChantiers(donnees?.chantiers || [])
      })
      .catch(() => {
        // Silencieux : la section s'efface. Un visiteur venu lire
        // l'histoire de la mosquée n'a pas à voir une erreur technique.
      })
    return () => {
      annule = true
    }
  }, [])

  // Rien en base ou API muette : la section disparaît plutôt que
  // d'afficher des barres vides.
  if (chantiers.length === 0) return null

  return (
    <section id="renovation" className={s.section} aria-labelledby="renovation-title">
      <div className="container">
        <header className={s.head}>
          <div className={s.headMain}>
            <LineReveal as="h2" id="renovation-title" className={s.title}>
              <span>{t('Préserver')}</span>
              <em>{t('l’Héritage')}</em>
            </LineReveal>
          </div>
          {campagne && (
            <Reveal className={s.global} delay={0.15}>
              <span className={s.globalNum}>{campagne.pourcentage}%</span>
              <span className={s.globalLabel}>{t('du budget global collecté')}</span>
            </Reveal>
          )}
        </header>

        <ol className={s.grid}>
          {chantiers.map((c, i) => {
            // Borné à 100 : un chantier sur-financé ne doit pas faire
            // déborder la barre hors de sa carte.
            const pct =
              c.estimation > 0 ? Math.min(100, Math.round((c.collecte / c.estimation) * 100)) : 0

            return (
              <Reveal as="li" className={s.card} key={c.id} delay={(i % 2) * 0.1}>
                {/* Titres et résumés sont saisis au dashboard : ils ne
                    passent pas par t(), le dictionnaire ne les connaît pas. */}
                <h3 className={s.cardTitle}>{c.titre}</h3>
                {c.resume && <p className={s.cardText}>{c.resume}</p>}
                <div className={s.progress}>
                  <Jauge pct={pct} color={c.couleur} label={c.titre} />
                  <p className={s.pct}>
                    <strong>{pct}%</strong> {t('du budget collecté')}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </ol>

        <Reveal className={s.actions}>
          <Button to="/renovation" variant="primary" size="lg">
            {t('En savoir plus sur le projet')}
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
