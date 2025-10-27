import React, { useEffect, useState } from 'react';
import { createContract } from '../../services/contractService';
import { listTenants } from '../../services/tenantService';
import { listProperties } from '../../services/propertyService';

export default function NewContract() {
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    landlord: '',
    landlordCpf: '',
    tenant: '',
    tenantCpf: '',
    property: '',
    propertyAddress: '',
    rentAmount: '',
    startDate: '',
    endDate: '',
    dueDate: '',
    duration: '',
    guarantees: {
      guarantor: false,
      deposit: false,
      insurance: false,
    },
    notes: ''
  });

  useEffect(() => {
    async function loadData() {
      const tenantList = await listTenants();
      const propertyList = await listProperties();
      setTenants(tenantList);
      setProperties(propertyList);
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('guarantees.')) {
      const field = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        guarantees: {
          ...prev.guarantees,
          [field]: checked
        }
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedProperty = properties.find(p => p._id === form.property);
      const fullData = {
        ...form,
        rentAmount: Number(form.rentAmount),
        propertyAddress: selectedProperty?.address || ''
      };
      await createContract(fullData);
      alert('Contrato criado com sucesso!');
      window.location.href = '/contracts';
    } catch (err) {
      console.error('Erro ao criar contrato:', err);
      alert('Erro ao criar contrato');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Novo Contrato</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Proprietário</label>
          <input
            name="landlord"
            value={form.landlord}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CPF do Proprietário</label>
          <input
            name="landlordCpf"
            value={form.landlordCpf}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Inquilino</label>
          <select
            name="tenant"
            value={form.tenant}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-sm"
          >
            <option value="">Selecione um inquilino</option>
            {tenants.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CPF do Inquilino</label>
          <input
            name="tenantCpf"
            value={form.tenantCpf}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imóvel</label>
          <select
            name="property"
            value={form.property}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-sm"
          >
            <option value="">Selecione um imóvel</option>
            {properties.map((p) => (
              <option key={p._id} value={p._id}>{p.description}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Valor do Aluguel</label>
          <input
            type="number"
            name="rentAmount"
            value={form.rentAmount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duração (ex: 12 meses)</label>
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Início</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Término</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vencimento</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md text-sm"
            />
          </div>
        </div>

        <fieldset className="mt-4 border border-gray-300 rounded-md p-4">
          <legend className="text-sm font-semibold text-gray-700">Garantias</legend>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="guarantees.guarantor"
                checked={form.guarantees.guarantor}
                onChange={handleChange}
              />
              Fiador
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="guarantees.deposit"
                checked={form.guarantees.deposit}
                onChange={handleChange}
              />
              Caução
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="guarantees.insurance"
                checked={form.guarantees.insurance}
                onChange={handleChange}
              />
              Seguro Fiança
            </label>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md text-sm"
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Salvar Contrato
        </button>
      </form>
    </div>
  );
}
