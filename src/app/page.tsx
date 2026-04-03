import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Clock, ChefHat } from 'lucide-react'
import { getSession } from '@/lib/auth'

const STRIPE_COLORS = ['#ffe500', '#b71422', '#363cff', '#000']

export default async function Home(props: { searchParams: Promise<Record<string, string>> }) {
  const searchParams = await props.searchParams
  const session = await getSession()
  const query = searchParams.search || ''

  // 1. Fetch User Preferences if logged in
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

  // 2. Fetch all public recipes with necessary joins
  const allRecipes = await prisma.recipe.findMany({
    where: {
      is_public: true,
      ...(searchParams.difficulty ? { difficulty_level: searchParams.difficulty } : {}),
      ...(query ? {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      } : {})
    },
    include: {
      images: true,
      moods: { include: { mood: true } },
      user: { include: { profile: true } },
      diets: { include: { restriction: true } }
    }
  })

  // 3. Filter and Score for Personalization
  let recipes = allRecipes

  if (session && mustFollowRestrictionIds.length > 0) {
    recipes = allRecipes.filter((r) => {
      const recipeRestrictionIds = r.diets.map((d) => d.restriction_id)
      return mustFollowRestrictionIds.every(id => recipeRestrictionIds.includes(id))
    })
  }

  // 4. Sort by score
  recipes.sort((a, b) => {
    let scoreA = 0
    let scoreB = 0

    // Boost based on rank in preferredCuisines
    if (a.cuisine_id && preferredCuisineIds.includes(a.cuisine_id)) {
      const rank = preferredCuisineIds.indexOf(a.cuisine_id)
      scoreA += (100 - rank * 20) // Top rank gets 100, 2nd gets 80, etc.
    }
    if (b.cuisine_id && preferredCuisineIds.includes(b.cuisine_id)) {
      const rank = preferredCuisineIds.indexOf(b.cuisine_id)
      scoreB += (100 - rank * 20)
    }

    // Secondary sort by date
    if (scoreA === scoreB) {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return scoreB - scoreA
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Hero Header */}
      <section className="border-b-[6px] border-black pb-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-xs uppercase font-black text-[#363cff] mb-2">
              {session ? `// PERSONALIZED_FEED_FOR_${session.username.toUpperCase()}` : '// GLOBAL_RESEARCH_FEED'}
            </p>
            <h1 className="font-headline font-black text-6xl lg:text-8xl tracking-tighter uppercase leading-[0.85]">
              The Daily<br />
              <span style={{ color: '#363cff' }}>Extraction</span>
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-mono font-black text-xl uppercase">RECIPE_FEED</p>
            <p className="font-mono text-sm uppercase text-black/50">{recipes.length} Matches Found</p>
            {session && <p className="font-mono text-[9px] uppercase text-[#22c55e] font-black">Preferences Synchronized ✓</p>}
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mt-6 flex-wrap">
          {['Easy', 'Medium', 'Hard'].map(d => (
            <Link key={d} href={`/?difficulty=${d}`}
              className={`brutalist-btn px-4 py-1.5 text-xs ${searchParams.difficulty === d ? 'bg-[#ffe500] text-black' : 'bg-white text-black'}`}>
              {d}
            </Link>
          ))}
          <Link href="/" className="brutalist-btn px-4 py-1.5 text-xs bg-black text-[#ffe500]">
            Clear
          </Link>
        </div>
      </section>

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <div className="brutalist-card p-16 text-center">
          <p className="font-mono uppercase text-black/50">No experiments found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {recipes.map((recipe, i: number) => {
            const stripe = STRIPE_COLORS[i % STRIPE_COLORS.length]
            return (
              <Link key={recipe.recipe_id} href={`/recipe/${recipe.recipe_id}`}
                className="group block">
                <div className="brutalist-card brutalist-shadow-hover bg-[#fdf9ee] flex flex-col h-full">
                  {/* Color stripe */}
                  <div className="h-4 border-b-[3px] border-black" style={{ background: stripe }} />

                  {/* Image */}
                  <div className="relative h-56 overflow-hidden border-b-[3px] border-black">
                    {recipe.images[0] ? (
                      <Image src={recipe.images[0].image_url} alt={recipe.title} width={800} height={600}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#ece8dd]">
                        <ChefHat className="w-12 h-12 text-black/20" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white border-2 border-black font-mono font-black text-[10px] px-2 py-1 uppercase">
                      #{String(recipe.recipe_id).padStart(4, '0')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-headline font-extrabold text-2xl leading-none uppercase tracking-tighter mb-4">
                      {recipe.title}
                    </h3>
                    
                    <div className="flex gap-2 flex-wrap mb-4">
                      <span className="db-tag">Difficulty: {recipe.difficulty_level}</span>
                      <span className="db-tag">Time: {recipe.estimated_time}m</span>
                    </div>

                    <div className="flex gap-1 flex-wrap mb-4">
                      {recipe.moods.slice(0, 3).map((m) => (
                        <span key={m.mood_id}
                          className="font-mono text-[10px] font-bold uppercase border border-black px-2 py-0.5 text-black/60">
                          {m.mood.mood_name}
                        </span>
                      ))}
                    </div>

                    <p className="font-body text-sm text-black/60 line-clamp-2 mb-6 flex-1">{recipe.description}</p>

                    <div className="flex items-center justify-between mt-auto border-t-[2px] border-black pt-3">
                      <span className="font-mono text-xs uppercase text-black/50 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {recipe.estimated_time} min
                      </span>
                      <span className="font-mono text-xs uppercase text-black/50">
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
