import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Correct import path for App component.
import App from './App.tsx';
import './i18n'; // Initialize i18next
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
      <App />
      <ToastContainer />
    </ToastProvider>
  </React.StrictMode>
);