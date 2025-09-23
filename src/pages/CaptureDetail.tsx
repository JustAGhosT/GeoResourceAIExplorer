import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../components/Card";
// import { repo } from "../data";
// import { buildShareLinks, shareNative } from "../lib/share";
// import { selectDisplayValuation } from "../lib/valuation";
// import { useCurrencyFormat } from "../lib/valuation";

const repo = {
  getCapture: (id: string) => Promise.resolve({ id, predicted_label: 'test', predicted_slug: 'test', confidence: 0.9, image_url: 'https://via.placeholder.com/150' }),
  getValuations: (id: string) => Promise.resolve([]),
  insertFeedback: (f: any) => Promise.resolve(),
};
const buildShareLinks = (url: string, text: string) => ({ whatsapp: '', facebook: '' });
const shareNative = (url: string, text: string) => {};
const selectDisplayValuation = (vals: any[]) => null;
const useCurrencyFormat = () => ({ fmt: new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }), convert: (v: number) => v });


export default function CaptureDetail() {
  const { id } = useParams();
  const [cap, setCap] = useState<any>(null);
  const [vals, setVals] = useState<any[]>([]);
  const { fmt, convert } = useCurrencyFormat();

  useEffect(() => {
    (async () => {
      const capture = await repo.getCapture(id!);
      setCap(capture);

      if (id) {
        const valuations = await repo.getValuations(id);
        setVals(valuations);
      }
    })();
  }, [id]);

  if (!cap) return <div className="text-white">Loading…</div>;

  const pageUrl = location.href;
  const text = `Prospector Scout: ${cap.predicted_label || cap.predicted_slug}`;

  const links = buildShareLinks(pageUrl, text);
  const displayVal = selectDisplayValuation(vals);

  return (
    <div className="grid gap-4">
      <h2 className="text-white text-3xl font-bold">📸 Capture</h2>
      <Card>
        {cap.image_url && <img src={cap.image_url} alt={cap.predicted_label} className="rounded mb-2" />}
        <p><b>Prediction:</b> {cap.predicted_label || cap.predicted_slug} ({Math.round((cap.confidence||0)*100)}%)</p>

        {cap.is_false_positive && (
          <div className="mt-2 px-3 py-2 rounded bg-rose-100 text-rose-800 font-semibold">Marked as FALSE POSITIVE by reviewer</div>
        )}
        {displayVal && (
          <p className="mt-2"><b>Value (display):</b> {fmt.format(convert(displayVal.value_min))} – {fmt.format(convert(displayVal.value_max))} <i>({displayVal.method})</i></p>
        )}

        <div className="flex gap-2 mt-3">
          <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => shareNative(pageUrl, text)}>
            Share
          </button>
          <a className="px-3 py-2 bg-green-600 text-white rounded" href={links.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          <a className="px-3 py-2 bg-blue-700 text-white rounded" href={links.facebook} target="_blank" rel="noreferrer">Facebook</a>
        </div>
      </Card>

      <Card>
        <h3 className="text-primary font-bold text-lg mb-2">Community Feedback</h3>
        <FeedbackForm captureId={cap.id} />
      </Card>
    </div>
  );
}

function FeedbackForm({ captureId }: { captureId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  async function submit() {
    try {
      await repo.insertFeedback({
        capture_id: captureId,
        rating, comment
      });
      setComment("");
      alert("Thanks for the feedback!");
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label>Rating (1–5)</label>
      <input type="number" min={1} max={5} value={rating} onChange={(e)=>setRating(Number(e.target.value))} className="border rounded px-3 py-2 w-24" />
      <label>Comment</label>
      <textarea value={comment} onChange={(e)=>setComment(e.target.value)} className="border rounded px-3 py-2"></textarea>
      <button className="self-start bg-primary text-white px-4 py-2 rounded" onClick={submit}>Submit</button>
    </div>
  );
}
