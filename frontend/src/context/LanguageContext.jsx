import { createContext, useContext, useEffect, useState } from 'react'

// Contexte de langue (FR par défaut) — alimente le sélecteur FR/EN du header
// et la traduction des textes (cf. utils/i18n.js).
const LanguageContext = createContext(null)

const STORAGE_KEY = 'mdld-langue'

export function LanguageProvider({ children }) {
  // Choix mémorisé d'une visite à l'autre ; anglais proposé si le navigateur l'est
  const [lang, setLang] = useState(() => {
    const memo = localStorage.getItem(STORAGE_KEY)
    if (memo === 'FR' || memo === 'EN') return memo
    return navigator.language?.toLowerCase().startsWith('en') ? 'EN' : 'FR'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang === 'EN' ? 'en' : 'fr'
  }, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

// Hook pratique pour consommer le contexte (colocalisé avec le Provider — pattern courant)
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage doit être utilisé dans un LanguageProvider')
  }
  return ctx
}
