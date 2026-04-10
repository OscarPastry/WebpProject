import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ChefHat, Star } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import FilterBar from '@/components/FilterBar'

const STRIPE_COLORS = ['#ffe500', '#b71422', '#363cff', '#000']

export default async function Home(props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams
  const session = await getSession()
  if (!session) redirect('/login')
  const query = searchParams.search || ''

  const cuisines = await prisma.cuisine.findMany({ orderBy: { cuisine_name: 'asc' } })
  const moods = await prisma.mood.findMany({ orderBy: { mood_name: 'asc' } })

  const activeCuisine = searchParams.cuisine || ''
  const activeMood = searchParams.mood || ''

  let preferredCuisineIds: number[] = []
  let mustFollowRestrictionIds: number[] = []

  if (session) {
    const userPrefs = await prisma.user.findUnique({
      where: { user_id: session.userId },
      include: {
        dietary_rests: true,
        onboarding: { include: { cuisines: { orderBy: { preference_rank: 'asc' } } } }
      }
    })
    
    if (userPrefs) {
      mustFollowRestrictionIds = userPrefs.dietary_rests.map((r) => r.restriction_id)
      preferredCuisineIds = userPrefs.onboarding?.cuisines.map((c) => c.cuisine_id) || []
    }
  }

  const whereClause: Record<string, unknown> = { is_public: true }
  if (searchParams.difficulty) whereClause.difficulty_level = searchParams.difficulty
  if (activeCuisine) {
    const cuisine = cuisines.find(c => c.cuisine_name === activeCuisine)
    if (cuisine) whereClause.cuisine_id = cuisine.cuisine_id
  }
  if (activeMood) {
    const mood = moods.find(m => m.mood_name === activeMood)
    if (mood) whereClause.moods = { some: { mood_id: mood.mood_id } }
  }
  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } }
    ]
  }

  const allRecipes = await prisma.recipe.findMany({
    where: whereClause,
    include: {
      images: true,
      moods: { include: { mood: true } },
      user: { include: { profile: true } },
      diets: { include: { restriction: true } },
      cuisine: true,
      reviews: true,
    }
  })

  let recipes = allRecipes

  if (session && mustFollowRestrictionIds.length > 0) {
    recipes = allRecipes.filter((r) => {
      const recipeRestrictionIds = r.diets.map((d) => d.restriction_id)
      return mustFollowRestrictionIds.every(id => recipeRestrictionIds.includes(id))
    })
  }

  recipes.sort((a, b) => {
    let scoreA = 0
    let scoreB = 0

    if (a.cuisine_id && preferredCuisineIds.includes(a.cuisine_id)) {
      const rank = preferredCuisineIds.indexOf(a.cuisine_id)
      scoreA += (100 - rank * 20)
    }
    if (b.cuisine_id && preferredCuisineIds.includes(b.cuisine_id)) {
      const rank = preferredCuisineIds.indexOf(b.cuisine_id)
      scoreB += (100 - rank * 20)
    }

    if (scoreA === scoreB) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return scoreB - scoreA
  })

  const activeFilters = [
    ...(searchParams.difficulty ? [{ key: 'difficulty', value: searchParams.difficulty }] : []),
    ...(activeCuisine ? [{ key: 'cuisine', value: activeCuisine }] : []),
    ...(activeMood ? [{ key: 'mood', value: activeMood }] : []),
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <section className="border-b-[6px] border-[var(--border)] pb-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-xs uppercase font-black text-[var(--blue)] mb-2">
              {session ? `// PERSONALIZED_FEED_FOR_${session.username.toUpperCase()}` : '// GLOBAL_RESEARCH_FEED'}
            </p>
            <h1 className="font-headline font-black text-6xl lg:text-8xl tracking-tighter uppercase leading-[0.85] text-[var(--fg)]">
              The Daily<br />
              <span style={{ color: 'var(--blue)' }}>Extraction</span>
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-mono font-black text-xl uppercase text-[var(--fg)]">RECIPE_FEED</p>
            <p className="font-mono text-sm uppercase text-[var(--fg-muted)]">{recipes.length} Matches Found</p>
            {session && <p className="font-mono text-[9px] uppercase text-[#22c55e] font-black">Preferences Synchronized ✓</p>}
          </div>
        </div>

        <FilterBar cuisines={cuisines} moods={moods} searchParams={searchParams} activeFilters={activeFilters} />
      </section>

      {recipes.length === 0 ? (
        <div className="brutalist-card p-16 text-center">
          <p className="font-mono uppercase text-[var(--fg-muted)]">No experiments found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {recipes.map((recipe, i: number) => {
            const stripe = STRIPE_COLORS[i % STRIPE_COLORS.length]
            const avgRating = recipe.reviews.length > 0
              ? recipe.reviews.reduce((sum, r) => sum + r.rating, 0) / recipe.reviews.length
              : 0
            return (
              <Link key={recipe.recipe_id} href={`/recipe/${recipe.recipe_id}`}
                className="group block">
                <div className="brutalist-card brutalist-shadow-hover flex flex-col h-full">
                  <div className="h-4 border-b-[3px] border-[var(--border)]" style={{ background: stripe }} />

                  <div className="relative h-56 overflow-hidden border-b-[3px] border-[var(--border)]">
                    {recipe.images[0] ? (
                      <Image src={recipe.images[0].image_url} alt={recipe.title} width={800} height={600}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-muted)]">
                        <ChefHat className="w-12 h-12 text-[var(--fg-ghost)]" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[var(--bg-card)] border-2 border-[var(--border)] font-mono font-black text-[10px] px-2 py-1 uppercase text-[var(--fg)]">
                      #{String(recipe.recipe_id).padStart(4, '0')}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-headline font-extrabold text-2xl leading-none uppercase tracking-tighter mb-4 text-[var(--fg)]">
                      {recipe.title}
                    </h3>
                    
                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className="db-tag">Difficulty: {recipe.difficulty_level}</span>
                      <span className="db-tag">Time: {recipe.estimated_time}m</span>
                      {recipe.cuisine && (
                        <span className="db-tag bg-[var(--blue)] text-white border-[var(--blue)]">{recipe.cuisine.cuisine_name}</span>
                      )}
                    </div>

                    {/* Star rating */}
                    {avgRating > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12}
                              className={s <= Math.round(avgRating)
                                ? 'fill-[var(--yellow)] text-[var(--yellow)]'
                                : 'fill-none text-[var(--fg-ghost)]'
                              }
                            />
                          ))}
                        </div>
                        <span className="font-mono text-[10px] font-black text-[var(--fg-dim)]">
                          {avgRating.toFixed(1)} ({recipe.reviews.length})
                        </span>
                      </div>
                    )}

                    <div className="flex gap-1 flex-wrap mb-4">
                      {recipe.moods.slice(0, 3).map((m) => (
                        <span key={m.mood_id}
                          className="font-mono text-[10px] font-bold uppercase border border-[var(--border)] px-2 py-0.5 text-[var(--fg-dim)]">
                          {m.mood.mood_name}
                        </span>
                      ))}
                    </div>

                    <p className="font-body text-sm text-[var(--fg-muted)] line-clamp-2 mb-6 flex-1">{recipe.description}</p>

                    <div className="flex items-center justify-between mt-auto border-t-[2px] border-[var(--border)] pt-3">
                      <span className="font-mono text-xs uppercase text-[var(--fg-muted)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {recipe.estimated_time} min
                      </span>
                      <span className="font-mono text-xs uppercase text-[var(--fg-muted)]">
                        {recipe.user.profile?.display_name || recipe.user.username}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </section>
      )}
    </div>
  )
}
