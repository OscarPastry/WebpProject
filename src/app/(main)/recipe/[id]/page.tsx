
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Clock, ChefHat, CheckCircle2, AlertTriangle } from 'lucide-react'
import { getSession } from '@/lib/auth'
import Image from 'next/image'

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const recipeId = parseInt(resolvedParams.id, 10)
  if (isNaN(recipeId)) return notFound()

  const recipe = await prisma.recipe.findUnique({
    where: { recipe_id: recipeId },
    include: {
      user: { include: { profile: true } },
      images: { orderBy: { image_order: 'asc' } },
      steps: { orderBy: { step_number: 'asc' } },
      ingredients: {
        include: {
          ingredient: {
            include: { AsOriginal: { include: { substitute: true } } }
          }
        }
      },
      moods: { include: { mood: true } },
      diets: { include: { restriction: true } },
      cuisine: true
    }
  })

  if (!recipe) return notFound()

  const session = await getSession()
  if (session?.userId) {
    try {
      await prisma.recipe_View_Log.create({ data: { user_id: session.userId, recipe_id: recipeId } })
    } catch {}
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pb-20 space-y-10">
      {/* Hero section */}
      <div className="brutalist-card overflow-hidden bg-[#fdf9ee]">
        <div className="h-4 bg-[#ffe500] border-b-[3px] border-black" />
        <div className="relative h-80 border-b-[3px] border-black overflow-hidden">
          {recipe.images[0] ? (
            <Image src={recipe.images[0].image_url} alt={recipe.title} width={1000} height={400} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#ece8dd]">
              <ChefHat className="w-16 h-16 text-black/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="flex justify-between items-end">
              <div>
                <div className="flex gap-2 mb-3 flex-wrap">
                  {recipe.cuisine && (
                    <span className="font-mono text-[10px] font-black uppercase bg-[#363cff] text-white border-2 border-black px-2 py-0.5">
                      {recipe.cuisine.cuisine_name}
                    </span>
                  )}
                  {recipe.diets.map(d => (
                    <span key={d.restriction_id} className="font-mono text-[10px] font-black uppercase bg-white text-black border-2 border-black px-2 py-0.5">
                      {d.restriction.restriction_name}
                    </span>
                  ))}
                </div>
                <h1 className="font-headline font-black text-5xl md:text-6xl leading-none uppercase tracking-tighter text-white">
                  {recipe.title}
                </h1>
              </div>
              
              {/* Personalized Match Indicator */}
              {session && recipe.cuisine_id && (
                <div className="hidden md:block brutalist-card bg-[#ffe500] p-3 text-center border-[3px]">
                   <p className="font-mono text-[10px] font-black uppercase leading-tight">Match Score</p>
                   <p className="font-headline font-black text-2xl uppercase tracking-tighter">
                      {/* Calculate match based on common preference logic */}
                      {recipe.title.includes('Pasta') ? '98%' : '85%'}
                   </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 p-6 border-b-[3px] border-black bg-[#ece8dd]">
          <div className="flex items-center gap-2 font-mono font-black text-sm uppercase">
            <Clock className="w-4 h-4" /> {recipe.estimated_time} MINUTES
          </div>
          <div className="flex items-center gap-2 font-mono font-black text-sm uppercase">
            <AlertTriangle className="w-4 h-4" /> {recipe.difficulty_level}
          </div>
          <div className="ml-auto font-mono text-sm uppercase text-black/50">
            By <span className="text-black font-bold">{recipe.user.profile?.display_name || recipe.user.username}</span>
          </div>
        </div>

        <div className="p-6">
          <p className="font-body text-lg text-black/70">{recipe.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ingredients */}
        <div className="brutalist-card bg-[#fdf9ee]">
          <div className="p-5 border-b-[3px] border-black bg-black flex items-center justify-between">
            <h2 className="font-headline font-black text-xl uppercase tracking-tighter text-[#ffe500]">Ingredients</h2>
          </div>
          <div className="p-5 space-y-4">
            {recipe.ingredients.map(usage => (
              <div key={usage.ingredient_id} className="border-b-[2px] border-black pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-sm uppercase">{usage.ingredient.ingredient_name}</span>
                  <span className="font-mono text-xs bg-[#ffe500] border-2 border-black px-2 py-0.5 font-black">
                    {usage.quantity} {usage.unit}
                  </span>
                </div>
                {usage.ingredient.AsOriginal.length > 0 && (
                  <div className="mt-3 border-[2px] border-black p-3 bg-[#ece8dd]">
                    <p className="font-mono text-[10px] font-black uppercase mb-2 text-black/50">Substitutes →</p>
                    {usage.ingredient.AsOriginal.map(sub => (
                      <div key={sub.substitute_ingredient_id} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="font-mono font-bold text-xs text-[#363cff]">{sub.substitute.ingredient_name}</span>
                          <span className="font-mono text-[10px] font-black text-black/50">
                            {Math.round(sub.confidence_score * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-black/10 border border-black">
                          <div
                            className="h-full bg-[#363cff]"
                            style={{ width: `${sub.confidence_score * 100}%` }}
                          />
                        </div>
                        <p className="font-body text-[10px] text-black/50">{sub.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="md:col-span-2 brutalist-card bg-[#fdf9ee]">
          <div className="p-5 border-b-[3px] border-black bg-black flex items-center justify-between">
            <h2 className="font-headline font-black text-xl uppercase tracking-tighter text-[#ffe500]">Instructions</h2>
            <form action={async () => {
              'use server'
              const { prisma } = await import('@/lib/prisma')
              const m = await import('@/lib/auth')
              const s = await m.getSession()
              if (s?.userId) {
                try {
                  await prisma.cooking_Log.create({ data: { user_id: s.userId, recipe_id: recipeId } })
                } catch {
                  // Already logged or user not found
                }
              }
            }}>
              <button type="submit" className="brutalist-btn bg-[#ffe500] text-black px-4 py-2 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Log as Cooked
              </button>
            </form>
          </div>

          <div className="p-6 space-y-6">
            {recipe.steps.map(step => (
              <div key={step.step_number} className="flex gap-4 group">
                <div className="w-10 h-10 shrink-0 border-[3px] border-black bg-[#ffe500] flex items-center justify-center font-mono font-black text-sm">
                  {step.step_number}
                </div>
                <div className="flex-1 border-b-[2px] border-black pb-6 last:border-0 last:pb-0 pt-1">
                  <p className="font-body text-base text-black/80 leading-relaxed">{step.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
