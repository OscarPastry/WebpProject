
import { register } from '@/app/actions'
import Link from 'next/link'
import { User, Mail, KeyRound, UserCircle } from 'lucide-react'

export default function RegisterPage() {
  const fieldClass = "w-full bg-[var(--input-bg)] border-[3px] border-[var(--border)] font-mono text-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-0 uppercase placeholder:text-[var(--fg-ghost)] text-[var(--fg)]"
  const labelClass = "block font-mono font-black text-xs uppercase mb-2 text-[var(--fg-muted)]"

  return (
    <div className="max-w-md mx-auto px-6 py-20 pb-40">
      <div className="border-b-[6px] border-[var(--border)] pb-6 mb-10 text-center">
        <p className="font-mono text-xs uppercase text-[var(--fg-dim)] font-black mb-1">New Researcher · PROTOCOL_SIGNUP</p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-none text-[var(--fg)]">
          Regis<span className="bg-[var(--blue)] text-white px-2 border-[3px] border-[var(--border)]">ter</span>
        </h1>
      </div>

      <div className="brutalist-card overflow-hidden">
        <div className="h-4 bg-[var(--blue)] border-b-[3px] border-[var(--border)]" />
        <form action={register} className="p-8 space-y-6">
          <div>
            <label className={labelClass}>Display Name</label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-ghost)]" />
              <input name="display_name" required type="text" className={fieldClass} placeholder="Chef Mario" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-ghost)]" />
              <input name="username" required type="text" className={fieldClass} placeholder="chef_mario" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-ghost)]" />
              <input name="email" required type="email" className={fieldClass} placeholder="newbie@flavor.co" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Access Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-ghost)]" />
              <input name="password" required type="password" className={fieldClass} placeholder="••••••••" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit"
              className="w-full brutalist-btn bg-[var(--blue)] text-white py-4 text-base uppercase font-headline font-black tracking-widest hover:opacity-80">
              Create Account →
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-[var(--bg-muted)] border-t-[3px] border-[var(--border)] text-center">
          <p className="font-mono text-xs uppercase text-[var(--fg)]">
            Already have access? <Link href="/login" className="font-black underline decoration-[var(--yellow)] hover:bg-[var(--yellow)] hover:text-black px-1">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
