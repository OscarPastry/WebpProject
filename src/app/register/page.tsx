
import { register } from '@/app/actions'
import Link from 'next/link'
import { User, Mail, KeyRound } from 'lucide-react'

export default function RegisterPage() {
  const fieldClass = "w-full bg-white border-[3px] border-black font-mono text-sm pl-12 pr-4 py-3 focus:outline-none focus:ring-0 focus:border-black uppercase placeholder:text-black/20"
  const labelClass = "block font-mono font-black text-xs uppercase mb-2 text-black/70"

  return (
    <div className="max-w-md mx-auto px-6 py-20 pb-40">
      <div className="border-b-[6px] border-black pb-6 mb-10 text-center">
        <p className="font-mono text-xs uppercase text-black/40 font-black mb-1">New Researcher · PROTOCOL_SIGNUP</p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-none">
          Regis<span className="bg-[#363cff] text-white px-2 border-[3px] border-black">ter</span>
        </h1>
      </div>

      <div className="brutalist-card bg-[#fdf9ee] overflow-hidden">
        <div className="h-4 bg-[#363cff] border-b-[3px] border-black" />
        <form action={register} className="p-8 space-y-6">
          <div>
            <label className={labelClass}>Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input name="username" required type="text" className={fieldClass} placeholder="chef_newbie" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input name="email" required type="email" className={fieldClass} placeholder="newbie@flavor.co" />
            </div>
          </div>
          <div>
            <label className={labelClass}>Access Password</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input name="password" required type="password" className={fieldClass} placeholder="••••••••" />
            </div>
          </div>

          <div className="pt-4">
            <button type="submit"
              className="w-full brutalist-btn bg-[#363cff] text-white py-4 text-base uppercase font-headline font-black tracking-widest hover:bg-neutral-800">
              Create Account →
            </button>
          </div>
        </form>
        
        <div className="p-6 bg-[#ece8dd] border-t-[3px] border-black text-center">
          <p className="font-mono text-xs uppercase">
            Already have access? <Link href="/login" className="font-black underline decoration-[#ffe500] hover:bg-[#ffe500] hover:text-black px-1">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
