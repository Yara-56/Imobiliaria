"use client";

import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { IconType } from "react-icons";

interface SidebarItem {
  name: string;
  icon: IconType;
  path: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  logo?: {
    icon: IconType;
    text: string;
    accent?: string;
  };
  footer?: React.ReactNode;
}

export default function Sidebar({
  sections,
  logo,
  footer,
}: SidebarProps) {
  const location = useLocation();

  return (
    <Box
      w="260px"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.100"
      p={4}
      display="flex"
      flexDirection="column"
    >
      {/* LOGO */}
      {logo && (
        <Flex align="center" gap={2} mb={8}>
          <Icon as={logo.icon} boxSize={5} color="blue.500" />
          <Text fontWeight="900" fontSize="lg">
            {logo.text}
            <Text as="span" color="gray.700">
              {logo.accent}
            </Text>
          </Text>
        </Flex>
      )}

      {/* SECTIONS */}
      <Box flex={1}>
        {sections.map((section) => (
          <Box key={section.title} mb={6}>
            <Text
              fontSize="11px"
              fontWeight="700"
              color="gray.400"
              mb={2}
              textTransform="uppercase"
            >
              {section.title}
            </Text>

            {section.items.map((item) => {
              const active = location.pathname.startsWith(item.path);

              return (
                <Link key={item.path} to={item.path}>
                  <Flex
                    align="center"
                    gap={3}
                    p={3}
                    borderRadius="10px"
                    bg={active ? "blue.50" : "transparent"}
                    color={active ? "blue.600" : "gray.700"}
                    cursor="pointer"
                    mb={1}
                    _hover={{ bg: "gray.100" }}
                  >
                    <Icon as={item.icon} boxSize={4} />
                    <Text fontSize="14px" fontWeight="600">
                      {item.name}
                    </Text>
                  </Flex>
                </Link>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* FOOTER */}
      {footer && <Box mt={4}>{footer}</Box>}
    </Box>
  );
}