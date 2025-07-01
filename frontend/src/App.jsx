import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Rotas públicas
import Login from './pages/Login.jsx';

// Rotas protegidas
import Inicio from './pages/Inicio.jsx';
import Pagamento from './pages/Pagamento.jsx';
import NovoInquilino from './pages/NovoInquilino.jsx';
import NovoContrato from './pages/NovoContrato.jsx';
import ContratoVisualizacao from './pages/ContratoVisualizacao.jsx';
import Contratos from './pages/Contratos.jsx';
import ModelosContrato from './pages/ModelosContrato.jsx';
import EditarModeloContrato from './pages/EditarModeloContrato.jsx';
import ConfigurarPagamento from './pages/ConfigurarPagamento.jsx';
import ReciboVisualizacao from './pages/ReciboVisualizacao.jsx';
import HistoricoPagamentos from './pages/HistoricoPagamentos.jsx';

import RotaProtegida from './components/RotaProtegida.jsx';

import './styles/layout/layout.scss';
import './styles/main.scss';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas protegidas */}
        <Route path="/inicio" element={<RotaProtegida><Inicio /></RotaProtegida>} />
        <Route path="/pagamento" element={<RotaProtegida><Pagamento /></RotaProtegida>} />
        <Route path="/novo-inquilino" element={<RotaProtegida><NovoInquilino /></RotaProtegida>} />
        <Route path="/novo-contrato" element={<RotaProtegida><NovoContrato /></RotaProtegida>} />
        <Route path="/contratos" element={<RotaProtegida><Contratos /></RotaProtegida>} />
        <Route path="/contrato/:id" element={<RotaProtegida><ContratoVisualizacao /></RotaProtegida>} />
        <Route path="/modelos" element={<RotaProtegida><ModelosContrato /></RotaProtegida>} />
        <Route path="/editar-modelo/:id" element={<RotaProtegida><EditarModeloContrato /></RotaProtegida>} />
        <Route path="/configurar-pagamento" element={<RotaProtegida><ConfigurarPagamento /></RotaProtegida>} />
        <Route path="/recibo/:id" element={<RotaProtegida><ReciboVisualizacao /></RotaProtegida>} />
        <Route path="/historico-pagamentos" element={<RotaProtegida><HistoricoPagamentos /></RotaProtegida>} />
      </Routes>
      <Route path="/teste-novo-inquilino" element={<NovoInquilino />} />
    </Router>
  );
}
