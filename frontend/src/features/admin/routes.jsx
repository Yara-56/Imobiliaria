import PropertiesList from "./pages/PropertiesList";
import PropertyForm from "./pages/PropertyForm";
import PropertyEdit from "./pages/PropertyEdit";
import PropertyDetails from "./pages/PropertyDetails";

export default [
  { path: "imoveis", element: <PropertiesList /> },
  { path: "imoveis/novo", element: <PropertyForm /> },
  { path: "imoveis/editar/:id", element: <PropertyEdit /> },
  { path: "imoveis/:id", element: <PropertyDetails /> },
];
