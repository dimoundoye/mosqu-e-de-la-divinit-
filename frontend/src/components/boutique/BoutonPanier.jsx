import { AnimatePresence, motion } from 'motion/react'
import { ShoppingBag } from 'lucide-react'
import { usePanier } from '../../context/usePanier'
import { ease } from '../../lib/motion'
import { useT } from '../../utils/useT'
import s from './Panier.module.css'

/**
 * Bouton flottant d'accès au panier.
 *
 * Masqué tant que le panier est vide : un panier à zéro article n'a rien
 * à montrer et encombrerait l'écran sur mobile.
 */
export default function BoutonPanier() {
  const t = useT()
  const { nombreArticles, ouvrir, ouvert } = usePanier()
  const visible = nombreArticles > 0 && !ouvert

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className={s.floating}
          onClick={ouvrir}
          aria-label={`${t('Voir le panier')} (${nombreArticles})`}
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.9 }}
          transition={{ duration: 0.45, ease: ease.out }}
        >
          <ShoppingBag size={20} strokeWidth={1.7} aria-hidden="true" />
          <span className={s.floatingBadge}>{nombreArticles}</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
