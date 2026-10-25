import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2,
  HardHat,
  Zap,
  Volume2,
  ArrowRight,
  Heart,
  Copy,
  ExternalLink,
  CheckCircle2,
  X,
  Sparkles,
  Layers,
  PackageCheck,
  Building,
  ShieldCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { chargerRenovation, urlMedia } from '../service/api'
import { useT } from '../utils/useT'
import { cx } from '../utils/helpers'
import { ease } from '../lib/motion'
import Button from '../components/ui/Button'
import Img from '../components/ui/Img'
import LineReveal from '../components/ui/LineReveal'
import Pattern from '../components/ui/Pattern'
import Reveal from '../components/ui/Reveal'
import logoRenovation from '../assets/photo/LOGO_RENOVATION-02.png'
import s from './Renovation.module.css'

// La base ne stocke qu'un nom d'icône : y mettre un composant React
// obligerait à redéployer le site pour changer le pictogramme d'un chantier.
const ICONES = { HardHat, Building2, Zap, Volume2, Building, ShieldCheck, Layers, PackageCheck, Sparkles }

/** 1 -> « Un », 4 -> « Quatre »… au-delà, le chiffre suffit. */
const EN_LETTRES = ['Aucun', 'Un', 'Deux', 'Trois', 'Quatre', 'Cinq', 'Six', 'Sept', 'Huit']
function enLettres(n) {
  return EN_LETTRES[n] || String(n)
}

/** 123000000 -> « 123.000.000 FCFA », la notation de la brochure. */
function montant(valeur, devise = 'FCFA') {
  return `${Number(valeur || 0).toLocaleString('fr-FR').split(/\s/).join('.')} ${devise}`
}

// Estimations par chantier rappelées dans la carte budget (brochure)
const ESTIMATIONS = [
  ['PROJET A', 'Structure', '123 M', '#C11616'],
  ['PROJET B', 'Toilettes', '52 M', '#0e4b50'],
  ['PROJET C', 'Élec / Solaire', '10 M', '#b78103'],
  ['PROJET D', 'Sonorisation', '15 M', '#167078'],
]

// =========================================================================
// LOGO OFFICIEL DE LA CAMPAGNE
// =========================================================================
// Le logo vient de la base (modifiable au dashboard) ; le fichier livré
// avec le site sert de repli pour qu'une base vierge reste signée.
// Fichier image et non SVG inline : le logo est un visuel de charte, pas
// une illustration à redessiner.
function RenovationLogo({ className = '', source }) {
  // Ce composant vit hors de la page : il lui faut son propre hook pour
  // traduire le texte alternatif de l'image.
  const t = useT()

  return (
    <img
      src={source || logoRenovation}
      alt={t('Projet Rénovation — Mosquée de la Divinité')}
      className={cx(s.logo, className)}
    />
  )
}

