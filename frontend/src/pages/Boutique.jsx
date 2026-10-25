import { useEffect, useState } from 'react'
import { AlertTriangle, Eye, MapPin, ShoppingBag, Truck, User } from 'lucide-react'
import Button from '../components/ui/Button'
import Img from '../components/ui/Img'
import LineReveal from '../components/ui/LineReveal'
import PageHero from '../components/ui/PageHero'
import Reveal from '../components/ui/Reveal'
import { useT } from '../utils/useT'
import { cx } from '../utils/helpers'
import { usePanier } from '../context/usePanier'
import { chargerProduits } from '../service/api'
import { visuelProduit, formaterPrix } from '../utils/catalogue'
import bagImg from '../assets/photo/Shopping_Bag_Mockup_v01.jpg'
import heroImg from '../assets/photo/DJI_0681.jpg'
import enfantsImg from '../assets/photo/Korite.jpg'
import s from './Boutique.module.css'

// Les trois raisons d'acheter (section institutionnelle)
const POINTS = [
  ['Pérennité', "Financement direct de l'entretien du site."],
  ['Transmission', 'Supports pédagogiques pour la jeunesse.'],
  ['Patrimoine', "Rayonnement de l'architecture islamique."],
]

// Carte produit de la galerie. Tout article affiché vient du catalogue
// géré dans le dashboard : il porte donc toujours un identifiant en base
// et peut être mis au panier.
function CarteProduit({ p }) {
  const t = useT()
  const { ajouter } = usePanier()
  const [ajoute, setAjoute] = useState(false)
  // Packshot (produit détouré, cadre carré) ou photo de mise en scène ?
  // Un packshot carré recadré en 3:4 perd un quart de sa largeur, soit
  // le produit lui-même. On lit les dimensions réelles au chargement
  // plutôt que de demander à l’équipe de cocher une case de plus.
  const [packshot, setPackshot] = useState(false)

  function ajouterAuPanier() {
    // On transmet le visuel déjà résolu : le tiroir du panier n'a pas à
    // refaire le choix entre l'image de l'API et le repli.
    ajouter({ ...p.produit, image: p.img }, 1)
    // Retour visuel court : l'ouverture du tiroir confirme déjà l'action,
    // ce libellé sert aux ajouts successifs sans fermer le tiroir.
    setAjoute(true)
    setTimeout(() => setAjoute(false), 1600)
  }

  return (
    <article className={s.card}>
      <div className={cx(s.media, !p.img && s.mediaEmpty, packshot && s.mediaContain)}>
        {p.badge && <span className={s.badge}>{t(p.badge)}</span>}
        {/* Un article saisi sans photo garde une carte lisible plutôt
            qu'une image cassée. */}
        {p.img ? (
          <>
            <Img
              src={p.img}
              alt={p.name}
              fit={packshot ? 'contain' : 'cover'}
              onLoad={(e) => {
                const { naturalWidth: l, naturalHeight: h } = e.currentTarget
                if (l && h && Math.abs(l / h - 1) < 0.08) setPackshot(true)
              }}
            />
            <div className={s.discover} aria-hidden="true">
              <span>
                <Eye size={15} strokeWidth={1.8} /> {t('Découvrir')}
              </span>
            </div>
          </>
        ) : (
          <ShoppingBag size={48} strokeWidth={1.1} aria-hidden="true" />
        )}
      </div>
      <div className={s.body}>
        <p className={s.cat}>{p.cat}</p>
        <h3 className={s.name}>{p.name}</h3>
        <p className={s.desc}>{p.desc}</p>
        <div className={s.priceRow}>
          <span className={s.priceLabel}>{t('Prix')}</span>
          <span className={s.price}>{p.price}</span>
        </div>
        {p.rupture ? (
          <button type="button" className={cx(s.add, s.addOff)} disabled>
            {t('Momentanément indisponible')}
          </button>
        ) : (
          <button type="button" className={cx(s.add, ajoute && s.addOk)} onClick={ajouterAuPanier}>
            <ShoppingBag size={16} strokeWidth={1.8} aria-hidden="true" />{' '}
            {ajoute ? t('Ajouté au panier') : t('Ajouter au panier')}
          </button>
        )}
      </div>
    </article>
  )
}

/** Variante de présentation pour la gamme spirituelle : même source de
 *  données, mise en page plus contemplative. */
