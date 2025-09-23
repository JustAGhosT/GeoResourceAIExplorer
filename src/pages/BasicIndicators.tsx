import Card from '../components/Card';
import { useMinerals } from '../hooks/useContent';


export default function BasicIndicators() {
  const minerals = useMinerals('basic');
  return (
    <div className="grid gap-4">
      <h2 className="text-white text-3xl font-bold">🔍 Basic Kimberlite Indicator Minerals</h2>
      {minerals.map((m) => (
        <Card key={m.id}>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-primary text-xl font-bold">{m.name}</h3>
            <span className="text-xs font-black rounded-full px-2 py-0.5 bg-yellow-400">{m.badge}</span>
          </div>
          {m.formula && <p className="italic text-neutral-600 mb-2">{m.formula}</p>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-neutral-100 p-2 rounded">
            {m.gallery.map((g, i) => (
              <div key={i} className="aspect-square grid place-items-center text-neutral-600 border-2 border-dashed rounded">{g}</div>
            ))}
          </div>
          <dl className="bg-neutral-50 rounded p-2 mt-2">
            {m.properties.map((p, i) => (
              <div key={i} className="flex justify-between border-b last:border-none py-1">
                <dt className="font-semibold text-neutral-600">{p.label}:</dt>
                <dd className="text-neutral-800">{p.value}</dd>
              </div>
            ))}
          </dl>
          {m.tips.length > 0 && (
            <ul className="mt-2 bg-gradient-to-br from-amber-200 to-amber-100 rounded p-2 list-disc list-inside">
              {m.tips.map((t, i) => (<li key={i}>{t}</li>))}
            </ul>
          )}
        </Card>
      ))}
    </div>
  );
}
