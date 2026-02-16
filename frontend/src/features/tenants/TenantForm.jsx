import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTenant } from "../../services/tenantService";

export default function TenantForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await createTenant(form);
    navigate("/admin/inquilinos");
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">

      <input name="name" placeholder="Nome" onChange={handleChange} className="border p-2 w-full" />
      <input name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" />
      <input name="phone" placeholder="Telefone" onChange={handleChange} className="border p-2 w-full" />
      <input name="cpf" placeholder="CPF" onChange={handleChange} className="border p-2 w-full" />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Salvar
      </button>
    </div>
  );
}