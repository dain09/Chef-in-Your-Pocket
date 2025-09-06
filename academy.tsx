import React from 'react';
import ReactDOM from 'react-dom/client';
import ChefsAcademyPage from './components/ChefsAcademy';
import './i18n'; // Initialize i18next
import ParticleBackground from './components/AuroraBackground';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <ParticleBackground />
      <ChefsAcademyPage />
      <ToastContainer />
    </ToastProvider>
  </React.StrictMode>
);
