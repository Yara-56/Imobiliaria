import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPropertyById,
  updateProperty,
  deleteProperty,
  deletePropertyDocument,
} from "../../services/propertyService";

export default function PropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ... (seus 'useState' estão corretos) ...
  const [form, setForm] = useState({
    cep: "", sqls: "", street: "", number: "", bairro: "",
    city: "", state: "", status: "",
  });
  const [existingDocs, setExistingDocs] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const data = await getPropertyById(id);
        setForm({
          cep: data?.cep || "",
          sqls: data?.sqls || "",
          street: data?.street || "",
          number: data?.number || "",
          bairro: data?.bairro || "", // ✅ Corrigido
          city: data?.city || "",
          state: data?.state || "",
          status: data?.status || "",
        });
        setExistingDocs(data?.documents || []);

      // ✅ BLOCO 'CATCH' ATUALIZADO PARA DEBUG
      } catch (err) {
        console.error(
          "❌ ERRO REAL AO CARREGAR IMÓVEL (REINICIADO):", 
          err
        );
        console.error("DADOS COMPLETOS DO ERRO (REINICIADO):", err.response);
        
        if (err.response && err.response.status === 401) {
          alert("Sessão expirou (NÃO VOU REDIRECIONAR).");
          localStorage.clear(); 
          // navigate("/"); // <-- DESATIVADO 
        } else {
          alert("Imóvel não encontrado (NÃO VOU REDIRECIONAR).");
          // navigate("/admin/imoveis"); // <-- DESATIVADO
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]); 

  
  // ... (O restante do seu arquivo: onChange, onSubmit, onDelete, e o JSX estão corretos) ...
  
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFilesChange = (e) => {
    setNewFiles(Array.from(e.target.files || []));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await updateProperty(id, form, newFiles);
      navigate("/admin/imoveis"); 
    } catch (err) {
      console.error(err);
      alert("Falha ao salvar alterações. Verifique os campos obrigatórios.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteProperty(id);
      navigate("/admin/imoveis");
    } catch (err) {
      console.error(err);
      alert("Falha ao excluir.");
    } finally {
      setDeleting(false);
    }
  };

  const onRemoveDoc = async (docId) => {
    if (!window.confirm("Excluir este documento?")) return;
    try {
      await deletePropertyDocument(id, docId);
      setExistingDocs((prev) => prev.filter((d) => d._id !== docId));
    } catch (err) {
      console.error(err);
      alert("Falha ao excluir documento.");
    }
  };


  if (loading) return <div>Carregando...</div>;

  return (
    <form onSubmit={onSubmit} className="max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Editar Imóvel</h1>
      {/* O resto do seu JSX está perfeito */}
      {/* ... (Dados do imóvel, Documentos, Ações) ... */}
        <div className="bg-white rounded border p-4 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <i className="fa-solid fa-house" /> Dados do imóvel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "CEP", name: "cep", placeholder: "35160-133" },
            { label: "SQLS", name: "sqls", placeholder: "Ex: 12930423546793023" },
            { label: "Rua", name: "street" },
            { label: "Número", name: "number" },
            { label: "Bairro", name: "bairro" }, // ✅ Corrigido
            { label: "Cidade", name: "city" },
            { label: "Estado", name: "state" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-sm text-gray-600 mb-1">{f.label}</label>
              <input
                name={f.name}
                value={form[f.name]}
                onChange={onChange}
                placeholder={f.placeholder}
                className="border rounded px-3 py-2 w-full"
                autoComplete="off"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={onChange}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="">Selecione o status</option>
              <option value="Available">Disponível</option>
              <option value="Occupied">Ocupado</option>
              <option value="Under Maintenance">Em manutenção</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white rounded border p-4 mb-6">
        <h2 className="font-medium mb-4 flex items-center gap-2">
          <i className="fa-solid fa-folder" /> Documentos do imóvel
        </h2>

        {existingDocs?.length > 0 ? (
          <ul className="space-y-2 mb-4">
            {existingDocs.map((doc) => (
              <li
                key={doc._id}
                className="flex items-center justify-between border rounded px-3 py-2"
              >
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline truncate"
                  title={doc.name}
                >
                  {doc.name || "Documento"}
                </a>
                <button
                  type="button"
                  onClick={() => onRemoveDoc(doc._id)}
                  className="text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 mb-4">Nenhum documento anexado.</p>
        )}

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Adicionar documentos
          </label>
          <input type="file" multiple onChange={onFilesChange} />
          {newFiles?.length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              {newFiles.length} arquivo(s) selecionado(s)
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={onDelete}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
        >
          {deleting ? "Excluindo..." : "Excluir"}
        </button>
      </div>
    </form>
  );
}