function CarteSpirituelle({ p }) {
  const t = useT()
  const { ajouter } = usePanier()

  return (
    <article className={s.spirit}>
      <div className={cx(s.spiritPhoto, !p.img && s.mediaEmpty)}>
        {p.img ? <Img src={p.img} alt={p.name} /> : <ShoppingBag size={48} strokeWidth={1.1} aria-hidden="true" />}
      </div>
      <h3 className={s.spiritName}>{p.name}</h3>
      <p className={s.spiritText}>{p.desc}</p>
      <p className={s.price}>{p.price}</p>
      {p.rupture ? (
        <Button variant="gold" icon={false} disabled>
          {t('Momentanément indisponible')}
        </Button>
      ) : (
        <Button variant="gold" icon={<ShoppingBag size={15} strokeWidth={1.8} />} onClick={() => ajouter({ ...p.produit, image: p.img }, 1)}>
          {t('Ajouter au panier')}
        </Button>
      )}
    </article>
  )
}

/** Carte fantôme affichée pendant le chargement du catalogue. La grille
 *  garde ainsi sa hauteur : sans elle, la page saute au moment où les
 *  articles arrivent. */
function CarteSquelette() {
  return (
    <article className={cx(s.card, s.skeleton)} aria-hidden="true">
      <div className={s.skeletonMedia} />
      <div className={s.skeletonBody}>
        <span className={cx(s.skeletonLine, s.skeletonShort)} />
        <span className={s.skeletonLine} />
        <span className={s.skeletonLine} />
        <span className={cx(s.skeletonLine, s.skeletonButton)} />
      </div>
    </article>
  )
}

/** Traduit un produit de l'API vers la forme attendue par CarteProduit.
 *  Les libellés ne passent pas par t() : ils sont saisis dans le
 *  dashboard, le dictionnaire i18n ne les connaît pas. */
function versCarte(produit) {
  const rupture = !produit.surCommande && produit.stock !== null && produit.stock <= 0
  return {
    id: produit.id,
    filter: produit.categorie?.slug || '',
    cat: produit.categorie?.nom || '',
    name: produit.nom,
    desc: produit.description || '',
    price: formaterPrix(produit.prix, produit.devise),
    img: visuelProduit(produit),
    badge: produit.badge || undefined,
    rupture,
    // Objet transmis au panier : identifiant + prix d'affichage.
    produit,
  }
}

