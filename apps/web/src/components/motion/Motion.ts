// src/components/motion/Motion.ts
"use client";

import { chakra } from "@chakra-ui/react.js";
import { motion } from "framer-motion";

/**
 * Motion + Chakra UI (compatível com Chakra v3)
 * - Permite animações suaves do Framer Motion
 * - Aceita TODAS as props do Chakra
 * - Sem shouldForwardProp (incompatível com Chakra v3)
 * - Ultra limpo, profissional e estável
 */

export const MotionBox = chakra(motion.div);
export const MotionFlex = chakra(motion.div);
export const MotionButton = chakra(motion.button);