import { useEffect, useState } from 'react';
import Card from '../components/Card';
// import { repo } from '../data';

const repo = {
  getMineralTaxonomy: () => Promise.resolve([
    { slug: 'garnet', display_name: 'Garnet', category: 'kimberlite-indicator', region_tags: ['bela-bela', 'waterberg'] },
    { slug: 'ilmenite', display_name: 'Ilmenite', category: 'kimberlite-indicator', region_tags: ['bela-bela'] },
  ])
};


type Taxon = { slug:string; display_name:string; category:string; region_tags:string[] };

export default function Catalog() {
  const [items, setItems] = useState<Taxon[]>([]);
  const [q, setQ] = useState('');
  const [regionOnly, setRegionOnly] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await repo.getMineralTaxonomy();
      setItems(data);
    })();
  }, []);

  const list = items
    .filter(i => (regionOnly ? (i.region_tags||[]).includes('bela-bela') || (i.region_tags||[]).includes('waterberg') : true))
    .filter(i => i.display_name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="grid gap-4">
      <h2 className="text-white text-3xl font-bold">📚 Prospect Catalog</h2>
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="border rounded px-3 py-2" />
          <label className="flex items-center gap-2"><input type="checkbox" checked={regionOnly} onChange={e=>setRegionOnly(e.target.checked)} /> Bela‑Bela priority</label>
        </div>
      </Card>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {list.map(i => (
          <Card key={i.slug}>
            <div className="flex items-center justify-between">
              <h3 className="text-primary text-xl font-bold">{i.display_name}</h3>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">{i.category}</span>
            </div>
            <p className="text-sm text-neutral-600 mt-1">Region tags: {(i.region_tags||[]).join(', ')}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
