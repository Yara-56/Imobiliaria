"use client";

import { useQuery } from "@tanstack/react-query";

// No arquivo usePropertyInsights.tsx
import { propertyInsightsApi } from "../api/property-insights.api"; // ✅ IMPORTAÇÃO CORRETA
import { propertyInsightsKeys } from "../keys/property-insights.keys"; 
import type { PropertyInsights } from "../types/property-insights.types";

export const usePropertyInsights = () => {
  const query = useQuery<PropertyInsights>({
    queryKey: propertyInsightsKeys.list(),
    queryFn: () => propertyInsightsApi.get(),
    staleTime: 1000 * 60 * 3, // 3 minutos
    retry: 1,
  });

  return {
    insights: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};