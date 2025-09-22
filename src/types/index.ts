export interface Mine {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  region: string;
  resources: ResourceType[];
  status: 'active' | 'inactive' | 'exploration';
  productionValue: number; // in millions USD
  yearEstablished?: number;
  owner: string;
  size: 'small' | 'medium' | 'large';
}

export type ResourceType = 
  | 'diamonds'
  | 'gold'
  | 'lithium'
  | 'platinum'
  | 'copper'
  | 'iron_ore'
  | 'coal'
  | 'rare_earth'
  | 'uranium'
  | 'chrome'
  | 'manganese';

export interface ResourceData {
  type: ResourceType;
  quantity: number;
  unit: string;
  yearlyProduction: number;
  estimatedReserves?: number;
}

export interface GeologicalLayer {
  id: string;
  name: string;
  type: 'geological' | 'mineral' | 'environmental';
  opacity: number;
  visible: boolean;
  data: any; // GeoJSON data
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FilterOptions {
  resources: ResourceType[];
  countries: string[];
  status: Mine['status'][];
  minProductionValue: number;
  maxProductionValue: number;
}

export interface AnalyticsData {
  totalProduction: number;
  resourceBreakdown: Record<ResourceType, number>;
  regionalProduction: Record<string, number>;
  yearlyTrends: Array<{
    year: number;
    production: number;
  }>;
}