import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-900 text-white p-4">
        Admin
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
