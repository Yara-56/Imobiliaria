import React, { FC, ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-inter">
      <header className="p-6 border-b border-slate-800">Logo / Navbar</header>
      <main className="p-6">{children}</main>
      <footer className="p-6 border-t border-slate-800 text-center text-slate-400">
        © 2026 ImobiSys
      </footer>
    </div>
  );
};

export default MainLayout;