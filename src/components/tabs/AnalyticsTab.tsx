'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'
import { TrendingUp, DollarSign, MapPin, Gem } from 'lucide-react'
import { getTotalProductionValue, getResourceBreakdown, getRegionalBreakdown, RESOURCE_COLORS } from '@/data/mines'
import { formatCurrency, formatNumber } from '@/lib/utils'

export function AnalyticsTab() {
  const totalProduction = getTotalProductionValue()
  const resourceBreakdown = getResourceBreakdown()
  const regionalBreakdown = getRegionalBreakdown()

  // Transform data for charts
  const resourceChartData = Object.entries(resourceBreakdown).map(([resource, value]) => ({
    name: resource.replace('_', ' '),
    value: Math.round(value),
    color: RESOURCE_COLORS[resource as keyof typeof RESOURCE_COLORS]
  }))

  const regionalChartData = Object.entries(regionalBreakdown).map(([region, value]) => ({
    name: region,
    value: Math.round(value)
  }))

  // Mock trend data
  const trendData = [
    { year: 2019, production: 22100 },
    { year: 2020, production: 20800 },
    { year: 2021, production: 23400 },
    { year: 2022, production: 24100 },
    { year: 2023, production: 24500 }
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50">
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mining Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive analysis of resource production and mining operations</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Production Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalProduction)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <Gem className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resource Types</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(resourceBreakdown).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">{Object.keys(regionalBreakdown).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">YoY Growth</p>
                <p className="text-2xl font-bold text-green-600">+1.7%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Resource Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Production by Resource Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={resourceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Regional Breakdown */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Production by Country</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionalChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}M`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Production Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Production Value Trend (2019-2023)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `$${value}M`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line 
                type="monotone" 
                dataKey="production" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Resource Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Resource Production Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Production Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resourceChartData
                  .sort((a, b) => b.value - a.value)
                  .map((resource, index) => (
                  <tr key={resource.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-3"
                          style={{ backgroundColor: resource.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {resource.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(resource.value)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((resource.value / totalProduction) * 100).toFixed(1)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}