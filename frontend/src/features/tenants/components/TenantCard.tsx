import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import { Tenant } from "../types/tenant";

interface TenantCardProps {
  tenant: Tenant;
  onDelete: (id: string) => void;
}

export default function TenantCard({ tenant, onDelete }: TenantCardProps) {
  return (
    <Box bg="white" p={6} borderRadius="2xl" shadow="sm">
      <Heading size="md">{tenant.name}</Heading>

      <Text color="gray.500">{tenant.email}</Text>
      <Text color="gray.500">{tenant.phone}</Text>

      <Flex mt={4} justify="flex-end" gap={2}>
        <Button size="sm" variant="outline">
          Editar
        </Button>

        <Button
          size="sm"
          colorPalette="red"
          onClick={() => onDelete(tenant._id)}
        >
          Excluir
        </Button>
      </Flex>
    </Box>
  );
}
