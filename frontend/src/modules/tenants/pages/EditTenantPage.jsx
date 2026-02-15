import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getTenant, updateTenant } from '../services/tenant.service';

export default function EditTenantPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    suretyLetter: ''
  });

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadTenant() {
      const data = await getTenant(id);
      setForm(data);
      setLoading(false);
    }

    loadTenant();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = new FormData();

    Object.entries(form).forEach(([k, v]) =>
      payload.append(k, v ?? '')
    );

    Array.from(documents).forEach(file =>
      payload.append('documents[]', file)
    );

    setSaving(true);
    await updateTenant(id, payload);
    navigate(`/admin/inquilinos/ver/${id}`);
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-4">

      {['name','cpf','email','phone'].map(field => (
        <input
          key={field}
          name={field}
          value={form[field] || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder={field.toUpperCase()}
        />
      ))}

      <textarea
        name="suretyLetter"
        value={form.suretyLetter}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        placeholder="Carta de fiança"
      />

      <input type="file" multiple onChange={e => setDocuments(e.target.files)} />

      <button
        disabled={saving}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        {saving ? 'Salvando...' : 'Salvar'}
      </button>

    </form>
  );
}