"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query.js";
import { tenantApi } from "../api/tenant.api.js";
import { toaster } from "@/components/ui/toaster.js";
import type { UpdateTenantDTO, Tenant } from "../types/tenant.enums.js";

// ═══════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Parâmetros da mutação de atualização de inquilino.
 * 
 * @remarks
 * Suporta tanto dados estruturados (DTO) quanto dados de formulário (FormData),
 * permitindo flexibilidade na origem dos dados de atualização.
 * 
 * @example
 * ```typescript
 * // Com DTO
 * updateTenant({ id: "123", data: { fullName: "João Silva" } });
 * 
 * // Com FormData (para uploads)
 * const formData = new FormData();
 * formData.append("fullName", "João Silva");
 * updateTenant({ id: "123", data: formData });
 * ```
 */
interface UpdateTenantParams {
  /** ID único do inquilino (MongoDB ObjectId ou UUID) */
  id: string;
  
  /** Dados de atualização (estruturados ou FormData para uploads) */
  data: UpdateTenantDTO | FormData;
}

/**
 * Contexto de rollback para estratégia de UI Otimista.
 * Armazena o estado anterior para restauração em caso de erro.
 * 
 * @internal
 */
interface RollbackContext {
  /** Lista completa de inquilinos antes da mutação */
  previousTenants?: Tenant[];
  
  /** Estado individual do inquilino antes da mutação */
  previousTenant?: Tenant;
}

// ═══════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

/** Chave base do cache React Query para inquilinos */
const TENANTS_QUERY_KEY = ["tenants"] as const;

/** Tempo de debounce para invalidação do cache (ms) */
const CACHE_INVALIDATION_DELAY = 100;

// ═══════════════════════════════════════════════════════════════════════
// HOOK
// ═══════════════════════════════════════════════════════════════════════

/**
 * Hook de mutação para atualização de inquilinos com estratégias avançadas.
 * 
 * @remarks
 * Implementa as seguintes estratégias profissionais:
 * - **UI Otimista**: Atualiza a interface antes da confirmação do servidor
 * - **Cache Granular**: Invalida apenas os dados necessários
 * - **Rollback Automático**: Restaura o estado anterior em caso de erro
 * - **Toast Contextual**: Notificações amigáveis com nome do inquilino
 * - **Type-safe**: Tipagem completa com TypeScript estrito
 * 
 * @example
 * ```typescript
 * function EditTenantForm({ tenantId }: Props) {
 *   const { mutate, isPending, isError } = useUpdateTenant();
 * 
 *   const handleSubmit = (formData: FormData) => {
 *     mutate({ id: tenantId, data: formData });
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <button disabled={isPending}>
 *         {isPending ? "Salvando..." : "Salvar"}
 *       </button>
 *     </form>
 *   );
 * }
 * ```
 * 
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/optimistic-updates | Optimistic Updates}
 * @returns Hook de mutação configurado com handlers de sucesso/erro
 */
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation<Tenant, Error, UpdateTenantParams, RollbackContext>({
    
    // ───────────────────────────────────────────────────────────────────
    // MUTATION FUNCTION
    // ───────────────────────────────────────────────────────────────────
    
    mutationFn: async ({ id, data }: UpdateTenantParams) => {
      return tenantApi.update(id, data);
    },

    // ───────────────────────────────────────────────────────────────────
    // OPTIMISTIC UPDATE (UI Otimista)
    // ───────────────────────────────────────────────────────────────────
    
    /**
     * Executa antes da mutação ser enviada ao servidor.
     * Atualiza o cache local para dar feedback instantâneo ao usuário.
     */
    onMutate: async ({ id, data }: UpdateTenantParams) => {
      // Cancela queries pendentes para evitar race conditions
      await queryClient.cancelQueries({ queryKey: TENANTS_QUERY_KEY });

      // Snapshot do estado atual (para rollback)
      const previousTenants = queryClient.getQueryData<Tenant[]>(TENANTS_QUERY_KEY);
      const previousTenant = queryClient.getQueryData<Tenant>([...TENANTS_QUERY_KEY, id]);

      // Atualiza cache otimisticamente (se data não for FormData)
      if (!(data instanceof FormData)) {
        queryClient.setQueryData<Tenant[]>(TENANTS_QUERY_KEY, (old) => {
          if (!old) return old;
          return old.map((tenant) =>
            tenant._id === id ? { ...tenant, ...data } : tenant
          );
        });
      }

      // Retorna contexto para rollback
      return { previousTenants, previousTenant };
    },

    // ───────────────────────────────────────────────────────────────────
    // SUCCESS HANDLER
    // ───────────────────────────────────────────────────────────────────
    
    /**
     * Executa quando a mutação é bem-sucedida.
     * Atualiza o cache com os dados confirmados do servidor.
     */
    onSuccess: (updatedTenant: Tenant) => {
      // Debounce para evitar múltiplas invalidações
      setTimeout(() => {
        // Invalida lista para refetch (garante consistência)
        queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });

        // Atualiza cache individual (granular)
        queryClient.setQueryData<Tenant>(
          [...TENANTS_QUERY_KEY, updatedTenant._id],
          updatedTenant
        );
      }, CACHE_INVALIDATION_DELAY);

      // Notificação de sucesso contextual
      toaster.create({
        title: "Atualização Concluída",
        description: `Os dados de ${updatedTenant.fullName} foram salvos com sucesso.`,
        type: "success",
        duration: 4000,
      });
    },

    // ───────────────────────────────────────────────────────────────────
    // ERROR HANDLER COM ROLLBACK
    // ───────────────────────────────────────────────────────────────────
    
    /**
     * Executa quando a mutação falha.
     * Restaura o estado anterior (rollback) e notifica o usuário.
     */
    onError: (error: any, _variables, context?: RollbackContext) => {
      // Rollback: Restaura estado anterior
      if (context?.previousTenants) {
        queryClient.setQueryData<Tenant[]>(
          TENANTS_QUERY_KEY,
          context.previousTenants
        );
      }

      // Mensagem de erro do servidor ou fallback genérico
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Não foi possível conectar ao servidor. Verifique sua conexão.";

      // Notificação de erro detalhada
      toaster.create({
        title: "Falha na Atualização",
        description: errorMessage,
        type: "error",
        duration: 6000,
      });

      // Log estruturado para debugging (apenas em desenvolvimento)
      if (import.meta.env.DEV) {
        console.error("[useUpdateTenant] Erro na mutação:", {
          error,
          timestamp: new Date().toISOString(),
          context,
        });
      }
    },

    // ───────────────────────────────────────────────────────────────────
    // CLEANUP (sempre executa, sucesso ou erro)
    // ───────────────────────────────────────────────────────────────────
    
    /**
     * Executa após sucesso ou erro.
     * Garante que o cache seja eventualmente consistente.
     */
    onSettled: () => {
      // Invalidação final para garantir sincronização
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
    },
  });
};

// ═══════════════════════════════════════════════════════════════════════
// EXPORTS AUXILIARES
// ═══════════════════════════════════════════════════════════════════════

/**
 * Type guard para verificar se os dados são FormData.
 * Útil para lógica condicional em componentes.
 * 
 * @example
 * ```typescript
 * if (isFormData(data)) {
 *   // Trata como upload de arquivo
 * } else {
 *   // Trata como JSON estruturado
 * }
 * ```
 */
export const isFormData = (data: UpdateTenantDTO | FormData): data is FormData => {
  return data instanceof FormData;
};

/**
 * Re-exporta tipos para conveniência.
 * Permite importar tudo de um único lugar.
 */
export type { UpdateTenantParams, RollbackContext };