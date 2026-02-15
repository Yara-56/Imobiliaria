import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTenant } from '../services/tenant.service';

export default function CreateTenantPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await createTenant(form);
    navigate('/admin/inquilinos');
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 space-y-3">

      {Object.keys(form).map(k => (
        <input
          key={k}
          name={k}
          value={form[k]}
          onChange={handleChange}
          placeholder={k}
          className="w-full border p-2 rounded"
        />
      ))}

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Criar
      </button>

    </form>
  );
}