// src/main.jsx (ou src/index.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import { AuthProvider } from './contexts/AuthContext'; // ✅ Contexto de autenticação

import './styles/layout/layout.scss';
import './styles/main.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
