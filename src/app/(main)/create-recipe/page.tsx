'use client'

import { useState } from 'react'
import { Plus, X, Image as ImageIcon } from 'lucide-react'
import { createRecipe } from '@/app/actions'
import Image from 'next/image'

export default function CreateRecipePage() {
  const [images, setImages] = useState<{ url: string; order: number }[]>([])
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string; unit: string }[]>([])
  const [steps, setSteps] = useState<string[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState('')
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState('Easy')
  const [submitting, setSubmitting] = useState(false)

  const addImage = () => setImages([...images, { url: '', order: images.length + 1 }])
  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i + 1 })))
  const updateImage = (index: number, url: string) => {
    const updated = [...images]
    updated[index] = { ...updated[index], url }
    setImages(updated)
  }

  const addIngredient = () => setIngredients([...ingredients, { name: '', quantity: '', unit: 'g' }])
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index))
  const updateIngredient = (index: number, field: string, value: string) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const addStep = () => setSteps([...steps, ''])
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index))
  const updateStep = (index: number, value: string) => {
    const updated = [...steps]
    updated[index] = value
    setSteps(updated)
  }

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true)
    try {
      const imageUrls = images.filter(img => img.url.trim()).map(img => img.url.trim())
      const ingredientData = ingredients
        .filter(ing => ing.name.trim() && ing.quantity.trim())
        .map(ing => ({
          name: ing.name.trim(),
          quantity: parseFloat(ing.quantity),
          unit: ing.unit.trim()
        }))
      const stepData = steps.filter(s => s.trim()).map((s, i) => ({ step_number: i + 1, instruction: s.trim() }))

      formData.append('images', JSON.stringify(imageUrls))
      formData.append('ingredients', JSON.stringify(ingredientData))
      formData.append('steps', JSON.stringify(stepData))
      if (selectedCuisine) formData.append('cuisine', selectedCuisine)
      if (selectedMoods.length) formData.append('moods', JSON.stringify(selectedMoods))
      if (selectedDiets.length) formData.append('diets', JSON.stringify(selectedDiets))
      formData.append('difficulty', difficulty)

      await createRecipe(formData)
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = "w-full bg-[var(--input-bg)] border-[3px] border-[var(--border)] font-mono text-sm px-4 py-3 focus:outline-none focus:ring-0 uppercase placeholder:text-[var(--fg-ghost)] text-[var(--fg)]"
  const labelClass = "block font-mono font-black text-xs uppercase mb-2 text-[var(--fg-muted)]"

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="border-b-[6px] border-[var(--border)] pb-6 mb-10">
        <p className="font-mono text-xs uppercase text-[var(--fg-dim)] font-black mb-1">Recipe Table · INSERT</p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-[0.85] text-[var(--fg)]">
          New<br />Recipe
        </h1>
      </div>

      <form action={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="brutalist-card overflow-hidden">
          <div className="h-4 bg-[var(--yellow)] border-b-[3px] border-[var(--border)]" />
          <div className="p-8 space-y-6">
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
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className={`${fieldClass} cursor-pointer`}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="brutalist-card overflow-hidden">
          <div className="h-4 bg-[var(--blue)] border-b-[3px] border-[var(--border)]" />
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <label className={`${labelClass} mb-0`}>Recipe Images</label>
              <button type="button" onClick={addImage} className="brutalist-btn bg-[var(--blue)] text-white px-3 py-1.5 text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Image
              </button>
            </div>
            {images.length === 0 ? (
              <div className="border-[3px] border-dashed border-[var(--fg-ghost)] p-8 text-center">
                <ImageIcon className="w-8 h-8 mx-auto mb-2 text-[var(--fg-ghost)]" />
                <p className="font-mono text-xs uppercase text-[var(--fg-dim)]">No images added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((img, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="font-mono text-[10px] font-black uppercase bg-[var(--fg)] text-[var(--yellow)] border-2 border-[var(--border)] px-2 py-1.5 shrink-0 mt-2">#{img.order}</span>
                    <div className="flex-1">
                      <input
                        type="url"
                        value={img.url}
                        onChange={e => updateImage(index, e.target.value)}
                        className={fieldClass}
                        placeholder="https://example.com/image.jpg"
                      />
                      {img.url && (
                        <div className="mt-2 border-[3px] border-[var(--border)] overflow-hidden h-32 bg-[var(--bg-muted)]">
                          <Image src={img.url} alt={`Preview ${img.order}`} width={400} height={128} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => removeImage(index)} className="brutalist-btn bg-[var(--red)] text-white p-2 mt-2">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ingredients */}
        <div className="brutalist-card overflow-hidden">
          <div className="h-4 bg-[var(--red)] border-b-[3px] border-[var(--border)]" />
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <label className={`${labelClass} mb-0`}>Ingredients</label>
              <button type="button" onClick={addIngredient} className="brutalist-btn bg-[var(--red)] text-white px-3 py-1.5 text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Ingredient
              </button>
            </div>
            {ingredients.length === 0 ? (
              <div className="border-[3px] border-dashed border-[var(--fg-ghost)] p-8 text-center">
                <p className="font-mono text-xs uppercase text-[var(--fg-dim)]">No ingredients added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ingredients.map((ing, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="font-mono text-[10px] font-black uppercase bg-[var(--fg)] text-[var(--yellow)] border-2 border-[var(--border)] px-2 py-1.5 shrink-0 mt-2">#{index + 1}</span>
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={ing.name}
                        onChange={e => updateIngredient(index, 'name', e.target.value)}
                        className={fieldClass}
                        placeholder="Ingredient name"
                      />
                      <input
                        type="number"
                        value={ing.quantity}
                        onChange={e => updateIngredient(index, 'quantity', e.target.value)}
                        className={fieldClass}
                        placeholder="Amount"
                        step="0.1"
                        min="0"
                      />
                      <div className="flex gap-2">
                        <select
                          value={ing.unit}
                          onChange={e => updateIngredient(index, 'unit', e.target.value)}
                          className={`${fieldClass} flex-1`}
                        >
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="ml">ml</option>
                          <option value="l">l</option>
                          <option value="cup">cup</option>
                          <option value="tbsp">tbsp</option>
                          <option value="tsp">tsp</option>
                          <option value="piece">piece</option>
                          <option value="pinch">pinch</option>
                        </select>
                        <button type="button" onClick={() => removeIngredient(index)} className="brutalist-btn bg-[var(--red)] text-white p-2">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="brutalist-card overflow-hidden">
          <div className="h-4 bg-[var(--fg)] border-b-[3px] border-[var(--border)]" />
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <label className={`${labelClass} mb-0`}>Cooking Steps</label>
              <button type="button" onClick={addStep} className="brutalist-btn bg-[var(--fg)] text-[var(--yellow)] px-3 py-1.5 text-xs flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Step
              </button>
            </div>
            {steps.length === 0 ? (
              <div className="border-[3px] border-dashed border-[var(--fg-ghost)] p-8 text-center">
                <p className="font-mono text-xs uppercase text-[var(--fg-dim)]">No steps added yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <span className="w-8 h-8 shrink-0 border-[3px] border-[var(--border)] bg-[var(--yellow)] flex items-center justify-center font-mono font-black text-sm mt-2 text-black">{index + 1}</span>
                    <div className="flex-1 flex gap-2">
                      <textarea
                        value={step}
                        onChange={e => updateStep(index, e.target.value)}
                        className={`${fieldClass} normal-case flex-1`}
                        placeholder={`Step ${index + 1} instructions...`}
                        rows={2}
                      />
                      <button type="button" onClick={() => removeStep(index)} className="brutalist-btn bg-[var(--red)] text-white p-2 mt-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cuisine & Tags */}
        <div className="brutalist-card overflow-hidden">
          <div className="h-4 bg-[var(--yellow)] border-b-[3px] border-[var(--border)]" />
          <div className="p-8 space-y-6">
            <div>
              <label className={labelClass}>Cuisine</label>
              <select value={selectedCuisine} onChange={e => setSelectedCuisine(e.target.value)} className={`${fieldClass} cursor-pointer`}>
                <option value="">Select cuisine (optional)</option>
                <option value="Italian">Italian</option>
                <option value="Chinese">Chinese</option>
                <option value="Indian">Indian</option>
                <option value="Mexican">Mexican</option>
                <option value="Japanese">Japanese</option>
                <option value="Thai">Thai</option>
                <option value="French">French</option>
                <option value="American">American</option>
                <option value="Mediterranean">Mediterranean</option>
                <option value="Korean">Korean</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Moods</label>
              <div className="flex flex-wrap gap-2">
                {['Comfort Food', 'Quick Meal', 'Date Night', 'Party', 'Healthy', 'Indulgent', 'Weekend Project'].map(mood => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood])}
                    className={`brutalist-btn px-3 py-1.5 text-xs ${selectedMoods.includes(mood) ? 'bg-[var(--yellow)] text-black' : 'bg-[var(--bg-card)] text-[var(--fg)]'}`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Dietary Tags</label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Keto', 'Paleo'].map(diet => (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => setSelectedDiets(prev => prev.includes(diet) ? prev.filter(d => d !== diet) : [...prev, diet])}
                    className={`brutalist-btn px-3 py-1.5 text-xs ${selectedDiets.includes(diet) ? 'bg-[var(--blue)] text-white' : 'bg-[var(--bg-card)] text-[var(--fg)]'}`}
                  >
                    {diet}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t-[3px] border-[var(--border)]">
          <button type="submit" disabled={submitting}
            className="w-full brutalist-btn bg-[var(--fg)] text-[var(--yellow)] py-4 text-base uppercase font-headline font-black tracking-widest disabled:opacity-50">
            {submitting ? 'Publishing...' : '★ Publish Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
