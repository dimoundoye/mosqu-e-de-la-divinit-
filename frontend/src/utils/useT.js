import { useCallback } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { EN } from '../data/i18n'

// Traduction par texte source : le français reste écrit dans les composants
// (c'est la version de référence), l'anglais vit dans data/i18n.js.
// Une clé absente du dictionnaire retombe naturellement sur le français.
export function useT() {
  const { lang } = useLanguage()
  return useCallback((fr) => (lang === 'EN' ? EN[fr] ?? fr : fr), [lang])
}
