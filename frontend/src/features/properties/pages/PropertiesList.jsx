import { useState } from "react";
import { Link } from "react-router-dom";
import { useProperties } from "../hooks/useProperties";

export const PropertiesList = () => {
const {
properties,
pagination,
filters,
setFilters,
isLoading,
error,
removeProperty
} = useProperties();

const handleSearch = (e) => {
setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
};

const handlePageChange = (newPage) => {
setFilters(prev => ({ ...prev, page: newPage }));
};

const handleDelete = (id) => {
if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
removeProperty(id, {
onSuccess: () => alert("Imóvel excluído com sucesso!"),
onError: (msg) => alert("Erro ao excluir: " + msg)
});
}
};

const formatCurrency = (value) => {
return new Intl.NumberFormat('pt-BR', {
style: 'currency',
currency: 'BRL'
}).format(value);
};

return (
<div className="p-6 bg-gray-50 min-h-screen">
  <h1 className="text-2xl font-bold mb-4">Lista de Imóveis</h1>
  {isLoading && <p>Carregando...</p>}
  {error && <p className="text-red-500">Erro: {error}</p>}
  {!isLoading && !error && properties.length === 0 && <p>Nenhum imóvel encontrado.</p>}
  {!isLoading && !error && properties.length > 0 && (
	<ul>
	  {properties.map(property => (
		<li key={property.id} className="mb-4">
		  <h2 className="text-xl font-semibold">{property.name}</h2>
		  <p>Preço: {formatCurrency(property.price)}</p>
		  <p>Localização: {property.location}</p>
		  <div className="flex gap-2 mt-2">
			<Link to={`/properties/${property.id}`} className="text-blue-500">Detalhes</Link>
			<button
			  onClick={() => handleDelete(property.id)}
			  className="text-red-500"
			>
			  Excluir
			</button>
		  </div>
		</li>
	  ))}
	</ul>
  )}
  <div className="mt-4">
	{pagination && pagination.totalPages > 1 && (
	  <div className="flex gap-2">
		{Array.from({ length: pagination.totalPages }, (_, index) => (
		  <button
			key={index}
			onClick={() => handlePageChange(index + 1)}
			className={`px-4 py-2 ${pagination.currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
		  >
			{index + 1}
		  </button>
		))}
	  </div>
	)}
  </div>
</div>
);
};