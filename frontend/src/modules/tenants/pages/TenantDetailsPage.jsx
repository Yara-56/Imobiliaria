import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getTenant } from '../services/tenant.service';

export default function TenantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);

  useEffect(() => {
    getTenant(id).then(setTenant);
  }, [id]);

  if (!tenant) return <p>Carregando...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-3">

      {Object.entries(tenant).map(([k,v]) =>
        typeof v === 'string' && (
          <p key={k}><b>{k}:</b> {v}</p>
        )
      )}

      <button
        onClick={() => navigate(`/admin/inquilinos/editar/${id}`)}
        className="bg-yellow-600 text-white px-4 py-2 rounded"
      >
        Editar
      </button>

    </div>
  );
}