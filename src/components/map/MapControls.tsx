import { Filter, Layers, Satellite, Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MapControlsProps {
  showFilters: boolean
  onShowFiltersChange: (show: boolean) => void
  showSatellite: boolean
  onShowSatelliteChange: (show: boolean) => void
}

export function MapControls({
  showFilters,
  onShowFiltersChange,
  showSatellite,
  onShowSatelliteChange,
}: MapControlsProps) {
  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
      <Button
        variant={showFilters ? "default" : "outline"}
        size="sm"
        onClick={() => onShowFiltersChange(!showFilters)}
        className="flex items-center space-x-2 bg-white shadow-md"
      >
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2 bg-white shadow-md"
        onClick={() => console.log('Layers button clicked')}
      >
        <Layers className="h-4 w-4" />
        <span>Layers</span>
      </Button>

      <Button
        variant={showSatellite ? "default" : "outline"}
        size="sm"
        onClick={() => onShowSatelliteChange(!showSatellite)}
        className="flex items-center space-x-2 bg-white shadow-md"
      >
        {showSatellite ? <Satellite className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
        <span>{showSatellite ? 'Satellite' : 'Map'}</span>
      </Button>
    </div>
  )
}