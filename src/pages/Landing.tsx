import BasicIndicators from './BasicIndicators';
import AdvancedIndicators from './AdvancedIndicators';

export default function Landing() {
  return (
    <div className="grid gap-8">
      <h1 className="text-5xl font-bold text-white text-center">Complete Kimberlite Prospector's Guide</h1>
      <BasicIndicators />
      <AdvancedIndicators />
    </div>
  );
}
