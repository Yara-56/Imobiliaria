import { FC } from "react";

const Problems: FC = () => (
  <section className="py-20 bg-slate-950 text-white px-6 sm:px-12 lg:px-24">
    <h2 className="text-3xl font-bold text-center mb-12">Os desafios do mercado imobiliário</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg hover:shadow-indigo-600/50 transition">
        <h3 className="text-xl font-semibold mb-2">Gestão de imóveis</h3>
        <p>Controle manual é demorado e sujeito a erros.</p>
      </div>
      <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg hover:shadow-indigo-600/50 transition">
        <h3 className="text-xl font-semibold mb-2">Contratos complexos</h3>
        <p>Organizar contratos e datas de vencimento é complicado.</p>
      </div>
      <div className="bg-slate-900/50 p-6 rounded-2xl shadow-lg hover:shadow-indigo-600/50 transition">
        <h3 className="text-xl font-semibold mb-2">Relatórios dispersos</h3>
        <p>Falta de visão clara sobre clientes e finanças.</p>
      </div>
    </div>
  </section>
);

export default Problems;
