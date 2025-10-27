import React from 'react';
import AppRoutes from './routes/AppRoutes';
// Não precisamos do AuthProvider nem do BrowserRouter aqui

function App() {
  return (
    // O App.jsx deve apenas renderizar o componente que gerencia as rotas.
    // O BrowserRouter e o AuthProvider já estão no seu main.jsx
    // envolvendo este componente App.
    <AppRoutes />
  );
}

export default App;