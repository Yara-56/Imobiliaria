import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { listTenants } from "../services/tenantService";
import { faUsers, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Tenants() {
  const [tenantList, setTenantList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar dados
  async function fetchTenants() {
    try {
      setLoading(true);
      setError(null);
      // O 'listTenants' precisa buscar dados novos
      const data = await listTenants();
      setTenantList(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // EFEITO 1: Para lidar com o refresh vindo da edição/exclusão
  // (Este efeito lida com a flag 'refresh' quando ela está presente)
  useEffect(() => {
    // 1. Verifica se a flag 'refresh' foi enviada
    if (location.state && location.state.refresh) {
      // 2. Limpa o 'state' da rota IMEDIATAMENTE
      // Isso é crucial para que o Efeito 2 saiba que não precisa rodar
      navigate(location.pathname, { replace: true, state: {} });

      // 3. Adiciona um pequeno atraso (setTimeout)
      // Isso resolve problemas de cache ou race conditions de DB.
      setTimeout(() => {
        fetchTenants();
      }, 250); // 250ms
    }
  }, [location.state, navigate, location.pathname]);

  // EFEITO 2: Para o carregamento inicial (NA MONTAGEM)
  // --- A GRANDE MUDANÇA ESTÁ AQUI ---
  useEffect(() => {
    // 4. SÓ executa o fetch inicial SE
    // o location.state ESTIVER LIMPO (ou seja, não estamos vindo de um refresh)
    if (!location.state || !location.state.refresh) {
      fetchTenants();
    }
  }, []); // Array vazio garante que rode só uma vez na montagem

  const filteredTenants = tenantList.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-6">Inquilinos Cadastrados</h1>

      {/* Barra de Busca e Botão */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <input
          type="text"
          placeholder="Buscar por Nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-[280px] px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-600"
        />
        <button
          onClick={() => navigate("/new-tenant")}
          className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Adicionar Novo Inquilino
        </button>
      </div>

      {/* Tabela de Dados */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-sm p-4">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold border-b">
                Nome
              </th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold border-b">
                CPF
              </th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold border-b">
                E-mail
              </th>
              <th className="text-left py-3 px-4 text-gray-700 font-semibold border-b">
                Telefone
              </th>
              <th className="text-center py-3 px-4 text-gray-700 font-semibold border-b">
                Detalhes
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  Carregando inquilinos...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-red-600">
                  Erro ao carregar: {error}
                </td>
              </tr>
            )}
            {!loading && !error && filteredTenants.length === 0 && (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  Nenhum inquilino encontrado.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              filteredTenants.map((tenant) => (
                <tr
                  key={tenant._id}
                  className="hover:bg-gray-50 transition border-b last:border-b-0"
                >
                  <td className="py-3 px-4 text-gray-800">{tenant.name}</td>
                  <td className="py-3 px-4 text-gray-800">{tenant.cpf}</td>
                  <td className="py-3 px-4 text-gray-800">
                    {tenant.email || "—"}
                  </td>
                  <td className="py-3 px-4 text-gray-800">
                    {tenant.phone || "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/tenants/${tenant._id}`);
                      }}
                      className="text-gray-600 hover:text-blue-700 transition"
                      title="Ver Detalhes"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
