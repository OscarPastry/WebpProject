'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'

interface Restaurant {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  cuisine: string
  rating: number
  phone: string
}

const RESTAURANTS: Restaurant[] = [
  { id: 1, name: 'Trattoria Bella', address: '123 Main St', lat: 12.8406, lng: 80.1534, cuisine: 'Italian', rating: 4.5, phone: '(555) 123-4567' },
  { id: 2, name: 'Spice Garden', address: '456 Oak Ave', lat: 12.8436, lng: 80.1564, cuisine: 'Indian', rating: 4.3, phone: '(555) 234-5678' },
  { id: 3, name: 'Sakura Sushi', address: '789 Pine Rd', lat: 12.8386, lng: 80.1504, cuisine: 'Japanese', rating: 4.7, phone: '(555) 345-6789' },
  { id: 4, name: 'El Camino', address: '321 Elm St', lat: 12.8426, lng: 80.1554, cuisine: 'Mexican', rating: 4.2, phone: '(555) 456-7890' },
  { id: 5, name: 'Le Petit Bistro', address: '654 Maple Dr', lat: 12.8396, lng: 80.1494, cuisine: 'French', rating: 4.8, phone: '(555) 567-8901' },
  { id: 6, name: 'Golden Dragon', address: '987 Cedar Ln', lat: 12.8446, lng: 80.1574, cuisine: 'Chinese', rating: 4.1, phone: '(555) 678-9012' },
  { id: 7, name: 'The Burger Joint', address: '147 Birch Way', lat: 12.8376, lng: 80.1554, cuisine: 'American', rating: 4.0, phone: '(555) 789-0123' },
  { id: 8, name: 'Mama Mia Pizza', address: '258 Walnut St', lat: 12.8416, lng: 80.1514, cuisine: 'Italian', rating: 4.4, phone: '(555) 890-1234' },
  { id: 9, name: 'Thai Orchid', address: '369 Spruce Ave', lat: 12.8456, lng: 80.1604, cuisine: 'Thai', rating: 4.6, phone: '(555) 901-2345' },
  { id: 10, name: 'Seoul Kitchen', address: '741 Ash Blvd', lat: 12.8366, lng: 80.1534, cuisine: 'Korean', rating: 4.3, phone: '(555) 012-3456' },
]

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })

export default function RestaurantsMap() {
  const [filter, setFilter] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('')

  const cuisines = [...new Set(RESTAURANTS.map(r => r.cuisine))].sort()

  const filtered = RESTAURANTS.filter(r => {
    const matchName = r.name.toLowerCase().includes(filter.toLowerCase()) ||
                      r.address.toLowerCase().includes(filter.toLowerCase())
    const matchCuisine = !selectedCuisine || r.cuisine === selectedCuisine
    return matchName && matchCuisine
  })

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search restaurants..."
          className="flex-1 min-w-[200px] bg-white border-[3px] border-black font-mono text-sm px-4 py-2 focus:outline-none focus:ring-0 focus:border-black placeholder:text-black/20"
        />
        <select
          value={selectedCuisine}
          onChange={e => setSelectedCuisine(e.target.value)}
          className="bg-white border-[3px] border-black font-mono text-sm px-4 py-2 focus:outline-none focus:ring-0 focus:border-black cursor-pointer"
        >
          <option value="">All Cuisines</option>
          {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="brutalist-card bg-[#fdf9ee] overflow-hidden">
            <div className="h-4 bg-[#363cff] border-b-[3px] border-black" />
            <div className="h-[500px]">
              <MapView restaurants={filtered} />
            </div>
          </div>
        </div>

        <div className="space-y-3 max-h-[540px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="brutalist-card p-8 text-center">
              <p className="font-mono text-xs uppercase text-black/40">No restaurants found</p>
            </div>
          ) : (
            filtered.map(r => (
              <div key={r.id} className="brutalist-card bg-[#fdf9ee] p-4 hover:bg-[#ffe500] transition-none cursor-pointer">
                <div className="flex justify-between items-start">
                  <h3 className="font-headline font-black text-lg uppercase tracking-tighter leading-none">{r.name}</h3>
                  <span className="bg-black text-[#ffe500] font-mono text-[10px] font-black px-2 py-0.5 border border-black">
                    {r.rating}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase text-black/50 mt-1">{r.address}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="db-tag">{r.cuisine}</span>
                  <span className="font-mono text-[10px] text-black/40">{r.phone}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
