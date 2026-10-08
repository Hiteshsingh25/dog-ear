import { Hero } from '@/components/sections/Hero'
import { Books } from '@/components/sections/Books'
import { Flow } from '@/components/sections/Flow'
import { BoxSection } from '@/components/sections/BoxSection'
import { Genre } from '@/components/sections/Genre'
import { Benefits } from '@/components/sections/Benefits'
import { Faq } from '@/components/sections/Faq'
import { Gift } from '@/components/sections/Gift'
import { Badge } from '@/components/sections/Badge'
import { Choice } from '@/components/sections/Choice'
import { Exclusive } from '@/components/sections/Exclusive'

/* Server component: every section server-renders its copy; the animated ones are
   plain markup with data-* hooks that src/modules picks up on the client. */
export default function HomePage() {
  return (
    <main className="main">
      <Hero />
      <Books />
      <Flow />
      <BoxSection />
      <Genre />
      <Benefits />
      <Faq />
      <Gift />
      <Badge />
      <Choice />
      <Exclusive />
    </main>
  )
}
