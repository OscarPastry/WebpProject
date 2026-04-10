import { prisma } from '@/lib/prisma'

export async function StatsFooter() {
  const [usersCount, recipesCount, ingredientsCount, logsCount] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.ingredient.count(),
    prisma.cooking_Log.count()
  ])

  const stats = [
    { label: 'TOTAL_USERS', value: usersCount },
    { label: 'TOTAL_RECIPES', value: recipesCount },
    { label: 'INGREDIENTS', value: ingredientsCount },
    { label: 'COOKING_LOGS', value: logsCount },
  ]

  return (
    <footer className="bg-[var(--fg)] border-t-[3px] border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="border-l-[3px] border-[var(--yellow)] pl-4">
          <p className="font-mono font-black text-[var(--yellow)] text-sm uppercase tracking-widest">Live DB Metrics</p>
          <p className="font-mono text-[var(--bg)] text-[10px] uppercase mt-0.5 opacity-40">ENGINE_STATUS: STABLE</p>
        </div>
        <div className="flex gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center border-l border-[var(--bg)]/10 pl-6 first:border-0 first:pl-0">
              <div className="font-headline font-black text-2xl text-[var(--yellow)]">{s.value.toLocaleString()}</div>
              <div className="font-mono text-[var(--bg)] text-[10px] uppercase mt-0.5 opacity-50">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
