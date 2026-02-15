import { FC } from "react";
import Button from "@/components/ui/Button.js";

const FinalCTA: FC = () => (
  <section className="py-20 bg-indigo-700 text-white text-center px-6 sm:px-12 lg:px-24">
    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
      Pronto para transformar seu negócio imobiliário?
    </h2>
    <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
      Experimente ImobiSys hoje mesmo e simplifique sua gestão.
    </p>
    <Button variant="primary" size="lg" onClick={() => alert("Comece Agora!")}>
      Comece Agora
    </Button>
  </section>
);

export default FinalCTA;
