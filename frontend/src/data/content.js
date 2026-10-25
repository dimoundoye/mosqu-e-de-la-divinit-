// Contenu du site centralisé (médias + données réutilisées) — source unique de vérité.
import { FaYoutube, FaFacebookF, FaInstagram, FaXTwitter, FaTiktok, FaSnapchat } from 'react-icons/fa6'
import khalife from '../assets/photo/Khalife de Dieu.jpg'
import expoImg from '../assets/photo/Exposition.jpg'
import expo2Img from '../assets/photo/Exposition-2.jpg'
import fajrImg from '../assets/photo/Fajr.jpg'
import ishaImg from '../assets/photo/Isha.jpg'
import maghribImg from '../assets/photo/MAGHRIB.jpg'
import heroVideo from '../assets/photo/hero3.mp4'
import khalifeJeune from '../assets/photo/Khalife Jeune.jpg'
import khalifeReco from '../assets/photo/Le khalife en reconnaissance sur le site.jpg'
import avantMosquee from '../assets/photo/Avant Mosquée.jpg'
import exposition3 from '../assets/photo/exposition 3.jpg'
import exposition4 from '../assets/photo/ecposition 4.jpg'
import asrImg from '../assets/photo/asr.jpg'
import jumaaImg from '../assets/photo/Jumaa.jpg'
import puzzleImg from '../assets/photo/puzzle.webp'
import bagImg from '../assets/photo/Shopping_Bag_Mockup_v01.jpg'
import hoodieImg from '../assets/photo/Hoodie.webp'
import blocNoteImg from '../assets/photo/Bloc-Note.webp'

export const VIDEO = heroVideo

export const images = {
  khalife, expoImg, expo2Img, fajrImg, ishaImg, maghribImg,
  khalifeJeune, khalifeReco, avantMosquee,
  exposition3, exposition4, asrImg, jumaaImg,
  puzzleImg, bagImg, hoodieImg, blocNoteImg,
}

// Réseaux sociaux officiels (pied de page et menu mobile)
export const SOCIAL_LINKS = [
  { Icon: FaYoutube, label: 'YouTube', url: 'https://www.youtube.com/user/divinitetv' },
  { Icon: FaFacebookF, label: 'Facebook', url: 'https://www.facebook.com/mosqueedeladivinite' },
  { Icon: FaInstagram, label: 'Instagram', url: 'https://www.instagram.com/mosqueedeladivinite/' },
  { Icon: FaXTwitter, label: 'X (Twitter)', url: 'https://twitter.com/mosqueedivinite' },
  { Icon: FaTiktok, label: 'TikTok', url: 'http://www.tiktok.com/@mosqueedeladivinite' },
  { Icon: FaSnapchat, label: 'Snapchat', url: 'https://www.snapchat.com/@mosqueedivinite' },
]

// Navigation du footer : libellé + ancre
export const FOOTER_NAV = [
  ['Histoire', '#histoire'], ['Visiter', '#visiter'], ['Prier', '#prier'],
  ['Le Message', '#message'], ['Communauté', '#communaute'],
  ['Rénovation', '#renovation'], ['Boutique', '#boutique'],
]

// ===== HERO ===== (chiffres-clés de la barre de statistiques)
export const HERO_STATS = [
  ['1973', 'Révélation fondatrice'],
  ['5 ans 5 mois', 'De construction'],
  ['45 m', 'Hauteur des minarets'],
  ['80 t', 'Coupole béton armé'],
]

// ===== SANGABI ===== (biographie affichée dans la section image + texte)
export const SANGABI_BIO = [
  'Né à Dakar, formé au dessin industriel au Lycée Maurice Delafosse, ancien comptable chez BTP Augier. Il a participé à la construction de la Grande Mosquée de Touba, comme comptable.',
  'En 1963, Dieu lui ordonna une retraite spirituelle. Il se retira du monde. Sans revenus ni moyens. Quatorze ans de silence intérieur.',
  'Sa femme, Sokhna Sagar Diagne, l’accompagna à travers ces années d’épreuve avec une foi et une dignité inébranlables.',
  'Durant cette retraite, Dieu l’investit comme Khalife de Dieu sur Terre. Et dans la nuit du 28 au 29 juin 1973, la mosquée lui fut révélée en songe. Une maquette lumineuse parachutée du ciel. ALLAHOU AKBAR en lettres d’or sur la porte de droite.',
  'Le 6 mars 1977, sa retraite achevée, Sangabi fit son premier appel public à Ouakam, appelant les hommes à revenir vers Dieu. Le mouvement Naby Allah était né.',
  'Tout au long de sa vie, il rappela le message que Dieu lui avait confié, trois principes pour quiconque veut vivre en paix avec Dieu, avec les autres et avec soi-même : Jub. Ragal Yàlla. Sellal.',
  'La mosquée, il la partagea avec la communauté. Il ne la leur confia pas de loin. Il était là. Chaque jour sur le chantier. Gérant les cotisations, suivant les travaux, travaillant avec eux.',
  'Le 1er octobre 1997, la mosquée était debout. Sangabi aussi. Dix ans plus tard, le 12 mars 2007, il s’en alla. L’œuvre et le message sont toujours là.',
]

