import { LanguageProvider } from './context/LanguageContext'
import { PanierProvider } from './context/PanierProvider'
import SmoothScroll from './components/layout/SmoothScroll'
import AppRoutes from './routes/AppRoutes'

// Coquille de l'application : contextes globaux, défilement amorti et routes.
// La mise en page (navigation, rideau, pied de page) vit dans SiteLayout.
function App() {
  return (
    <LanguageProvider>
      <PanierProvider>
        <SmoothScroll>
          <AppRoutes />
        </SmoothScroll>
      </PanierProvider>
    </LanguageProvider>
  )
}

export default App
