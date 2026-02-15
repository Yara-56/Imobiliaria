import { Link } from "react-router-dom";
import Button from "@/shared/ui/Button";

export default function Header() {
  return (
    <header className="fixed w-full z-50 backdrop-blur bg-slate-950/70 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">

        <Link to="/" className="font-bold text-xl">
          Imobi<span className="text-indigo-500">Sys</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-slate-400">
          <a href="#features">Funcionalidades</a>
          <a href="#benefits">Benefícios</a>
        </nav>

        <Button>Entrar</Button>

      </div>
    </header>
  );
}