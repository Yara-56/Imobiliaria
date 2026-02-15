import { FC } from "react";

const Benefits: FC = () => (
  <section className="py-20 bg-gradient-to-r from-indigo-900 via-slate-900 to-black text-white px-6 sm:px-12 lg:px-24">
    <h2 className="text-3xl font-bold text-center mb-12">Benefícios</h2>
    <ul className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
      <li>✅ Dashboard moderno e intuitivo</li>
      <li>✅ Alertas automáticos de contratos</li>
      <li>✅ Relatórios detalhados</li>
      <li>✅ Gestão centralizada de imóveis</li>
      <li>✅ Segurança e confiabilidade</li>
      <li>✅ Suporte rápido e eficiente</li>
    </ul>
  </section>
);

export default Benefits;
