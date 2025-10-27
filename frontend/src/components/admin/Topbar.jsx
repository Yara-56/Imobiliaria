import React from 'react';
import { useNavigate } from 'react-router-dom';
// ✅ CORREÇÃO VERIFICADA: Caminho correto se Topbar está em components/admin e AuthContext está em contexts
import { useAuth } from '../../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBell,
  faClockRotateLeft,
  faSun,
  faExpand,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate();
  // Pegamos o user para usar o nome e a função logout
  const { logout, user } = useAuth(); 
  
  // Extraímos o nome para usar no 'Olá, [Nome]!'
  // Usa o nome do usuário ou 'Admin' como fallback
  const userName = user?.name || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/'); // Manda para a home pública após o logout
  };

  return (
    <div className="sticky top-0 z-10 w-full bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* Esquerda: Título da Página */}
      <div className="flex items-center gap-3">
        <span className="font-semibold text-lg text-gray-800">{title}</span>
        <span className="text-gray-400 font-light">/</span>
        <span className="text-sm text-gray-500">{subtitle}</span>
      </div>

      {/* Direita: Ícones e Ações */}
      <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
        
        {/* Campo de Busca */}
        <div className="flex items-center border border-gray-200 bg-gray-100 rounded-full px-3 py-1 focus-within:border-blue-500 focus-within:bg-white transition-colors">
          <FontAwesomeIcon icon={faSearch} className="text-gray-400 text-sm mr-2" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 w-40"
          />
        </div>
        
        {/* Saudação ao Usuário */}
        <span className="text-sm text-gray-700 font-medium hidden sm:block">
          Olá, **{userName.split(' ')[0]}**! {/* Mostra só o primeiro nome */}
        </span>


        <FontAwesomeIcon
          icon={faSun}
          className="text-gray-500 hover:text-blue-600 cursor-pointer text-sm"
          title="Modo claro/escuro"
        />
        <FontAwesomeIcon
          icon={faClockRotateLeft}
          className="text-gray-500 hover:text-blue-600 cursor-pointer text-sm"
          title="Histórico"
        />
        <FontAwesomeIcon
          icon={faBell}
          className="text-gray-500 hover:text-blue-600 cursor-pointer text-sm"
          title="Notificações"
        />
        <FontAwesomeIcon
          icon={faExpand}
          className="text-gray-500 hover:text-blue-600 cursor-pointer text-sm"
          title="Tela cheia"
        />

        <button
          onClick={handleLogout}
          title="Sair"
          className="text-gray-500 hover:text-red-600 cursor-pointer text-sm transition-colors"
        >
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      </div>
    </div>
  );
}
