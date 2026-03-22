"use client";

import {
  Box,
  Flex,
  Stack,
  Text,
  Icon,
  Center,
  Image,
} from "@chakra-ui/react";

import { Link, useLocation } from "react-router-dom";
import {
  LuChevronDown,
  LuChevronRight,
  LuMenu,
  LuX,
} from "react-icons/lu";

import { motion } from "framer-motion";
import { useState } from "react";

interface SubItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  badge?: number;
  children?: SubItem[];
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

interface SidebarProps {
  sections: MenuSection[];     // ← EXISTE
  logo?: {                     // ← AGORA EXISTE!
    icon?: React.ElementType;
    text: string;
    accent?: string;
    imageSrc?: string; // opcional
  };
  footer?: React.ReactNode;    // ← EXISTE
}

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

export const Sidebar = ({ sections, logo, footer }: SidebarProps) => {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const panel = { base: "white", _dark: "gray.900" };

  const toggleExpand = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const LogoArea = (
    <Flex
      align="center"
      gap={3}
      px={isOpen ? 2 : 0}
      transition="all 0.3s"
      justify={isOpen ? "flex-start" : "center"}
    >
      {logo?.imageSrc ? (
        <Image
          src={logo.imageSrc}
          alt="Logo"
          w={isOpen ? "160px" : "48px"}
          transition="all 0.25s"
        />
      ) : (
        <>
          <Center
            w="42px"
            h="42px"
            bg="blue.600"
            borderRadius="lg"
            color="white"
          >
            {logo?.icon && <Icon as={logo.icon} boxSize={6} />}
          </Center>

          {isOpen && logo && (
            <Text fontSize="20px" fontWeight="800">
              {logo.text}
              {logo.accent && (
                <Text as="span" color="blue.600">
                  {logo.accent}
                </Text>
              )}
            </Text>
          )}
        </>
      )}
    </Flex>
  );

  const MenuContent = (
    <Stack gap={6} h="full">
      {LogoArea}

      <Stack flex={1} gap={5} px={isOpen ? 2 : 0}>
        {sections?.map((section, idx) => (
          <Box key={idx}>
            {isOpen && section.title && (
              <Text
                fontSize="11px"
                fontWeight="700"
                textTransform="uppercase"
                color="gray.500"
                ml={2}
                mb={1}
              >
                {section.title}
              </Text>
            )}

            <Stack gap={1}>
              {section.items.map((item) => {
                const active = location.pathname.startsWith(item.path);
                const key = item.path;

                return (
                  <Box key={key}>
                    <MotionFlex
                      align="center"
                      p={3}
                      gap={4}
                      bg={active ? "blue.50" : "transparent"}
                      color={active ? "blue.600" : "gray.700"}
                      borderRadius="12px"
                      cursor="pointer"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.25 }}
                      onClick={() =>
                        item.children ? toggleExpand(key) : null
                      }
                    >
                      <Icon as={item.icon} boxSize={5} />

                      {isOpen && (
                        <Flex flex={1} justify="space-between" align="center">
                          <Text fontWeight="600">{item.name}</Text>

                          {item.children && (
                            <Icon
                              as={expanded[key] ? LuChevronDown : LuChevronRight}
                              boxSize={4}
                              color="gray.500"
                            />
                          )}
                        </Flex>
                      )}
                    </MotionFlex>

                    {item.children && expanded[key] && (
                      <Stack pl={isOpen ? 10 : 0} mt={1}>
                        {item.children.map((sub) => {
                          const subActive =
                            location.pathname.startsWith(sub.path);

                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              style={{ textDecoration: "none" }}
                            >
                              <MotionFlex
                                p={2}
                                align="center"
                                gap={3}
                                borderRadius="10px"
                                color={subActive ? "blue.600" : "gray.600"}
                                bg={subActive ? "blue.50" : "transparent"}
                                whileHover={{ x: 10 }}
                                transition={{ duration: 0.25 }}
                              >
                                <Box
                                  w="6px"
                                  h="6px"
                                  borderRadius="full"
                                  bg={subActive ? "blue.600" : "gray.400"}
                                />

                                <Text>{sub.name}</Text>
                              </MotionFlex>
                            </Link>
                          );
                        })}
                      </Stack>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>
        ))}
      </Stack>

      {footer && <Box px={2}>{footer}</Box>}
    </Stack>
  );

  return (
    <>
      {/* MOBILE BUTTON */}
      <Center
        as="button"
        onClick={() => setMobileOpen(true)}
        position="fixed"
        top={4}
        left={4}
        bg="panel"
        borderRadius="full"
        w="48px"
        h="48px"
        shadow="lg"
        display={{ base: "flex", md: "none" }}
        zIndex={40}
      >
        <Icon as={LuMenu} boxSize={6} />
      </Center>

      {/* DESKTOP */}
      <MotionBox
        animate={{ width: isOpen ? 280 : 88 }}
        transition={{ duration: 0.35 }}
        bg={panel}
        borderRight="1px solid"
        borderColor="gray.200"
        minH="100vh"
        p={4}
        position="relative"
        display={{ base: "none", md: "block" }}
      >
        {/* BOTÃO DE COLAPSO */}
        <Center
          as="button"
          position="absolute"
          top="20px"
          right="-16px"
          bg="panel"
          w="32px"
          h="32px"
          borderRadius="full"
          border="1px solid"
          borderColor="gray.300"
          shadow="md"
          onClick={() => setIsOpen((v) => !v)}
        >
          <Icon as={isOpen ? LuX : LuMenu} boxSize={4} />
        </Center>

        {MenuContent}
      </MotionBox>

      {/* MOBILE SIDEBAR */}
      {mobileOpen && (
        <MotionBox
          position="fixed"
          top={0}
          left={0}
          h="100vh"
          w="280px"
          bg={panel}
          shadow="2xl"
          zIndex={50}
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 150 }}
          p={6}
        >
          <Center
            as="button"
            position="absolute"
            right="20px"
            top="20px"
            onClick={() => setMobileOpen(false)}
          >
            <Icon as={LuX} boxSize={6} />
          </Center>

          {MenuContent}
        </MotionBox>
      )}
    </>
  );
};