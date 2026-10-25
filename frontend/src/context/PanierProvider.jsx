import { useCallback, useEffect, useMemo, useState } from 'react'
import { PanierContext } from './PanierContext'

const CLE = 'mdld-panier'

/**
 * Panier de la boutique.
 *
 * Persisté dans localStorage : un visiteur qui ajoute un article puis va
 * lire la page Histoire ne doit pas retrouver un panier vide en revenant.
 *
 * Attention : ce panier ne contient que des identifiants, des quantités
 * et de quoi l'afficher. Les prix qu'il transporte servent uniquement à
 * l'affichage — le total facturé est TOUJOURS recalculé par l'API.
 */
function lireStockage() {
  try {
    const brut = localStorage.getItem(CLE)
    const donnees = brut ? JSON.parse(brut) : []
    return Array.isArray(donnees) ? donnees : []
  } catch {
    // Stockage corrompu ou navigation privée : on repart d'un panier vide
    // plutôt que de casser toute la boutique.
    return []
  }
}

export function PanierProvider({ children }) {
  const [lignes, setLignes] = useState(lireStockage)
  const [ouvert, setOuvert] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(CLE, JSON.stringify(lignes))
    } catch {
      // Quota dépassé ou stockage bloqué : le panier reste en mémoire.
    }
  }, [lignes])

  const ajouter = useCallback((produit, quantite = 1) => {
    setLignes((actuelles) => {
      const existante = actuelles.find((l) => l.produitId === produit.id)
      if (existante) {
        return actuelles.map((l) =>
          l.produitId === produit.id
            ? { ...l, quantite: Math.min(99, l.quantite + quantite) }
            : l
        )
      }
      return [
        ...actuelles,
        {
          produitId: produit.id,
          nom: produit.nom,
          prix: produit.prix,
          image: produit.image || null,
          slug: produit.slug,
          quantite,
        },
      ]
    })
    setOuvert(true)
  }, [])

  const changerQuantite = useCallback((produitId, quantite) => {
    setLignes((actuelles) => {
      if (quantite <= 0) return actuelles.filter((l) => l.produitId !== produitId)
      return actuelles.map((l) =>
        l.produitId === produitId ? { ...l, quantite: Math.min(99, quantite) } : l
      )
    })
  }, [])

  const retirer = useCallback((produitId) => {
    setLignes((actuelles) => actuelles.filter((l) => l.produitId !== produitId))
  }, [])

  const vider = useCallback(() => setLignes([]), [])

  const { nombreArticles, sousTotal } = useMemo(
    () => ({
      nombreArticles: lignes.reduce((n, l) => n + l.quantite, 0),
      sousTotal: lignes.reduce((n, l) => n + l.prix * l.quantite, 0),
    }),
    [lignes]
  )

  const valeur = useMemo(
    () => ({
      lignes,
      nombreArticles,
      sousTotal,
      ouvert,
      ouvrir: () => setOuvert(true),
      fermer: () => setOuvert(false),
      basculer: () => setOuvert((v) => !v),
      ajouter,
      changerQuantite,
      retirer,
      vider,
    }),
    [lignes, nombreArticles, sousTotal, ouvert, ajouter, changerQuantite, retirer, vider]
  )

  return <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>
}
