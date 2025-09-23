import React from 'react';
import { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import Capture from './pages/Capture';
import CaptureDetail from './pages/CaptureDetail';
import { AuthProvider } from './contexts/AuthProvider';

// import { processOfflineQueue } from './lib/processQueue';


export default function App({ children }: { children?: React.ReactNode }) {
  useEffect(() => {
    // const run = () => navigator.onLine && processOfflineQueue();
    // window.addEventListener('online', run);
    // run();
    // return () => window.removeEventListener('online', run);
  }, []);
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 text-white">
        <a href="#main" className="sr-only focus:not-sr-only focus-ring absolute left-2 top-2 z-50 bg-white px-3 py-2 rounded">
          Skip to content
        </a>
        <nav className="bg-white/10 p-4">
          <ul className="flex gap-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/catalog">Catalog</Link></li>
            <li><Link to="/capture">Capture</Link></li>
          </ul>
        </nav>
        <main id="main" className="p-4">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/capture" element={<Capture />} />
            <Route path="/capture/:id" element={<CaptureDetail />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
