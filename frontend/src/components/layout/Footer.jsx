import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 p-10 font-inter">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna 1 — Nome e descrição */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Imobiliária Lacerda</h3>
          <p className="text-sm text-gray-400">
            Sua parceira de confiança para encontrar o imóvel dos sonhos.
          </p>
        </div>

        {/* Coluna 2 — Links rápidos */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition-colors">
                Início
              </Link>
            </li>
            <li>
              <Link to="/admin/imoveis" className="hover:text-white transition-colors">
                Ver Imóveis
              </Link>
            </li>
            <li>
              <Link to="/contato" className="hover:text-white transition-colors">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-white transition-colors">
                Acesso Restrito
              </Link>
            </li>
          </ul>
        </div>

        {/* Coluna 3 — Contato */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contato</h4>
          <p className="text-sm text-gray-400">(31) 99999-8888</p>
          <p className="text-sm text-gray-400">contato@suaimobiliaria.com</p>
          <p className="text-sm text-gray-400">Rua Fictícia, 123 - Centro, Ipatinga/MG</p>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} Imobiliária Lacerda. Todos os direitos reservados.
      </div>
    </footer>
  );
}
