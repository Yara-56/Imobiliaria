// src/components/Menu.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useAuth } from "../contexts/AuthContext";

export default function Menu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserName(user?.name || "Usuário");
  }, []);

  // Abre submenu automaticamente se a URL corresponder
  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    if (activeItem?.submenu) setOpenMenu(activeItem.key);
  }, [location.pathname]);

  const toggleSubmenu = (key) => {
    setOpenMenu(openMenu === key ? null : key);
  };

  const isActive = (path) => location.pathname === path;
  const isPrefixActive = (prefix) => location.pathname.startsWith(prefix);

  const menuItems = [
    {
      key: "dashboard",
      icon: "fa-solid fa-chart-line",
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      key: "payments",
      icon: "fa-solid fa-credit-card",
      label: "Pagamentos",
      path: "/admin/pagamentos",
      submenu: [
        { to: "/admin/pagamentos", label: "➕ Novo Pagamento" },
        { to: "/admin/pagamentos/historico", label: "📜 Histórico" },
      ],
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
      submenu: [
        { to: "/admin/inquilinos", label: "📋 Listar inquilinos" },
        { to: "/admin/inquilinos/novo", label: "➕ Novo inquilino" },
      ],
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
        { to: "/admin/relatorios/pagamentos", label: "💰 Pagamentos" },
        { to: "/admin/relatorios/contratos", label: "📄 Contratos" },
        { to: "/admin/relatorios/inquilinos", label: "👥 Inquilinos" },
      ],
    },
  ];

  return (
    <aside
      className={classNames(
        "min-h-screen bg-[#0B1D3A] flex flex-col text-white shadow-xl transition-all",
        menuCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-white/10 flex justify-between items-center">
        {!menuCollapsed && (
          <div>
            <h1 className="text-lg font-semibold tracking-wide mb-1">Imobiliária</h1>
            <p className="text-sm text-gray-300 italic">
              Olá, <span className="text-white font-medium">{userName}</span> 👋
            </p>
          </div>
        )}
        <button
          onClick={() => setMenuCollapsed(!menuCollapsed)}
          className="text-gray-400 hover:text-white text-lg p-1 rounded"
        >
          <i className={classNames(menuCollapsed ? "fa-solid fa-arrow-right" : "fa-solid fa-arrow-left")}></i>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.key} className="relative">
            <button
              onClick={() =>
                item.submenu ? toggleSubmenu(item.key) : navigate(item.path)
              }
              className={classNames(
                "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-all",
                isPrefixActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-800 hover:text-white"
              )}
            >
              <div className="flex items-center gap-4">
                <i className={`${item.icon} text-[18px]`}></i>
                {!menuCollapsed && <span>{item.label}</span>}
              </div>
              {!menuCollapsed && item.submenu && (
                <i
                  className={classNames(
                    "fa-solid fa-chevron-right text-xs transition-transform duration-200",
                    openMenu === item.key && "rotate-90"
                  )}
                ></i>
              )}
            </button>

            {item.submenu && openMenu === item.key && !menuCollapsed && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
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

      {/* Logout */}
      <div className="border-t border-white/10 px-4 py-3 mt-auto flex flex-col gap-2">
        <button
          onClick={logout}
          className="flex items-center gap-4 px-2 py-2 rounded-md text-gray-300 hover:bg-red-600 hover:text-white text-sm w-full text-left"
        >
          <i className="fa-solid fa-right-from-bracket"></i>
          {!menuCollapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}
