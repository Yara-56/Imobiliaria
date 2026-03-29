import React, { useMemo, useState } from "react";
import {
  Box,
  Stack,
  Input,
  Text,
  Button,
  Image,
  SimpleGrid,
  Spinner
} from "@chakra-ui/react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
  address: z.string().min(1, "Endereço obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  neighborhood: z.string().min(1, "Bairro obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().min(2, "UF obrigatória"),
  zipCode: z.string().min(8, "CEP obrigatório")
});

type FormData = z.infer<typeof schema>;

interface PropertyCreateFormProps {
  contractTemplate: { price: number };
  googleKey: string;
  onSubmit: (data: FormData & { price: number }) => void;
}

export function PropertyCreateFormPRO({
  contractTemplate,
  googleKey,
  onSubmit
}: PropertyCreateFormProps) {
  const [fetchingCEP, setFetchingCEP] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const address = watch("address");
  const city = watch("city");
  const state = watch("state");

  const mapUrl = useMemo(() => {
    if (!address || !city || !state) return "";
    const full = `${address}, ${city}, ${state}`;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
      full
    )}&zoom=16&size=600x400&maptype=roadmap&markers=color:red|${encodeURIComponent(
      full
    )}&key=${googleKey}`;
  }, [address, city, state, googleKey]);

  async function handleCEP(cep: string) {
    if (!cep || cep.length < 8) return;
    try {
      setFetchingCEP(true);
      const clean = cep.replace(/\D/g, "");
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();

      if (!data.erro) {
        setValue("address", data.logradouro || "");
        setValue("neighborhood", data.bairro || "");
        setValue("city", data.localidade || "");
        setValue("state", data.uf || "");
      }
    } finally {
      setFetchingCEP(false);
    }
  }

  function submit(data: FormData) {
    onSubmit({ ...data, price: contractTemplate.price });
  }

  return (
    <Box
      p={6}
      rounded="lg"
      borderWidth="1px"
      borderColor="gray.300"
      maxW="720px"
      mx="auto"
      bg="white"
    >
      <form onSubmit={handleSubmit(submit)}>
        <Stack gap={6}>
          {/* 📌 TÍTULO */}
          <Box>
            <Text mb={1} fontWeight="600">
              Título do imóvel
            </Text>
            <Input placeholder="Ex: Casa ampla com 3 quartos" {...register("title")} />
            {errors.title && (
              <Text mt={1} fontSize="sm" color="red.500">
                {errors.title.message}
              </Text>
            )}
          </Box>

          {/* 📌 DESCRIÇÃO */}
          <Box>
            <Text mb={1} fontWeight="600">
              Descrição
            </Text>
            <Input placeholder="Resumo do imóvel..." {...register("description")} />
          </Box>

          {/* 📌 CEP */}
          <SimpleGrid columns={2} gap={4}>
            <Box>
              <Text mb={1} fontWeight="600">
                CEP
              </Text>
              <Input
                placeholder="00000-000"
                {...register("zipCode")}
                onBlur={(e) => handleCEP(e.target.value)}
              />
              {errors.zipCode && (
                <Text mt={1} fontSize="sm" color="red.500">
                  {errors.zipCode.message}
                </Text>
              )}
            </Box>

            <Box flex={1} display="flex" alignItems="center">
            {fetchingCEP && (
             <Spinner size="lg" color="blue.500" />
             )}
            </Box>
          </SimpleGrid>

          {/* 📌 ENDEREÇO */}
          <SimpleGrid columns={2} gap={4}>
            <Box>
              <Text mb={1} fontWeight="600">
                Endereço
              </Text>
              <Input placeholder="Rua / Avenida" {...register("address")} />
              {errors.address && (
                <Text mt={1} fontSize="sm" color="red.500">
                  {errors.address.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb={1} fontWeight="600">
                Número
              </Text>
              <Input placeholder="Ex: 123" {...register("number")} />
              {errors.number && (
                <Text mt={1} fontSize="sm" color="red.500">
                  {errors.number.message}
                </Text>
              )}
            </Box>
          </SimpleGrid>

          <SimpleGrid columns={3} gap={4}>
            <Box>
              <Text mb={1} fontWeight="600">
                Bairro
              </Text>
              <Input placeholder="Bairro" {...register("neighborhood")} />
              {errors.neighborhood && (
                <Text mt={1} fontSize="sm" color="red.500">
                  {errors.neighborhood.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb={1} fontWeight="600">
                Cidade
              </Text>
              <Input placeholder="Cidade" {...register("city")} />
              {errors.city && (
                <Text mt={1} fontSize="sm" color="red.500">
                  {errors.city.message}
                </Text>
              )}
            </Box>

            <Box>
              <Text mb={1} fontWeight="600">
                Estado
              </Text>
              <Input placeholder="UF" maxLength={2} {...register("state")} />
              {errors.state && (
                <Text mt={1} fontSize="sm" color="red.500">
                  {errors.state.message}
                </Text>
              )}
            </Box>
          </SimpleGrid>

          {/* 📌 PREÇO */}
          <Box>
            <Text mb={1} fontWeight="600">
              Preço do contrato
            </Text>
            <Text fontSize="lg" fontWeight="700">
              R$ {contractTemplate.price.toLocaleString("pt-BR")}
            </Text>
          </Box>

          {/* 📌 MAPA */}
          {mapUrl && (
            <Box>
              <Text mb={2} fontWeight="600">
                Mapa da Localização
              </Text>
              <Image
                src={mapUrl}
                alt="Mapa da propriedade"
                rounded="md"
                w="100%"
                h="auto"
                borderWidth="1px"
                borderColor="gray.200"
              />
            </Box>
          )}

          {/* 📌 BOTÃO */}
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            mt={2}
            fontWeight="700"
          >
            Criar Imóvel
          </Button>
        </Stack>
      </form>
    </Box>
  );
}