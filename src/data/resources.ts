import { ResourceDatabase, ResourceStatus, OperationType } from '../types/types';

export const resourceDatabase: ResourceDatabase = {
  diamonds: {
    'south-africa': [
      {
        name: "Cullinan Diamond Mine",
        lat: -25.6667,
        lng: 28.5167,
        status: ResourceStatus.Active,
        type: OperationType.Underground,
        owner: "Petra Diamonds",
        production: "2.5 million carats/year",
        reserves: "125 million carats",
        details: {
          established: "1902",
          employees: 1200,
          lifespan: "25+ years",
          grade: "32.8 carats per 100 tonnes",
          processingMethod: "Dense Media Separation"
        }
      },
      {
        name: "Venetia Diamond Mine",
        lat: -22.4167,
        lng: 29.3167,
        status: ResourceStatus.Active,
        type: OperationType.OpenPit,
        owner: "De Beers",
        production: "4.2 million carats/year",
        reserves: "94 million carats",
        details: {
          established: "1992",
          employees: 3500,
          lifespan: "20+ years",
          grade: "36.2 carats per 100 tonnes"
        }
      }
    ],
    'russia': [
      {
        name: "Mir Diamond Mine",
        lat: 62.5267,
        lng: 113.9967,
        status: ResourceStatus.Active,
        type: OperationType.Underground,
        owner: "Alrosa",
        production: "2 million carats/year",
        reserves: "86 million carats",
        details: {
          established: "1957",
          employees: 2800,
          lifespan: "15+ years"
        }
      }
    ]
  },
  gold: {
    'south-africa': [
      {
        name: "Mponeng Gold Mine",
        lat: -26.2667,
        lng: 27.5,
        status: ResourceStatus.Active,
        type: OperationType.Underground,
        owner: "AngloGold Ashanti",
        production: "5.5 tonnes/year",
        reserves: "22.5 tonnes",
        details: {
          established: "1986",
          employees: 5500,
          lifespan: "10+ years",
          grade: "8.5 g/t"
        }
      },
      {
        name: "Kloof Gold Mine",
        lat: -26.2833,
        lng: 27.4833,
        status: ResourceStatus.Active,
        type: OperationType.Underground,
        owner: "Gold Fields",
        production: "19.8 tonnes/year",
        reserves: "98 tonnes",
        details: {
          established: "1952",
          employees: 8900,
          lifespan: "15+ years"
        }
      }
    ],
    'australia': [
      {
        name: "Super Pit Kalgoorlie",
        lat: -30.7333,
        lng: 121.5,
        status: ResourceStatus.Active,
        type: OperationType.OpenPit,
        owner: "Kalgoorlie Consolidated Gold Mines",
        production: "28 tonnes/year",
        reserves: "321 tonnes",
        details: {
          established: "1989",
          employees: 2500,
          lifespan: "25+ years"
        }
      }
    ]
  },
  platinum: {
    'south-africa': [
      {
        name: "Impala Platinum Mine",
        lat: -25.7167,
        lng: 27.9167,
        status: ResourceStatus.Active,
        type: OperationType.Underground,
        owner: "Impala Platinum Holdings",
        production: "42 tonnes/year",
        reserves: "156 tonnes",
        details: {
          established: "1969",
          employees: 18000,
          lifespan: "30+ years"
        }
      },
      {
        name: "Marikana Mine",
        lat: -25.6833,
        lng: 27.4833,
        status: ResourceStatus.Active,
        type: OperationType.Underground,
        owner: "Sibanye-Stillwater",
        production: "38 tonnes/year",
        reserves: "142 tonnes",
        details: {
          established: "1999",
          employees: 28000,
          lifespan: "25+ years"
        }
      }
    ]
  },
  copper: {
    'chile': [
      {
        name: "Escondida Mine",
        lat: -24.2333,
        lng: -69.05,
        status: ResourceStatus.Active,
        type: OperationType.OpenPit,
        owner: "BHP",
        production: "1.2 million tonnes/year",
        reserves: "57 million tonnes",
        details: {
          established: "1990",
          employees: 9500,
          lifespan: "40+ years"
        }
      },
      {
        name: "Chuquicamata Mine",
        lat: -22.3,
        lng: -68.9,
        status: ResourceStatus.Active,
        type: OperationType.OpenPit,
        owner: "Codelco",
        production: "320,000 tonnes/year",
        reserves: "34 million tonnes",
        details: {
          established: "1915",
          employees: 8200,
          lifespan: "30+ years"
        }
      }
    ]
  },
  lithium: {
    'chile': [
      {
        name: "Salar de Atacama",
        lat: -23.5,
        lng: -68.2,
        status: ResourceStatus.Active,
        type: OperationType.Marine,
        owner: "SQM",
        production: "48,000 tonnes/year",
        reserves: "8.6 million tonnes",
        details: {
          established: "1997",
          employees: 2100,
          lifespan: "50+ years"
        }
      }
    ]
  },
  coal: {
    'australia': [
      {
        name: "Hunter Valley Operations",
        lat: -32.7,
        lng: 150.9,
        status: ResourceStatus.Active,
        type: OperationType.OpenPit,
        owner: "Glencore",
        production: "20 million tonnes/year",
        reserves: "485 million tonnes",
        details: {
          established: "1982",
          employees: 1800,
          lifespan: "25+ years"
        }
      }
    ]
  },
  iron: {
    'australia': [
      {
        name: "Mount Whaleback",
        lat: -23.35,
        lng: 119.65,
        status: ResourceStatus.Active,
        type: OperationType.OpenPit,
        owner: "BHP",
        production: "85 million tonnes/year",
        reserves: "2.4 billion tonnes",
        details: {
          established: "1966",
          employees: 2200,
          lifespan: "30+ years"
        }
      }
    ],
    'brazil': [
      {
        name: "Carajás Mine",
        lat: -6.05,
        lng: -50.4,
        status: ResourceStatus.Active,
        type: OperationType.OpenPit,
        owner: "Vale",
        production: "150 million tonnes/year",
        reserves: "7.2 billion tonnes",
        details: {
          established: "1985",
          employees: 8900,
          lifespan: "50+ years"
        }
      }
    ]
  }
};