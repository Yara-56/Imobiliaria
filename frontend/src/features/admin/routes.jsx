import { lazy } from "react";
import ProtectedRoute from "@/core/guards/ProtectedRoute";
import AdminLayout from "@/core/layouts/AdminLayout";

const Dashboard = lazy(() =>
  import("@/features/dashboard/pages/Dashboard")
);

const AdminRoutes = [
  {
    element: (
      <ProtectedRoute allowedRoles={["ADMIN", "OWNER"]} />
    ),
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "/admin/dashboard",
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
];

export default AdminRoutes;
