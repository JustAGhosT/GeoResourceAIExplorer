import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        {/* The rest of the app will be rendered as children of App */}
      </App>
    </BrowserRouter>
  </React.StrictMode>
);
