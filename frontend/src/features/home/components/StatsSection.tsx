import { Container, SimpleGrid } from "@chakra-ui/react";
// Ajuste o caminho abaixo se o arquivo físico estiver em outro local
import { StatModule } from "@/features/dashboard/components/StatModule";

/**
 * StatsSection - Exibe métricas rápidas no estilo Dashboard.
 * Atualizado para Chakra UI v3 (gap) e TypeScript moderno.
 */
export const StatsSection = () => {
  return (
    <Container maxW="6xl" py={{ base: 16, md: 24 }}>
      {/* CORREÇÃO: 'spacing' alterado para 'gap' para Chakra UI v3 */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
        <StatModule 
          label="Imóveis Ativos" 
          value="128" 
          trend="+4" 
          icon="/icons/home.svg" 
          color="#3B82F6" 
        />
        <StatModule 
          label="Inquilinos" 
          value="52" 
          trend="+2" 
          icon="/icons/users.svg" 
          color="#8B5CF6" 
        />
        <StatModule 
          label="Receita" 
          value="R$ 184k" 
          trend="+12.5%" 
          icon="/icons/dollar.svg" 
          color="#10B981" 
        />
      </SimpleGrid>
    </Container>
  );
};