import { useRoutes } from "react-router-dom";
import PublicRoutes from "../../features/public/routes";
import AdminRoutes from "../../features/admin/routes";

export default function Router() {
  return useRoutes([...PublicRoutes, ...AdminRoutes]);
}
