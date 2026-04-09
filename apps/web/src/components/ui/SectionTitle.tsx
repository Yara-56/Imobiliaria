import { Box, Text } from "@chakra-ui/react.js";

export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Box textAlign="center">
      <Text fontSize="24px" fontWeight="800">
        {title}
      </Text>

      {subtitle && (
        <Text fontSize="14px" color="token(colors.gray.500)">
          {subtitle}
        </Text>
      )}
    </Box>
  );
}