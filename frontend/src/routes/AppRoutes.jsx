import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import SiteLayout from '../components/layout/SiteLayout'
import { pageLoaders } from './pages'

const Home = lazy(pageLoaders.home)
const RenovationPage = lazy(pageLoaders.renovation)
const BoutiquePage = lazy(pageLoaders.boutique)
const PatrimoinePage = lazy(pageLoaders.patrimoine)
const PaiementDon = lazy(pageLoaders.dons)
const NotFound = lazy(pageLoaders.notFound)

// Déclaration centralisée des routes : toutes passent par la coquille du site
// (navigation, rideau d'ouverture, pied de page).
export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="renovation" element={<RenovationPage />} />
        <Route path="boutique" element={<BoutiquePage />} />
        <Route path="patrimoine" element={<PatrimoinePage />} />
        <Route path="dons" element={<PaiementDon />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
