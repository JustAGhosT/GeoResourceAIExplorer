'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/Header'
import { ExploreTab } from '@/components/tabs/ExploreTab'
import { AITab } from '@/components/tabs/AITab'
import { AnalyticsTab } from '@/components/tabs/AnalyticsTab'
import { FilterProvider } from '@/components/providers/FilterProvider'

export default function Home() {
  const [activeTab, setActiveTab] = useState('explore')

  return (
    <FilterProvider>
      <div className="h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <div className="border-b bg-white">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="explore">Explore</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="explore" className="h-full mt-0">
              <ExploreTab />
            </TabsContent>
            
            <TabsContent value="ai" className="h-full mt-0">
              <AITab />
            </TabsContent>
            
            <TabsContent value="analytics" className="h-full mt-0">
              <AnalyticsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </FilterProvider>
  )
}