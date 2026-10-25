import { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import Button from '../ui/Button'
import Img from '../ui/Img'
import LineReveal from '../ui/LineReveal'
import Reveal from '../ui/Reveal'
import { useT } from '../../utils/useT'
import { usePanier } from '../../context/usePanier'
import { chargerProduits } from '../../service/api'
import { visuelProduit, formaterPrix } from '../../utils/catalogue'
import s from './Boutique.module.css'

// BOUTIQUE — « Boutique Patrimoine » : aperçu sur l'accueil des articles
// mis en vedette depuis le dashboard. Aucun article n'est écrit ici : une
// vitrine qui affiche des produits inexistants fait perdre son temps au
// visiteur et décrédibilise la boutique.
export default function Boutique() {
  const t = useT()
  const { ajouter } = usePanier()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    let annule = false
    chargerProduits({ vedette: true, limit: 4 })
      .then((donnees) => {
        if (annule) return
        setArticles(
          (donnees?.items || []).map((p) => ({
            id: p.id,
            nom: p.nom,
            prixTexte: formaterPrix(p.prix, p.devise),
            img: visuelProduit(p),
            produit: p,
          }))
        )
      })
      .catch(() => {
        // Silencieux : la section s'efface, inutile d'afficher une erreur
        // technique à un visiteur venu lire l'histoire de la mosquée.
      })
    return () => {
      annule = true
    }
  }, [])

  // Rien en vedette (ou API muette) : la section disparaît de l'accueil
  // au lieu d'y laisser une grille vide.
  if (articles.length === 0) return null

  return (
    <section id="boutique" className={s.section} aria-labelledby="boutique-title">
      <div className="container">
        <header className={s.head}>
          <div className={s.headMain}>
            <LineReveal as="h2" id="boutique-title" className={s.title}>
              <span>{t('Boutique')}</span>
              <em>{t('Patrimoine')}</em>
            </LineReveal>
          </div>
          <Reveal delay={0.15}>
            <Button to="/boutique" variant="outline">
              {t('Voir tout')}
            </Button>
          </Reveal>
        </header>

        <ul className={s.grid}>
          {articles.map((a, i) => (
            <Reveal as="li" className={s.card} key={a.id} delay={i * 0.08}>
              {/* Les noms de produits viennent du dashboard : ils ne passent
                  pas par t(), le dictionnaire i18n ne les connaît pas. */}
              <div className={s.thumb}>
                {a.img ? (
                  <Img src={a.img} alt={a.nom} fit="contain" />
                ) : (
                  <ShoppingBag size={40} strokeWidth={1.2} aria-hidden="true" />
                )}
              </div>
              <div className={s.body}>
                <h3 className={s.name}>{a.nom}</h3>
                <p className={s.price}>{a.prixTexte}</p>
              </div>
              <button
                type="button"
                className={s.add}
                onClick={() => ajouter({ ...a.produit, image: a.img }, 1)}
              >
                <ShoppingBag size={15} strokeWidth={1.8} aria-hidden="true" /> {t('Ajouter au panier')}
              </button>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
