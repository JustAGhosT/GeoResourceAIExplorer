'use client'

import { useMemo, useState } from 'react'
import { Info, ExternalLink } from 'lucide-react'
import { SPRINGS_HERITAGE, SPRINGS_TOWN, HeritageSite } from '@/data/springsHeritage'

const COL = {
  gold: '#d8ad4e',
  goldBright: '#f0cd77',
  coal: '#8ba3b4',
  ctx: '#a99f86',
  ink: '#ece3cf',
  inkDim: '#a99f86',
  inkFaint: '#6f6650',
  line: '#3a3323',
  lineSoft: '#2a2417',
  reef: 'rgba(216,173,78,0.13)',
  sel: '#f0cd77',
}

const S = 2400
const M = 54

function colourFor(kind: HeritageSite['kind']): string {
  if (kind === 'coal') return COL.coal
  if (kind === 'context') return COL.ctx
  return COL.gold
}

function frange(a: number, b: number, step: number): number[] {
  const out: number[] = []
  let v = Math.ceil(a / step) * step
  for (; v <= b + 1e-9; v += step) out.push(Number(v.toFixed(3)))
  return out
}

export function SpringsHeritageTab() {
  const [selected, setSelected] = useState<string>('geduld')

  const geo = useMemo(() => {
    const pts = [...SPRINGS_HERITAGE, SPRINGS_TOWN]
    let latMin = Infinity
    let latMax = -Infinity
    let lonMin = Infinity
    let lonMax = -Infinity
    pts.forEach((p) => {
      latMin = Math.min(latMin, p.lat)
      latMax = Math.max(latMax, p.lat)
      lonMin = Math.min(lonMin, p.lon)
      lonMax = Math.max(lonMax, p.lon)
    })
    const padLat = (latMax - latMin) * 0.1 + 0.012
    const padLon = (lonMax - lonMin) * 0.1 + 0.012
    latMin -= padLat
    latMax += padLat
    lonMin -= padLon
    lonMax += padLon
    const latMid = (latMin + latMax) / 2
    const kx = Math.cos((latMid * Math.PI) / 180)
    const X = (lon: number) => (lon - lonMin) * kx * S
    const Y = (lat: number) => (latMax - lat) * S
    const px = (lon: number) => X(lon) + M
    const py = (lat: number) => Y(lat) + M
    const W = X(lonMax)
    const H = Y(latMin)

    const sites = SPRINGS_HERITAGE.map((s) => ({ site: s, x: px(s.lon), y: py(s.lat) }))
    const lonLines = frange(lonMin, lonMax, 0.05)
    const latLines = frange(latMin, latMax, 0.05)

    return {
      vbw: W + M * 2,
      vbh: H + M * 2,
      px,
      py,
      sites,
      town: { x: px(SPRINGS_TOWN.lon), y: py(SPRINGS_TOWN.lat) },
      lonLines,
      latLines,
      W,
      H,
    }
  }, [])

  const rec = SPRINGS_HERITAGE.find((s) => s.id === selected) || SPRINGS_HERITAGE[0]
  const kindLabel =
    rec.kind === 'coal' ? 'Coal shaft' : rec.kind === 'context' ? 'Gold · context (Nigel)' : 'Gold mine & shaft'
  const mapsQuery = `${rec.lat.toFixed(4)},${rec.lon.toFixed(4)}`

  const reefPath = `M ${geo.px(28.345)} ${geo.py(-26.3)} C ${geo.px(28.41)} ${geo.py(-26.335)}, ${geo.px(
    28.47
  )} ${geo.py(-26.3)}, ${geo.px(28.53)} ${geo.py(-26.255)}`

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-gray-50">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Springs Goldfield · Heritage</h2>
          <p className="text-gray-600">
            The Far East Rand goldfield around Springs, c.1938 — eight gold mines that briefly made it the largest
            single gold-producing area on earth, plus the 1888 coal shaft in Pioneer Park where the district began.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <Info className="h-5 w-5 flex-shrink-0 text-amber-500" />
          <p>
            <span className="font-semibold">Approximate — for orientation, not survey.</span> Positions are placed
            from known localities and the goldfield layout; exact shaft-collar coordinates are not verified. Treat pins
            as “about here,” accurate to roughly a kilometre. The reef trend is schematic.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-4">
            <div className="rounded-md overflow-hidden" style={{ background: '#12100b' }}>
              <svg
                viewBox={`0 0 ${geo.vbw.toFixed(1)} ${geo.vbh.toFixed(1)}`}
                className="block w-full h-auto"
                role="img"
                aria-label="Survey plan of the Springs goldfield showing gold mines, the Pioneer Park coal shaft and the town of Springs."
              >
                {/* graticule */}
                <g>
                  {geo.lonLines.map((lo) => (
                    <g key={`lo-${lo}`}>
                      <line x1={geo.px(lo)} y1={M - 6} x2={geo.px(lo)} y2={geo.vbh - M + 6} stroke={COL.lineSoft} strokeWidth={1} />
                      <text x={geo.px(lo)} y={geo.vbh - M + 22} fill={COL.inkFaint} fontFamily="monospace" fontSize={16} textAnchor="middle">
                        {lo.toFixed(2)}°E
                      </text>
                    </g>
                  ))}
                  {geo.latLines.map((la) => (
                    <g key={`la-${la}`}>
                      <line x1={M - 6} y1={geo.py(la)} x2={geo.vbw - M + 6} y2={geo.py(la)} stroke={COL.lineSoft} strokeWidth={1} />
                      <text x={M - 12} y={geo.py(la) + 5} fill={COL.inkFaint} fontFamily="monospace" fontSize={16} textAnchor="end">
                        {Math.abs(la).toFixed(2)}°S
                      </text>
                    </g>
                  ))}
                </g>

                {/* frame */}
                <rect x={M} y={M} width={geo.W} height={geo.H} fill="none" stroke={COL.line} strokeWidth={1.5} />

                {/* reef trend */}
                <path d={reefPath} fill="none" stroke={COL.reef} strokeWidth={58} strokeLinecap="round" />

                {/* town */}
                <g>
                  <rect
                    x={geo.town.x - 9}
                    y={geo.town.y - 9}
                    width={18}
                    height={18}
                    fill="none"
                    stroke={COL.inkDim}
                    strokeWidth={2}
                    transform={`rotate(45 ${geo.town.x} ${geo.town.y})`}
                  />
                  <text x={geo.town.x + 15} y={geo.town.y - 12} fill={COL.inkDim} fontFamily="monospace" fontSize={17} fontWeight={600}>
                    SPRINGS
                  </text>
                </g>

                {/* markers */}
                {geo.sites.map(({ site, x, y }) => {
                  const col = colourFor(site.kind)
                  const on = site.id === selected
                  const labelLeft = site.lon > 28.49
                  return (
                    <g
                      key={site.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      aria-label={`${site.name}, ${site.kind === 'coal' ? 'coal shaft' : 'gold mine'}`}
                      className="cursor-pointer focus:outline-none"
                      onClick={() => setSelected(site.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          setSelected(site.id)
                        }
                      }}
                    >
                      {on && <circle cx={x} cy={y} r={20} fill="none" stroke={COL.sel} strokeWidth={2} />}
                      <circle cx={x} cy={y} r={22} fill="transparent" />
                      {site.kind === 'context' ? (
                        <g>
                          <path
                            d={`M ${x} ${y - 11} L ${x + 11} ${y} L ${x} ${y + 11} L ${x - 11} ${y} Z`}
                            fill="none"
                            stroke={col}
                            strokeWidth={2}
                            strokeDasharray="3 3"
                          />
                          <circle cx={x} cy={y} r={2.6} fill={col} />
                        </g>
                      ) : site.kind === 'coal' ? (
                        <g>
                          <circle cx={x} cy={y} r={8.5} fill="none" stroke={col} strokeWidth={2.4} />
                          <circle cx={x} cy={y} r={3} fill={col} />
                        </g>
                      ) : (
                        <g>
                          <path
                            d={`M ${x - 11} ${y + 11} L ${x} ${y - 13} L ${x + 11} ${y + 11} M ${x - 11} ${y + 11} L ${x + 7} ${y - 13} M ${x + 11} ${y + 11} L ${x - 7} ${y - 13}`}
                            fill="none"
                            stroke={col}
                            strokeWidth={2.4}
                            strokeLinejoin="round"
                            strokeLinecap="round"
                          />
                          <circle cx={x} cy={y + 11} r={3.4} fill={col} />
                        </g>
                      )}
                      <text
                        x={labelLeft ? x - 16 : x + 16}
                        y={y + 5}
                        fill={COL.ink}
                        fontFamily="monospace"
                        fontSize={16.5}
                        textAnchor={labelLeft ? 'end' : 'start'}
                      >
                        {site.name}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* legend */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-3 text-xs text-gray-500 font-mono">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-3 h-3" style={{ background: COL.gold }} /> Gold mine &amp; shaft
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: COL.coal }} /> Coal shaft (1888)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-3 h-3 border" style={{ borderColor: '#9ca3af' }} /> Town of Springs
              </span>
              <span className="text-gray-400">◇ context mine (Nigel border)</span>
            </div>
          </div>

          {/* Detail panel */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Mine record</p>
            <h3 className="text-xl font-bold text-gray-900 leading-tight">{rec.name}</h3>
            {rec.sub && <p className="text-sm text-gray-500 mb-1">{rec.sub}</p>}
            <p className="text-sm font-medium mb-4" style={{ color: rec.kind === 'coal' ? '#3f5d70' : '#9c7418' }}>
              {kindLabel}
            </p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-xs uppercase tracking-wide text-gray-400 self-baseline">Established</dt>
              <dd className="font-mono text-gray-900">{rec.est}</dd>
              <dt className="text-xs uppercase tracking-wide text-gray-400 self-baseline">Latitude</dt>
              <dd className="font-mono text-gray-900">{Math.abs(rec.lat).toFixed(4)}° S</dd>
              <dt className="text-xs uppercase tracking-wide text-gray-400 self-baseline">Longitude</dt>
              <dd className="font-mono text-gray-900">{rec.lon.toFixed(4)}° E</dd>
            </dl>
            <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">{rec.note}</p>
            <a
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-white bg-amber-600 hover:bg-amber-500 rounded px-3 py-2"
              href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" /> Open on Google Maps
            </a>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">The roster · west → south-east → south</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mine</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approx. lat, long</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {SPRINGS_HERITAGE.map((s) => (
                  <tr
                    key={s.id}
                    className={`cursor-pointer hover:bg-gray-50 ${s.id === selected ? 'bg-amber-50' : ''}`}
                    onClick={() => setSelected(s.id)}
                  >
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="w-2.5 h-2.5 rounded-full mr-3" style={{ background: colourFor(s.kind) }} />
                        <span className="text-sm font-medium text-gray-900">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {s.kind === 'coal' ? 'coal' : s.kind === 'context' ? 'gold · ctx' : 'gold'}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">{s.est}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 font-mono tabular-nums">
                      {Math.abs(s.lat).toFixed(3)}S, {s.lon.toFixed(3)}E
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
