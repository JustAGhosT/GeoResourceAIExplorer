import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GeoResource AI Explorer',
  description: 'Interactive mining analytics platform with AI assistant. Maps mines in SA and other regions, tracks 11 resource types.',
  keywords: ['mining', 'analytics', 'AI', 'geospatial', 'resources', 'diamonds', 'gold', 'lithium'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
}