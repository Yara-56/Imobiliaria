"use client";

import { Box, Flex, Heading, Text, Stack, Button, Center, Link } from "@chakra-ui/react";
import { LuFolderOpen, LuUpload, LuX, LuFileText, LuTrash2 } from "react-icons/lu";
import {
  getDocumentDisplayName,
  resolveDocumentUrl,
} from "../../utils/propertyDocuments";

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

export default function DocumentSection({
  files,
  existingDocuments = [],
  onFilesChange,
  onExistingDocumentsChange,
}: {
  files: File[];
  existingDocuments?: ExistingDocument[];
  onFilesChange: (files: File[]) => void;
  onExistingDocumentsChange?: (documents: ExistingDocument[]) => void;
}) {
  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    const merged = [...files, ...picked];

    const uniqueFiles = merged.filter(
      (file, index, arr) =>
        arr.findIndex(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        ) === index
    );

    onFilesChange(uniqueFiles.slice(0, 10));
    e.currentTarget.value = "";
  };

  const removeNewFileAt = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  const removeExistingDocumentAt = (idx: number) => {
    if (!onExistingDocumentsChange) return;
    onExistingDocumentsChange(existingDocuments.filter((_, i) => i !== idx));
  };

  const hasAnyDocument = existingDocuments.length > 0 || files.length > 0;

  return (
    <Box
      bg="white"
      borderRadius="24px"
      shadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
      overflow="hidden"
    >
      <Flex
        align="center"
        gap={2}
        px={6}
        py={4}
        borderBottomWidth="1px"
        borderColor="gray.100"
        bg="gray.50/50"
      >
        <LuFolderOpen />
        <Stack gap={0}>
          <Heading size="sm" fontWeight="800">
            Documentos do imóvel
          </Heading>
          <Text fontSize="xs" color="gray.500">
            Anexe PDFs e imagens (você pode anexar mais de um).
          </Text>
        </Stack>
      </Flex>

      <Box p={6}>
        <Flex gap={3} mb={4} wrap="wrap" align="center">
          <Button as="label" cursor="pointer" borderRadius="xl" variant="outline" gap={2}>
            <LuUpload /> Adicionar documentos
            <input
              type="file"
              hidden
              multiple
              accept=".pdf,image/png,image/jpeg,image/webp"
              onChange={handlePick}
            />
          </Button>

          <Text fontSize="sm" color="gray.500">
            {files.length > 0
              ? `${files.length} novo(s) arquivo(s) selecionado(s)`
              : existingDocuments.length > 0
                ? `${existingDocuments.length} documento(s) já salvo(s)`
                : "Nenhum arquivo selecionado"}
          </Text>
        </Flex>

        {!hasAnyDocument ? (
          <Center
            p={12}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.100"
            bg="gray.50/30"
            flexDirection="column"
            gap={2}
          >
            <Text color="gray.500" fontSize="sm">
              Adicione aqui documentos como escritura, fotos e PDFs.
            </Text>
          </Center>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {existingDocuments.map((doc, idx) => {
              const documentUrl = resolveDocumentUrl(doc);

              return (
                <Flex
                  key={doc.id ?? `${getDocumentDisplayName(doc)}-${idx}`}
                  justify="space-between"
                  align="center"
                  p={3}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor="gray.100"
                >
                  <Stack gap={0}>
                    <Flex align="center" gap={2}>
                      <LuFileText />
                      <Text fontWeight="600">{getDocumentDisplayName(doc)}</Text>
                    </Flex>

                    {documentUrl ? (
                      <Link
                        href={documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        color="blue.600"
                        fontSize="xs"
                      >
                        Abrir documento
                      </Link>
                    ) : (
                      <Text fontSize="xs" color="red.500">
                        Documento sem URL válida
                      </Text>
                    )}
                  </Stack>

                  {onExistingDocumentsChange ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      colorPalette="red"
                      onClick={() => removeExistingDocumentAt(idx)}
                    >
                      <LuTrash2 />
                    </Button>
                  ) : null}
                </Flex>
              );
            })}

            {files.map((f, idx) => (
              <Flex
                key={`${f.name}-${f.size}-${f.lastModified}-${idx}`}
                justify="space-between"
                align="center"
                p={3}
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
              >
                <Stack gap={0}>
                  <Text fontWeight="600">{f.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {(f.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </Stack>

                <Button
                  variant="ghost"
                  size="sm"
                  colorPalette="red"
                  onClick={() => removeNewFileAt(idx)}
                >
                  <LuX />
                </Button>
              </Flex>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}