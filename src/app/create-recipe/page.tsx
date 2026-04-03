import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function CreateRecipePage() {
  const submitRecipe = async (formData: FormData) => {
    'use server'
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const estimated_time = parseInt(formData.get('estimated_time') as string)
    await prisma.recipe.create({
      data: { title, description, estimated_time, difficulty_level: formData.get('difficulty') as string, user_id: 1 }
    })
    redirect('/')
  }

  const fieldClass = "w-full bg-white border-[3px] border-black font-mono text-sm px-4 py-3 focus:outline-none focus:ring-0 focus:border-black uppercase placeholder:text-black/30 placeholder:normal-case"
  const labelClass = "block font-mono font-black text-xs uppercase mb-2 text-black/70"

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="border-b-[6px] border-black pb-6 mb-10">
        <p className="font-mono text-xs uppercase text-black/40 font-black mb-1">Recipe Table · INSERT</p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-[0.85]">
          New<br />Recipe
        </h1>
      </div>

      <div className="brutalist-card bg-[#fdf9ee] overflow-hidden">
        <div className="h-4 bg-[#ffe500] border-b-[3px] border-black" />
        <form action={submitRecipe} className="p-8 space-y-6">
          <div>
            <label className={labelClass}>Recipe Title *</label>
            <input name="title" required type="text" className={fieldClass} placeholder="e.g., Spicy Arrabiata" />
          </div>
          <div>
            <label className={labelClass}>Description *</label>
            <textarea name="description" required rows={4} className={`${fieldClass} normal-case`} placeholder="Tell us about this recipe..." />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Est. Time (mins) *</label>
              <input name="estimated_time" required type="number" min="1" className={fieldClass} placeholder="30" />
            </div>
            <div>
              <label className={labelClass}>Difficulty *</label>
              <select name="difficulty" className={`${fieldClass} cursor-pointer`}>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t-[3px] border-black">
            <button type="submit"
              className="w-full brutalist-btn bg-black text-[#ffe500] py-4 text-base uppercase font-headline font-black tracking-widest">
              ★ Publish Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
