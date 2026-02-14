import { useEffect, useMemo, useState } from 'react';

import AdminLayout from '@/shared/layouts/AdminLayout';
import Topbar from '@/shared/components/Topbar';

import PaymentsTable from '../components/PaymentsTable';
import { listPayments } from '../services/payment.service';

import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await listPayments();
        setPayments(data);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar histórico.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredPayments = useMemo(() => {
    return payments.filter(p =>
      p.tenant?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [payments, search]);

  return (
    <AdminLayout>
      <Topbar
        icon={faFileInvoiceDollar}
        title="Histórico de Pagamentos"
        subtitle="Todos os pagamentos recebidos"
      />

      <div className="p-6 space-y-6">

        <input
          className="w-full max-w-sm px-4 py-2 text-sm border rounded focus:ring"
          placeholder="Buscar por inquilino"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && (
          <div className="text-gray-500">
            Carregando pagamentos...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {!loading && (
          <PaymentsTable payments={filteredPayments} />
        )}

      </div>
    </AdminLayout>
  );
}