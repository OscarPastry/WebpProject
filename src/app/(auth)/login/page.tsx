
import { login } from '@/app/actions'
import Link from 'next/link'
import { KeyRound, User } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="border-b-[6px] border-[var(--border)] pb-6 mb-10 text-center">
        <p className="font-mono text-xs uppercase text-[var(--fg-dim)] font-black mb-1">Session Protocol · AUTH</p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-none text-[var(--fg)]">
          Sign <span className="bg-[var(--yellow)] px-2 border-[3px] border-[var(--border)] text-black">In</span>
        </h1>
      </div>

      <div className="brutalist-card overflow-hidden">
        <div className="h-4 bg-[var(--fg)] border-b-[3px] border-[var(--border)]" />
        <form action={login} className="p-8 space-y-6">
          <div>
            <label className="block font-mono font-black text-xs uppercase mb-2 text-[var(--fg-muted)]">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-ghost)]" />
              <input 
                name="username" 
                required 
                type="text" 
                className="w-full bg-[var(--input-bg)] border-[3px] border-[var(--border)] font-mono text-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-0 uppercase placeholder:text-[var(--fg-ghost)] text-[var(--fg)]" 
                placeholder="chef_mario" 
              />
            </div>
          </div>
          <div>
            <label className="block font-mono font-black text-xs uppercase mb-2 text-[var(--fg-muted)]">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-ghost)]" />
              <input 
                name="password" 
                required 
                type="password" 
                className="w-full bg-[var(--input-bg)] border-[3px] border-[var(--border)] font-mono text-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-0 placeholder:text-[var(--fg-ghost)] text-[var(--fg)]" 
                placeholder="••••••••" 
              />
            </div>
            <p className="font-mono text-[9px] text-[var(--fg-dim)] mt-2 uppercase">Hint: Seeded users use &quot;password123&quot;</p>
          </div>

          <div className="pt-4">
            <button type="submit"
              className="w-full brutalist-btn bg-[var(--fg)] text-[var(--yellow)] py-4 text-base uppercase font-headline font-black tracking-widest hover:opacity-80">
              Authorize →
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-[var(--bg-muted)] border-t-[3px] border-[var(--border)] text-center">
            <p className="font-mono text-xs uppercase text-[var(--fg)]">
                New researcher? <Link href="/register" className="font-black underline decoration-[var(--blue)] hover:bg-[var(--blue)] hover:text-white px-1">Register Access</Link>
            </p>
        </div>
      </div>
    </div>
  )
}
