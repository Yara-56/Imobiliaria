import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../../services/propertyService";

const fieldTranslations = {
  cep: "CEP",
  sqls: "SQLS",
  street: "Rua",
  number: "Número",
  bairro: "Bairro",
  city: "Cidade",
  state: "Estado",
  status: "Status",
};

export default function PropertyForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cep: "",
    sqls: "",
    street: "",
    number: "",
    bairro: "",
    city: "",
    state: "",
    status: "",
  });

  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [firstError, setFirstError] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });

      if (firstError === name) setFirstError(null);
    }
  };

  const onFilesChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setFieldErrors({});
    setFirstError(null);

    try {
      await createProperty(form, files);
      navigate("/admin/imoveis");
    } catch (err) {
      console.error("Erro ao salvar imóvel:", err?.response?.data);

      if (err?.response?.data?.fields) {
        const keys = Object.keys(err.response.data.fields);

        const highlights = Object.fromEntries(
          keys.map((k) => [k, true])
        );

        setFieldErrors(highlights);
        setFirstError(keys[0]);
      } else {
        alert("Erro inesperado.");
      }
    } finally {
      setSaving(false);
    }
  };

  const renderErrorMessage = (field) => {
    if (firstError !== field) return null;

    return (
      <p className="text-red-600 text-sm mt-1">
        O campo '{fieldTranslations[field] || field}' é obrigatório.
      </p>
    );
  };

  return (
    <form onSubmit={onSubmit} className="max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Novo Imóvel</h1>

      <div className="bg-white rounded border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {[
            ["cep", "CEP"],
            ["sqls", "SQLS"],
            ["street", "Rua"],
            ["number", "Número"],
            ["bairro", "Bairro"],
            ["city", "Cidade"],
            ["state", "Estado"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm text-gray-600 mb-1">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={onChange}
                className={`border rounded px-3 py-2 w-full ${
                  fieldErrors[name] ? "border-red-500" : "border-gray-300"
                }`}
              />
              {renderErrorMessage(name)}
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className={`border rounded px-3 py-2 w-full ${
                fieldErrors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecione</option>
              <option value="Available">Disponível</option>
              <option value="Occupied">Ocupado</option>
              <option value="Under Maintenance">Manutenção</option>
            </select>

            {renderErrorMessage("status")}
          </div>
        </div>
      </div>

      <div className="bg-white rounded border p-4 mb-6">
        <input type="file" multiple onChange={onFilesChange} />

        {files.length > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            {files.length} arquivo(s)
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}
