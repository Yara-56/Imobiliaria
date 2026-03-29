import { useMemo, useState, useEffect } from "react";
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

interface Props {
  mode: "create" | "edit";
  initialData?: Partial<FormData>;
  propertyId?: string;
}

function PropertyForm({ mode, initialData }: Props) {
  const [fetchingCEP, setFetchingCEP] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData
  });

  // carrega dados no modo edição
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const address = watch("address");
  const city = watch("city");
  const state = watch("state");

  const mapUrl = useMemo(() => {
    if (!address || !city || !state) return "";
    const full = `${address}, ${city}, ${state}`;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
      full
    )}&zoom=16&size=600x400&markers=color:red|${encodeURIComponent(full)}`;
  }, [address, city, state]);

  async function handleCEP(cep: string) {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;

    try {
      setFetchingCEP(true);
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
    console.log("Form enviado:", data);
  }

  return (
    <Box p={6} borderWidth="1px" rounded="lg" maxW="720px" mx="auto">
      <form onSubmit={handleSubmit(submit)}>
        <Stack gap={6}>
          <Box>
            <Text>Título</Text>
            <Input {...register("title")} />
            {errors.title && (
              <Text color="red.500">{errors.title.message}</Text>
            )}
          </Box>

          <Box>
            <Text>CEP</Text>
            <Input
              {...register("zipCode")}
              onBlur={(e) => handleCEP(e.target.value)}
            />
            {fetchingCEP && <Spinner />}
          </Box>

          <SimpleGrid columns={2} gap={4}>
            <Input placeholder="Endereço" {...register("address")} />
            <Input placeholder="Número" {...register("number")} />
          </SimpleGrid>

          <SimpleGrid columns={3} gap={4}>
            <Input placeholder="Bairro" {...register("neighborhood")} />
            <Input placeholder="Cidade" {...register("city")} />
            <Input placeholder="UF" {...register("state")} />
          </SimpleGrid>

          {mapUrl && <Image src={mapUrl} />}

          <Button type="submit" colorScheme="blue">
            {mode === "create" ? "Criar Imóvel" : "Atualizar"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
}

export default PropertyForm;