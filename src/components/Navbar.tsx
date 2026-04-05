import Link from 'next/link'
import { Plus, Search, User, LogOut } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { logout } from '@/app/actions'

export default async function Navbar() {
  const session = await getSession()

  return (
    <header className="fixed top-0 w-full z-50 bg-[#fdf9ee] border-b-[3px] border-black flex justify-between items-center px-6 h-20"
      style={{ boxShadow: '4px 4px 0px 0px #000' }}>
      
      {/* Left: Logo + Nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="font-headline font-black text-2xl uppercase tracking-tighter text-black hover:text-[#363cff] transition-none">
          FlavorForge
        </Link>
        <nav className="hidden xl:flex gap-0 items-center">
          <Link href="/"
            className="text-black/70 font-mono font-medium text-sm uppercase hover:bg-[#ffe500] hover:text-black px-3 py-1 transition-none border-r border-black/10">
            Recipes
          </Link>
          <Link href="/boards"
            className="text-black/70 font-mono font-medium text-sm uppercase hover:bg-[#ffe500] hover:text-black px-3 py-1 transition-none border-r border-black/10">
            Boards
          </Link>
          <Link href="/onboarding"
            className="text-black/70 font-mono font-medium text-sm uppercase hover:bg-[#ffe500] hover:text-black px-3 py-1 transition-none border-r border-black/10">
            Onboarding
          </Link>
          <Link href="/admin/ingredients"
            className="text-black/70 font-mono font-medium text-sm uppercase hover:bg-[#ffe500] hover:text-black px-3 py-1 transition-none">
            Ingredients
          </Link>
        </nav>
      </div>

      {/* Middle: Functional Search */}
      <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
        <form action="/" method="GET" className="w-full flex">
          <div className="relative w-full brutalist-card bg-[#ece8dd] flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-black/40" />
            <input 
              name="search"
              type="text" 
              placeholder="SEARCH RECIPES..." 
              className="w-full bg-transparent border-none focus:ring-0 font-mono text-[10px] uppercase pl-10 pr-4 py-2"
            />
          </div>
        </form>
      </div>

      {/* Right: CTA & Auth */}
      <div className="flex items-center gap-3">
        {session ? (
          <>
            <Link href="/create-recipe"
              className="hidden sm:flex items-center gap-2 brutalist-btn bg-white text-black px-4 py-2 text-xs">
              <Plus className="w-3 h-3" /> New Experiment
            </Link>
            <Link href={`/profile/${session.username}`}
              className="brutalist-btn bg-white text-black px-4 py-2 text-xs flex items-center gap-2 hover:bg-[#363cff] hover:text-white">
              <User className="w-3 h-3" /> {session.username}
            </Link>
            <form action={logout}>
              <button type="submit" className="brutalist-btn bg-black text-white px-3 py-2 text-xs hover:bg-neutral-800">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login"
              className="brutalist-btn bg-white text-black px-5 py-2 text-xs uppercase font-black">
              Login
            </Link>
            <Link href="/register"
              className="brutalist-btn bg-black text-white px-5 py-2 text-xs uppercase font-black">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
