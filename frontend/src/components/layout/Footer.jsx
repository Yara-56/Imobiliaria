import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 p-10 font-inter">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">[Nome da Imobiliária]</h3>
          <p className="text-sm text-gray-400">
            Sua parceira de confiança para encontrar o imóvel dos sonhos.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
            <li><Link to="/imoveis" className="hover:text-white transition-colors">Ver Imóveis</Link></li>
            <li><Link to="/contato" className="hover:text-white transition-colors">Contato</Link></li>
            <li><Link to="/admin/login" className="hover:text-white transition-colors">Acesso Restrito</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
          <p className="text-sm text-gray-400">(31) 99999-8888</p>
          <p className="text-sm text-gray-400">contato@suaimobiliaria.com</p>
          <p className="text-sm text-gray-400">Rua Fictícia, 123 - Centro, Ipatinga/MG</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} [Nome da Imobiliária]. Todos os direitos reservados.
      </div>
    </footer>
  );
}