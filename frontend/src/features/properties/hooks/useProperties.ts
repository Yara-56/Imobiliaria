"use client";

import { useState, useCallback, useEffect, useRef } from "react";
// ✅ Importação absoluta usando o alias configurado no seu projeto
import { propertyService } from "@/features/properties/services/propertyService";
import { toaster } from "@/components/ui/toaster";

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  status: "Disponível" | "Alugado" | "Vendido" | "Manutenção";
  tenantId: string;
  description?: string;
  type: "Casa" | "Apartamento" | "Comercial" | "Terreno";
  images?: string[];
}

export const useProperties = (initialFilters = { page: 1, limit: 10 }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState(initialFilters);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProperties = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      const data = await propertyService.list(filters, controller.signal);
      setProperties(data);
      setError(null);
    } catch (err: any) {
      if (err.name !== "CanceledError") {
        setError("Erro ao carregar imóveis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createProperty = async (data: Partial<Property>, files: File[] = []) => {
    setIsSubmitting(true);
    try {
      const result = await propertyService.create(data, files);
      toaster.create({ title: "Imóvel cadastrado com sucesso!", type: "success" });
      await fetchProperties();
      return result;
    } catch (err: any) {
      toaster.create({ title: "Erro ao salvar imóvel", type: "error" });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeProperty = async (id: string) => {
    try {
      await propertyService.delete(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toaster.create({ title: "Imóvel removido", type: "success" });
    } catch (err) {
      toaster.create({ title: "Erro ao excluir", type: "error" });
    }
  };

  useEffect(() => {
    fetchProperties();
    return () => abortControllerRef.current?.abort();
  }, [fetchProperties]);

  return {
    properties,
    isLoading,
    isSubmitting,
    error,
    filters,
    setFilters,
    refresh: fetchProperties,
    createProperty,
    removeProperty,
  };
};