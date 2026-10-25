import Hero from '../components/sections/Hero'
import Histoire from '../components/sections/Histoire'
import Sangabi from '../components/sections/Sangabi'
import Construction from '../components/sections/Construction'
import Visiter from '../components/sections/Visiter'
import Exposition from '../components/sections/Exposition'
import Timeline from '../components/sections/Timeline'
import Prier from '../components/sections/Prier'
import Evenements from '../components/sections/Evenements'
import LeMessage from '../components/sections/LeMessage'
import Communaute from '../components/sections/Communaute'
import Renovation from '../components/sections/Renovation'
import Patrimoine from '../components/sections/Patrimoine'
import Boutique from '../components/sections/Boutique'

// Page d'accueil : assemble les sections dans l'ordre du récit.
export default function Home() {
  return (
    <>
      <Hero />
      <Histoire />
      <Sangabi />
      <Construction />
      <Visiter />
      <Exposition />
      <Timeline />
      <Prier />
      <Evenements />
      <LeMessage />
      <Communaute />
      <Renovation />
      <Patrimoine />
      <Boutique />
    </>
  )
}
