"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { propertiesApi } from "../api/properties.api";
import type { PropertyUI } from "../types/property";

export const useProperties = (initialFilters = { page: 1, limit: 10 }) => {
  const [properties, setProperties] = useState<PropertyUI[]>([]);
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
      const data = await propertiesApi.list(filters, controller.signal);
      setProperties(data);
      setError(null);
    } catch (err: any) {
      if (err?.name !== "AbortError" && err?.name !== "CanceledError") {
        setError("Erro ao carregar imóveis.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createProperty = async (data: Partial<PropertyUI>, files: File[] = []) => {
    setIsSubmitting(true);
    try {
      const result = await propertiesApi.create(data, files);
      toaster.create({ title: "Imóvel cadastrado com sucesso!", type: "success" });
      await fetchProperties();
      return result;
    } catch (err) {
      toaster.create({ title: "Erro ao salvar imóvel", type: "error" });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProperty = async (id: string, data: Partial<PropertyUI>, files: File[] = []) => {
    setIsSubmitting(true);
    try {
      const result = await propertiesApi.update(id, data, files);
      toaster.create({ title: "Imóvel atualizado com sucesso!", type: "success" });
      await fetchProperties();
      return result;
    } catch (err) {
      toaster.create({ title: "Erro ao atualizar imóvel", type: "error" });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeProperty = async (id: string) => {
    try {
      await propertiesApi.delete(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
      toaster.create({ title: "Imóvel removido", type: "success" });
    } catch {
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
    updateProperty,
    removeProperty,
  };
};