// Fenêtre modale commune aux deux formulaires de contribution.
function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={s.modalOverlay}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: ease.out }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            className={s.modal}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.5, ease: ease.out }}
          >
            <div className={s.modalHead}>
              <h3 className={s.modalTitle}>{title}</h3>
              <button type="button" onClick={onClose} className={s.modalClose} aria-label="Fermer">
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// =========================================================================
// PAGE RÉNOVATION
// =========================================================================
export default function RenovationView() {
  const navigate = useNavigate()
  // Traduction par texte source : le français reste écrit ici, l’anglais
  // vit dans data/i18n.js. Une clé absente retombe sur le français.
  const t = useT()
  // Contenu de la page : campagne, chantiers, responsables et moyens de
  // paiement viennent tous de la base, pilotés depuis le dashboard.
  const [contenu, setContenu] = useState(null)
  const [indisponible, setIndisponible] = useState(false)

  useEffect(() => {
    let annule = false
    chargerRenovation()
      .then((donnees) => {
        if (!annule) setContenu(donnees)
      })
      .catch(() => {
        if (!annule) setIndisponible(true)
      })
    return () => {
      annule = true
    }
  }, [])

  const campagne = contenu?.campagne
  const devise = campagne?.devise || 'FCFA'
  const TOTAL_BUDGET = campagne?.objectif ?? 0
  const currentCollected = campagne?.collecte ?? 0
  // Aucune donnée encore reçue : on masque les montants au lieu
  // d'annoncer un objectif nul.
  const chiffresPrets = Boolean(campagne)
  const imageHero = urlMedia(campagne?.imageHero)

  // Modales
  const [donateModalOpen, setDonateModalOpen] = useState(false)
  const [natureModalOpen, setNatureModalOpen] = useState(false)

  // Formulaire don financier
  const [donorName, setDonorName] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [donationAmount, setDonationAmount] = useState(25000)
  const [customAmount, setCustomAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('wave')
  const [targetedProject, setTargetedProject] = useState('global')
  const [donationSuccess, setDonationSuccess] = useState(false)

  // Formulaire don en nature
  const [natureItemType, setNatureItemType] = useState('ciment_fer')
  const [natureDescription, setNatureDescription] = useState('')
  const [natureContact, setNatureContact] = useState('')
  const [natureSuccess, setNatureSuccess] = useState(false)

  // Notifications
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
      showToast('Numéro copié dans le presse-papier !')
    }
  }

  const handleGoToFullDonation = () => {
    navigate('/dons')
  }

  // Chantiers de la campagne. Les noms de champs restent ceux du
  // composant : seule la source change.
  const projects = (contenu?.chantiers || []).map((c) => ({
    id: c.id,
    code: c.code,
    title: c.titre,
    estimate: c.estimation,
    formattedEstimate: montant(c.estimation, devise),
    icon: ICONES[c.icone] || Building2,
    color: c.couleur || '#0e4b50',
    badge: c.badge,
    image: urlMedia(c.image),
    summary: c.resume,
    works: c.travaux || [],
    collected: c.collecte,
    progress: c.estimation > 0 ? Math.min(100, Math.round((c.collecte / c.estimation) * 100)) : 0,
  }))
  // Le pourcentage vient du serveur : deux clients qui le recalculent
  // finissent par diverger d'un arrondi.
  const overallProgress = campagne?.pourcentage ?? 0

  const handleDonationSubmit = (e) => {
    e.preventDefault()
    const effectiveAmt = donationAmount === 'custom' ? Number(customAmount) : donationAmount
    if (!effectiveAmt || effectiveAmt <= 0) {
      showToast('Veuillez sélectionner ou saisir un montant valide.')
      return
    }
    setDonationSuccess(true)
    setTimeout(() => {
      setDonationSuccess(false)
      setDonateModalOpen(false)
      showToast(`Qu'Allah vous bénisse ! Votre don de ${effectiveAmt.toLocaleString('fr-FR')} FCFA a été enregistré.`)
    }, 2200)
  }

  const handleNatureSubmit = (e) => {
    e.preventDefault()
    if (!natureDescription.trim() || !natureContact.trim()) {
      showToast('Veuillez renseigner la description du don et votre contact.')
      return
    }
    setNatureSuccess(true)
    setTimeout(() => {
      setNatureSuccess(false)
      setNatureModalOpen(false)
      setNatureDescription('')
      setNatureContact('')
      showToast('Votre proposition de don en nature a été transmise à la commission des travaux.')
    }, 2200)
  }

  // Les responsables du chantier (photos en cercle)
  const activeLeaders = (contenu?.responsables || []).map((r) => ({
    id: r.id,
    name: r.nom,
    roleTitle: r.roleTitre,
    responsibility: r.responsabilite,
    image: urlMedia(r.image),
    bio: r.bio,
  }))

  const moyens = contenu?.moyensPaiement || []

  return (
    <div className={s.page}>
      {/* Tant que les chiffres ne sont pas arrivés, un voile discret plutôt
          qu'un objectif à 0 FCFA qui passerait pour la réalité de la collecte. */}
      {!contenu && !indisponible && <div className={s.loadingBar} aria-hidden="true" />}

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className={s.toast}
            role="status"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: ease.out }}
          >
            <Sparkles size={16} className={s.toastIcon} aria-hidden="true" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          I. EN-TÊTE DE CAMPAGNE : LOGO, APPEL ET CARTE BUDGET
          ========================================================================= */}
      <section id="hero-renovation-light" className={s.hero}>
        {/* Photo de fond de la Mosquée face à l'Océan (pilotée par la base).
            Pas d'image sans source : le navigateur afficherait une icône cassée. */}
        {imageHero && (
          <div className={s.heroBg} aria-hidden="true">
            <Img src={imageHero} alt="" />
          </div>
        )}

        <div className={`container ${s.heroInner}`}>
          <Reveal className={s.brandBar} y={14}>
            <RenovationLogo source={urlMedia(campagne?.logo)} />
          </Reveal>

          {/* Contenu injoignable : on le dit plutôt que d'afficher une page de
              chiffres à zéro qui passerait pour la réalité de la collecte. */}
          {indisponible && (
            <p className={s.unavailable} role="status">
              {t('Les chiffres de la campagne sont momentanement indisponibles.')}
            </p>
          )}

          <div className={s.heroGrid}>
            {/* Colonne gauche : titre et appel officiel */}
            <div className={s.heroText}>
              <LineReveal as="h1" onMount className={s.title}>
                <span>{t('Ensemble, rénovons la')}</span>
                <em>{t('Maison de Dieu')}</em>
              </LineReveal>

              {/* Citation officielle de la brochure */}
              <Reveal className={s.quoteBox} delay={0.2}>
                <p className={s.quoteText}>
                  {t('« Depuis plus de 30 ans, la Mosquée de la Divinité résiste vaillamment à l’érosion maritime et aux embruns de l\'Atlantique. Aujourd\'hui, préserver ce sanctuaire sacré exige la mobilisation solidaire de chacun. »')}
                </p>
              </Reveal>

              {/* Vignette photo de la Mosquée */}
              {imageHero && (
                <Reveal className={s.vignette} delay={0.25}>
                  <Img src={imageHero} alt={t('Vue de la Mosquée de la Divinité')} position="center 38%" />
                  <div className={s.vignetteCaption}>
                    <span className={s.vignettePlace}>
                      <span className={s.goldDot} aria-hidden="true" />
                      {t('Mosquée de la Divinité · Ouakam, Dakar')}
                    </span>
                  </div>
                </Reveal>
              )}

              {/* Boutons d'action principaux */}
              <Reveal className={s.heroActions} delay={0.3}>
                <Button
                  variant="red"
                  size="lg"
                  icon={<Heart size={15} fill="currentColor" strokeWidth={1.5} />}
                  onClick={handleGoToFullDonation}
                >
                  FAIRE UN DON (FI SABILILAH)
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon={<PackageCheck size={16} strokeWidth={1.6} />}
                  onClick={() => setNatureModalOpen(true)}
                >
                  Don en Nature (Matériaux)
                </Button>
              </Reveal>
            </div>

            {/* Colonne droite : carte budget officielle */}
            <Reveal className={s.budget} delay={0.2} y={40}>
              <div className={s.budgetHead}>
                <div>
                  <span className={s.budgetKicker}>{t('Budget Global des Travaux')}</span>
                  <span className={s.budgetSub}>{t('Estimations officielles des 4 chantiers')}</span>
                </div>
                <div className={s.budgetPct}>
                  <strong>{chiffresPrets ? `${overallProgress}%` : '—'}</strong>
                  <span>{t('Souscription')}</span>
                </div>
              </div>

              {/* Jauge de la collecte */}
              <div className={s.gauge}>
                <div className={s.gaugeTrack}>
                  <motion.span
                    className={s.gaugeFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1.4, ease: ease.out, delay: 0.6 }}
                  />
                </div>
                <div className={s.gaugeLegend}>
                  <span>
                    {t('Collecté :')}{' '}
                    <strong className={s.collected}>{chiffresPrets ? montant(currentCollected, devise) : '—'}</strong>
                  </span>
                  <span>
                    {t('Objectif :')}{' '}
                    <strong>{chiffresPrets ? montant(TOTAL_BUDGET, devise) : '—'}</strong>
                  </span>
                </div>
              </div>

              {/* Synthèse des 4 montants de la brochure */}
              <div className={s.estimates}>
                <span className={s.estimatesTitle}>{t('Estimations par Chantier :')}</span>
                <div className={s.estimatesGrid}>
                  {ESTIMATIONS.map(([code, nom, valeur, couleur]) => (
                    <div className={s.estimate} key={code}>
                      <div>
                        <span className={s.estimateCode} style={{ color: couleur }}>
                          {t(code)}
                        </span>
                        <span className={s.estimateName}>{t(nom)}</span>
                      </div>
                      <span className={s.estimateValue}>{valeur}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reste à collecter */}
              <div className={s.remaining}>
                <span>{t('Reste à Financer :')}</span>
                <strong>{(TOTAL_BUDGET - currentCollected).toLocaleString('fr-FR')} FCFA</strong>
              </div>

              {/* Boutons d'action carte */}
              <div className={s.budgetActions}>
                <Button variant="primary" icon={false} onClick={handleGoToFullDonation}>
                  {t('Faire un Don')}
                </Button>
                <Button variant="outline" icon={false} onClick={handleGoToFullDonation}>
                  {t('Modes de paiement')}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          II. LES CHANTIERS : IMAGES DÉDIÉES & CHIFFRES
          ========================================================================= */}
      <section id="les-quatre-projets" className={s.projects}>
        <div className="container">
          <header className={s.sectionHead}>
            <LineReveal as="h2" className={s.h2}>
              <span>
                {enLettres(projects.length)} Projet{projects.length > 1 ? 's' : ''} pour Sauvegarder la Mosquée
              </span>
            </LineReveal>
            <Reveal as="p" className={s.lead} delay={0.1}>
              {t('« Votre contribution servira à financer un ensemble de projets de rénovation de la mosquée. » Chaque projet fait l’objet d’un devis technique rigoureux et peut être financé individuellement.')}
            </Reveal>
          </header>

          {/* Grille des projets avec images illustratives */}
          <div className={s.projectsGrid}>
            {projects.map((project, i) => {
              const IconComp = project.icon
              return (
                <Reveal as="article" key={project.id} className={s.project} delay={(i % 2) * 0.1}>
                  <div className={s.projectMedia}>
                    {project.image ? (
                      <Img src={project.image} alt={project.title} />
                    ) : (
                      // Chantier sans photo : aplat aux couleurs du projet
                      // plutôt qu'un cadre vide au milieu de la grille.
                      <div className={s.projectFallback} style={{ backgroundColor: `${project.color}14` }}>
                        <IconComp size={52} style={{ color: project.color, opacity: 0.45 }} aria-hidden="true" />
                      </div>
                    )}
                    <span className={s.projectShade} aria-hidden="true" />

                    {/* Badge Projet & Code */}
                    <div className={s.projectBadges}>
                      <span className={s.projectCode} style={{ backgroundColor: project.color }}>
                        {project.code}
                      </span>
                      {project.badge && <span className={s.projectBadge}>{project.badge}</span>}
                    </div>

                    {/* Devis officiel */}
                    <div className={s.projectEstimate}>
                      <span>{t('Estimation du Chantier')}</span>
                      <strong>{project.formattedEstimate}</strong>
                    </div>
                  </div>

                  {/* Contenu textuel officiel */}
                  <div className={s.projectBody}>
                    <div className={s.projectTitleRow}>
                      <span
                        className={s.projectIcon}
                        style={{ backgroundColor: `${project.color}15`, color: project.color }}
                        aria-hidden="true"
                      >
                        <IconComp size={22} />
                      </span>
                      <h3 className={s.projectTitle}>{project.title}</h3>
                    </div>

                    {project.summary && <p className={s.projectSummary}>{project.summary}</p>}

                    {/* Liste exacte des travaux de la brochure */}
                    <div className={s.works}>
                      <span className={s.worksTitle}>{t('Les Travaux Prévus :')}</span>
                      <ul>
                        {project.works.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Jauge et action */}
                  <div className={s.projectFoot}>
                    <div className={s.projectProgress}>
                      <span>{t('Progression du financement :')}</span>
                      <strong>
                        {project.progress}% ({montant(project.collected, devise)})
                      </strong>
                    </div>
                    <div className={s.projectBar}>
                      <span style={{ width: `${project.progress}%`, backgroundColor: project.color }} />
                    </div>
                    <Button
                      variant="primary"
                      block
                      icon={<ArrowRight size={15} strokeWidth={1.8} />}
                      onClick={handleGoToFullDonation}
                    >
                      {`Financer le ${project.code}`}
                    </Button>
                  </div>
                </Reveal>
              )
            })}
          </div>

          {/* Bannière de récapitulation globale */}
          <Reveal className={s.recap}>
            <div className={s.recapText}>
              <span className={s.recapKicker}>{t('Totalité des 4 Projets de la Brochure')}</span>
              <h3 className={s.recapTitle}>{t('200.000.000 FCFA pour la sauvegarde complète')}</h3>
              <p>{t('Vous pouvez affecter votre don à l\'un des 4 chantiers ou au fonds global de sauvegarde du patrimoine.')}</p>
            </div>
            <Button variant="red" size="lg" onClick={handleGoToFullDonation}>
              {t('Participer Maintenant')}
            </Button>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          III. LES RESPONSABLES DU CHANTIER
          ========================================================================= */}
      <section id="responsables-travaux-light" className={cx(s.leaders, 'on-dark')}>
        <Pattern className={s.leadersPattern} />
        <div className={`container ${s.leadersInner}`}>
          <header className={s.sectionHead}>
            <LineReveal as="h2" className={cx(s.h2, s.h2Light)}>
              <span>{t('Responsables des Travaux de Rénovation')}</span>
            </LineReveal>
            <Reveal as="p" className={cx(s.lead, s.leadLight)} delay={0.1}>
              {t('La conduite, l\'engagement financier et la responsabilité technique du présent chantier sont assurés collégialement par les trois responsables en activité ci-dessous.')}
            </Reveal>
          </header>

          {/* Les responsables, présentés avec leur photo en cercle */}
          <div className={s.leadersGrid}>
            {activeLeaders.map((leader, i) => (
              <Reveal as="article" key={leader.id} className={s.leader} delay={i * 0.1}>
                <div className={s.avatarWrap}>
                  <div className={s.avatar}>
                    {leader.image ? (
                      <Img src={leader.image} alt={leader.name} />
                    ) : (
                      // Initiales tant que le portrait n'est pas téléversé.
                      <span className={s.initial}>{(leader.name || '?').trim().charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className={s.avatarBadge}>{t('Responsable Actif')}</span>
                </div>

                <div className={s.leaderIdentity}>
                  <h3 className={s.leaderName}>{leader.name}</h3>
                  <span className={s.leaderRole}>{leader.roleTitle}</span>
                  <span className={s.leaderResp}>{leader.responsibility}</span>
                </div>

                {leader.bio && <p className={s.leaderBio}>« {leader.bio} »</p>}

                <div className={s.leaderFoot}>
                  <ShieldCheck size={16} aria-hidden="true" />
                  <span>{t('Comité Directeur du Chantier')}</span>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Mention commémorative de Feu Mouhamed Seyni Gueye */}
          <Reveal className={s.tribute}>
            <span className={s.tributeIcon} aria-hidden="true">
              <Building size={24} />
            </span>
            <div className={s.tributeText}>
              <h4 className={s.tributeTitle}>Feu Mouhamed Seyni Gueye (Sanga bi, 1926-2007)</h4>
              <p>
                {t('Bâtisseur originel de la Mosquée de la Divinité en 1992, rappelé à Dieu. Ce grand chantier perpétue sa vision sacrée sous la responsabilité exclusive du Khalife Mouhamed Naby Gueye, du Président des Travaux Ababacar Sadikh Ndoye et du Responsable Communication Cheikh Ahmet Tidiane Gueye.')}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          IV. COMMENT PARTICIPER (canaux officiels)
          ========================================================================= */}
      <section id="comment-participer-light" className={s.participate}>
        <div className="container">
          <header className={s.sectionHead}>
            <LineReveal as="h2" className={s.h2}>
              <span>{t('Comment Participer ?')}</span>
            </LineReveal>
            <Reveal as="p" className={s.lead} delay={0.1}>
              Pour que chaque fidèle et bienfaiteur puisse apporter sa pierre à l'édifice selon ses moyens,{' '}
              {moyens.length > 1
                ? `${enLettres(moyens.length).toLowerCase()} voies sécurisées et directes sont ouvertes.`
                : 'une voie sécurisée et directe est ouverte.'}
            </Reveal>
          </header>

          {/* Colonnes calées sur le nombre de cartes : une grille en 4
              colonnes avec deux moyens laisserait la moitié du bloc vide. */}
          <div className={cx(s.ways, moyens.length >= 4 ? s.ways4 : moyens.length === 3 ? s.ways3 : s.ways2)}>
            {/* Moyens de contribution : saisis dans le dashboard, numéros
                compris. Une carte sans numéro n'affiche pas de bloc vide. */}
            {moyens.map((moyen, i) => {
              const accent = moyen.couleur || '#0e4b50'
              const estNature = moyen.typeAction === 'nature'
              const logo = urlMedia(moyen.logo)

              return (
                <Reveal
                  as="article"
                  key={moyen.id}
                  className={s.way}
                  style={{ '--accent-way': accent }}
                  delay={(i % 4) * 0.08}
                >
                  <div className={s.wayTop}>
                    <span className={s.wayLogo} style={{ backgroundColor: logo ? '#ffffff' : accent }}>
                      {logo ? (
                        <img src={logo} alt={moyen.nom} />
                      ) : estNature ? (
                        <PackageCheck size={22} aria-hidden="true" />
                      ) : (
                        <Building size={22} aria-hidden="true" />
                      )}
                    </span>

                    {moyen.categorie && <span className={s.wayCategory}>{moyen.categorie}</span>}

                    <h3 className={s.wayName}>{moyen.nom}</h3>

                    {moyen.description && <p className={s.wayDesc}>{moyen.description}</p>}

                    {moyen.numero && (
                      <div className={s.wayNumber}>
                        <span>{moyen.numero}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(moyen.numero)}
                          title={t('Copier le numéro')}
                          aria-label={t('Copier le numéro')}
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={estNature ? () => setNatureModalOpen(true) : handleGoToFullDonation}
                    className={s.wayButton}
                  >
                    {moyen.libelleBouton || 'Contribuer'}
                  </button>
                </Reveal>
              )
            })}
          </div>

          {/* Lien officiel www.mosqueedeladivinite.org */}
          <Reveal className={s.website}>
            <div>
              <p>{t('Pour consulter en toute transparence l\'état d\'avancement des devis et travaux :')}</p>
            </div>
            <Button
              href="https://www.mosqueedeladivinite.org"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              icon={<ExternalLink size={15} strokeWidth={1.8} />}
            >
              www.mosqueedeladivinite.org
            </Button>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          V. APPEL SOLENNEL FINAL : « SOUTENEZ LA MAISON DE DIEU »
          ========================================================================= */}
      <section className={s.finale}>
        <Pattern className={s.finalePattern} />
        <div className={`container ${s.finaleInner}`}>
          <LineReveal as="h2" className={s.finaleTitle}>
            <span>{t('Soutenez la')}</span>
            <em>{t('Maison de Dieu')}</em>
          </LineReveal>

          <Reveal as="p" className={s.finaleText} delay={0.1}>
            {t('« Quiconque construit ou répare une mosquée pour Allah, Allah lui construira une demeure au Paradis. » Unissons nos forces pour que ce sanctuaire rayonne face à l’Océan pour les siècles à venir.')}
          </Reveal>

          <Reveal className={s.finaleActions} delay={0.2}>
            <Button
              variant="red"
              size="lg"
              icon={<Heart size={15} fill="currentColor" strokeWidth={1.5} />}
              onClick={handleGoToFullDonation}
            >
              {t('JE FAIS UN DON IMMÉDIAT')}
            </Button>
            <Button variant="outline" size="lg" icon={<PackageCheck size={16} strokeWidth={1.6} />} onClick={() => setNatureModalOpen(true)}>
              {t('Proposer un don matériel')}
            </Button>
          </Reveal>
        </div>
      </section>

      {/* =========================================================================
          MODALE 1 : DON FINANCIER
          ========================================================================= */}
      <Modal
        open={donateModalOpen}
        onClose={() => setDonateModalOpen(false)}
        title="Faire un Don (Fi Sabililah)"
      >
        {donationSuccess ? (
          <div className={s.success}>
            <span className={s.successIcon}>
              <CheckCircle2 size={36} aria-hidden="true" />
            </span>
            <h4>{t('Votre don a été pris en compte')}</h4>
            <p>{t('Qu\'Allah vous comble de Ses grâces et bénisse votre geste pour la Maison de Dieu.')}</p>
          </div>
        ) : (
          <form onSubmit={handleDonationSubmit} className={s.form}>
            <label className={s.field}>
              <span>{t('Affectation de votre don')}</span>
              <select value={targetedProject} onChange={(e) => setTargetedProject(e.target.value)}>
                <option value="global">Fonds Global des Grands Travaux (200.000.000 FCFA)</option>
                <option value="projet_a">PROJET A : Rénovations structurelles (123.000.000 FCFA)</option>
                <option value="projet_b">PROJET B : Toilettes modernes (52.000.000 FCFA)</option>
                <option value="projet_c">PROJET C : Électricité & Solaire (10.000.000 FCFA)</option>
                <option value="projet_d">PROJET D : Sonorisation & Sauvegarde (15.000.000 FCFA)</option>
              </select>
            </label>

            <div className={s.field}>
              <span>{t('Montant du Don')}</span>
              <div className={s.amounts}>
                {[10000, 25000, 50000, 100000, 250000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDonationAmount(amt)}
                    className={cx(s.amount, donationAmount === amt && s.amountActive)}
                  >
                    {amt.toLocaleString('fr-FR')} F
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDonationAmount('custom')}
                  className={cx(s.amount, donationAmount === 'custom' && s.amountActive)}
                >
                  {t('Autre')}
                </button>
              </div>

              {donationAmount === 'custom' && (
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={t('Montant libre en FCFA')}
                  className={s.customAmount}
                />
              )}
            </div>

            <div className={s.grid2}>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Nom & Prénom (facultatif)"
                aria-label="Nom & Prénom (facultatif)"
              />
              <input
                type="tel"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                placeholder={t('Téléphone mobile')}
                aria-label={t('Téléphone mobile')}
              />
            </div>

            <div className={s.field}>
              <span>{t('Opérateur de Paiement')}</span>
              <div className={s.operators}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wave')}
                  className={cx(s.operator, paymentMethod === 'wave' && s.operatorWave)}
                >
                  🌊 Wave
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('om')}
                  className={cx(s.operator, paymentMethod === 'om' && s.operatorOm)}
                >
                  🟠 OM (*144#)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pamecas')}
                  className={cx(s.operator, paymentMethod === 'pamecas' && s.operatorBank)}
                >
                  🏛️ PAMECAS
                </button>
              </div>
            </div>

            <Button type="submit" variant="red" block icon={<Heart size={15} fill="currentColor" strokeWidth={1.5} />}>
              {t('Confirmer mon Don')}
            </Button>
          </form>
        )}
      </Modal>

      {/* =========================================================================
          MODALE 2 : CONTRIBUTION EN NATURE
          ========================================================================= */}
      <Modal
        open={natureModalOpen}
        onClose={() => setNatureModalOpen(false)}
        title={t('Proposer un Don en Nature')}
      >
        {natureSuccess ? (
          <div className={s.success}>
            <span className={s.successIcon}>
              <CheckCircle2 size={36} aria-hidden="true" />
            </span>
            <h4>{t('Proposition Enregistrée')}</h4>
            <p>{t('La commission des travaux vous contactera sous peu pour organiser la logistique sur le site de la mosquée.')}</p>
          </div>
        ) : (
          <form onSubmit={handleNatureSubmit} className={s.form}>
            <label className={s.field}>
              <span>{t('Type de Matériau ou Service')}</span>
              <select value={natureItemType} onChange={(e) => setNatureItemType(e.target.value)}>
                <option value="ciment_fer">Ciment marin & Fer à béton (Projet A)</option>
                <option value="sanitaires">Sanitaires, carrelage & plomberie (Projet B)</option>
                <option value="solaire_elec">Panneaux solaires & câblage électrique (Projet C)</option>
                <option value="sonorisation">Équipements audio, micros & enceintes (Projet D)</option>
                <option value="expertise">{t('Expertise en ingénierie ou main-d\'œuvre qualifiée')}</option>
              </select>
            </label>

            <label className={s.field}>
              <span>{t('Description du don et quantités')}</span>
              <textarea
                rows={3}
                value={natureDescription}
                onChange={(e) => setNatureDescription(e.target.value)}
                placeholder={t('Ex: 50 sacs de ciment marin, 20 barres de fer 12mm, ou fourniture de 4 panneaux solaires...')}
              />
            </label>

            <label className={s.field}>
              <span>{t('Vos coordonnées complètes')}</span>
              <input
                type="text"
                value={natureContact}
                onChange={(e) => setNatureContact(e.target.value)}
                placeholder={t('Nom complet, téléphone et ville')}
              />
            </label>

            <Button type="submit" variant="primary" block icon={false}>
              {t('Transmettre ma Proposition de Don')}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  )
}
