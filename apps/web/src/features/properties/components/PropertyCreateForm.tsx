import React, { useMemo } from "react";
import { Box, Stack, Input, Text, Button, Image } from "@chakra-ui/react.js";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod.js";

const schema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional(),
  address: z.string().min(1, "Endereço obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  state: z.string().min(1, "Estado obrigatório"),
  zipCode: z.string().min(1, "CEP obrigatório")
});

type FormData = z.infer<typeof schema>;

interface PropertyCreateFormProps {
  contractTemplate: { price: number };
  googleKey: string;
  onSubmit: (data: FormData & { price: number }) => void;
}

export function PropertyCreateFormPROv3({
  contractTemplate,
  googleKey,
  onSubmit
}: PropertyCreateFormProps) {
  const {
    register,
    handleSubmit,
    watch,
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

  function submit(data: FormData) {
    onSubmit({ ...data, price: contractTemplate.price });
  }

  return (
    <Box
      p={6}
      rounded="lg"
      borderWidth="1px"
      borderColor="gray.300"
      maxW="640px"
      mx="auto"
      bg="white"
    >
      <form onSubmit={handleSubmit(submit)}>
        <Stack gap={4}>
          <Box>
            <Text mb={1} fontWeight="600">
              Título
            </Text>
            <Input placeholder="Ex: Casa 3 quartos" {...register("title")} />
            {errors.title && (
              <Text mt={1} fontSize="sm" color="red.500">
                {errors.title.message}
              </Text>
            )}
          </Box>

          <Box>
            <Text mb={1} fontWeight="600">
              Descrição
            </Text>
            <Input
              placeholder="Descrição do imóvel..."
              {...register("description")}
            />
          </Box>

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

          <Box>
            <Text mb={1} fontWeight="600">
              CEP
            </Text>
            <Input placeholder="00000-000" {...register("zipCode")} />
            {errors.zipCode && (
              <Text mt={1} fontSize="sm" color="red.500">
                {errors.zipCode.message}
              </Text>
            )}
          </Box>

          <Box>
            <Text mb={1} fontWeight="600">
              Preço do contrato
            </Text>
            <Text fontSize="lg" fontWeight="700">
              R$ {contractTemplate.price.toLocaleString("pt-BR")}
            </Text>
          </Box>

          {mapUrl && (
            <Box>
              <Text mb={2} fontWeight="600">
                Pré‑visualização do Mapa
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