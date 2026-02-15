import { NavLink } from "react-router-dom";
import { LayoutDashboard, Building2, Users } from "lucide-react";

export default function Sidebar() {
  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all";

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 hidden md:block">
      <nav className="space-y-2">

        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/imoveis"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          <Building2 size={18} />
          Imóveis
        </NavLink>

        <NavLink
          to="/admin/clientes"
          className={({ isActive }) =>
            `${linkClass} ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:bg-slate-800"
            }`
          }
        >
          <Users size={18} />
          Clientes
        </NavLink>

      </nav>
    </aside>
  );
}
