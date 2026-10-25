// Navigation du site : libellé (texte source FR, traduit par t()) + destination.

// Une seule navigation pour tout le site : sections de l'accueil, puis pages.
// Le logo ramène à l'accueil.
export const NAV_LINKS = [
  ['Histoire', '/#histoire'],
  ['Visiter', '/#visiter'],
  ['Prier', '/#prier'],
  ['Le Message', '/#message'],
  ['Communauté', '/#communaute'],
  ['Rénovation', '/renovation'],
  ['Patrimoine', '/patrimoine'],
  ['Boutique', '/boutique'],
]

// Toutes les routes connues (le reste mène à la page 404)
const KNOWN_PATHS = ['/', '/boutique', '/renovation', '/patrimoine', '/dons']

// Pages dont le haut est sombre : la navigation y passe en texte clair tant qu'on est en haut.
export function hasDarkHero(pathname) {
  return pathname === '/' || pathname === '/dons' || !KNOWN_PATHS.includes(pathname)
}
