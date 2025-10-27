import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Importação do seu contexto de autenticação
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faBell,
  faClockRotateLeft,
  faSun,
  faExpand,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Componente Topbar (Barra Superior) do painel administrativo.
 * @param {string} title - Título principal da página.
 * @param {string} subtitle - Subtítulo/caminho da página.
 */
export default function Topbar({ title, subtitle }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); 
  
  // Extrai o primeiro nome do usuário ou usa 'Admin' como fallback
  const userName = user?.name?.split(' ')[0] || 'Admin';

  const handleLogout = () => {
    logout();
    navigate('/'); // Redireciona para a home pública
  };

  // --- Funções Placeholder para Interatividade ---
  const handleSearch = (e) => {
    // Implemente a lógica de busca (ex: redirecionar para uma página de resultados)
    console.log('Buscando por:', e.target.value);
  };
  
  const handleToggleTheme = () => {
    // Implemente a lógica de alternar tema (claro/escuro)
    alert('Função de alternar tema (Modo Escuro) em desenvolvimento!');
  };

  const handleShowHistory = () => {
    // Implemente a lógica para exibir histórico de atividades
    alert('Função de Histórico de Atividades em desenvolvimento!');
  };

  const handleShowNotifications = () => {
    // Implemente a lógica para exibir notificações
    alert('Função de Notificações em desenvolvimento!');
  };

  const handleToggleFullscreen = () => {
    // Implemente a lógica de tela cheia (ex: document.documentElement.requestFullscreen())
    alert('Função de Tela Cheia em desenvolvimento!');
  };
  // -----------------------------------------------

  return (
    <div 
      className="sticky top-0 z-20 w-full bg-white border-b border-gray-200 px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-sm"
    >
      {/* Esquerda: Título da Página */}
      <div className="flex items-center gap-3">
        {/* Verifica se o título existe antes de renderizar o divisor */}
        {title && (
          <span className="font-semibold text-xl text-gray-800">{title}</span>
        )}
        
        {subtitle && (
          <>
            <span className="text-gray-400 font-light hidden sm:block">/</span>
            <span className="text-sm text-gray-500 truncate max-w-[150px] md:max-w-none">{subtitle}</span>
          </>
        )}
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
            onChange={handleSearch}
            aria-label="Campo de busca global"
          />
        </div>
        
        {/* Saudação ao Usuário */}
        <span className="text-sm text-gray-700 font-medium hidden sm:block ml-2">
          Olá, **{userName}**!
        </span>

        {/* Botões de Ação */}
        
        {/* Tema */}
        <button
          onClick={handleToggleTheme}
          title="Alternar modo claro/escuro"
          aria-label="Alternar modo claro/escuro"
          className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faSun} className="text-sm" />
        </button>

        {/* Histórico */}
        <button
          onClick={handleShowHistory}
          title="Histórico de Atividades"
          aria-label="Histórico de Atividades"
          className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faClockRotateLeft} className="text-sm" />
        </button>
        
        {/* Notificações */}
        <button
          onClick={handleShowNotifications}
          title="Notificações"
          aria-label="Notificações"
          className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faBell} className="text-sm" />
        </button>

        {/* Tela Cheia */}
        <button
          onClick={handleToggleFullscreen}
          title="Alternar tela cheia"
          aria-label="Alternar tela cheia"
          className="text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded-full transition-colors hidden md:block"
        >
          <FontAwesomeIcon icon={faExpand} className="text-sm" />
        </button>

        {/* Separador visual */}
        <span className="h-6 w-px bg-gray-300 hidden md:block"></span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Sair"
          aria-label="Sair da aplicação"
          className="text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 p-1 rounded-full transition-colors"
        >
          <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
        </button>
      </div>
    </div>
  );
}