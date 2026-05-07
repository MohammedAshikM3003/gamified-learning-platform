import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './firebase.js';
import App from './App.jsx';
import { TranslationProvider } from './TranslationContext.jsx'; // ⬅️ import your context
import { ToastProvider } from './context/ToastContext.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TranslationProvider>    {/* ⬅️ wrap App with provider */}
        <ToastProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </ToastProvider>
      </TranslationProvider>
    </BrowserRouter>
  </StrictMode>,
);
