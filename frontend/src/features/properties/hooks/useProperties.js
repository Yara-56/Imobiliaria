import { useState, useCallback, useEffect, useRef } from "react";
import { propertyService } from "../../../services/propertyService";

export const useProperties = (initialFilters = { page: 1, limit: 10 }) => {
// --- Estados de Dados ---
const [properties, setProperties] = useState([]);
const [pagination, setPagination] = useState({
page: 1,
limit: 10,
total: 0,
lastPage: 1,
});
const [filters, setFilters] = useState(initialFilters);

// --- Estados de UI ---
const [isLoading, setIsLoading] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState(null);

// Ref para cancelar requisições em andamento
const abortControllerRef = useRef(null);

// --- BUSCAR IMÓVEIS (GET) ---
const fetchProperties = useCallback(async (customParams = {}) => {
if (abortControllerRef.current) {
abortControllerRef.current.abort();
}
const controller = new AbortController();
abortControllerRef.current = controller;

}, [filters]);

// --- HELPER GENÉRICO DE MUTAÇÃO ---
const executeMutation = async (mutationFn, options = {}) => {
setIsSubmitting(true);
setError(null);
try {
const result = await mutationFn();
if (options.onSuccess) {
options.onSuccess(result);
}
return result;
} catch (err) {
console.error("Erro na mutação:", err);
const msg = err.response?.data?.message || "Ocorreu um erro ao processar a operação.";
setError(msg);
if (options.onError) {
options.onError(msg);
}
throw err;
} finally {
setIsSubmitting(false);
}
};

// --- AÇÕES PÚBLICAS (CRUD) ---

const createProperty = (data, files = [], options = {}) => {
return executeMutation(
() => propertyService.create(data, files),
{
...options,
onSuccess: (result) => {
fetchProperties();
if (options.onSuccess) options.onSuccess(result);
}
}
);
};

const updateProperty = (id, data, files = [], options = {}) => {
return executeMutation(
() => propertyService.update(id, data, files),
{
...options,
onSuccess: (result) => {
fetchProperties();
if (options.onSuccess) options.onSuccess(result);
}
}
);
};

const removeProperty = (id, options = {}) => {
return executeMutation(
() => propertyService.delete(id),
{
...options,
onSuccess: (result) => {
setProperties((prev) => prev.filter((p) => p.id !== id));
if (options.onSuccess) options.onSuccess(result);
}
}
);
};

const addDocs = (id, files, options = {}) => {
return executeMutation(
() => propertyService.addDocuments(id, files),
{
...options,
onSuccess: (result) => {
fetchProperties();
if (options.onSuccess) options.onSuccess(result);
}
}
);
};

const removeDoc = (id, docId, options = {}) => {
return executeMutation(
() => propertyService.deleteDocument(id, docId),
{
...options,
onSuccess: (result) => {
fetchProperties();
if (options.onSuccess) options.onSuccess(result);
}
}
);
};

// --- LIFECYCLE ---
useEffect(() => {
fetchProperties();
return () => {
if (abortControllerRef.current) {
abortControllerRef.current.abort();
}
};
}, [fetchProperties]);

return {
properties,
pagination,
filters,
isLoading,
isSubmitting,
error,
setFilters,
setPagination,
refresh: fetchProperties,
createProperty,
updateProperty,
removeProperty,
addDocs,
removeDoc
};
};