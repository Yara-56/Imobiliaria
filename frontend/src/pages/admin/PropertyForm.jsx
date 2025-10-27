import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../services/propertyService";

export default function PropertyForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    cep: "",
    sqls: "",
    street: "",
    number: "",
    district: "",     // <-- era neighborhood
    city: "",
    state: "",
    status: "",       // se ficar vazio, não enviaremos
  });
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await createProperty(form, files); // envia multipart
      navigate("/imoveis");
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar. Verifique o console para detalhes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Novo Imóvel</h1>

      <div className="bg-white rounded border p-4 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <i className="fa-solid fa-house" /> Dados do imóvel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">CEP</label>
            <input
              name="cep"
              value={form.cep}
              onChange={onChange}
              placeholder="Ex: 35160-133"
              className="border rounded px-3 py-2 w-full"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">SQLS</label>
            <input
              name="sqls"
              value={form.sqls}
              onChange={onChange}
              placeholder="Ex: 12930423546793023"
              className="border rounded px-3 py-2 w-full"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Rua</label>
            <input
              name="street"
              value={form.street}
              onChange={onChange}
              placeholder="Digite o nome da Rua"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Número</label>
            <input
              name="number"
              value={form.number}
              onChange={onChange}
              placeholder="Ex: 129"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Bairro</label>
            <input
              name="bairro"                // <-- nome certo para o Model
              value={form.bairro}
              onChange={onChange}
              placeholder="Digite o nome do bairro"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Cidade</label>
            <input
              name="city"
              value={form.city}
              onChange={onChange}
              placeholder="Ex: Digite o nome da cidade"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Estado</label>
            <input
              name="state"
              value={form.state}
              onChange={onChange}
              placeholder="Ex: MG"
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Selecione o status</option>
              <option value="Available">Disponível</option>
              <option value="Occupied">Ocupado</option>
              <option value="Under Maintenance">Manutenção</option> {/* <-- valor certo */}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border p-4 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <i className="fa-solid fa-folder" /> Documentos do imóvel
        </h2>

        <input type="file" multiple onChange={onFilesChange} className="block" />
        {files?.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {files.length} arquivo(s) selecionado(s)
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
