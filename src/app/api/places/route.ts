import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const cuisine = searchParams.get('cuisine')

  if (!lat || !lng || !cuisine) {
    return NextResponse.json({ results: [] })
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=restaurant&keyword=${encodeURIComponent(cuisine)}&key=${GOOGLE_MAPS_API_KEY}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    const results = (data.results || []).map((place: Record<string, unknown>) => {
      const geometry = place.geometry as { location: { lat: () => number; lng: () => number } }
      const location = geometry?.location
      return {
        name: place.name as string,
        address: place.vicinity as string,
        lat: typeof location?.lat === 'function' ? location.lat() : (location?.lat as number) || 0,
        lng: typeof location?.lng === 'function' ? location.lng() : (location?.lng as number) || 0,
        rating: (place.rating as number) || 0,
        userRatingsTotal: (place.user_ratings_total as number) || 0,
        placeId: place.place_id as string,
      }
    })

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [] })
  }
}
