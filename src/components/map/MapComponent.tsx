'use client'

import dynamic from 'next/dynamic'
import { Mine } from '@/types'

interface MapComponentProps {
  mines: Mine[]
  selectedMine?: Mine | null
  onMineSelect?: (mine: Mine) => void
  showSatellite?: boolean
}

// Dynamically import the actual map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapImplementation'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
})

export default function MapWrapper(props: MapComponentProps) {
  return <MapComponent {...props} />
}