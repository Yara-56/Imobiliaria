// src/pages/Inquilinos/CadastroInquilino.jsx
import React from 'react';
import SectionBox from '../../components/Inquilinos/SectionBox';
import styles from '../../styles/modules/inquilinos/CadastroInquilino.module.scss';

const CadastroInquilino = () => {
  return (
    <div className={styles.container}>
      <h1>Inquilinos / Perfil do Inquilino / Cadastro</h1>
      <h2>Perfil do Inquilino</h2>

      <SectionBox title="Dados do Inquilino">
        <form className="form-container">
          <div>
            <label htmlFor="nome">Nome *</label>
            <input type="text" id="nome" name="nome" placeholder="Nome" required />
          </div>

          <div>
            <label htmlFor="telefone">Telefone *</label>
            <input type="tel" id="telefone" name="telefone" placeholder="Telefone" required />
          </div>

          <div>
            <label htmlFor="data_nascimento">Data de Nascimento *</label>
            <input type="date" id="data_nascimento" name="data_nascimento" required />
          </div>

          <div>
            <label htmlFor="email">E-mail *</label>
            <input type="email" id="email" name="email" placeholder="Email" required />
          </div>

          <div>
            <label htmlFor="cpf">CPF *</label>
            <input type="text" id="cpf" name="cpf" placeholder="CPF" required />
          </div>

          <div>
            <label htmlFor="endereco">Endereço *</label>
            <input type="text" id="endereco" name="endereco" placeholder="Endereço" required />
          </div>

          <div>
            <label htmlFor="rg">RG *</label>
            <input type="text" id="rg" name="rg" placeholder="RG" required />
          </div>

          <div className="botoes-container">
            <button type="reset">Limpar</button>
            <button type="submit">Salvar</button>
          </div>
        </form>
      </SectionBox>

      <SectionBox title="Documentos do Inquilino">
        <label htmlFor="documentos" className="upload-button">Escolher Arquivos</label>
        <input type="file" id="documentos" name="documentos[]" multiple />
      </SectionBox>
    </div>
  );
};

export default CadastroInquilino;
