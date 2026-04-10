
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { Globe, Lock, ChefHat } from 'lucide-react'

const STRIPES = ['#ffe500', '#363cff', '#b71422', '#000', '#ffe500', '#363cff']

export default async function BoardsPage() {
  const boards = await prisma.board.findMany({
    include: {
      user: { include: { profile: true } },
      recipes: {
        include: {
          recipe: { include: { images: { where: { is_primary: true }, take: 1 } } }
        }
      }
    },
    orderBy: { board_id: 'desc' }
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <section className="border-b-[6px] border-[var(--border)] pb-6 flex justify-between items-end">
        <div>
          <p className="font-mono text-xs uppercase font-black text-[var(--fg-dim)] mb-1">Pinterest-style · SAVES Table</p>
          <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-[0.85] text-[var(--fg)]">
            Recipe<br />Boards
          </h1>
        </div>
        <button className="brutalist-btn bg-[var(--yellow)] text-black px-6 py-3 text-sm">
          + New Board
        </button>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {boards.map((board, i) => {
          const stripe = STRIPES[i % STRIPES.length]
          const previews = board.recipes.slice(0, 4)
          return (
            <div key={board.board_id} className="brutalist-card brutalist-shadow-hover flex flex-col">
              <div className="h-4 border-b-[3px] border-[var(--border)]" style={{ background: stripe }} />

              {/* Mosaic preview */}
              <div className="grid grid-cols-2 gap-0 h-40 border-b-[3px] border-[var(--border)]">
                {[0,1,2,3].map(j => (
                  <div key={j} className={`relative overflow-hidden bg-[var(--bg-muted)] ${j === 1 || j === 3 ? 'border-l-[2px] border-[var(--border)]' : ''} ${j === 2 || j === 3 ? 'border-t-[2px] border-[var(--border)]' : ''}`}>
                    {previews[j]?.recipe.images[0] ? (
                      <Image src={previews[j].recipe.images[0].image_url} alt="Recipe image" width={300} height={300}
                        className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-[var(--fg-ghost)]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between">
                  <h2 className="font-headline font-black text-2xl uppercase tracking-tighter leading-none text-[var(--fg)]">{board.board_name}</h2>
                  {board.visibility === 'public'
                    ? <Globe className="w-4 h-4 shrink-0 text-green-700 mt-1" />
                    : <Lock className="w-4 h-4 shrink-0 text-[var(--fg-dim)] mt-1" />}
                </div>
                <p className="font-mono text-[10px] uppercase text-[var(--fg-muted)] mt-1">
                  By {board.user.profile?.display_name || board.user.username}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="db-tag">{board.recipes.length} Saved</span>
                  <span className={`db-tag ${board.visibility === 'public' ? 'bg-[var(--yellow)] text-black' : ''}`}>{board.visibility}</span>
                </div>

                {board.recipes.length > 0 && (
                  <div className="mt-4 pt-4 border-t-[2px] border-[var(--border)] space-y-1">
                    {board.recipes.slice(0, 3).map(save => (
                      <Link key={save.recipe_id} href={`/recipe/${save.recipe_id}`}
                        className="block font-mono text-xs uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--yellow)] hover:text-black px-1 transition-none truncate">
                        → {save.recipe.title}
                      </Link>
                    ))}
                    {board.recipes.length > 3 && (
                      <p className="font-mono text-[10px] text-[var(--fg-ghost)] uppercase">+{board.recipes.length - 3} more...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
