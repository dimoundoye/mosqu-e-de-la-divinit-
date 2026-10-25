import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import Button from '../ui/Button'
import { usePanier } from '../../context/usePanier'
import { useT } from '../../utils/useT'
import { cx } from '../../utils/helpers'
import { envoyerCommande, messageErreur } from '../../service/api'
import { ease } from '../../lib/motion'
import s from './Panier.module.css'

const FRAIS_LIVRAISON = 2000

const CHAMPS_VIDES = {
  prenom: '',
  nom: '',
  email: '',
  telephone: '',
  modeLivraison: 'retrait',
  adresse: '',
  ville: 'Dakar',
  quartier: '',
  note: '',
}

/**
 * Tiroir du panier : récapitulatif, formulaire de commande, confirmation.
 *
 * Le formulaire est dans le tiroir plutôt que sur une page dédiée : le
 * visiteur qui hésite garde le catalogue derrière lui et n'a pas
 * l'impression d'entrer dans un tunnel de paiement.
 */
export default function Panier() {
  const t = useT()
  const lenis = useLenis()
  const { lignes, nombreArticles, sousTotal, ouvert, fermer, changerQuantite, retirer, vider } =
    usePanier()

  // 'panier' -> 'formulaire' -> 'confirmation'
  const [etape, setEtape] = useState('panier')
  const [valeurs, setValeurs] = useState(CHAMPS_VIDES)
  const [erreur, setErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [commande, setCommande] = useState(null)

  // Fermeture au clavier + blocage du défilement de la page derrière.
  useEffect(() => {
    if (!ouvert) return undefined
    const surTouche = (e) => {
      if (e.key === 'Escape') fermer()
    }
    document.addEventListener('keydown', surTouche)
    const avant = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    lenis?.stop()
    return () => {
      document.removeEventListener('keydown', surTouche)
      document.documentElement.style.overflow = avant
      lenis?.start()
    }
  }, [ouvert, fermer, lenis])

  const fraisLivraison = valeurs.modeLivraison === 'livraison' ? FRAIS_LIVRAISON : 0
  const total = sousTotal + fraisLivraison
  const fcfa = (n) => `${Number(n || 0).toLocaleString('fr-FR').split(/\s/).join(' ')} FCFA`

  function maj(champ, valeur) {
    setValeurs((v) => ({ ...v, [champ]: valeur }))
  }

  async function soumettre(e) {
    e.preventDefault()
    setErreur('')
    setEnvoi(true)

    try {
      const resultat = await envoyerCommande({
        prenom: valeurs.prenom.trim(),
        nom: valeurs.nom.trim(),
        email: valeurs.email.trim(),
        telephone: valeurs.telephone.trim(),
        modeLivraison: valeurs.modeLivraison,
        adresse: valeurs.adresse.trim() || undefined,
        ville: valeurs.ville.trim() || undefined,
        quartier: valeurs.quartier.trim() || undefined,
        note: valeurs.note.trim() || undefined,
        // On n'envoie que l'identifiant et la quantité : les prix sont
        // relus en base par le serveur.
        articles: lignes.map((l) => ({ produitId: l.produitId, quantite: l.quantite })),
      })

      setCommande(resultat)
      setEtape('confirmation')
      vider()
    } catch (err) {
      setErreur(messageErreur(err, t('L’envoi de la commande a échoué')))
    } finally {
      setEnvoi(false)
    }
  }

  function fermerEtReinitialiser() {
    fermer()
    // Remise à zéro différée : sinon l'utilisateur voit le tiroir changer
    // de contenu pendant l'animation de fermeture.
    setTimeout(() => {
      setEtape('panier')
      setValeurs(CHAMPS_VIDES)
      setCommande(null)
      setErreur('')
    }, 400)
  }

  return (
    <AnimatePresence>
      {ouvert && (
        <motion.div className={s.root} role="dialog" aria-modal="true" aria-label={t('Votre panier')}>
          <motion.div
            className={s.veil}
            onClick={fermerEtReinitialiser}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: ease.out }}
          />

          <motion.aside
            className={s.drawer}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: ease.inOut }}
          >
            <header className={s.head}>
              {etape === 'formulaire' ? (
                <button type="button" className={s.back} onClick={() => setEtape('panier')}>
                  <ArrowLeft size={16} strokeWidth={1.8} aria-hidden="true" /> {t('Retour au panier')}
                </button>
              ) : (
                <h2 className={s.title}>
                  {t('Votre panier')}
                  {nombreArticles > 0 && <span className={s.count}>{nombreArticles}</span>}
                </h2>
              )}
              <button type="button" className={s.close} onClick={fermerEtReinitialiser} aria-label={t('Fermer')}>
                <X size={18} strokeWidth={1.8} />
              </button>
            </header>

            {/* ---------- Étape 1 : récapitulatif ---------- */}
            {etape === 'panier' && (
              <>
                <div className={s.body} data-lenis-prevent>
                  {lignes.length === 0 ? (
                    <div className={s.empty}>
                      <ShoppingBag size={40} strokeWidth={1.2} aria-hidden="true" />
                      <p>{t('Votre panier est vide.')}</p>
                      <Button variant="primary" onClick={fermerEtReinitialiser}>
                        {t('Parcourir la boutique')}
                      </Button>
                    </div>
                  ) : (
                    <ul className={s.lines}>
                      {lignes.map((l) => (
                        <li className={s.line} key={l.produitId}>
                          <div className={s.thumb}>
                            {l.image ? (
                              <img src={l.image} alt="" />
                            ) : (
                              <ShoppingBag size={22} strokeWidth={1.3} aria-hidden="true" />
                            )}
                          </div>
                          <div className={s.lineBody}>
                            <p className={s.lineName}>{l.nom}</p>
                            <p className={s.linePrice}>{fcfa(l.prix)}</p>
                            <div className={s.qty}>
                              <button
                                type="button"
                                onClick={() => changerQuantite(l.produitId, l.quantite - 1)}
                                aria-label={t('Diminuer la quantité')}
                              >
                                <Minus size={14} strokeWidth={2} />
                              </button>
                              <span>{l.quantite}</span>
                              <button
                                type="button"
                                onClick={() => changerQuantite(l.produitId, l.quantite + 1)}
                                aria-label={t('Augmenter la quantité')}
                              >
                                <Plus size={14} strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                          <div className={s.lineEnd}>
                            <span className={s.lineTotal}>{fcfa(l.prix * l.quantite)}</span>
                            <button
                              type="button"
                              className={s.remove}
                              onClick={() => retirer(l.produitId)}
                              aria-label={t('Retirer cet article')}
                            >
                              <Trash2 size={16} strokeWidth={1.7} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {lignes.length > 0 && (
                  <footer className={s.foot}>
                    <div className={s.total}>
                      <span>{t('Sous-total')}</span>
                      <strong>{fcfa(sousTotal)}</strong>
                    </div>
                    <p className={s.note}>{t('Les frais de livraison sont calculés à l’étape suivante.')}</p>
                    <Button variant="gold" block onClick={() => setEtape('formulaire')}>
                      {t('Valider ma commande')}
                    </Button>
                  </footer>
                )}
              </>
            )}

            {/* ---------- Étape 2 : coordonnées ---------- */}
            {etape === 'formulaire' && (
              <form className={cx(s.body, s.form)} onSubmit={soumettre} data-lenis-prevent>
                <p className={s.formIntro}>
                  {t('Aucun compte n’est nécessaire. Ces informations servent uniquement à vous recontacter pour votre commande.')}
                </p>

                {erreur && (
                  <p className={s.error} role="alert">
                    {erreur}
                  </p>
                )}

                <div className={s.grid2}>
                  <label className={s.field}>
                    <span>{t('Prénom')} *</span>
                    <input
                      type="text"
                      value={valeurs.prenom}
                      onChange={(e) => maj('prenom', e.target.value)}
                      required
                      autoComplete="given-name"
                    />
                  </label>
                  <label className={s.field}>
                    <span>{t('Nom')} *</span>
                    <input
                      type="text"
                      value={valeurs.nom}
                      onChange={(e) => maj('nom', e.target.value)}
                      required
                      autoComplete="family-name"
                    />
                  </label>
                </div>

                <label className={s.field}>
                  <span>{t('Adresse e-mail')} *</span>
                  <input
                    type="email"
                    value={valeurs.email}
                    onChange={(e) => maj('email', e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                  />
                </label>

                <label className={s.field}>
                  <span>{t('Téléphone')} *</span>
                  <input
                    type="tel"
                    value={valeurs.telephone}
                    onChange={(e) => maj('telephone', e.target.value)}
                    required
                    autoComplete="tel"
                    placeholder="+221 77 000 00 00"
                  />
                </label>

                <fieldset className={s.modes}>
                  <legend>{t('Comment souhaitez-vous recevoir votre commande ?')}</legend>
                  <label className={cx(s.mode, valeurs.modeLivraison === 'retrait' && s.modeActive)}>
                    <input
                      type="radio"
                      name="modeLivraison"
                      value="retrait"
                      checked={valeurs.modeLivraison === 'retrait'}
                      onChange={(e) => maj('modeLivraison', e.target.value)}
                    />
                    <span className={s.modeTitle}>{t('Retrait à la mosquée')}</span>
                    <span className={s.modeNote}>{t('Gratuit · Ouakam, Corniche-Ouest')}</span>
                  </label>
                  <label className={cx(s.mode, valeurs.modeLivraison === 'livraison' && s.modeActive)}>
                    <input
                      type="radio"
                      name="modeLivraison"
                      value="livraison"
                      checked={valeurs.modeLivraison === 'livraison'}
                      onChange={(e) => maj('modeLivraison', e.target.value)}
                    />
                    <span className={s.modeTitle}>{t('Livraison')}</span>
                    <span className={s.modeNote}>
                      {fcfa(FRAIS_LIVRAISON)} · {t('Dakar et environs')}
                    </span>
                  </label>
                </fieldset>

                {valeurs.modeLivraison === 'livraison' && (
                  <>
                    <label className={s.field}>
                      <span>{t('Adresse')} *</span>
                      <input
                        type="text"
                        value={valeurs.adresse}
                        onChange={(e) => maj('adresse', e.target.value)}
                        required
                        autoComplete="street-address"
                        placeholder={t('Rue, villa, repère…')}
                      />
                    </label>
                    <div className={s.grid2}>
                      <label className={s.field}>
                        <span>{t('Ville')} *</span>
                        <input
                          type="text"
                          value={valeurs.ville}
                          onChange={(e) => maj('ville', e.target.value)}
                          required
                        />
                      </label>
                      <label className={s.field}>
                        <span>{t('Quartier')}</span>
                        <input
                          type="text"
                          value={valeurs.quartier}
                          onChange={(e) => maj('quartier', e.target.value)}
                        />
                      </label>
                    </div>
                  </>
                )}

                <label className={s.field}>
                  <span>{t('Message (facultatif)')}</span>
                  <textarea
                    rows="2"
                    value={valeurs.note}
                    onChange={(e) => maj('note', e.target.value)}
                    placeholder={t('Précision sur votre commande…')}
                  />
                </label>

                <div className={s.recap}>
                  <div>
                    <span>{t('Sous-total')}</span>
                    <strong>{fcfa(sousTotal)}</strong>
                  </div>
                  <div>
                    <span>{t('Livraison')}</span>
                    <strong>{fcfa(fraisLivraison)}</strong>
                  </div>
                  <div className={s.recapTotal}>
                    <span>{t('Total')}</span>
                    <strong>{fcfa(total)}</strong>
                  </div>
                </div>

                <Button type="submit" variant="gold" block disabled={envoi}>
                  {envoi ? t('Envoi en cours…') : t('Envoyer ma commande')}
                </Button>
                <p className={s.note}>
                  {t('Le paiement se fait au retrait ou à la livraison. Un membre de l’équipe vous contactera pour confirmer.')}
                </p>
              </form>
            )}

            {/* ---------- Étape 3 : confirmation ---------- */}
            {etape === 'confirmation' && commande && (
              <div className={cx(s.body, s.confirmation)} data-lenis-prevent>
                <CheckCircle2 className={s.confirmationIcon} size={52} strokeWidth={1.3} aria-hidden="true" />
                <h3>{t('Commande enregistrée')}</h3>
                <p className={s.reference}>{commande.reference}</p>
                <p className={s.confirmationText}>
                  {t('Conservez cette référence : elle vous permet de suivre votre commande. Un membre de l’équipe vous contactera au numéro indiqué.')}
                </p>
                <div className={s.recap}>
                  <div>
                    <span>{t('Total')}</span>
                    <strong>{fcfa(commande.total)}</strong>
                  </div>
                  <div>
                    <span>{t('Mode')}</span>
                    <strong>
                      {commande.modeLivraison === 'livraison' ? t('Livraison') : t('Retrait à la mosquée')}
                    </strong>
                  </div>
                </div>
                <Button variant="primary" onClick={fermerEtReinitialiser}>
                  {t('Retour à la boutique')}
                </Button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
