import React, { FC, ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-inter">
      <aside className="w-64 bg-slate-900 p-6 border-r border-slate-800">
        Sidebar admin
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default AdminLayout;