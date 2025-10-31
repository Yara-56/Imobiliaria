import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserName(user?.name || "Usuário");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const isPrefixActive = (prefix) => location.pathname.startsWith(prefix);

  const toggleSubmenu = (key) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: "fa-solid fa-chart-line",
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      key: "properties",
      icon: "fa-solid fa-building",
      label: "Imóveis",
      path: "/admin/imoveis",
      submenu: [
        { to: "/admin/imoveis", label: "📋 Listar imóveis" },
        { to: "/admin/imoveis/novo", label: "➕ Novo imóvel" },
      ],
    },
    {
      key: "tenants",
      icon: "fa-solid fa-users",
      label: "Inquilinos",
      path: "/admin/inquilinos",
    },
    {
      key: "contracts",
      icon: "fa-solid fa-file-contract",
      label: "Contratos",
      path: "/admin/contratos",
      submenu: [
        { to: "/admin/contratos", label: "📄 Todos os Contratos" },
        { to: "/admin/contratos/modelos", label: "📂 Modelos de Contrato" },
      ],
    },
    {
      key: "reports",
      icon: "fa-solid fa-chart-pie",
      label: "Relatórios",
      path: "/admin/relatorios",
      submenu: [
        { to: "/admin/pagamentos/historico/1", label: "📊 Pagamentos" },
        { to: "/admin/contratos", label: "📄 Contratos" },
        { to: "/admin/inquilinos", label: "🧑‍💼 Inquilinos" },
      ],
    },
  ];

  return (
    <aside className="min-h-screen w-64 bg-[#0B1D3A] flex flex-col text-white shadow-xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10">
        <h1 className="text-lg font-semibold tracking-wide mb-1">
          Imobiliária Lacerda
        </h1>
        <p className="text-sm text-gray-300 italic">
          Olá, <span className="text-white font-medium">{userName}</span> 👋
        </p>
      </div>

      {/* Menu principal */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.key} className="relative">
            <button
              onClick={() =>
                item.submenu ? toggleSubmenu(item.key) : navigate(item.path)
              }
              className={classNames(
                "flex items-center justify-between w-full px-4 py-2 rounded-md text-sm font-medium transition-all",
                isPrefixActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </div>
              {item.submenu && (
                <i
                  className={classNames(
                    "fa-solid fa-chevron-right text-xs transition-transform duration-200",
                    openMenu === item.key && "rotate-90"
                  )}
                ></i>
              )}
            </button>

            {/* Submenu */}
            {item.submenu && openMenu === item.key && (
              <div className="ml-9 mt-1 flex flex-col gap-1">
                {item.submenu.map((sub) => (
                  <Link
                    key={sub.to}
                    to={sub.to}
                    className={classNames(
                      "text-sm py-1 px-2 rounded transition-all",
                      isActive(sub.to)
                        ? "bg-blue-500 text-white font-medium"
                        : "text-gray-400 hover:text-white hover:bg-blue-800"
                    )}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="border-t border-white/10 px-4 py-3 mt-auto">
        <Link
          to="/admin/configuracoes"
          className="flex items-center gap-3 px-2 py-2 rounded-md text-gray-300 hover:bg-blue-800 hover:text-white text-sm"
        >
          <i className="fa-solid fa-gear"></i>
          <span>Configurações</span>
        </Link>
        <button
          onClick={handleLogout}
          className="mt-2 flex items-center gap-3 px-2 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white text-sm w-full text-left"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
