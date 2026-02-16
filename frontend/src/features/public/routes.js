import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Unauthorized from "./pages/Unauthorized";

const PublicRoutes = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
];

export default PublicRoutes;
