// Map and Region Types
export interface RegionConfig {
  center: [number, number];
  zoom: number;
  name: string;
  description: string;
  totalProduction: {
    [key: string]: string;
  };
}

export interface RegionConfigs {
  [key: string]: RegionConfig;
}

// Resource Types
export interface Resource {
  name: string;
  lat: number;
  lng: number;
  status: ResourceStatus;
  type: OperationType;
  owner: string;
  production: string;
  reserves: string;
  details?: {
    established?: string;
    employees?: number;
    lifespan?: string;
    grade?: string;
    processingMethod?: string;
  };
}

export interface ResourceDatabase {
  [resourceType: string]: {
    [region: string]: Resource[];
  };
}

// Enum Types
export enum ResourceStatus {
  Active = "active",
  Inactive = "inactive",
  Closed = "closed",
  Exploration = "exploration"
}

export enum OperationType {
  Underground = "underground",
  OpenPit = "open-pit",
  Alluvial = "alluvial",
  Marine = "marine",
  Tailings = "tailings"
}

export enum ResourceType {
  Diamonds = "diamonds",
  Gold = "gold",
  Platinum = "platinum",
  Copper = "copper",
  Coal = "coal",
  Iron = "iron",
  Uranium = "uranium",
  Lithium = "lithium",
  Cobalt = "cobalt",
  RareEarth = "rare-earth",
  OilGas = "oil-gas",
  All = "all"
}

// Map Marker and Overlay Types
export interface CustomIconOptions extends L.DivIconOptions {
  color: string;
}

export interface OverlayLayer {
  name: string;
  layer: L.Layer;
  active: boolean;
}

export interface OverlayLayers {
  [key: string]: OverlayLayer;
}

// UI Interface
export interface StatisticsData {
  total: number;
  active: number;
  reserves: number;
  production: string;
}

export interface AnalyticsExport {
  region: string;
  resource: string;
  timestamp: string;
  statistics: {
    total: string;
    active: string;
    reserves: string;
  };
  sites: Resource[];
}