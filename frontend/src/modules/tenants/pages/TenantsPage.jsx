import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TenantsTable from '../components/TenantsTable';
import { listTenants, deleteTenant } from '../services/tenant.service';

export default function TenantsPage() {
  const navigate = useNavigate();

  const [tenants, setTenants] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  async function loadTenants() {
    setLoading(true);

    try {
      const data = await listTenants({ q: search });
      setTenants(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTenants();
  }, [search]);

  async function handleDelete(id) {
    if (!confirm('Deseja remover este inquilino?')) return;

    setDeletingId(id);
    await deleteTenant(id);
    await loadTenants();
    setDeletingId(null);
  }

  const sortedTenants = useMemo(() => tenants, [tenants]);

  return (
    <div className="p-6 space-y-6">

      <div className="flex justify-between">

        <input
          className="border p-2 rounded"
          placeholder="Buscar inquilino..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <button
          onClick={() => navigate('/admin/inquilinos/novo')}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Novo Inquilino
        </button>

      </div>

      {loading && <p>Carregando...</p>}

      {!loading && (
        <TenantsTable
          tenants={sortedTenants}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      )}

    </div>
  );
}