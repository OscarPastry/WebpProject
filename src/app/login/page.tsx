
import { login } from '@/app/actions'
import Link from 'next/link'
import { KeyRound, User } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="border-b-[6px] border-black pb-6 mb-10 text-center">
        <p className="font-mono text-xs uppercase text-black/40 font-black mb-1">Session Protocol · AUTH</p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-none">
          Sign <span className="bg-[#ffe500] px-2 border-[3px] border-black">In</span>
        </h1>
      </div>

      <div className="brutalist-card bg-[#fdf9ee] overflow-hidden">
        <div className="h-4 bg-black border-b-[3px] border-black" />
        <form action={login} className="p-8 space-y-6">
          <div>
            <label className="block font-mono font-black text-xs uppercase mb-2 text-black/70">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input 
                name="username" 
                required 
                type="text" 
                className="w-full bg-white border-[3px] border-black font-mono text-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-0 focus:border-black uppercase placeholder:text-black/20" 
                placeholder="chef_mario" 
              />
            </div>
          </div>
          <div>
            <label className="block font-mono font-black text-xs uppercase mb-2 text-black/70">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input 
                name="password" 
                required 
                type="password" 
                className="w-full bg-white border-[3px] border-black font-mono text-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-0 focus:border-black placeholder:text-black/20" 
                placeholder="••••••••" 
              />
            </div>
            <p className="font-mono text-[9px] text-black/40 mt-2 uppercase">Hint: Seeded users use &quot;password123&quot;</p>
          </div>

          <div className="pt-4">
            <button type="submit"
              className="w-full brutalist-btn bg-black text-[#ffe500] py-4 text-base uppercase font-headline font-black tracking-widest hover:bg-neutral-800">
              Authorize →
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-[#ece8dd] border-t-[3px] border-black text-center">
            <p className="font-mono text-xs uppercase">
                New researcher? <Link href="/register" className="font-black underline decoration-[#363cff] hover:bg-[#363cff] hover:text-white px-1">Register Access</Link>
            </p>
        </div>
      </div>
    </div>
  )
}
