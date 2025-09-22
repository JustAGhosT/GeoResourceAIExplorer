'use client'

import { useState } from 'react'
import { Search, Settings, Download, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFilter } from '@/components/providers/FilterProvider'

export function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const { filters, setFilters } = useFilter()

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    // In a real app, this would trigger search functionality
    console.log('Searching for:', term)
  }

  const handleExport = () => {
    // In a real app, this would export data
    console.log('Exporting data...')
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              GeoResource AI Explorer
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search mines, resources, regions..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-80"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}