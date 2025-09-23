import { useRef, useState } from 'react';
import Card from '../components/Card';
// import { requestSas, uploadWithSas } from "../lib/blobUpload";
// import { classifyCoarseThenFine } from "../lib/inference";
// import { estimateValueZAR } from '../lib/valuation';
// import { queueCapture } from '../lib/offlineQueue';
// import { resolveRegion } from '../lib/regionResolver';
// import { preprocessImage } from '../lib/imageProcess';

const requestSas = (s: string) => Promise.resolve({ url: 'https://example.com', expires: ''});
const uploadWithSas = (f: File, s: string) => Promise.resolve('https://example.com');
const classifyCoarseThenFine = (f: File, s: string, gps?: any, hints?: any, threshold?: number) => Promise.resolve({ top_label: 'test', confidence: 0.9, alt: [], tags: [], attributes: {} });
const estimateValueZAR = (s: string, o: any) => ({ min: 100, max: 200 });
const queueCapture = (f: File, o: any) => Promise.resolve();
const resolveRegion = (lat: number, lon: number) => 'test-region';
const preprocessImage = (f: File, o: any) => Promise.resolve(f);


export default function Capture() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [valuation, setValuation] = useState<{min:number,max:number}|null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function uploadAndClassify() {
    if (!fileRef.current?.files?.[0]) return;
    setBusy(true);
    try {
      const file = fileRef.current.files[0];

      // Preprocess image
      const processed = await preprocessImage(file, { maxDim: 1600, keepGPS: false });

      // GPS
      const pos = await new Promise<GeolocationPosition | null>((res) =>
        navigator.geolocation.getCurrentPosition(p => res(p), () => res(null), { enableHighAccuracy: true, timeout: 8000 })
      );
      const lat = pos?.coords.latitude ?? undefined;
      const lon = pos?.coords.longitude ?? undefined;
      const region_tag = lat && lon ? resolveRegion(lat, lon) : undefined;

      if (!navigator.onLine) {
        await queueCapture(processed, { lat, lon, region_tag });
        setPreview(URL.createObjectURL(processed));
        setResult({ top_label: 'queued-offline', confidence: 0, alt: [], tags: ['queued'], attributes: {} });
        setBusy(false);
        return;
      }

      const name = `${crypto.randomUUID()}-${processed.name}`;
      const { url: sasUrl } = await requestSas(name);
      const blobUrl = await uploadWithSas(processed, sasUrl);

      const inf = await classifyCoarseThenFine(processed, blobUrl, lat && lon ? {lat,lon} : undefined, undefined, 0.82);
      setResult(inf);
      const val = estimateValueZAR(inf.top_label, { size_mm: 20, clarity: 'med', demand: 'med', region_score: 0.6 });
      setValuation(val);


    } catch (e:any) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <h2 className="text-white text-3xl font-bold">📷 Capture & Identify</h2>
      <Card>
        <div className="flex flex-col gap-3">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} />
          {preview && <img src={preview} alt="preview" className="rounded" />}
          <button disabled={busy || !preview} onClick={uploadAndClassify} className="self-start bg-primary text-white px-4 py-2 rounded disabled:opacity-50">{busy ? 'Classifying…' : 'Upload & Classify'}</button>
        </div>
      </Card>
      {result && (
        <Card>
          <h3 className="text-primary font-bold text-xl">Prediction</h3>
          <p><b>Label:</b> {result.top_label} — <b>Confidence:</b> {(result.confidence*100).toFixed(0)}%</p>
          {valuation && <p className="mt-2"><b>Estimated Value:</b> ZAR {valuation.min.toFixed(0)} — {valuation.max.toFixed(0)}</p>}
          <div className="mt-2">
            <h4 className="font-semibold">Tags</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {result.tags?.map((t:string) => <span key={t} className="px-2 py-0.5 bg-amber-100 rounded text-amber-900 text-sm">{t}</span>)}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
