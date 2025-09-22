'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Icon, LatLngExpression } from 'leaflet'
import { Mine } from '@/types'
import { RESOURCE_COLORS } from '@/data/mines'
import { formatCurrency } from '@/lib/utils'

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
const icon = new Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

interface MapComponentProps {
  mines: Mine[]
  selectedMine?: Mine | null
  onMineSelect?: (mine: Mine) => void
  showSatellite?: boolean
}

export default function MapImplementation({ mines, selectedMine, onMineSelect, showSatellite = false }: MapComponentProps) {
  // Center on South Africa
  const center: LatLngExpression = [-25.7459, 25.0947]
  
  const tileUrl = showSatellite 
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const attribution = showSatellite
    ? '&copy; <a href="https://www.esri.com/">Esri</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <MapContainer
      center={center}
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      className="z-10"
    >
      <TileLayer
        url={tileUrl}
        attribution={attribution}
      />
      
      {mines.map((mine) => (
        <Marker
          key={mine.id}
          position={[mine.latitude, mine.longitude]}
          icon={icon}
          eventHandlers={{
            click: () => onMineSelect?.(mine)
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{mine.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Location:</strong> {mine.region}, {mine.country}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Owner:</strong> {mine.owner}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Status:</strong> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  mine.status === 'active' ? 'bg-green-100 text-green-800' :
                  mine.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {mine.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Production Value:</strong> {formatCurrency(mine.productionValue)}
              </p>
              
              <div className="mb-2">
                <strong className="text-sm">Resources:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mine.resources.map((resource) => (
                    <span
                      key={resource}
                      className="px-2 py-1 rounded text-xs"
                      style={{
                        backgroundColor: RESOURCE_COLORS[resource],
                        color: '#000'
                      }}
                    >
                      {resource.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              {mine.yearEstablished && (
                <p className="text-sm text-gray-600">
                  <strong>Established:</strong> {mine.yearEstablished}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}