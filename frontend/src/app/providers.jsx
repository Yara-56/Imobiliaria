import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../core/auth/context/AuthContext";

export default function Providers({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}
