// Fonctions utilitaires réutilisables

// Concatène des classes conditionnelles
export function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}
