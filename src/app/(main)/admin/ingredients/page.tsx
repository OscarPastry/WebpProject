
import { prisma } from '@/lib/prisma'
import { ArrowRight } from 'lucide-react'

export default async function AdminIngredientsPage() {
  const ingredients = await prisma.ingredient.findMany({
    include: { AsOriginal: { include: { substitute: true } } },
    orderBy: { ingredient_name: 'asc' }
  })
  const substitutes = await prisma.sUBSTITUTES.findMany({
    include: { original: true, substitute: true }
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <section className="border-b-[6px] border-black pb-6">
        <p className="font-mono text-xs uppercase font-black text-black/40 mb-1">Admin Panel · SUBSTITUTES Junction</p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-[0.85]">
          Ingredient<br /><span style={{ color: '#363cff' }}>Manager</span>
        </h1>
      </section>

      {/* SUBSTITUTES Table */}
      <div className="brutalist-card overflow-hidden">
        <div className="flex flex-wrap gap-3 items-center px-6 py-4 border-b-[3px] border-black bg-black">
          <h2 className="font-headline font-black text-xl uppercase tracking-tighter text-[#ffe500]">
            SUBSTITUTES Table
          </h2>
          <span className="pk-badge bg-[#ffe500] border-[#ffe500]">PK: original_ingredient_id</span>
          <span className="pk-badge bg-[#ffe500] border-[#ffe500]">PK: substitute_ingredient_id</span>
          <span className="font-mono text-[10px] text-white/40 ml-auto">Self-join on Ingredient</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#ece8dd]">
                <th className="p-4 font-mono font-black text-xs uppercase text-left border-r-[2px] border-b-[2px] border-black">
                  Original <span className="fk-badge ml-1">FK</span>
                </th>
                <th className="p-4 border-r-[2px] border-b-[2px] border-black w-10" />
                <th className="p-4 font-mono font-black text-xs uppercase text-left border-r-[2px] border-b-[2px] border-black">
                  Substitute <span className="fk-badge ml-1">FK</span>
                </th>
                <th className="p-4 font-mono font-black text-xs uppercase text-left border-r-[2px] border-b-[2px] border-black">Reason</th>
                <th className="p-4 font-mono font-black text-xs uppercase text-left border-r-[2px] border-b-[2px] border-black">Confidence</th>
                <th className="p-4 font-mono font-black text-xs uppercase text-left border-b-[2px] border-black">Explanation</th>
              </tr>
            </thead>
            <tbody>
              {substitutes.map((sub, i) => (
                <tr key={i} className={`border-b-[2px] border-black ${i % 2 ? 'bg-[#ece8dd]' : 'bg-[#fdf9ee]'}`}>
                  <td className="p-4 border-r-[2px] border-black font-mono font-bold text-xs uppercase">{sub.original.ingredient_name}</td>
                  <td className="p-4 border-r-[2px] border-black text-center">
                    <ArrowRight className="w-4 h-4 text-[#363cff]" />
                  </td>
                  <td className="p-4 border-r-[2px] border-black font-mono font-bold text-xs uppercase text-[#363cff]">{sub.substitute.ingredient_name}</td>
                  <td className="p-4 border-r-[2px] border-black font-body text-xs text-black/60">{sub.reason}</td>
                  <td className="p-4 border-r-[2px] border-black">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-24 border-[2px] border-black bg-[#ece8dd]">
                        <div
                          className="h-full"
                          style={{
                            width: `${sub.confidence_score * 100}%`,
                            background: sub.confidence_score > 0.8 ? '#22c55e' : sub.confidence_score > 0.5 ? '#ffe500' : '#b71422'
                          }}
                        />
                      </div>
                      <span className="font-mono text-[10px] font-black">{(sub.confidence_score * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="p-4 font-body text-xs text-black/50 max-w-[200px]">{sub.explanation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingredients Grid */}
      <div>
        <div className="border-b-[4px] border-black pb-3 mb-6">
          <h2 className="font-headline font-black text-3xl uppercase tracking-tighter">All Ingredients</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {ingredients.map(ing => (
            <div key={ing.ingredient_id} className="brutalist-card brutalist-shadow-hover bg-[#fdf9ee] p-4">
              <p className="font-mono font-black text-sm uppercase leading-tight">{ing.ingredient_name}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`db-tag text-[9px] ${ing.availability_tag === 'High' ? 'bg-[#ffe500]' : ing.availability_tag === 'Medium' ? 'bg-orange-200' : 'bg-red-200'}`}>
                  {ing.availability_tag}
                </span>
                {ing.AsOriginal.length > 0 && (
                  <span className="font-mono text-[9px] uppercase text-[#363cff] flex items-center gap-0.5 font-black">
                    <ArrowRight className="w-2.5 h-2.5" />{ing.AsOriginal.length}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
