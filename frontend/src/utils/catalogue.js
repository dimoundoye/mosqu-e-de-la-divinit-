import { urlMedia } from '../service/api'

/**
 * Présentation des produits venus de l'API.
 *
 * Aucune table de correspondance entre un slug et une photo du dépôt :
 * l'image d'un article se renseigne dans le dashboard, avec l'article.
 * Un fichier codé ici survivrait à la suppression du produit et finirait
 * par illustrer un autre article que le sien.
 */

/** Visuel d'un produit en URL absolue, ou null si aucune image n'a été
 *  renseignée. L'API renvoie un chemin relatif (/medias/…) : servi tel
 *  quel, le navigateur le chercherait sur le port du site vitrine.  */
export function visuelProduit(produit) {
  return urlMedia(produit?.image)
}

/** 45000 -> « 45 000 FCFA » (les prix sont des entiers en FCFA). */
export function formaterPrix(montant, devise = 'FCFA') {
  return `${Number(montant || 0).toLocaleString('fr-FR').split(/\s/).join(' ')} ${devise}`
}
