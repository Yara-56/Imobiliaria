import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { ROLES } from "../auth/roles";

import AdminLayout from "../../layouts/AdminLayout";
import HomePage from "../../pages/public/HomePage";
import Dashboard from "../../pages/admin/Home";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.CORRETOR,
                  ROLES.FINANCEIRO,
                ]}
              />
            }
          >
            <Route
              path="dashboard"
              element={<Dashboard />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
