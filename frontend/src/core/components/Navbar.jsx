import { LogOut, User } from "lucide-react";
import useAuth from "@/features/auth/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold tracking-tight">
        Imobiliária <span className="text-indigo-500">Premium</span>
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <User size={16} />
          {user?.name}
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
