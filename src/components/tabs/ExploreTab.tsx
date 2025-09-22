'use client'

import { useState, useMemo } from 'react'
import { Filter, Layers, Satellite, Map as MapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MapComponent from '@/components/map/MapComponent'
import { FilterPanel } from '@/components/panels/FilterPanel'
import { MineDetailsPanel } from '@/components/panels/MineDetailsPanel'
import { MOCK_MINES } from '@/data/mines'
import { Mine } from '@/types'
import { useFilter } from '@/components/providers/FilterProvider'

export function ExploreTab() {
  const [showFilters, setShowFilters] = useState(false)
  const [showSatellite, setShowSatellite] = useState(false)
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null)
  const { filters } = useFilter()

  // Filter mines based on current filters
  const filteredMines = useMemo(() => {
    return MOCK_MINES.filter(mine => {
      // Resource filter
      if (filters.resources.length > 0) {
        const hasMatchingResource = mine.resources.some(resource => 
          filters.resources.includes(resource)
        )
        if (!hasMatchingResource) return false
      }

      // Country filter
      if (filters.countries.length > 0) {
        if (!filters.countries.includes(mine.country)) return false
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(mine.status)) return false
      }

      // Production value filter
      if (mine.productionValue < filters.minProductionValue || 
          mine.productionValue > filters.maxProductionValue) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div className="h-full flex relative">
      {/* Map Container */}
      <div className="flex-1 relative">
        <MapComponent
          mines={filteredMines}
          selectedMine={selectedMine}
          onMineSelect={setSelectedMine}
          showSatellite={showSatellite}
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-white shadow-md"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 bg-white shadow-md"
          >
            <Layers className="h-4 w-4" />
            <span>Layers</span>
          </Button>
          
          <Button
            variant={showSatellite ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSatellite(!showSatellite)}
            className="flex items-center space-x-2 bg-white shadow-md"
          >
            {showSatellite ? <Satellite className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
            <span>{showSatellite ? 'Satellite' : 'Map'}</span>
          </Button>
        </div>

        {/* Results Counter */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white px-3 py-2 rounded-md shadow-md text-sm">
            <span className="font-semibold">{filteredMines.length}</span> mines found
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="w-80 bg-white border-l border-gray-200 shadow-lg z-30">
          <FilterPanel onClose={() => setShowFilters(false)} />
        </div>
      )}

      {/* Mine Details Panel */}
      {selectedMine && (
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg z-30">
          <MineDetailsPanel 
            mine={selectedMine} 
            onClose={() => setSelectedMine(null)} 
          />
        </div>
      )}
    </div>
  )
}