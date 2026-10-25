// Courbes et durées partagées par toutes les animations du site.
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.76, 0, 0.24, 1],
  soft: [0.33, 1, 0.68, 1],
}

// Durées du rideau d'ouverture, au premier chargement (en secondes).
export const curtain = {
  reveal: 0.8,
  introHold: 1.35,
}

// Délai avant les animations d'entrée d'une page : le temps que le rideau
// d'ouverture se lève, aucun une fois le site ouvert.
export const pageEnterDelay = (opening) => (opening ? curtain.introHold + 0.45 : 0)
