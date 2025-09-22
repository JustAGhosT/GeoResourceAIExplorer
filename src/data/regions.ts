import { RegionConfigs } from '../types/types';

export const regionConfigs: RegionConfigs = {
  'south-africa': {
    center: [-28.5, 24.5],
    zoom: 6,
    name: 'South Africa',
    description: 'Major mining hub with diverse mineral resources including gold, diamonds, platinum, and coal.',
    totalProduction: {
      gold: '140 tonnes/year',
      diamonds: '7.2 million carats/year',
      platinum: '140 tonnes/year',
      coal: '250 million tonnes/year'
    }
  },
  'australia': {
    center: [-25, 135],
    zoom: 5,
    name: 'Australia',
    description: 'World leader in iron ore and coal production, with significant uranium and gold resources.',
    totalProduction: {
      'iron-ore': '900 million tonnes/year',
      coal: '500 million tonnes/year',
      gold: '320 tonnes/year',
      uranium: '6,200 tonnes/year'
    }
  },
  'canada': {
    center: [60, -110],
    zoom: 4,
    name: 'Canada',
    description: 'Rich in diverse minerals including uranium, gold, copper, and rare earth elements.',
    totalProduction: {
      uranium: '13,116 tonnes/year',
      gold: '200 tonnes/year',
      copper: '550,000 tonnes/year',
      nickel: '180,000 tonnes/year'
    }
  },
  'chile': {
    center: [-35, -71],
    zoom: 5,
    name: 'Chile',
    description: 'World\'s largest copper producer with significant lithium reserves.',
    totalProduction: {
      copper: '5.8 million tonnes/year',
      lithium: '26,000 tonnes/year',
      gold: '37 tonnes/year',
      silver: '1,300 tonnes/year'
    }
  },
  'brazil': {
    center: [-15, -55],
    zoom: 5,
    name: 'Brazil',
    description: 'Major iron ore producer with significant reserves of various minerals.',
    totalProduction: {
      'iron-ore': '380 million tonnes/year',
      gold: '107 tonnes/year',
      copper: '380,000 tonnes/year',
      uranium: '309 tonnes/year'
    }
  },
  'russia': {
    center: [60, 90],
    zoom: 3,
    name: 'Russia',
    description: 'Vast mineral resources including diamonds, gold, platinum, and rare earth elements.',
    totalProduction: {
      diamonds: '23 million carats/year',
      gold: '329 tonnes/year',
      platinum: '20 tonnes/year',
      coal: '165 million tonnes/year'
    }
  }
};