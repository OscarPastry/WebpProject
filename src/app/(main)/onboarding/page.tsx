'use client'
import { useState } from 'react'
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react'

const CUISINES = ['Italian', 'Indian', 'Japanese', 'Mexican', 'French']
const RESTRICTIONS = ['Vegan', 'Gluten-Free', 'Keto', 'Vegetarian', 'Dairy-Free', 'Nut-Free', 'Halal', 'Low-Carb']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([])
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([])
  const [complete, setComplete] = useState(false)

  const toggleCuisine = (c: string) =>
    setSelectedCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  const toggleRestriction = (r: string) =>
    setSelectedRestrictions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  const [loading, setLoading] = useState(false)

  const handleFinish = async () => {
    setLoading(true)
    const { saveOnboarding } = await import('@/app/actions')
    const result = await saveOnboarding(selectedCuisines, selectedRestrictions)
    if (result?.success) {
      setComplete(true)
    }
    setLoading(false)
  }

  if (complete) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 space-y-6">
        <div className="brutalist-card bg-[#fdf9ee] overflow-hidden">
          <div className="h-4 bg-[#ffe500] border-b-[3px] border-black" />
          <div className="p-10 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
            <h1 className="font-headline font-black text-5xl uppercase tracking-tighter">Setup<br />Complete!</h1>
            <p className="font-body text-black/60 text-lg">Your taste profile has been synchronized with the database.</p>
            
            <div className="border-[3px] border-black p-4 bg-[#ece8dd] text-left mt-6 space-y-2">
              <p className="font-mono text-[10px] uppercase font-black text-black/40">Relational Operations Executed:</p>
              <div className="space-y-1">
                <code className="font-mono text-[10px] block text-blue-700">UPSERT User_Onboarding (v2.1)</code>
                <code className="font-mono text-[10px] block text-blue-700">DELETE + INSERT SELECTS ({selectedCuisines.length} ranks)</code>
                <code className="font-mono text-[10px] block text-green-700">DELETE + INSERT FOLLOWS ({selectedRestrictions.length} restrictions)</code>
              </div>
            </div>

            <div className="pt-6">
                <button 
                  onClick={() => window.location.href = '/'}
                  className="w-full brutalist-btn bg-black text-[#ffe500] py-4 text-sm uppercase">
                    Launch Discovery Feed →
                </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
      <div className="border-b-[6px] border-black pb-6">
        <p className="font-mono text-xs uppercase text-black/40 font-black mb-1">
          User_Onboarding · SELECTS · FOLLOWS Tables
        </p>
        <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-[0.85]">
          Taste<br />Setup
        </h1>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between font-mono text-xs uppercase">
          <span className="font-black">Step {step + 1} / 2</span>
          <span className="text-black/40">{step === 0 ? 'Cuisine Preferences' : 'Dietary Restrictions'}</span>
        </div>
        <div className="h-3 border-[3px] border-black bg-[#ece8dd]">
          <div className="h-full bg-black transition-all duration-300" style={{ width: `${((step + 1) / 2) * 100}%` }} />
        </div>
      </div>

      <div className="brutalist-card bg-[#fdf9ee] overflow-hidden">
        <div className="h-4 border-b-[3px] border-black" style={{ background: step === 0 ? '#ffe500' : '#363cff' }} />

        <div className="p-8 space-y-6">
          {step === 0 ? (
            <>
              <div>
                <h2 className="font-headline font-black text-3xl uppercase tracking-tighter">Select Cuisines</h2>
                <p className="font-mono text-xs text-black/50 uppercase mt-1">Order of selection = preference_rank in SELECTS</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {CUISINES.map(c => {
                  const rank = selectedCuisines.indexOf(c)
                  const selected = rank !== -1
                  return (
                    <button key={c} onClick={() => toggleCuisine(c)}
                      className={`relative p-5 text-left font-headline font-black text-2xl uppercase tracking-tighter border-[3px] border-black transition-none
                        ${selected ? 'bg-[#ffe500] text-black' : 'bg-white text-black/60 hover:bg-[#ece8dd] hover:text-black'}`}
                      style={selected ? { boxShadow: '4px 4px 0 0 #000' } : {}}>
                      {selected && (
                        <span className="absolute top-2 right-2 w-6 h-6 border-2 border-black bg-black text-[#ffe500] font-mono text-xs font-black flex items-center justify-center">
                          {rank + 1}
                        </span>
                      )}
                      {c}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-headline font-black text-3xl uppercase tracking-tighter">Dietary Needs</h2>
                <p className="font-mono text-xs text-black/50 uppercase mt-1">Inserts into FOLLOWS junction table</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {RESTRICTIONS.map(r => {
                  const selected = selectedRestrictions.includes(r)
                  return (
                    <button key={r} onClick={() => toggleRestriction(r)}
                      className={`p-4 text-left font-mono font-black text-sm uppercase border-[3px] border-black transition-none
                        ${selected ? 'bg-black text-[#ffe500]' : 'bg-white text-black/60 hover:bg-[#ece8dd] hover:text-black'}`}>
                      {selected ? '✓ ' : ''}{r}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Nav buttons */}
        <div className="flex justify-between border-t-[3px] border-black">
          {step > 0 ? (
            <button onClick={() => setStep(s => s - 1)}
              className="brutalist-btn bg-white text-black px-6 py-4 text-sm border-0 border-r-[3px] border-t-0 border-b-0 border-black flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}
          {step < 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="brutalist-btn bg-black text-[#ffe500] px-6 py-4 text-sm border-0 border-l-[3px] border-t-0 border-b-0 flex items-center gap-2 ml-auto">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              disabled={loading}
              className="brutalist-btn bg-[#ffe500] text-black px-8 py-4 text-sm border-0 border-l-[3px] border-t-0 border-b-0 flex items-center gap-2 font-headline font-black text-lg uppercase ml-auto disabled:opacity-50">
              <CheckCircle2 className="w-5 h-5" /> 
              {loading ? 'Archiving...' : 'Finish Protocol'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
