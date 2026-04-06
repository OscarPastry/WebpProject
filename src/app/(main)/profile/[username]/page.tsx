
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, Eye, Flame, ChefHat, Clock } from 'lucide-react'
import { getSession } from '@/lib/auth'
import EditProfileButton from '@/components/EditProfileButton'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const session = await getSession()

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      recipes: { include: { images: { where: { is_primary: true }, take: 1 } } },
      cooking_logs: {
        include: { recipe: { include: { images: { where: { is_primary: true }, take: 1 } } } },
        orderBy: { cooked_at: 'desc' }, take: 10
      },
      taste_signals: true,
    }
  })
  if (!user) return notFound()

  const totalViews = await prisma.recipe_View_Log.count({ where: { recipe: { user_id: user.user_id } } })
  const maxWeight = Math.max(...user.taste_signals.map(s => s.weight), 1)

  const isOwnProfile = session?.username === username

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      {/* Profile hero */}
      <div className="brutalist-card bg-[#fdf9ee] overflow-hidden">
        <div className="h-4 bg-black border-b-[3px] border-black" />
        <div className="p-8 flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          {user.profile?.profile_image_url ? (
            <div className="w-20 h-20 shrink-0 border-[3px] border-black overflow-hidden bg-[#ece8dd]">
              <Image src={user.profile.profile_image_url} alt={user.profile.display_name || username}
                width={80} height={80} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 shrink-0 border-[3px] border-black flex items-center justify-center font-headline font-black text-4xl bg-[#ffe500]">
              {(user.profile?.display_name || user.username).charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase text-black/40 font-black">Profile</p>
                <h1 className="font-headline font-black text-4xl uppercase tracking-tighter leading-none">
                  {user.profile?.display_name || user.username}
                </h1>
                <p className="font-mono text-sm text-black/50 mt-1">@{user.username}</p>
                {user.profile?.bio && <p className="font-body text-base text-black/70 mt-3">{user.profile.bio}</p>}
              </div>
              {isOwnProfile && (
                <EditProfileButton username={username} />
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t-[3px] border-black">
          {[
            { Icon: BookOpen, value: user.recipes.length, label: 'Recipes' },
            { Icon: Eye, value: totalViews, label: 'Views' },
            { Icon: Flame, value: user.cooking_logs.length, label: 'Cooked' },
            { Icon: ChefHat, value: user.taste_signals.length, label: 'Signals' },
          ].map(({ Icon, value, label }, i) => (
            <div key={label}
              className={`p-6 flex flex-col items-center text-center ${i < 3 ? 'border-r-[3px] border-black' : ''} ${i >= 2 ? 'border-t-[3px] md:border-t-0 border-black' : ''}`}>
              <Icon className="w-5 h-5 mb-2" />
              <div className="font-headline font-black text-4xl">{value}</div>
              <div className="font-mono text-[10px] uppercase text-black/40 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Taste Signal Profile */}
        {user.taste_signals.length > 0 && (
          <div className="brutalist-card bg-[#fdf9ee]">
            <div className="px-6 py-4 border-b-[3px] border-black bg-black">
              <h2 className="font-headline font-black text-xl uppercase tracking-tighter text-[#ffe500]">Taste Signal Profile</h2>
              <p className="font-mono text-[10px] text-white/40 uppercase mt-0.5">User_Taste_Signal table</p>
            </div>
            <div className="p-6 space-y-5">
              {user.taste_signals.map(signal => (
                <div key={signal.signal_id}>
                  <div className="flex justify-between font-mono text-xs uppercase mb-1.5">
                    <span className="font-bold">{signal.signal_type.replace('_', ' ')}</span>
                    <span className="bg-[#ffe500] border border-black px-2 font-black">{(signal.weight * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-4 border-[2px] border-black bg-[#ece8dd]">
                    <div className="h-full bg-black"
                      style={{ width: `${(signal.weight / maxWeight) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cooking Log */}
        {user.cooking_logs.length > 0 && (
          <div className="brutalist-card bg-[#fdf9ee]">
            <div className="px-6 py-4 border-b-[3px] border-black bg-black">
              <h2 className="font-headline font-black text-xl uppercase tracking-tighter text-[#ffe500]">Cooking Log</h2>
              <p className="font-mono text-[10px] text-white/40 uppercase mt-0.5">Cooking_Log join Recipe</p>
            </div>
            <div className="divide-y-[2px] divide-black">
              {user.cooking_logs.map(log => (
                <Link key={log.log_id} href={`/recipe/${log.recipe_id}`}
                  className="flex items-center gap-4 p-4 hover:bg-[#ffe500] transition-none group">
                  <div className="w-12 h-12 border-[2px] border-black overflow-hidden shrink-0 bg-[#ece8dd]">
                    {log.recipe.images[0]
                      ? <Image src={log.recipe.images[0].image_url} alt={log.recipe.title} width={100} height={100} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><ChefHat className="w-4 h-4 text-black/20" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-bold text-xs uppercase truncate">{log.recipe.title}</p>
                    <p className="font-mono text-[10px] text-black/40 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {new Date(log.cooked_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-black/30 group-hover:text-black">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User's Recipes */}
      {user.recipes.length > 0 && (
        <div>
          <div className="border-b-[4px] border-black pb-3 mb-6">
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter">
              Recipes by <span className="bg-[#ffe500] px-2 border-x-[3px] border-black">{user.profile?.display_name || user.username}</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {user.recipes.map(recipe => (
              <Link key={recipe.recipe_id} href={`/recipe/${recipe.recipe_id}`}
                className="brutalist-card brutalist-shadow-hover group bg-[#fdf9ee]">
                <div className="h-3 bg-[#ffe500] border-b-[3px] border-black" />
                <div className="aspect-video border-b-[3px] border-black overflow-hidden bg-[#ece8dd]">
                  {recipe.images[0]
                    ? <Image src={recipe.images[0].image_url} alt={recipe.title} width={600} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center"><ChefHat className="w-8 h-8 text-black/20" /></div>}
                </div>
                <div className="p-4">
                  <h3 className="font-headline font-black text-lg uppercase tracking-tighter leading-none">{recipe.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
