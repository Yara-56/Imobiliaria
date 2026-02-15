import { useNavigate } from 'react-router-dom';

export default function TenantsTable({ tenants, deletingId, onDelete }) {
  const navigate = useNavigate();

  if (!tenants.length) {
    return <p>Nenhum inquilino encontrado.</p>;
  }

  return (
    <table className="w-full border">

      <thead className="bg-gray-100">
        <tr>
          {['Nome','CPF','Email','Telefone','Ações'].map(h => (
            <th key={h} className="p-2 text-left">{h}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {tenants.map(t => (
          <tr key={t._id} className="border-t">

            <td className="p-2">{t.name}</td>
            <td className="p-2">{t.cpf}</td>
            <td className="p-2">{t.email}</td>
            <td className="p-2">{t.phone}</td>

            <td className="p-2 space-x-2">

              <button onClick={() => navigate(`/admin/inquilinos/ver/${t._id}`)}>
                Ver
              </button>

              <button onClick={() => navigate(`/admin/inquilinos/editar/${t._id}`)}>
                Editar
              </button>

              <button
                disabled={deletingId === t._id}
                onClick={() => onDelete(t._id)}
              >
                {deletingId === t._id ? '...' : 'Deletar'}
              </button>

            </td>
          </tr>
        ))}
      </tbody>

    </table>
  );
}