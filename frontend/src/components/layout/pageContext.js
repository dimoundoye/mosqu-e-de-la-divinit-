import { createContext, useContext } from 'react'

// État des pages : `ready` passe à true une fois le rideau d'ouverture levé
// (dès le départ si les animations sont réduites).
export const PageContext = createContext({ ready: true, enterDelay: 0 })

export const usePage = () => useContext(PageContext)
