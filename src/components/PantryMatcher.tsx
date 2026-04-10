'use client'

import { useState } from 'react'
import { Search, ChefHat, Clock, Check, X, Flame } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface IngredientOption {
  ingredient_id: number
  ingredient_name: string
  availability_tag: string | null
}

interface MatchedRecipe {
  recipe_id: number
  title: string
  description: string
  estimated_time: number
  difficulty_level: string
  image_url: string | null
  cuisine_name: string | null
  chef_name: string
  moods: string[]
  totalIngredients: number
  matchedCount: number
  matchPercentage: number
  matchedNames: string[]
  missingNames: string[]
}

export default function PantryMatcher({ ingredients }: { ingredients: IngredientOption[] }) {
  const [selected, setSelected] = useState<number[]>([])
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<MatchedRecipe[] | null>(null)
  const [loading, setLoading] = useState(false)

  const filtered = ingredients.filter(i =>
    i.ingredient_name.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleMatch = async () => {
    if (selected.length === 0) return
    setLoading(true)
    try {
      const res = await fetch('/api/pantry-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientIds: selected })
      })
      const data = await res.json()
      setResults(data.recipes)
    } finally {
      setLoading(false)
    }
  }

  const selectedNames = selected.map(id =>
    ingredients.find(i => i.ingredient_id === id)?.ingredient_name
  ).filter(Boolean)

  const fullMatches = results?.filter(r => r.matchPercentage === 100) || []
  const partialMatches = results?.filter(r => r.matchPercentage < 100) || []

  return (
    <div className="space-y-10">
      {/* Ingredient Selector */}
      <div className="brutalist-card overflow-hidden">
        <div className="h-4 bg-[var(--yellow)] border-b-[3px] border-[var(--border)]" />
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-black text-2xl uppercase tracking-tighter text-[var(--fg)]">
              Select Your Ingredients
            </h2>
            <span className="font-mono text-[10px] text-[var(--fg-dim)] uppercase">
              {selected.length} selected
            </span>
          </div>

          {/* Selected chips */}
          {selectedNames.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedNames.map(name => (
                <button
                  key={name}
                  onClick={() => {
                    const ing = ingredients.find(i => i.ingredient_name === name)
                    if (ing) toggle(ing.ingredient_id)
                  }}
                  className="flex items-center gap-1 font-mono text-[10px] font-black uppercase bg-[var(--yellow)] text-black border-2 border-[var(--border)] px-3 py-1.5"
                >
                  {name}
                  <X className="w-3 h-3" />
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-ghost)]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search ingredients..."
              className="w-full bg-[var(--input-bg)] border-[3px] border-[var(--border)] font-mono text-sm pl-12 pr-4 py-3 focus:outline-none text-[var(--fg)] placeholder:text-[var(--fg-ghost)] uppercase"
            />
          </div>

          {/* Grid */}
          <div className="max-h-64 overflow-y-auto border-[3px] border-[var(--border)]">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map(ing => {
                const isSelected = selected.includes(ing.ingredient_id)
                return (
                  <button
                    key={ing.ingredient_id}
                    onClick={() => toggle(ing.ingredient_id)}
                    className={`p-3 text-left font-mono text-xs uppercase border-b border-r border-[var(--border-muted)] transition-none
                      ${isSelected
                        ? 'bg-[var(--yellow)] text-black font-black'
                        : 'bg-[var(--bg-card)] text-[var(--fg-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--fg)]'}`}
                  >
                    <span className="flex items-center gap-1">
                      {isSelected && <Check className="w-3 h-3" />}
                      {ing.ingredient_name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleMatch}
              disabled={selected.length === 0 || loading}
              className="brutalist-btn bg-[var(--fg)] text-[var(--yellow)] px-8 py-3 text-sm font-headline font-black uppercase disabled:opacity-50"
            >
              {loading ? 'Searching...' : `Find Recipes (${selected.length} ingredients)`}
            </button>
            {selected.length > 0 && (
              <button
                onClick={() => { setSelected([]); setResults(null) }}
                className="brutalist-btn bg-[var(--bg-card)] text-[var(--fg)] px-4 py-3 text-xs"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {results !== null && (
        <div className="space-y-8">
          {/* Summary */}
          <div className="border-b-[4px] border-[var(--border)] pb-3">
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter text-[var(--fg)]">
              {results.length === 0 ? 'No Matches Found' : (
                <>
                  <span className="bg-[var(--yellow)] px-2 border-x-[3px] border-[var(--border)] text-black">{fullMatches.length}</span> Full Match{fullMatches.length !== 1 ? 'es' : ''}
                  {partialMatches.length > 0 && (
                    <span className="text-[var(--fg-muted)]"> · {partialMatches.length} Partial</span>
                  )}
                </>
              )}
            </h2>
            <p className="font-mono text-[10px] text-[var(--fg-dim)] uppercase mt-1">
              Query: SELECT recipes WHERE USES.ingredient_id IN ({selected.length} items) GROUP BY recipe_id
            </p>
          </div>

          {/* Full Matches */}
          {fullMatches.length > 0 && (
            <div className="space-y-4">
              <p className="font-mono text-xs font-black uppercase text-green-600">
                ✓ 100% Match — You have everything!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fullMatches.map(recipe => (
                  <RecipeMatchCard key={recipe.recipe_id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}

          {/* Partial Matches */}
          {partialMatches.length > 0 && (
            <div className="space-y-4">
              <p className="font-mono text-xs font-black uppercase text-[var(--fg-muted)]">
                Partial Matches — Missing some ingredients
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partialMatches.map(recipe => (
                  <RecipeMatchCard key={recipe.recipe_id} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function RecipeMatchCard({ recipe }: { recipe: MatchedRecipe }) {
  const isFull = recipe.matchPercentage === 100

  return (
    <Link href={`/recipe/${recipe.recipe_id}`} className="group block">
      <div className="brutalist-card brutalist-shadow-hover flex flex-col h-full overflow-hidden">
        <div className={`h-3 border-b-[3px] border-[var(--border)] ${isFull ? 'bg-green-500' : 'bg-[var(--yellow)]'}`} />

        {/* Match % bar */}
        <div className="px-4 py-2 border-b-[3px] border-[var(--border)] bg-[var(--bg-muted)]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-black uppercase text-[var(--fg)]">
              {isFull ? '✓ FULL MATCH' : `${recipe.matchPercentage}% MATCH`}
            </span>
            <span className="font-mono text-[10px] text-[var(--fg-dim)]">
              {recipe.matchedCount}/{recipe.totalIngredients} ingredients
            </span>
          </div>
          <div className="h-2 border-[2px] border-[var(--border)] bg-[var(--bg)]">
            <div
              className={`h-full ${isFull ? 'bg-green-500' : 'bg-[var(--yellow)]'}`}
              style={{ width: `${recipe.matchPercentage}%` }}
            />
          </div>
        </div>

        {/* Image */}
        <div className="relative h-36 overflow-hidden border-b-[3px] border-[var(--border)]">
          {recipe.image_url ? (
            <Image src={recipe.image_url} alt={recipe.title} width={600} height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--bg-muted)]">
              <ChefHat className="w-10 h-10 text-[var(--fg-ghost)]" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-headline font-black text-lg uppercase tracking-tighter leading-none text-[var(--fg)] mb-2">
            {recipe.title}
          </h3>
          <div className="flex gap-2 flex-wrap mb-3">
            <span className="db-tag"><Clock className="w-3 h-3 inline" /> {recipe.estimated_time}m</span>
            <span className="db-tag"><Flame className="w-3 h-3 inline" /> {recipe.difficulty_level}</span>
            {recipe.cuisine_name && <span className="db-tag bg-[var(--blue)] text-white border-[var(--blue)]">{recipe.cuisine_name}</span>}
          </div>

          {/* Missing */}
          {recipe.missingNames.length > 0 && (
            <div className="mt-auto pt-3 border-t-[2px] border-[var(--border)]">
              <p className="font-mono text-[10px] font-black uppercase text-[var(--red)] mb-1">Missing:</p>
              <p className="font-mono text-[10px] text-[var(--fg-dim)] leading-relaxed">
                {recipe.missingNames.join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
