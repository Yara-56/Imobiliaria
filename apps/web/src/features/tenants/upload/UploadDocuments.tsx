import {
    Box,
    Text,
    VStack,
    Button,
    Input,
    Center,
    Flex,
    Icon,
  } from "@chakra-ui/react.js";
  import { useState } from "react";
  import { FiUploadCloud } from "react-icons/fi";
  import FileCard from "../../../components/ui/FileCard";
  import SectionTitle from "../../../components/ui/SectionTitle";
  
  export default function UploadDocuments() {
    const [files, setFiles] = useState<File[]>([]);
  
    function onSelectFiles(e: React.ChangeEvent<HTMLInputElement>) {
      const list = e.target.files ? Array.from(e.target.files) : [];
      setFiles(list);
    }
  
    function fakeSend() {
      alert("Visual apenas — backend será conectado depois.");
    }
  
    return (
      <Center w="100%" py="40px">
        <Box
          w="100%"
          maxW="520px"
          border="1px solid token(colors.gray.400)"
          borderRadius="20px"
          p="32px"
        >
          <VStack gap="24px">
            <Icon as={FiUploadCloud} fontSize="56px" color="token(colors.blue.500)" />
  
            <SectionTitle
              title="Enviar Documentos"
              subtitle="RG, CPF, comprovante de renda, comprovante de residência e outros."
            />
  
            <Input
              type="file"
              multiple
              onChange={onSelectFiles}
              border="1px dashed token(colors.gray.500)"
              borderRadius="12px"
              p="12px"
              cursor="pointer"
            />
  
            {files.length > 0 && (
              <Box
                w="100%"
                border="1px solid token(colors.gray.400)"
                borderRadius="12px"
                p="16px"
              >
                <Text fontWeight="600" mb="12px">
                  Documentos selecionados:
                </Text>
  
                <VStack align="stretch" gap="8px">
                  {files.map((file) => (
                    <FileCard key={file.name} file={file} />
                  ))}
                </VStack>
              </Box>
            )}
  
            <Button w="100%" size="lg" colorScheme="blue" onClick={fakeSend}>
              Enviar Documentos
            </Button>
  
            <Text fontSize="12px" color="token(colors.gray.500)">
              Seus arquivos são protegidos segundo a LGPD.
            </Text>
          </VStack>
        </Box>
      </Center>
    );
  }