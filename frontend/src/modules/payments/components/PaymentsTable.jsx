export default function PaymentsTable({ payments }) {
    if (!payments.length) {
      return (
        <div className="text-center text-gray-500 py-10">
          Nenhum pagamento encontrado.
        </div>
      );
    }
  
    return (
      <div className="overflow-x-auto bg-white border rounded-lg">
  
        <table className="min-w-full text-sm">
  
          <thead className="bg-gray-100">
            <tr>
              {['Inquilino','Valor','Método','Data','Status','Recibo'].map(header => (
                <th
                  key={header}
                  className="px-4 py-3 text-left font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {payments.map(p => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
  
                <td className="px-4 py-3">
                  {p.tenant?.name || '—'}
                </td>
  
                <td className="px-4 py-3">
                  R$ {Number(p.amount).toFixed(2)}
                </td>
  
                <td className="px-4 py-3">
                  {p.method}
                </td>
  
                <td className="px-4 py-3">
                  {new Date(p.paymentDate).toLocaleDateString('pt-BR')}
                </td>
  
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'Pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {p.status || 'Pago'}
                  </span>
                </td>
  
                <td className="px-4 py-3">
                  <a
                    href={`/receipt/${p._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Visualizar
                  </a>
                </td>
  
              </tr>
            ))}
          </tbody>
  
        </table>
      </div>
    );
  }