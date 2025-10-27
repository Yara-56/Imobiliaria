import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createTemplate } from "../../services/contractTemplateService";
import Menu from "../../components/Menu";
import Topbar from "../../components/admin/Topbar";
import { faFileContract } from "@fortawesome/free-solid-svg-icons";

export default function ContractForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSave = async () => {
    if (!title || !content) return alert("Preencha todos os campos");
    await createTemplate({ name: title, content });
    navigate("/templates");
  };

  return (
    <div className="layout-container">
      <Menu />
      <div className="page-content-area">
        <Topbar icon={faFileContract} title="Modelos" subtitle="Novo Modelo de Contrato" />
        <main className="content">
          <div className="form-group">
            <label>Título do Modelo</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Conteúdo do Contrato</label>
            <ReactQuill value={content} onChange={setContent} />
          </div>

          <div className="btn-container">
            <button className="btn-salvar" onClick={handleSave}>
              Salvar Modelo
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
