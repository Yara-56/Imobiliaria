"use client";

import { Box, Flex, Heading, Text, Stack, Button, Center } from "@chakra-ui/react";
import { LuFolderOpen, LuUpload, LuX } from "react-icons/lu";

export default function DocumentSection({
  files,
  onFilesChange,
}: {
  files: File[];
  onFilesChange: (files: File[]) => void;
}) {
  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;

    // adiciona sem perder os antigos
    onFilesChange([...files, ...picked]);

    // permite selecionar o mesmo arquivo novamente depois
    e.currentTarget.value = "";
  };

  const removeAt = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx));
  };

  return (
    <Box bg="white" borderRadius="24px" shadow="sm" borderWidth="1px" borderColor="gray.100" overflow="hidden">
      <Flex align="center" gap={2} px={6} py={4} borderBottomWidth="1px" borderColor="gray.100" bg="gray.50/50">
        <LuFolderOpen />
        <Stack gap={0}>
          <Heading size="sm" fontWeight="800">Documentos do imóvel</Heading>
          <Text fontSize="xs" color="gray.500">Anexe PDFs e imagens (você pode anexar mais de um).</Text>
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
              accept=".pdf,image/png,image/jpeg"
              onChange={handlePick}
            />
          </Button>

          <Text fontSize="sm" color="gray.500">
            {files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : "Nenhum arquivo selecionado"}
          </Text>
        </Flex>

        {files.length === 0 ? (
          <Center p={12} borderRadius="2xl" borderWidth="1px" borderColor="gray.100" bg="gray.50/30" flexDirection="column" gap={2}>
            <Text color="gray.500" fontSize="sm">Adicione aqui documentos como escritura, fotos e PDFs.</Text>
          </Center>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {files.map((f, idx) => (
              <Flex
                key={`${f.name}-${idx}`}
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
                  onClick={() => removeAt(idx)}
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