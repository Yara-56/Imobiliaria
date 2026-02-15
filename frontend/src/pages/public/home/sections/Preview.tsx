import { FC } from "react";

const Preview: FC = () => (
  <section className="py-20 bg-slate-950 text-white px-6 sm:px-12 lg:px-24">
    <h2 className="text-3xl font-bold text-center mb-12">Veja como funciona</h2>
    <div className="flex flex-wrap justify-center gap-6">
      <div className="w-80 h-48 bg-gray-800 rounded-xl shadow-lg animate-pulse"></div>
      <div className="w-80 h-48 bg-gray-800 rounded-xl shadow-lg animate-pulse"></div>
      <div className="w-80 h-48 bg-gray-800 rounded-xl shadow-lg animate-pulse"></div>
    </div>
  </section>
);

export default Preview;
