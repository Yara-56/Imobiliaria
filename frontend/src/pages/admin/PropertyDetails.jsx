// src/pages/admin/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../../services/propertyService";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusLabel = {
    Available: "Disponível",
    Occupied: "Ocupado",
    "Under Maintenance": "Manutenção",
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar os dados do imóvel.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) return <div className="p-6">Carregando detalhes do imóvel...</div>;
  if (error) return (
    <div className="p-6">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/admin/imoveis" className="text-blue-600 hover:underline">
        Voltar para a lista
      </Link>
    </div>
  );
  if (!property) return (
    <div className="p-6">
      <p>Imóvel não encontrado.</p>
      <Link to="/admin/imoveis" className="text-blue-600 hover:underline">
        Voltar para a lista
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Detalhes do Imóvel</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div><strong>SQLS:</strong> {property.sqls || "-"}</div>
        <div><strong>CEP:</strong> {property.cep || "-"}</div>
        <div><strong>Rua:</strong> {property.street || "-"}</div>
        <div><strong>Bairro:</strong> {property.bairro || "-"}</div>
        <div><strong>Cidade:</strong> {property.city || "-"}</div>
        <div><strong>Estado:</strong> {property.state || "-"}</div>
        <div><strong>Status:</strong> {statusLabel[property.status] ?? property.status ?? "-"}</div>
        <div><strong>Número:</strong> {property.number || "-"}</div>
      </div>
      <Link to="/admin/imoveis" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Voltar para a lista
      </Link>
    </div>
  );
}
