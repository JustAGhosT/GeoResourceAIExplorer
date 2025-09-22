'use client'

import { X, MapPin, Building, Calendar, DollarSign, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Mine } from '@/types'
import { RESOURCE_COLORS } from '@/data/mines'
import { formatCurrency } from '@/lib/utils'

interface MineDetailsPanelProps {
  mine: Mine
  onClose: () => void
}

export function MineDetailsPanel({ mine, onClose }: MineDetailsPanelProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold text-gray-900">{mine.name}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        
        {/* Basic Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{mine.region}, {mine.country}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Building className="h-4 w-4" />
            <span className="text-sm">{mine.owner}</span>
          </div>
          
          {mine.yearEstablished && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Established {mine.yearEstablished}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-gray-600">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">{formatCurrency(mine.productionValue)} annual production</span>
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="font-medium mb-2">Status</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            mine.status === 'active' ? 'bg-green-100 text-green-800' :
            mine.status === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {mine.status.charAt(0).toUpperCase() + mine.status.slice(1)}
          </span>
        </div>

        {/* Size */}
        <div>
          <h3 className="font-medium mb-2">Mine Size</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            mine.size === 'large' ? 'bg-purple-100 text-purple-800' :
            mine.size === 'medium' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {mine.size.charAt(0).toUpperCase() + mine.size.slice(1)}
          </span>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-medium mb-3">Resources</h3>
          <div className="grid grid-cols-2 gap-2">
            {mine.resources.map((resource) => (
              <div
                key={resource}
                className="flex items-center space-x-2 p-2 rounded border"
              >
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: RESOURCE_COLORS[resource] }}
                />
                <span className="text-sm">{resource.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coordinates */}
        <div>
          <h3 className="font-medium mb-2">Location</h3>
          <div className="bg-gray-50 p-3 rounded text-sm font-mono">
            <div>Latitude: {mine.latitude.toFixed(4)}</div>
            <div>Longitude: {mine.longitude.toFixed(4)}</div>
          </div>
        </div>

        {/* Production Analytics */}
        <div>
          <h3 className="font-medium mb-3">Production Analytics</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-blue-600 font-medium">Annual Production Value</div>
              <div className="text-xl font-bold text-blue-900">
                {formatCurrency(mine.productionValue)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 p-3 rounded">
                <div className="text-sm text-green-600 font-medium">Resources</div>
                <div className="text-lg font-bold text-green-900">
                  {mine.resources.length}
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded">
                <div className="text-sm text-purple-600 font-medium">Age</div>
                <div className="text-lg font-bold text-purple-900">
                  {mine.yearEstablished ? new Date().getFullYear() - mine.yearEstablished : 'N/A'} years
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button className="w-full" variant="default">
            View Detailed Analytics
          </Button>
          <Button className="w-full" variant="outline">
            Add to Watchlist
          </Button>
          <Button className="w-full" variant="outline">
            Export Data
          </Button>
        </div>
      </div>
    </div>
  )
}