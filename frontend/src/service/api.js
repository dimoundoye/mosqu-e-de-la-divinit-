/**
 * Accès à l'API publique de la boutique.
 *
 * Volontairement sans axios : le site vitrine n'a besoin que de deux
 * appels publics, sans jeton ni rafraîchissement. Ajouter une dépendance
 * de 30 ko pour cela alourdirait un site déjà lourd en images, sur des
 * connexions mobiles sénégalaises.
 */

// Repli explicite sur l'API locale : sans variable définie, on ne part
// pas sur une URL vide qui donnerait des 404 incompréhensibles.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/mdld/v1'

const DELAI_MS = 15000

async function requete(chemin, options = {}) {
  // AbortController : sans délai maximal, un backend injoignable laisse
  // le bouton « Valider » en chargement pour toujours.
  const controleur = new AbortController()
  const minuterie = setTimeout(() => controleur.abort(), DELAI_MS)

  try {
    const reponse = await fetch(`${API_BASE_URL}${chemin}`, {
      ...options,
      signal: controleur.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    })

    const corps = await reponse.json().catch(() => null)

    if (!reponse.ok) {
      const erreur = new Error(corps?.message || `Erreur ${reponse.status}`)
      erreur.statut = reponse.status
      erreur.details = corps?.details
      throw erreur
    }

    return corps?.data
  } finally {
    clearTimeout(minuterie)
  }
}

/** Origine de l'API, déduite de l'URL de base : les visuels sont servis
 *  sur /medias, en dehors du préfixe versionné de l'API. */
export const API_ORIGINE = API_BASE_URL.replace(/\/mdld\/v1\/?$/, '')

/** Chemin de visuel renvoyé par l'API → URL absolue chargeable par le
 *  navigateur. Une URL déjà absolue (visuel hébergé ailleurs) passe telle quelle. */
export function urlMedia(chemin) {
  if (!chemin) return null
  if (/^https?:\/\//.test(chemin)) return chemin
  return `${API_ORIGINE}${chemin}`
}

/** Contenu de la page rénovation : campagne, chantiers, responsables et
 *  moyens de paiement. Un seul appel, la page les affiche ensemble. */
export function chargerRenovation() {
  return requete('/renovation')
}

/** Catalogue public. */
export function chargerProduits(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '')
  ).toString()
  return requete(`/boutique/produits${query ? `?${query}` : ''}`)
}

export function chargerCategories() {
  return requete('/boutique/categories')
}

/** Envoi d'une commande. Le serveur recalcule les prix : le panier
 *  n'envoie que des identifiants et des quantités. */
export function envoyerCommande(commande) {
  return requete('/boutique/commandes', {
    method: 'POST',
    body: JSON.stringify(commande),
  })
}

export function suivreCommande(reference, email) {
  const query = new URLSearchParams({ reference, email }).toString()
  return requete(`/boutique/commandes/suivi?${query}`)
}

/** Message lisible pour l'utilisateur, détails de validation inclus. */
export function messageErreur(erreur, secours = 'Une erreur est survenue') {
  if (erreur?.details?.length) return erreur.details.map((d) => d.message).join(' · ')
  if (erreur?.name === 'AbortError') return 'Le serveur met trop de temps à répondre'
  return erreur?.message || secours
}
