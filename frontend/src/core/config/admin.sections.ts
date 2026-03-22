import {
    LuLayoutDashboard,
    LuHouse,
    LuPenLine,
    LuUsers,
    LuWallet,
  } from "react-icons/lu";
  
  export const AdminSections = [
    {
      title: "Painel",
      items: [
        { name: "Dashboard", icon: LuLayoutDashboard, path: "/admin/dashboard" },
      ],
    },
  
    {
      title: "Gestão",
      items: [
        { name: "Imóveis", icon: LuHouse, path: "/admin/properties" },
        { name: "Contratos", icon: LuPenLine, path: "/admin/contracts" },
        { name: "Inquilinos", icon: LuUsers, path: "/admin/tenants" },
        { name: "Financeiro", icon: LuWallet, path: "/admin/payments" },
      ],
    },
  ];