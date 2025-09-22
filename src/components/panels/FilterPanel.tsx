'use client'

import { useState } from 'react'
import { X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RESOURCE_TYPES, RESOURCE_COLORS, MOCK_MINES } from '@/data/mines'
import { useFilter } from '@/components/providers/FilterProvider'
import { ResourceType } from '@/types'

interface FilterPanelProps {
  onClose: () => void
}

export function FilterPanel({ onClose }: FilterPanelProps) {
  const { filters, updateFilter } = useFilter()
  
  // Get unique countries from mock data
  const uniqueCountries = Array.from(new Set(MOCK_MINES.map(mine => mine.country)))
  const statusOptions: Array<'active' | 'inactive' | 'exploration'> = ['active', 'inactive', 'exploration']

  const toggleResource = (resource: ResourceType) => {
    const newResources = filters.resources.includes(resource)
      ? filters.resources.filter(r => r !== resource)
      : [...filters.resources, resource]
    updateFilter('resources', newResources)
  }

  const toggleCountry = (country: string) => {
    const newCountries = filters.countries.includes(country)
      ? filters.countries.filter(c => c !== country)
      : [...filters.countries, country]
    updateFilter('countries', newCountries)
  }

  const toggleStatus = (status: 'active' | 'inactive' | 'exploration') => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]
    updateFilter('status', newStatus)
  }

  const clearAllFilters = () => {
    updateFilter('resources', [])
    updateFilter('countries', [])
    updateFilter('status', [])
    updateFilter('minProductionValue', 0)
    updateFilter('maxProductionValue', 5000)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        
        {/* Resource Types */}
        <div>
          <h3 className="font-medium mb-3">Resource Types</h3>
          <div className="grid grid-cols-2 gap-2">
            {RESOURCE_TYPES.map((resource) => (
              <button
                key={resource}
                onClick={() => toggleResource(resource)}
                className={`p-2 rounded text-xs border transition-all ${
                  filters.resources.includes(resource)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-3 h-3 rounded mb-1 mx-auto"
                  style={{ backgroundColor: RESOURCE_COLORS[resource] }}
                />
                {resource.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div>
          <h3 className="font-medium mb-3">Countries</h3>
          <div className="space-y-2">
            {uniqueCountries.map((country) => (
              <label key={country} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.countries.includes(country)}
                  onChange={() => toggleCountry(country)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="font-medium mb-3">Status</h3>
          <div className="space-y-2">
            {statusOptions.map((status) => (
              <label key={status} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm capitalize">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Production Value Range */}
        <div>
          <h3 className="font-medium mb-3">Production Value (Millions USD)</h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Minimum</label>
              <Input
                type="number"
                value={filters.minProductionValue}
                onChange={(e) => updateFilter('minProductionValue', Number(e.target.value))}
                min="0"
                max="5000"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Maximum</label>
              <Input
                type="number"
                value={filters.maxProductionValue}
                onChange={(e) => updateFilter('maxProductionValue', Number(e.target.value))}
                min="0"
                max="5000"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-4">
        <Button 
          variant="outline" 
          onClick={clearAllFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}