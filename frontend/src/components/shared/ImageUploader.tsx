"use client";

import { Box, Flex, Icon, Image, Text, IconButton, Stack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { LuImage, LuX } from "react-icons/lu";
// ✅ Importando o toaster padrão do Chakra v3
import { toaster } from "@/components/ui/toaster";

interface ImageUploaderProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
}

export default function ImageUploader({ onFilesChange, maxFiles = 5 }: ImageUploaderProps) {
  const [previewFiles, setPreviewFiles] = useState<(File & { preview: string })[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const currentTotal = previewFiles.length + acceptedFiles.length;
      
      if (currentTotal > maxFiles) {
        toaster.create({
          title: "Limite excedido",
          description: `Você pode enviar no máximo ${maxFiles} imagens.`,
          type: "warning",
        });
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      
      const updatedList = [...previewFiles, ...newFiles];
      setPreviewFiles(updatedList);
      onFilesChange(updatedList);
    },
    [previewFiles, onFilesChange, maxFiles]
  );

  const removeFile = (fileToRemove: any) => {
    const updatedFiles = previewFiles.filter((file) => file !== fileToRemove);
    setPreviewFiles(updatedFiles);
    onFilesChange(updatedFiles);
    URL.revokeObjectURL(fileToRemove.preview);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.webp', '.jpg'] },
    maxFiles: maxFiles - previewFiles.length,
  });

  return (
    <Box w="full">
      <Box
        {...getRootProps()}
        p={8}
        borderWidth={2}
        borderColor={isDragActive ? "blue.500" : "gray.200"}
        borderStyle="dashed"
        borderRadius="2xl"
        textAlign="center"
        cursor="pointer"
        bg={isDragActive ? "blue.50" : "gray.50/50"}
        _hover={{ bg: "gray.50", borderColor: "gray.300" }}
        transition="all 0.2s"
      >
        <input {...getInputProps()} />
        <Stack gap={2} align="center">
          <Center w={12} h={12} bg="white" shadow="sm" borderRadius="xl">
             <Icon as={LuImage} boxSize={6} color="blue.500" />
          </Center>
          <Box>
            <Text fontWeight="bold" fontSize="sm">
              {isDragActive ? "Solte para carregar" : "Arraste as fotos ou clique aqui"}
            </Text>
            <Text fontSize="xs" color="gray.500">
              JPG, PNG ou WebP (Máx. {maxFiles} arquivos)
            </Text>
          </Box>
        </Stack>
      </Box>

      {previewFiles.length > 0 && (
        <Flex mt={6} flexWrap="wrap" gap={4}>
          {previewFiles.map((file) => (
            <Box 
              key={file.name} 
              position="relative" 
              w="110px" 
              h="110px" 
              borderRadius="xl" 
              overflow="hidden"
              border="1px solid"
              borderColor="gray.100"
              shadow="sm"
            >
              <Image src={file.preview} alt={file.name} objectFit="cover" w="full" h="full" />
              <IconButton
                aria-label="Remover"
                size="xs"
                variant="solid"
                colorPalette="red"
                borderRadius="full"
                position="absolute"
                top={1.5}
                right={1.5}
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file);
                }}
              >
                <LuX />
              </IconButton>
            </Box>
          ))}
        </Flex>
      )}
    </Box>
  );
}

// Pequeno helper caso não tenha o Center importado
import { Center } from "@chakra-ui/react";