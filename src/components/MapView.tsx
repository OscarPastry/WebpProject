'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

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

export default function MapView({ restaurants }: { restaurants: Restaurant[] }) {
  return (
    <MapContainer center={[12.8406, 80.1534]} zoom={14} scrollWheelZoom className="w-full h-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {restaurants.map(r => (
        <Marker key={r.id} position={[r.lat, r.lng]}>
          <Popup>
            <div className="font-mono text-xs">
              <strong className="font-black text-sm uppercase">{r.name}</strong>
              <p className="text-black/60 mt-1">{r.address}</p>
              <p className="mt-1"><span className="bg-[#ffe500] px-1 border border-black">{r.cuisine}</span></p>
              <p className="mt-1">{'★'.repeat(Math.floor(r.rating))} {r.rating}</p>
              <p className="text-black/50 mt-1">{r.phone}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
