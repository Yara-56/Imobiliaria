import { Box, Flex, Heading, Text, Stack } from "@chakra-ui/react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  count: string | number;
  icon: ReactNode;
  color: string;
}

export const StatCard = ({ title, count, icon, color }: StatCardProps) => (
  <Box 
    p={6} 
    bg="white" 
    borderRadius="24px" 
    border="1px solid" 
    borderColor="gray.100" 
    shadow="sm"
    transition="all 0.2s"
    _hover={{ shadow: "md", transform: "translateY(-2px)" }}
  >
    <Flex align="center" gap={4}>
      <Box p={3} bg={`${color}.50`} color={`${color}.600`} borderRadius="xl">
        {icon}
      </Box>
      <Stack gap={0}>
        <Text fontSize="xs" color="gray.500" fontWeight="bold" textTransform="uppercase" letterSpacing="wider">
          {title}
        </Text>
        <Heading size="md" color="gray.800" fontWeight="black">{count}</Heading>
      </Stack>
    </Flex>
  </Box>
);