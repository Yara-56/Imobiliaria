// hooks/useTenantForm.ts

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  tenantFormSchema, 
  type TenantFormInput,
  DEFAULT_TENANT_VALUES 
} from "../schemas/tenant.schema";

export const useTenantForm = () => {
  const form = useForm<TenantFormInput>({
    resolver: zodResolver(tenantFormSchema),
    mode: "onChange",
    defaultValues: DEFAULT_TENANT_VALUES,
  });

  return {
    ...form,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
  };
};