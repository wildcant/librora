'use client'

import { DatabaseTypes, countries } from 'database/client'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'

type LocationProps = Pick<DatabaseTypes.Location, 'country'>

export function Location({ country }: LocationProps) {
  const countryData = countries[country]
  if (!countryData) return <div>Loading</div>
  const latlng: LatLngExpression = [countryData.lat, countryData.lng]
  const iconPerson = new L.Icon({
    iconUrl: '/assets/marker.svg',
    iconRetinaUrl: '/assets/marker.svg',
    className: 'bg-primary rounded-full h-12 w-12 !p-2 &>line:fill-white shadow-primary shadow-2xl ',
  })

  return (
    <MapContainer
      zoom={6}
      center={latlng}
      style={{ height: '100%', width: '100%' }}
      className="rounded-2xl z-0"
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Marker position={latlng} icon={iconPerson} />
    </MapContainer>
  )
}
