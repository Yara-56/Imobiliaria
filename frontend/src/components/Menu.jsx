import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import "../styles/modules/Menu.scss";

export default function Menu() {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [menuOpen, setMenuOpen] = useState(true);

  const toggleSubmenu = (menu) => {
    setOpenSubmenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { key: "inicio", icon: "fa-house", label: "Início", path: "/inicio" },
    {
      key: "inquilino",
      icon: "fa-users",
      label: "Inquilino",
      submenu: [{ to: "/novo-inquilino", label: "🧑‍💼 Novo Inquilino" }],
    },
    {
      key: "pagamentos",
      icon: "fa-dollar-sign",
      label: "Pagamento",
      submenu: [
        { to: "/pagamento", label: "💸 Realizar Pagamento" },
        { to: "/historico-pagamentos", label: "📜 Histórico" },
      ],
    },
    {
      key: "contrato",
      icon: "fa-file-contract",
      label: "Contratos",
      submenu: [
        { to: "/contratos", label: "📑 Listar Contratos" },
        { to: "/modelos", label: "📂 Modelos de Contrato" },
      ],
    },
    {
      key: "imoveis",
      icon: "fa-building",
      label: "Imóveis",
      submenu: [{ to: "/novo-imovel", label: "🏠 Novo Imóvel" }],
    },
    {
      key: "relatorios",
      icon: "fa-chart-pie",
      label: "Relatórios",
      submenu: [
        { to: "/relatorio-pagamentos", label: "📊 Pagamentos" },
        { to: "/relatorio-contratos", label: "📄 Contratos" },
        { to: "/relatorio-inquilinos", label: "🧑‍💼 Inquilinos" },
      ],
    },
  ];

  return (
    <div className={classNames("menu-container", { collapsed: !menuOpen })}>
      <div className="menu-header">
        {menuOpen && (
          <div className="user-info">
            <img
              src="https://via.placeholder.com/40"
              alt="User"
              className="user-avatar"
            />
            <span className="user-name">Cleia Maria</span>
          </div>
        )}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <i className={`fa-solid ${menuOpen ? "fa-angle-left" : "fa-bars"}`}></i>
        </button>
      </div>

      <div className="menu-section">
        {menuItems.map((item) => (
          <div key={item.key} className="menu-group">
            {item.submenu ? (
              <>
                <div
                  className="menu-label"
                  onClick={() => toggleSubmenu(item.key)}
                >
                  <i className={`fa-solid ${item.icon}`}></i>
                  {menuOpen && <span>{item.label}</span>}
                  {menuOpen && (
                    <i
                      className={`fa-solid ${
                        openSubmenus[item.key] ? "fa-angle-up" : "fa-angle-down"
                      } arrow`}
                    ></i>
                  )}
                </div>
                {menuOpen && openSubmenus[item.key] && (
                  <div className="submenu open">
                    {(item.submenu || []).map((sub) => (
                      <Link key={sub.to} to={sub.to} className="menu-item">
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className={classNames("menu-item", {
                  active: isActive(item.path),
                })}
              >
                <i className={`fa-solid ${item.icon}`}></i>
                {menuOpen && <span>{item.label}</span>}
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="menu-footer">
        <Link to="/configuracoes" className="menu-item">
          <i className="fa-solid fa-gear"></i>
          {menuOpen && <span>Configurações</span>}
        </Link>
        <Link to="/ajuda" className="menu-item">
          <i className="fa-solid fa-circle-question"></i>
          {menuOpen && <span>Ajuda</span>}
        </Link>
      </div>
    </div>
  );
}
