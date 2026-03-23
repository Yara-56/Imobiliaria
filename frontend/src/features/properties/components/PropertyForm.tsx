"use client";

import { useEffect, useState } from "react";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { LuSave } from "react-icons/lu";
import { useProperties } from "../hooks/useProperties";
import PropertyDataSection from "./sections/PropertyDataSection";
import DocumentSection from "./sections/DocumentSection";
import type {
  CreatePropertyDTO,
  PropertyStatus,
  PropertyStatusPT,
  PropertyUI,
  UpdatePropertyDTO,
} from "../types/property";

type Mode = "create" | "edit";

type ExistingDocument = {
  id?: string;
  fileName?: string;
  fileUrl?: string;
  mimeType?: string | null;
  size?: number | null;
  originalName?: string;
  filename?: string;
  url?: string;
};

export type PropertyFormValues = {
  name: string;
  cep: string;
  sqls: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  status: PropertyStatusPT;
};

const initialValues: PropertyFormValues = {
  name: "",
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
  if (!addressText) {
    return { rua: "", numero: "", bairro: "", cidade: "", estado: "" };
  }

  try {
    const [streetAndNumber = "", rest = ""] = addressText.split(" - ");
    const [rua = "", numero = ""] = streetAndNumber
      .split(",")
      .map((s) => s.trim());

    const [bairro = "", cityState = ""] = rest
      .split(",")
      .map((s) => s.trim());

    const [cidade = "", estado = ""] = cityState
      .split("/")
      .map((s) => s.trim());

    return { rua, numero, bairro, cidade, estado };
  } catch {
    return { rua: "", numero: "", bairro: "", cidade: "", estado: "" };
  }
}

function mapStatusToApi(status: PropertyStatusPT): PropertyStatus {
  switch (status) {
    case "Disponível":
      return "DISPONIVEL";
    case "Alugado":
      return "ALUGADO";
    case "Manutenção":
      return "MANUTENCAO";
    case "Inativo":
      return "INATIVO";
    default:
      return "DISPONIVEL";
  }
}

function buildValuesFromInitialData(initialData?: PropertyUI | null): PropertyFormValues {
  if (!initialData) return initialValues;

  const parsedFallback = parseAddressText(initialData.addressText);

  return {
    ...initialValues,
    name: initialData.name ?? "",
    cep: initialData.cep ?? "",
    sqls: initialData.sqls ?? "",
    rua: initialData.street ?? parsedFallback.rua,
    numero: initialData.number ?? parsedFallback.numero,
    bairro: initialData.neighborhood ?? parsedFallback.bairro,
    cidade: initialData.city ?? parsedFallback.cidade,
    estado: initialData.state ?? parsedFallback.estado,
    status: initialData.status ?? "Disponível",
  };
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
  const { createProperty, updateProperty, isSubmitting } = useProperties();

  const [values, setValues] = useState<PropertyFormValues>(
    buildValuesFromInitialData(initialData)
  );

  const [files, setFiles] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<ExistingDocument[]>(
    initialData?.documents ?? []
  );

  useEffect(() => {
    if (mode === "edit") {
      setValues(buildValuesFromInitialData(initialData));
      setExistingDocuments(initialData?.documents ?? []);
    }
  }, [mode, initialData]);

  const onChange = (patch: Partial<PropertyFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  const handleSubmit = async () => {
    if (!values.name.trim()) return alert("Informe o nome/título do imóvel.");
    if (!values.cep.trim()) return alert("Informe o CEP.");
    if (!values.rua.trim()) return alert("Informe a Rua.");
    if (!values.numero.trim()) return alert("Informe o Número.");
    if (!values.bairro.trim()) return alert("Informe o Bairro.");
    if (!values.cidade.trim()) return alert("Informe a Cidade.");
    if (!values.estado.trim()) return alert("Informe o Estado.");
    if (!/^[A-Za-z]{2}$/.test(values.estado.trim())) {
      return alert("Informe o Estado com a sigla de 2 letras. Ex.: MG");
    }
    if (!values.sqls.trim()) return alert("Informe o SQLS.");

    const normalizedZipCode = values.cep.replace(/\D/g, "");
    if (normalizedZipCode.length !== 8) {
      return alert("Informe um CEP válido com 8 dígitos.");
    }

    const basePayload: CreatePropertyDTO = {
      name: values.name.trim(),
      zipCode: normalizedZipCode,
      sqls: values.sqls.trim(),
      street: values.rua.trim(),
      number: values.numero.trim(),
      neighborhood: values.bairro.trim(),
      city: values.cidade.trim(),
      state: values.estado.trim().toUpperCase(),
      status: mapStatusToApi(values.status),
    };

    try {
      if (mode === "create") {
        await createProperty(basePayload, files);
      } else {
        if (!propertyId) {
          return alert("ID do imóvel não encontrado para edição.");
        }

        const updatePayload: UpdatePropertyDTO = {
          ...basePayload,
          documents: existingDocuments,
        };

        await updateProperty(propertyId, updatePayload, files);
      }

      navigate("/admin/properties");
    } catch (error) {
      console.error("Erro ao salvar imóvel:", error);
      alert("Não foi possível salvar o imóvel.");
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={6}>
      <PropertyDataSection values={values} onChange={onChange} />

      <DocumentSection
        files={files}
        existingDocuments={existingDocuments}
        onFilesChange={(nextFiles) => setFiles(nextFiles)}
        onExistingDocumentsChange={(nextDocuments) =>
          setExistingDocuments(nextDocuments)
        }
      />

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