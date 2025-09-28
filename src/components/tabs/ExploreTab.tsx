'use client'

import { useEffect, useReducer } from 'react'
import MapComponent from '@/components/map/MapComponent'
import { MapControls } from '@/components/map/MapControls'
import { FilterPanel } from '@/components/panels/FilterPanel'
import { MineDetailsPanel } from '@/components/panels/MineDetailsPanel'
import { useFilter } from '@/components/providers/FilterProvider'
import { useMineFilter } from '@/hooks/useMineFilter'
import { exploreTabReducer, initialState } from '@/reducers/exploreTabReducer'

export function ExploreTab() {
  const [state, dispatch] = useReducer(exploreTabReducer, initialState)
  const { showFilters, showSatellite, selectedMine, mines, loading, error } = state
  const { filters } = useFilter()

  useEffect(() => {
    const fetchMines = async () => {
      dispatch({ type: 'FETCH_MINES_START' })
      try {
        const response = await fetch('/api/mines')
        if (!response.ok) {
          throw new Error('Failed to fetch mines')
        }
        const data = await response.json()
        dispatch({ type: 'FETCH_MINES_SUCCESS', payload: data })
      } catch (err) {
        dispatch({ type: 'FETCH_MINES_FAILURE', payload: err as Error })
      }
    }

    fetchMines()
  }, [])

  const filteredMines = useMineFilter(mines, filters)

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>
  if (error) return <div className="flex items-center justify-center h-full text-red-500">Error: {error.message}</div>

  return (
    <div className="h-full flex relative">
      {/* Map Container */}
      <div className="flex-1 relative">
        <MapComponent
          mines={filteredMines}
          selectedMine={selectedMine}
          onMineSelect={(mine) => dispatch({ type: 'SELECT_MINE', payload: mine })}
          showSatellite={showSatellite}
        />
        
        <MapControls
          showFilters={showFilters}
          onShowFiltersChange={() => dispatch({ type: 'TOGGLE_FILTERS' })}
          showSatellite={showSatellite}
          onShowSatelliteChange={() => dispatch({ type: 'TOGGLE_SATELLITE' })}
        />

        {/* Results Counter */}
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-white px-3 py-2 rounded-md shadow-md text-sm">
            <span className="font-semibold">{filteredMines.length}</span> mines found
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div className={`bg-white border-l border-gray-200 shadow-lg z-30 transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'max-w-xs' : 'max-w-0'}`}>
        <div className="w-80">
          <FilterPanel onClose={() => dispatch({ type: 'SET_SHOW_FILTERS', payload: false })} />
        </div>
      </div>

      {/* Mine Details Panel */}
      <div className={`bg-white border-l border-gray-200 shadow-lg z-30 transition-all duration-300 ease-in-out overflow-hidden ${selectedMine ? 'max-w-sm' : 'max-w-0'}`}>
        <div className="w-96 h-full">
          {selectedMine && (
            <MineDetailsPanel
              mine={selectedMine}
              onClose={() => dispatch({ type: 'SELECT_MINE', payload: null })}
            />
          )}
        </div>
      </div>
    </div>
  )
}