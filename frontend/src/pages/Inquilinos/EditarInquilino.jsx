// src/pages/Inquilinos/EditarInquilino.jsx
import React from 'react';
import SectionBox from '../../components/Inquilinos/SectionBox';
import DocumentList from '../../components/Inquilinos/DocumentList';
import styles from '../../styles/modules/inquilinos/EditarInquilino.module.scss';

const EditarInquilino = () => {
  const documentos = [
    'RG.pdf',
    'CPF.pdf',
    'Comprovante de Residência.pdf'
  ];

  return (
    <div className={styles.container}>
      <h1>Inquilinos / Perfil do Inquilino / Editando</h1>
      <h2>Perfil do Inquilino</h2>

      <SectionBox title="Dados do Inquilino">
        <form className="form-container">
          <div>
            <label htmlFor="nome">Nome</label>
            <input type="text" id="nome" name="nome" required />
          </div>

          <div>
            <label htmlFor="telefone">Telefone</label>
            <input type="tel" id="telefone" name="telefone" required />
          </div>

          <div>
            <label htmlFor="data_nascimento">Data de Nascimento</label>
            <input type="date" id="data_nascimento" name="data_nascimento" required />
          </div>

          <div>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div>
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" name="cpf" required />
          </div>

          <div>
            <label htmlFor="endereco">Endereço</label>
            <input type="text" id="endereco" name="endereco" required />
          </div>

          <div>
            <label htmlFor="rg">RG</label>
            <input type="text" id="rg" name="rg" required />
          </div>

          <div className="botoes-container">
            <button type="submit">Salvar Alterações</button>
            <button type="reset">Restaurar</button>
          </div>
        </form>
      </SectionBox>

      <SectionBox title="Documentos do Inquilino">
        <DocumentList documentos={documentos} />
        <div className="adicionar-doc">
          <label htmlFor="novoDoc">Adicionar Novo Documento</label>
          <input type="file" id="novoDoc" />
        </div>
      </SectionBox>

      <SectionBox>
        <div className="botoes-container">
          <button type="button" id="btn-excluir">Excluir Inquilino</button>
        </div>
      </SectionBox>
    </div>
  );
};

export default EditarInquilino;
