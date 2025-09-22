'use client'

import React, { createContext, useContext, useState } from 'react'
import { FilterOptions, ResourceType } from '@/types'

interface FilterContextType {
  filters: FilterOptions
  setFilters: (filters: FilterOptions) => void
  updateFilter: <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => void
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

const defaultFilters: FilterOptions = {
  resources: [],
  countries: [],
  status: [],
  minProductionValue: 0,
  maxProductionValue: 5000
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)

  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <FilterContext.Provider value={{ filters, setFilters, updateFilter }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}