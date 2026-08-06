// Springs / Far East Rand mining heritage dataset.
//
// IMPORTANT — these are APPROXIMATE, historical positions compiled from local
// history sources and satellite imagery, NOT surveyed coordinates. They are
// good to roughly a few hundred metres and are intended for illustration in the
// Heritage view, not for navigation, property or undermining decisions.

export type HeritageKind = 'gold' | 'coal' | 'context'

export interface HeritageSite {
  id: string
  name: string
  sub?: string
  kind: HeritageKind
  lat: number
  lon: number
  est: string
  note: string
}

export const SPRINGS_TOWN = { name: 'Springs (CBD)', lat: -26.254, lon: 28.442 }

// Ordered west -> south-east -> south across the goldfield.
export const SPRINGS_HERITAGE: HeritageSite[] = [
  {
    id: 'modder-east',
    name: 'Modder East',
    sub: 'New Modder / Modderfontein East',
    kind: 'gold',
    lat: -26.205,
    lon: 28.36,
    est: 'c.1913',
    note: 'North-west edge of the field on the Benoni border; one of the older Modderfontein workings.',
  },
  {
    id: 'brakpan',
    name: 'Brakpan Mines',
    kind: 'gold',
    lat: -26.243,
    lon: 28.373,
    est: 'c.1910',
    note: 'Western neighbour, on the Brakpan side of the goldfield.',
  },
  {
    id: 'springs-mines',
    name: 'Springs Mines',
    sub: 'Springs Mines Ltd',
    kind: 'gold',
    lat: -26.283,
    lon: 28.43,
    est: 'c.1908',
    note: 'Worked the reef immediately south of the young town of Springs.',
  },
  {
    id: 'geduld',
    name: 'Geduld Proprietary',
    sub: 'Geduld Prop. Mines',
    kind: 'gold',
    lat: -26.284,
    lon: 28.462,
    est: 'c.1909',
    note: 'On farm Geduld, where East Rand gold was first found in 1899 — the seed of the whole field.',
  },
  {
    id: 'east-geduld',
    name: 'East Geduld',
    sub: 'East Geduld Mine',
    kind: 'gold',
    lat: -26.284,
    lon: 28.505,
    est: 'c.1935',
    note: 'Eastern extension of the Geduld ground; a deeper, later shaft.',
  },
  {
    id: 'daggafontein',
    name: 'Daggafontein Mines',
    kind: 'gold',
    lat: -26.295,
    lon: 28.48,
    est: 'c.1937',
    note: 'A large, late, deep mine on the Daggafontein farm south-east of town.',
  },
  {
    id: 'grootvlei',
    name: 'Grootvlei Prop.',
    sub: 'Grootvlei Proprietary Mines',
    kind: 'gold',
    lat: -26.3235,
    lon: 28.4875,
    est: 'reg. 1904 · gold from 1938',
    note: 'Grootvlei Proprietary Mines were registered in 1904; the modern gold mine dates from the late 1930s. South-east toward Nigel; later notorious for the acid mine water from its pumping shafts after pumping stopped in 2011.',
  },
  {
    id: 'sub-nigel',
    name: 'Sub Nigel',
    kind: 'gold',
    lat: -26.42,
    lon: 28.47,
    est: 'c.1909',
    note: 'Southernmost of the group, on the Nigel end of the East Rand basin — a famously rich payer.',
  },
  {
    id: 'marievale',
    name: 'Marievale',
    sub: 'Nigel Gold Mining Co.',
    kind: 'context',
    lat: -26.4,
    lon: 28.515,
    est: 'c.1938',
    note: 'Context: a Nigel-border neighbour often counted with the southern field rather than Springs proper.',
  },
  {
    id: 'great-eastern-coal',
    name: 'Great Eastern shaft',
    sub: 'Pioneer Park · the coal origin',
    kind: 'coal',
    lat: -26.248,
    lon: 28.454,
    est: '1888',
    note: 'The shallow pioneer COAL shaft the district began with — the ivy-covered mineshaft Pioneer Park is built around. Not gold: the reason Springs exists at all.',
  },
]
