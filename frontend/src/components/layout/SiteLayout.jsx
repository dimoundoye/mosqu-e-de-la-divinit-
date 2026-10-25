import { useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import Navbar from './Navbar'
import PageShell from './PageShell'
import Panier from '../boutique/Panier'
import BoutonPanier from '../boutique/BoutonPanier'
import { hasDarkHero } from '../../data/navigation'
import { prefetchPages } from '../../routes/pages'
import { useT } from '../../utils/useT'
import s from './SiteLayout.module.css'

// Défilement à chaque navigation : une nouvelle page s'ouvre en haut, ou
// directement sur l'ancre (#section) demandée ; sur la même page, l'ancre est
// rejointe en douceur. Effet de mise en page : rien ne s'affiche avant.
function useRouteScroll() {
  const { pathname, hash, key } = useLocation()
  const lenis = useLenis()
  const lastPath = useRef(pathname)
  const firstRun = useRef(true)

  useLayoutEffect(() => {
    // Premier affichage : l'ancre éventuelle est retirée de l'adresse (voir SiteLayout).
    if (firstRun.current) {
      firstRun.current = false
      return undefined
    }
    const arrived = lastPath.current !== pathname
    lastPath.current = pathname
    if (arrived) {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
    }
    if (!hash) return undefined

    const id = decodeURIComponent(hash.slice(1))
    let frame = 0
    let tries = 0
    // La page arrivante peut encore se charger : on attend que la cible existe.
    const go = () => {
      const target = document.getElementById(id)
      if (!target) {
        if (tries++ < 120) frame = requestAnimationFrame(go)
        return
      }
      if (lenis) {
        // Hauteur de la nouvelle page : sans ce recalcul, Lenis borne le
        // défilement à la hauteur de la page précédente.
        lenis.resize()
        lenis.scrollTo(target, { immediate: arrived, duration: 1.5, force: true })
      } else {
        target.scrollIntoView({ behavior: arrived ? 'auto' : 'smooth', block: 'start' })
      }
    }
    go()
    return () => cancelAnimationFrame(frame)
    // `key` change à chaque clic : un même lien cliqué deux fois redéfile.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}

// Coquille du site : navigation persistante, pages et pied de page.
// D'une page à l'autre, le changement est immédiat (pas de transition).
export default function SiteLayout() {
  const t = useT()
  const location = useLocation()
  const navigate = useNavigate()

  // Au rechargement : revenir à l'adresse de base (sans #ancre) et en haut de page.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    if (location.hash) navigate({ pathname: location.pathname, search: location.search }, { replace: true })
    window.scrollTo(0, 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRouteScroll()

  return (
    <div className={s.site}>
      <a href="#contenu" className="skip-link">
        {t('Aller au contenu')}
      </a>
      <Navbar overDarkHero={hasDarkHero(location.pathname)} />
      <PageShell onIntroDone={prefetchPages}>
        <Outlet />
      </PageShell>
      {/* Le panier est global : on peut ajouter un article depuis
          l'aperçu de l'accueil comme depuis la page Boutique. */}
      <BoutonPanier />
      <Panier />
      <div className={s.grain} aria-hidden="true" />
    </div>
  )
}
