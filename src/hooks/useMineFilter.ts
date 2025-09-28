import { useMemo } from 'react'
import { Mine } from '@/types'
import { FilterState } from '@/components/providers/FilterProvider'

export function useMineFilter(mines: Mine[], filters: FilterState) {
  const filteredMines = useMemo(() => {
    return mines.filter(mine => {
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
  }, [mines, filters])

  return filteredMines
}