export default function BoutiquePage() {
  const t = useT()
  const [activeFilter, setActiveFilter] = useState('Tous les objets')

  // Le catalogue vient entièrement de l'API : aucun article n'est écrit
  // dans le code. Ce que l'équipe saisit dans le dashboard est ce que le
  // visiteur voit — sinon la boutique afficherait des prix qui n'engagent
  // personne.
  const [produits, setProduits] = useState([])
  const [chargement, setChargement] = useState(true)
  const [horsLigne, setHorsLigne] = useState(false)

  useEffect(() => {
    let annule = false
    chargerProduits({ limit: 100 })
      .then((donnees) => {
        if (annule) return
        setProduits((donnees.items || []).map(versCarte))
      })
      .catch(() => {
        // Plutôt qu'un faux catalogue : on le dit. Le reste de la page
        // (philosophie, retrait, livraison) tient debout sans articles.
        if (!annule) setHorsLigne(true)
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })
    return () => {
      annule = true
    }
  }, [])

  // Filtres construits à partir des gammes réellement présentes : une
  // gamme vide ne doit pas afficher un onglet qui ne renvoie rien.
  const gammes = Array.from(
    new Map(
      produits
        .filter((p) => p.filter && p.cat)
        .map((p) => [p.filter, p.cat])
    ).entries()
  )

  const visibleProducts =
    activeFilter === 'Tous les objets'
      ? produits
      : produits.filter((p) => p.filter === activeFilter || p.cat === activeFilter)

  /** Articles d'une gamme, pour les sections thématiques de la page. */
  const parGamme = (slug) => produits.filter((p) => p.filter === slug)

  return (
    <div className={s.page}>
      {/* ---------- EN-TÊTE ---------- */}
      <PageHero
        title={[t('Porter le message.'), <em key="em">{t('Soutenir l’œuvre.')}</em>]}
        intro={t('Chaque acquisition contribue directement à la préservation et au rayonnement de la Mosquée de la Divinité. Un pont entre le spirituel et le matériel.')}
        photo={heroImg}
        photoAlt=""
        photoPosition="50% 60%"
      >
        <Button to="#catalogue" variant="gold">
          {t('Explorer les gammes')}
        </Button>
        <Button to="/#message" variant="outline">
          {t('Notre Philosophie')}
        </Button>
      </PageHero>

      {/* ---------- GALERIE FILTRABLE ---------- */}
      <section className={s.catalogue} id="catalogue" aria-label={t('Tous les objets')}>
        <div className="container">
          <div className={s.filters} role="group">
            <button
              type="button"
              className={cx(s.filter, activeFilter === 'Tous les objets' && s.filterActive)}
              aria-pressed={activeFilter === 'Tous les objets'}
              onClick={() => setActiveFilter('Tous les objets')}
            >
              {t('Tous les objets')}
            </button>
            {gammes.map(([valeur, libelle]) => (
              <button
                key={valeur}
                type="button"
                className={cx(s.filter, activeFilter === valeur && s.filterActive)}
                aria-pressed={activeFilter === valeur}
                onClick={() => setActiveFilter(valeur)}
              >
                {libelle}
              </button>
            ))}
          </div>

          {chargement ? (
            <div className={s.grid}>
              {Array.from({ length: 4 }, (_, i) => (
                <CarteSquelette key={i} />
              ))}
            </div>
          ) : horsLigne ? (
            <div className={s.state}>
              <AlertTriangle size={36} strokeWidth={1.3} aria-hidden="true" />
              <p>{t('Le catalogue est momentanément indisponible. Merci de réessayer dans un instant.')}</p>
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className={s.state}>
              <ShoppingBag size={36} strokeWidth={1.3} aria-hidden="true" />
              <p>{t('Aucun article en vente pour le moment.')}</p>
            </div>
          ) : (
            <div className={s.grid}>
              {visibleProducts.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.06} y={24}>
                  <CarteProduit p={p} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- GAMME YEETE (éducation & éveil) ---------- */}
      <section className={s.yeete} id="gamme-enfants" aria-labelledby="yeete-title">
        <div className={`container ${s.yeeteGrid}`}>
          <div className={s.yeeteText}>
            <LineReveal as="h2" id="yeete-title" className={s.h2}>
              <span>{t('Gamme Yeete')}</span>
            </LineReveal>
            <Reveal as="p" className={s.lead} delay={0.1}>
              {t('Inspirée par la pédagogie Montessori, cette collection propose des jeux et supports éducatifs pour transmettre l’héritage spirituel et architectural dès le plus jeune âge.')}
            </Reveal>
            {/* Section éditoriale : les articles de la gamme se retrouvent
                dans le catalogue ci-dessus, avec leurs prix réels. */}
            <Reveal delay={0.15}>
              <Button to="#catalogue" variant="link">
                {t('Voir les articles disponibles')}
              </Button>
            </Reveal>
          </div>

          <Reveal className={s.yeeteVisual} y={40}>
            <div className={s.arch}>
              <Img src={enfantsImg} alt={t('Enfants et familles de la communauté un jour de fête')} />
            </div>
            <div className={s.yeeteBadge}>
              <p lang="ar" dir="rtl">
                الأولاد
              </p>
              <span>{t('Pour les futurs bâtisseurs')}</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- TEXTILE & ÉQUIPEMENT ---------- */}
      {/* Vue par gamme, alimentée par le catalogue. La section disparaît
          quand la gamme est vide : mieux vaut pas de section qu'une
          section vide. */}
      {parGamme('textile').length > 0 && (
        <section className={s.textile} id="textile" aria-labelledby="textile-title">
          <div className="container">
            <div className={s.headRow}>
              <div className={s.headMain}>
                <LineReveal as="h2" id="textile-title" className={s.h2}>
                  <span>{t('Textile &')}</span>
                  <em>{t('Équipement')}</em>
                </LineReveal>
                <Reveal as="p" className={s.lead} delay={0.1}>
                  {t('Une gamme premium conçue pour les membres, les bénévoles et les sympathisants. Chaque pièce arbore l’insigne officiel de Masdjidou Rabbani.')}
                </Reveal>
              </div>
              <Button variant="link" onClick={() => setActiveFilter('textile')} to="#catalogue">
                {t('Voir tout le textile')}
              </Button>
            </div>

            <div className={s.grid}>
              {parGamme('textile').map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 0.06} y={24}>
                  <CarteProduit p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- GAMME SPIRITUELLE ---------- */}
      {parGamme('spirituelle').length > 0 && (
        <section className={s.spiritual} id="spirituelle" aria-labelledby="spirituelle-title">
          <div className="container">
            <div className={s.centerHead}>
              <LineReveal as="h2" id="spirituelle-title" className={s.h2}>
                <span>{t('Spirituelle')}</span>
              </LineReveal>
            </div>

            <div className={s.spiritGrid}>
              {parGamme('spirituelle').map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 0.08}>
                  <CarteSpirituelle p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- SIGNALÉTIQUE (institutionnel) ---------- */}
      <section className={s.sign} id="signaletique" aria-labelledby="signaletique-title">
        <div className={`container ${s.signGrid}`}>
          <div className={s.signLeft}>
            <LineReveal as="h2" id="signaletique-title" className={s.h2}>
              <span>{t('L’Empreinte de la')}</span>
              <em>{t('Divinité')}</em>
            </LineReveal>
            <div className={s.signProducts}>
              <Reveal className={s.signProduct}>
                <div className={s.signPhoto}>
                  <Img src={bagImg} alt={t('Tote Bag Premium Mosquée de la Divinité')} />
                </div>
                <h3>{t('Tote Bag Premium')}</h3>
                <p>{t('Toile de coton robuste avec marquage sérigraphié haute définition.')}</p>
              </Reveal>
              <Reveal className={cx(s.signProduct, s.signOffset)} delay={0.12}>
                <div className={cx(s.signPhoto, s.mediaEmpty)}>
                  {/* Emplacement réservé : visuel des casquettes à venir */}
                  <User size={48} strokeWidth={1.1} aria-hidden="true" />
                </div>
                <h3>{t('Casquettes Officielles')}</h3>
                <p>{t('Modèles ajustables avec broderie relief de l’emblème Rabbani.')}</p>
              </Reveal>
            </div>
          </div>

          <Reveal className={cx(s.signRight, 'on-dark')} y={40}>
            <p className={s.quote}>
              «&nbsp;{t('L’achat est un don avec un objet en retour. Le don est un achat sans objet.')}&nbsp;»
            </p>
            <p className={s.quoteSub}>{t('Philosophie de la Boutique Officielle')}</p>
            <ol className={s.points}>
              {POINTS.map(([titre, texte]) => (
                <li className={s.point} key={titre}>
                  <div>
                    <h3>{t(titre)}</h3>
                    <p>{t(texte)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ---------- LIVRAISON & RETRAIT ---------- */}
      <section className={s.logistics} id="assistance" aria-labelledby="logistique-title">
        <div className="container">
          <Reveal className={s.logiCard} y={40}>
            <Truck className={s.logiWatermark} strokeWidth={0.6} aria-hidden="true" />
            <div className={s.logiGrid}>
              <div className={s.logiText}>
                <h2 id="logistique-title" className={s.h3}>
                  {t('Logistique & Retraits')}
                </h2>
                <p className={s.lead}>
                  {t('Nous assurons une livraison fluide sur tout le territoire sénégalais. Les commandes peuvent également être retirées directement au guichet officiel de la Mosquée à Ouakam.')}
                </p>
                <ul className={s.logiList}>
                  <li className={s.logiItem}>
                    <span className={s.logiIcon}>
                      <MapPin size={18} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <div>
                      <b>{t('Point de Retrait Ouakam')}</b>
                      <span>{t('Lundi - Dimanche | 09h00 - 18h00')}</span>
                    </div>
                  </li>
                  <li className={s.logiItem}>
                    <span className={s.logiIcon}>
                      <Truck size={18} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <div>
                      <b>{t('Livraison Dakar & Régions')}</b>
                      <span>{t('Sous 24h à 72h ouvrés')}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className={s.form}>
                <h3>{t('Besoin d’assistance ?')}</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder={t('Votre nom')} aria-label={t('Votre nom')} />
                  <input type="email" placeholder={t('Votre email')} aria-label={t('Votre email')} />
                  <textarea placeholder={t('Votre message')} aria-label={t('Votre message')} rows="3" />
                  <Button type="submit" variant="gold" block>
                    {t('Envoyer la demande')}
                  </Button>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
