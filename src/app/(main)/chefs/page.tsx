import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Eye, Flame, ChefHat, Search } from 'lucide-react'

export default async function ChefsPage(props: { searchParams: Promise<{ search?: string }> }) {
  const searchParams = await props.searchParams
  const query = searchParams.search || ''

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { profile: { display_name: { contains: query, mode: 'insensitive' } } },
            { profile: { bio: { contains: query, mode: 'insensitive' } } },
          ],
        }
      : {},
    include: {
      profile: true,
      recipes: true,
      cooking_logs: true,
      taste_signals: true,
    },
    orderBy: { created_at: 'desc' },
  })

  const totalViews = await Promise.all(
    users.map(u =>
      prisma.recipe_View_Log.count({
        where: { recipe: { user_id: u.user_id } },
      })
    )
  )

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* Header */}
      <section className="border-b-[6px] border-black pb-6">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs uppercase font-black text-black/40 mb-1">User Table · ALL_CHEFS</p>
            <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-[0.85]">
              Our<br />
              <span className="bg-[#ffe500] px-2 border-[3px] border-black">Chefs</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="font-mono font-black text-xl uppercase">CHEF_ROSTER</p>
            <p className="font-mono text-sm uppercase text-black/50">{users.length} Registered</p>
          </div>
        </div>

        {/* Search */}
        <form className="mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
            <input
              name="search"
              type="text"
              defaultValue={query}
              placeholder="Search chefs by name, username, or bio..."
              className="w-full bg-white border-[3px] border-black font-mono text-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-0 focus:border-black uppercase placeholder:text-black/20 placeholder:normal-case"
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button type="submit" className="brutalist-btn bg-black text-[#ffe500] px-6 py-2 text-xs">
              Search
            </button>
            {query && (
              <Link href="/chefs" className="brutalist-btn bg-white text-black px-4 py-2 text-xs ml-2">
                Clear
              </Link>
            )}
          </div>
        </form>
      </section>

      {/* Chef Grid */}
      {users.length === 0 ? (
        <div className="brutalist-card p-16 text-center">
          <p className="font-mono uppercase text-black/50">No chefs found.</p>
        </div>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {users.map((user, i) => {
            const initials = (user.profile?.display_name || user.username).charAt(0).toUpperCase()
            const stripeColors = ['#ffe500', '#b71422', '#363cff', '#000']
            const stripe = stripeColors[i % stripeColors.length]

            return (
              <Link key={user.user_id} href={`/profile/${user.username}`} className="group block">
                <div className="brutalist-card brutalist-shadow-hover bg-[#fdf9ee] flex flex-col h-full">
                  {/* Color stripe */}
                  <div className="h-4 border-b-[3px] border-black" style={{ background: stripe }} />

                  {/* Avatar + Name */}
                  <div className="p-6 flex items-start gap-4 border-b-[3px] border-black">
                    {user.profile?.profile_image_url ? (
                      <div className="w-16 h-16 shrink-0 border-[3px] border-black overflow-hidden bg-[#ece8dd]">
                        <Image src={user.profile.profile_image_url} alt={user.profile.display_name || user.username}
                          width={64} height={64} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 shrink-0 border-[3px] border-black flex items-center justify-center font-headline font-black text-3xl bg-[#ffe500] group-hover:bg-[#363cff] group-hover:text-white transition-colors">
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] uppercase text-black/40 font-black">@{user.username}</p>
                      <h2 className="font-headline font-black text-2xl uppercase tracking-tighter leading-none truncate">
                        {user.profile?.display_name || user.username}
                      </h2>
                      {user.profile?.bio && (
                        <p className="font-body text-sm text-black/60 mt-1 line-clamp-2">{user.profile.bio}</p>
                      )}
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-4 border-b-[3px] border-black">
                    {[
                      { Icon: BookOpen, value: user.recipes.length, label: 'Recipes' },
                      { Icon: Eye, value: totalViews[i], label: 'Views' },
                      { Icon: Flame, value: user.cooking_logs.length, label: 'Cooked' },
                      { Icon: ChefHat, value: user.taste_signals.length, label: 'Signals' },
                    ].map(({ Icon, value, label }, j) => (
                      <div key={label}
                        className={`p-4 flex flex-col items-center text-center ${j < 3 ? 'border-r-[3px] border-black' : ''}`}>
                        <Icon className="w-4 h-4 mb-1 text-black/40" />
                        <div className="font-headline font-black text-2xl">{value}</div>
                        <div className="font-mono text-[8px] uppercase text-black/40">{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent recipes preview */}
                  {user.recipes.length > 0 && (
                    <div className="p-4 flex-1">
                      <p className="font-mono text-[10px] font-black uppercase text-black/40 mb-2">Recent Recipes</p>
                      <div className="space-y-1">
                        {user.recipes.slice(0, 3).map(r => (
                          <div key={r.recipe_id}
                            className="font-mono text-xs uppercase text-black/60 truncate group-hover:text-black">
                            → {r.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="px-6 py-3 bg-[#ece8dd] border-t-[3px] border-black flex justify-between items-center">
                    <span className="font-mono text-[10px] uppercase text-black/40">
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-mono text-[10px] font-black uppercase text-[#363cff]">
                      View Profile →
                    </span>
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
