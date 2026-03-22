import {
  LuHouse,
  LuUsers,
  LuFileText,
  LuScan,
  LuShieldCheck,
  LuSettings,
  LuBadgeCheck,
  LuBuilding2,
  LuWallet,
  LuChartColumn,
  LuBrain,
} from "react-icons/lu";

export const HomeFluxSidebar = [
  {
    title: "Geral",
    items: [
      {
        name: "Dashboard",
        icon: LuHouse,
        path: "/",
      },
    ],
  },

  {
    title: "Gestão",
    items: [
      {
        name: "Locatários",
        icon: LuUsers,
        path: "/tenants",
        children: [
          { name: "Todos os Locatários", path: "/tenants" },
          { name: "Novo Locatário", path: "/tenants/new" },
        ],
      },
      {
        name: "Contratos",
        icon: LuFileText,
        path: "/contracts",
      },
      {
        name: "Documentos",
        icon: LuScan,
        path: "/documents",
      },
      {
        name: "Propriedades",
        icon: LuBuilding2,
        path: "/properties",
      },
    ],
  },

  {
    title: "Relatórios",
    items: [
      {
        name: "Painel",
        icon: LuChartColumn,
        path: "/reports",
      },
      {
        name: "Financeiro",
        icon: LuWallet,
        path: "/reports/finance",
        children: [
          {
            name: "Contas a Receber",
            path: "/reports/finance/accounts-receivable",
          },
          {
            name: "Pagamentos Atrasados",
            path: "/reports/finance/late-payments",
          },
        ],
      },
      {
        name: "Contratos",
        icon: LuFileText,
        path: "/reports/contracts",
        children: [
          { name: "A Vencer", path: "/reports/contracts/expiring" },
          { name: "Renovações", path: "/reports/contracts/renewal" },
        ],
      },
      {
        name: "Locatários",
        icon: LuUsers,
        path: "/reports/tenants",
        children: [
          { name: "Score Inteligente", path: "/reports/tenants/score" },
        ],
      },
      {
        name: "IA & Insights",
        icon: LuBrain,
        path: "/reports/intelligence",
        children: [
          { name: "Previsões", path: "/reports/intelligence/predictions" },
        ],
      },
    ],
  },

  {
    title: "Sistema",
    items: [
      {
        name: "Validação",
        icon: LuBadgeCheck,
        path: "/validation",
      },
      {
        name: "Segurança",
        icon: LuShieldCheck,
        path: "/security",
      },
      {
        name: "Configurações",
        icon: LuSettings,
        path: "/settings",
      },
    ],
  },
];