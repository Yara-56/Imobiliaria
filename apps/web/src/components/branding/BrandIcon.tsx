// src/components/BrandIcon.tsx
import { chakra, HTMLChakraProps } from "@chakra-ui/react.js";

/**
 * Ícone oficial HomeFlux em PNG (32x32)
 * - Moderno, fluido, premium
 * - Funciona tanto como <BrandIcon /> quanto como <Icon as={BrandIconAsIcon} />
 */
export function BrandIcon(props: HTMLChakraProps<"img">) {
  return (
    <chakra.img
      src="/branding/icons/favicon-32.png"
      alt="HomeFlux Icon"
      width="100%"
      height="100%"
      draggable={false}
      style={{
        filter:
          "drop-shadow(0px 1px 2px rgba(0,0,0,0.14)) drop-shadow(0px 2px 6px rgba(0,0,0,0.12))",
        transition: "transform 0.25s ease, filter 0.25s ease",
      }}
      _hover={{
        transform: "scale(1.07)",
        filter:
          "drop-shadow(0px 3px 8px rgba(0,0,0,0.16)) drop-shadow(0px 4px 14px rgba(0,0,0,0.18))",
      }}
      {...props}
    />
  );
}

/**
 * Wrapper compatível com Chakra <Icon />
 */
export const BrandIconAsIcon: React.FC = () => (
  <BrandIcon width="24px" height="24px" />
);