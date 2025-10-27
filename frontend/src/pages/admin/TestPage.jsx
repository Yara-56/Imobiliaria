import React from "react";
import { motion } from "framer-motion";

export default function TestPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ padding: "2rem" }}
    >
      <h1>Página de Teste</h1>
      <p>Se você está vendo isso, Framer Motion funciona corretamente 🎉</p>
    </motion.div>
  );
}
