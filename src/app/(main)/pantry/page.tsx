import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PantryMatcher from '@/components/PantryMatcher'

export default async function PantryPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const ingredients = await prisma.ingredient.findMany({
    orderBy: { ingredient_name: 'asc' }
  })

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <section className="border-b-[6px] border-[var(--border)] pb-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-xs uppercase font-black text-[var(--fg-dim)] mb-2">
              Ingredient Table · USES · SET INTERSECTION
            </p>
            <h1 className="font-headline font-black text-6xl lg:text-8xl tracking-tighter uppercase leading-[0.85] text-[var(--fg)]">
              What Can<br />
              <span className="text-[var(--yellow)]" style={{ WebkitTextStroke: '2px var(--border)' }}>I Cook?</span>
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-mono font-black text-xl uppercase text-[var(--fg)]">PANTRY_MATCH</p>
            <p className="font-mono text-sm uppercase text-[var(--fg-muted)]">{ingredients.length} Ingredients Available</p>
          </div>
        </div>
      </section>

      <PantryMatcher ingredients={ingredients} />
    </div>
  )
}
