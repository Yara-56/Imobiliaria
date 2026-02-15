import { Route } from "react-router-dom";
import { lazy } from "react";

const LoginPage = lazy(() => import("./pages/LoginPage"));

export function AuthRoutes() {
  return (
    <>
      <Route path="/login" element={<LoginPage />} />
    </>
  );
}
