// Chargeurs des pages (découpage du code par route).
// Partagés entre les routes et le préchargement : un même import, un même fichier.
export const pageLoaders = {
  home: () => import('../pages/Home'),
  renovation: () => import('../pages/Renovation'),
  boutique: () => import('../pages/Boutique'),
  patrimoine: () => import('../pages/Patrimoine'),
  dons: () => import('../pages/PaiementDon'),
  notFound: () => import('../pages/NotFound'),
}

// Précharge toutes les pages quand le navigateur est libre : la navigation
// suivante n'attend plus le réseau.
export function prefetchPages() {
  const run = () => Object.values(pageLoaders).forEach((load) => load().catch(() => {}))
  if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 4000 })
  else window.setTimeout(run, 2000)
}
