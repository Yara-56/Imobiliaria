"use client";

import { useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LuSave } from "react-icons/lu";
import { useProperties } from "../hooks/useProperties";
import PropertyDataSection from "./sections/PropertyDataSection";
import DocumentSection from "./sections/DocumentSection";
import type { PropertyUI } from "../types/property";

type Mode = "create" | "edit";

export type PropertyFormValues = {
  title: string;
  cep: string;
  sqls: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  status: "Disponível" | "Alugado" | "Vendido" | "Manutenção";
};

const initialValues: PropertyFormValues = {
  title: "",
  cep: "",
  sqls: "",
  rua: "",
  numero: "",
  bairro: "",
  cidade: "",
  estado: "",
  status: "Disponível",
};

function parseAddressText(addressText?: string) {
  // addressText exemplo: "Rua A, 70 - Centro, Ipatinga/MG"
  // Isso é só um parser simples pra preencher algo no edit.
  // Se não bater certinho, fica vazio (sem quebrar).
  if (!addressText) {
    return { rua: "", numero: "", bairro: "", cidade: "", estado: "" };
  }

  try {
    const [streetAndNumber = "", rest = ""] = addressText.split(" - ");
    const [rua = "", numero = ""] = streetAndNumber.split(",").map((s) => s.trim());

    const [bairro = "", cityState = ""] = rest.split(",").map((s) => s.trim());
    const [cidade = "", estado = ""] = cityState.split("/").map((s) => s.trim());

    return { rua, numero, bairro, cidade, estado };
  } catch {
    return { rua: "", numero: "", bairro: "", cidade: "", estado: "" };
  }
}

export default function PropertyForm({
  mode,
  initialData,
  propertyId,
}: {
  mode: Mode;
  initialData?: PropertyUI | null;
  propertyId?: string;
}) {
  const navigate = useNavigate();

  // ✅ pega também updateProperty (além de createProperty)
  const { createProperty, updateProperty, isSubmitting } = useProperties();

  const [values, setValues] = useState<PropertyFormValues>(() => {
    if (mode === "edit" && initialData) {
      const parsed = parseAddressText(initialData.addressText);

      return {
        ...initialValues,
        title: initialData.title ?? "",
        cep: initialData.cep ?? "",
        sqls: (initialData as any).sqls ?? "",
        status: (initialData.status as any) ?? "Disponível",
        ...parsed,
      };
    }
    return initialValues;
  });

  const [files, setFiles] = useState<File[]>([]);

  const onChange = (patch: Partial<PropertyFormValues>) =>
    setValues((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async () => {
    if (!values.title.trim()) return alert("Informe o nome/título do imóvel.");
    if (!values.cep.trim()) return alert("Informe o CEP.");
    if (!values.rua.trim()) return alert("Informe a Rua.");
    if (!values.numero.trim()) return alert("Informe o Número.");
    if (!values.bairro.trim()) return alert("Informe o Bairro.");
    if (!values.cidade.trim()) return alert("Informe a Cidade.");
    if (!values.estado.trim()) return alert("Informe o Estado.");

    const addressText = `${values.rua}, ${values.numero} - ${values.bairro}, ${values.cidade}/${values.estado}`;

    const payload: Partial<PropertyUI> = {
      title: values.title,
      addressText,
      cep: values.cep,
      status: values.status,
      // opcional:
      // type: "Casa",
      // sqls: values.sqls,
    };

    if (mode === "create") {
      await createProperty(payload as any, files);
    } else {
      if (!propertyId) return alert("ID do imóvel não encontrado para edição.");
      await updateProperty(propertyId, payload as any, files);
    }

    navigate("/admin/properties");
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <PropertyDataSection values={values} onChange={onChange} />
      <DocumentSection files={files} onFilesChange={setFiles} />

      <Flex justify="flex-end" gap={3}>
        <Button
          colorPalette="blue"
          size="lg"
          borderRadius="xl"
          gap={2}
          shadow="md"
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          <LuSave /> {mode === "create" ? "Salvar Imóvel" : "Salvar Alterações"}
        </Button>
      </Flex>
    </Box>
  );
}