import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById, updateProperty } from "../../services/propertyService";

export default function PropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);     // null = ainda carregando
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Carrega imóvel
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPropertyById(id);
        setForm({
          title: data.title ?? "",
          cep: data.cep ?? "",
          sqls: data.sqls ?? "",
          street: data.street ?? "",
          number: data.number ?? "",
          district: data.district ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          status: data.status ?? "",
        });
      } catch (e) {
        console.error("Erro ao carregar imóvel:", e);
        alert("Imóvel não encontrado.");
        navigate("/properties");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const required = ["title", "cep", "street", "city", "state", "status"];
    const next = {};
    required.forEach((k) => {
      if (!form[k] || String(form[k]).trim() === "") next[k] = "Campo obrigatório";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await updateProperty(id, form);
      alert("Imóvel atualizado com sucesso!");
      navigate("/properties");
    } catch (e) {
      console.error("Erro ao atualizar:", e);
      alert("Erro ao atualizar o imóvel.");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ name, label, type = "text", placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`border px-3 py-2 rounded w-full ${
          errors[name] ? "border-red-500" : "border-gray-300"
        }`}
      />
      {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  if (loading || !form) {
    return <div className="p-6">Carregando dados do imóvel...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Editar Imóvel</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field name="title"   label="Título"   placeholder="Ex: Apto 302 - Centro" />
          <Field name="cep"     label="CEP"      placeholder="Ex: 35160-000" />
          <Field name="sqls"    label="SQLS"     placeholder="Opcional" />
          <Field name="street"  label="Rua"      placeholder="Ex: Rua das Flores" />
          <Field name="number"  label="Número"   placeholder="Ex: 150" />
          <Field name="district"label="Bairro"   placeholder="Ex: Centro" />
          <Field name="city"    label="Cidade"   placeholder="Ex: Ipatinga" />
          <Field name="state"   label="Estado"   placeholder="Ex: MG" />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={`border px-3 py-2 rounded w-full ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Selecione o status</option>
              <option value="Available">Disponível</option>
              <option value="Occupied">Ocupado</option>
              <option value="Maintenance">Manutenção</option>
            </select>
            {errors.status && <p className="text-red-600 text-xs mt-1">{errors.status}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/properties")}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
