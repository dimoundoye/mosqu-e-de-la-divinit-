import { useContext } from 'react'
import { PanierContext } from './PanierContext'

export function usePanier() {
  const ctx = useContext(PanierContext)
  if (!ctx) throw new Error('usePanier doit être utilisé dans un PanierProvider')
  return ctx
}
