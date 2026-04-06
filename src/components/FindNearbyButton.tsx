'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import NearbyRestaurantsMap from '@/components/NearbyRestaurantsMap'

export default function FindNearbyButton({ cuisine, recipeTitle }: { cuisine: string; recipeTitle: string }) {
  const [showMap, setShowMap] = useState(false)

  return (
    <>
      <button onClick={() => setShowMap(true)}
        className="brutalist-btn bg-[#b71422] text-white px-4 py-2 text-xs flex items-center gap-2">
        <MapPin className="w-3 h-3" /> Find Nearby
      </button>
      {showMap && (
        <NearbyRestaurantsMap
          cuisine={cuisine}
          recipeTitle={recipeTitle}
          onClose={() => setShowMap(false)}
        />
      )}
    </>
  )
}
