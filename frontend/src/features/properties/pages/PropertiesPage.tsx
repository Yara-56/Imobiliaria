import { 
    Box, Flex, Heading, Text, SimpleGrid, Input, Button, Badge, Image, Stack 
  } from "@chakra-ui/react";
  import { LuPlus, LuSearch, LuMapPin, LuBed, LuMaximize, LuExternalLink } from "react-icons/lu";
  
  export default function PropertiesPage() {
    // Dados mockados para o visual "uau"
    const properties = [
      {
        id: 1,
        title: "Edifício Horizon - Ap 402",
        address: "Av. Beira Mar, 1200 - Centro",
        price: "R$ 4.500/mês",
        specs: { beds: 3, size: "120m²" },
        status: "Disponível",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop"
      },
      {
        id: 2,
        title: "Casa Condomínio Solar",
        address: "Rua das Palmeiras, 45 - Barra",
        price: "R$ 8.200/mês",
        specs: { beds: 4, size: "350m²" },
        status: "Alugado",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop"
      }
    ];
  
    return (
      <Box>
        <Flex justify="space-between" align="flex-end" mb={8}>
          <Stack gap={1}>
            <Heading size="xl" fontWeight="black">Patrimônio Imobiliário</Heading>
            <Text color="gray.500">Gerencie e visualize sua carteira de imóveis.</Text>
          </Stack>
          <Button colorPalette="blue" size="lg" borderRadius="xl" gap={2}>
            <LuPlus /> Cadastrar Imóvel
          </Button>
        </Flex>
  
        {/* Barra de Busca Premium */}
        <Box mb={10} position="relative">
          <Flex align="center" position="absolute" left={4} h="full" color="gray.400">
            <LuSearch />
          </Flex>
          <Input 
            placeholder="Buscar por nome, bairro ou código..." 
            pl="44px"
            size="lg"
            bg="white"
            borderRadius="xl"
            shadow="sm"
            border="1px solid"
            borderColor="gray.200"
          />
        </Box>
  
        <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={8}>
          {properties.map((p) => (
            <Box 
              key={p.id} 
              bg="white" 
              borderRadius="3xl" 
              overflow="hidden" 
              shadow="sm" 
              border="1px solid" 
              borderColor="gray.100"
              transition="all 0.3s"
              _hover={{ shadow: "xl", transform: "translateY(-5px)" }}
            >
              <Box position="relative">
                <Image src={p.image} w="full" h="200px" objectFit="cover" />
                <Badge 
                  position="absolute" top={4} right={4} 
                  colorPalette={p.status === "Disponível" ? "green" : "gray"}
                  variant="solid" borderRadius="full" px={3}
                >
                  {p.status}
                </Badge>
              </Box>
  
              <Stack p={6} gap={4}>
                <Stack gap={1}>
                  <Heading size="md" color="gray.800">{p.title}</Heading>
                  <Flex align="center" gap={1} color="gray.500" fontSize="xs">
                    <LuMapPin size={14} /> {p.address}
                  </Flex>
                </Stack>
  
                <Flex gap={4} py={2} borderY="1px solid" borderColor="gray.50">
                  <Flex align="center" gap={1} fontSize="sm" color="gray.600">
                    <LuBed size={16} /> {p.specs.beds} Quartos
                  </Flex>
                  <Flex align="center" gap={1} fontSize="sm" color="gray.600">
                    <LuMaximize size={16} /> {p.specs.size}
                  </Flex>
                </Flex>
  
                <Flex align="center" justify="space-between">
                  <Text fontWeight="black" fontSize="lg" color="blue.600">{p.price}</Text>
                  <Button variant="ghost" size="sm" color="blue.500" gap={1}>
                    Ver Detalhes <LuExternalLink size={14} />
                  </Button>
                </Flex>
              </Stack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    );
  }