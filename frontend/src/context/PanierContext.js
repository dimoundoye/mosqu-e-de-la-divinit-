import { createContext } from 'react'

/**
 * Contexte du panier, séparé du provider et du hook.
 * Trois fichiers : Vite ne rafraîchit proprement à chaud qu'un module
 * n'exportant que des composants.
 */
export const PanierContext = createContext(null)
