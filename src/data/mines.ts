import { Mine, ResourceType } from '@/types';

export const RESOURCE_TYPES: ResourceType[] = [
  'diamonds',
  'gold',
  'lithium',
  'platinum',
  'copper',
  'iron_ore',
  'coal',
  'rare_earth',
  'uranium',
  'chrome',
  'manganese'
];

export const RESOURCE_COLORS: Record<ResourceType, string> = {
  diamonds: '#b3e5fc',
  gold: '#ffeb3b',
  lithium: '#e1bee7',
  platinum: '#cfd8dc',
  copper: '#ff8a65',
  iron_ore: '#8d6e63',
  coal: '#424242',
  rare_earth: '#4fc3f7',
  uranium: '#81c784',
  chrome: '#90a4ae',
  manganese: '#a1887f'
};

export const MOCK_MINES: Mine[] = [
  {
    id: '1',
    name: 'Cullinan Diamond Mine',
    latitude: -25.6667,
    longitude: 28.5167,
    country: 'South Africa',
    region: 'Gauteng',
    resources: ['diamonds'],
    status: 'active',
    productionValue: 150,
    yearEstablished: 1902,
    owner: 'Petra Diamonds',
    size: 'large'
  },
  {
    id: '2',
    name: 'Witwatersrand Gold Fields',
    latitude: -26.2041,
    longitude: 28.0473,
    country: 'South Africa',
    region: 'Gauteng',
    resources: ['gold', 'uranium'],
    status: 'active',
    productionValue: 2800,
    yearEstablished: 1886,
    owner: 'AngloGold Ashanti',
    size: 'large'
  },
  {
    id: '3',
    name: 'Bikita Lithium Mine',
    latitude: -20.0833,
    longitude: 31.2833,
    country: 'Zimbabwe',
    region: 'Masvingo',
    resources: ['lithium', 'rare_earth'],
    status: 'active',
    productionValue: 85,
    yearEstablished: 1956,
    owner: 'Bikita Minerals',
    size: 'medium'
  },
  {
    id: '4',
    name: 'Sishen Iron Ore Mine',
    latitude: -27.2167,
    longitude: 23.0000,
    country: 'South Africa',
    region: 'Northern Cape',
    resources: ['iron_ore'],
    status: 'active',
    productionValue: 1200,
    yearEstablished: 1947,
    owner: 'Kumba Iron Ore',
    size: 'large'
  },
  {
    id: '5',
    name: 'Palabora Copper Mine',
    latitude: -23.9833,
    longitude: 31.1500,
    country: 'South Africa',
    region: 'Limpopo',
    resources: ['copper', 'uranium'],
    status: 'active',
    productionValue: 680,
    yearEstablished: 1966,
    owner: 'Palabora Mining Company',
    size: 'large'
  },
  {
    id: '6',
    name: 'Mogalakwena Platinum Mine',
    latitude: -24.2667,
    longitude: 28.9333,
    country: 'South Africa',
    region: 'Limpopo',
    resources: ['platinum', 'chrome'],
    status: 'active',
    productionValue: 1850,
    yearEstablished: 1993,
    owner: 'Anglo American Platinum',
    size: 'large'
  },
  {
    id: '7',
    name: 'Grootegeluk Coal Mine',
    latitude: -23.8667,
    longitude: 27.7000,
    country: 'South Africa',
    region: 'Limpopo',
    resources: ['coal'],
    status: 'active',
    productionValue: 420,
    yearEstablished: 1980,
    owner: 'Exxaro Resources',
    size: 'large'
  },
  {
    id: '8',
    name: 'Kansanshi Copper Mine',
    latitude: -12.0833,
    longitude: 26.4167,
    country: 'Zambia',
    region: 'North-Western',
    resources: ['copper', 'gold'],
    status: 'active',
    productionValue: 1100,
    yearEstablished: 2005,
    owner: 'First Quantum Minerals',
    size: 'large'
  },
  {
    id: '9',
    name: 'Jwaneng Diamond Mine',
    latitude: -24.6000,
    longitude: 24.7000,
    country: 'Botswana',
    region: 'Southern District',
    resources: ['diamonds'],
    status: 'active',
    productionValue: 3200,
    yearEstablished: 1982,
    owner: 'De Beers',
    size: 'large'
  },
  {
    id: '10',
    name: 'Konkola Copper Mine',
    latitude: -12.8333,
    longitude: 27.7500,
    country: 'Zambia',
    region: 'Copperbelt',
    resources: ['copper'],
    status: 'active',
    productionValue: 890,
    yearEstablished: 1957,
    owner: 'Vedanta Resources',
    size: 'large'
  }
];

export const getTotalProductionValue = (): number => {
  return MOCK_MINES.reduce((total, mine) => total + mine.productionValue, 0);
};

export const getResourceBreakdown = () => {
  const breakdown: Record<string, number> = {};
  
  MOCK_MINES.forEach(mine => {
    mine.resources.forEach(resource => {
      if (!breakdown[resource]) {
        breakdown[resource] = 0;
      }
      breakdown[resource] += mine.productionValue / mine.resources.length;
    });
  });
  
  return breakdown;
};

export const getRegionalBreakdown = () => {
  const breakdown: Record<string, number> = {};
  
  MOCK_MINES.forEach(mine => {
    if (!breakdown[mine.country]) {
      breakdown[mine.country] = 0;
    }
    breakdown[mine.country] += mine.productionValue;
  });
  
  return breakdown;
};