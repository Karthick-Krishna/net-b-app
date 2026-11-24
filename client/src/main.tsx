import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { BankingProvider } from './context/BankingContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BankingProvider>
        <App />
      </BankingProvider>
    </AuthProvider>
  </React.StrictMode>
);
