import { FC } from "react";
import Button from "@/components/ui/Button.js";
import { motion } from "framer-motion";

const Hero: FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-indigo-900 via-slate-900 to-black min-h-screen flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-24 overflow-hidden">
      {/* Blobs animados de fundo */}
      <motion.div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-indigo-700 opacity-20 rounded-full filter blur-3xl"
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-indigo-500 opacity-20 rounded-full filter blur-2xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 max-w-3xl">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight"
        >
          Bem-vindo à <span className="text-indigo-400">ImobiSys</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Plataforma moderna de gestão imobiliária. Controle imóveis, contratos e clientes em um só lugar, de forma segura e eficiente.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col sm:flex-row justify-center gap-4"
        >
          <Button variant="primary" size="lg" onClick={() => alert("Comece Agora clicado!")}>
            Comece Agora
          </Button>
          <Button variant="secondary" size="lg" onClick={() => alert("Saiba Mais clicado!")}>
            Saiba Mais
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
