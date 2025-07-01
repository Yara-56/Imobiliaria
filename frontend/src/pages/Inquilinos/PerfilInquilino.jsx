// src/pages/Inquilinos/PerfilInquilino.jsx
import React from 'react';
import FieldDisplay from '../../components/Inquilinos/FieldDisplay';
import SectionBox from '../../components/Inquilinos/SectionBox';
import styles from '../../styles/modules/inquilinos/PerfilInquilino.module.scss';

const PerfilInquilino = () => {
  const dadosInquilino = {
    nome: 'João da Silva',
    telefone: '(11) 99999-9999',
    data_nascimento: '1990-01-01',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    endereco: 'Rua Exemplo, 123',
    rg: '12.345.678-9',
  };

  const documentos = ['RG.pdf', 'CPF.pdf', 'Comprovante de Endereço.pdf'];

  const informacoesAdicionais = {
    codigoImovel: 'IMV-2025',
    dataCadastro: '2024-01-15',
  };

  return (
    <div className={styles.container}>
      <h1>Inquilinos / Perfil do Inquilino</h1>
      <h2>Perfil do Inquilino</h2>

      <SectionBox title="Dados do Inquilino">
        <div className="form-container">
          {Object.entries(dadosInquilino).map(([label, value]) => (
            <FieldDisplay key={label} label={label.replace('_', ' ')} value={value} />
          ))}

          <div className="botoes-container">
            <a href="/EditarInquilino" className="btn">Editar</a>
            <a href="/ListaInquilinos" className="btn">Voltar</a>
          </div>
        </div>
      </SectionBox>

      <SectionBox title="Documentos do Inquilino">
        <ul>
          {documentos.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </SectionBox>

      <SectionBox title="Informações Adicionais">
        <div className="form-container">
          <FieldDisplay label="Código Imóvel" value={informacoesAdicionais.codigoImovel} />
          <FieldDisplay label="Data de Cadastro" value={informacoesAdicionais.dataCadastro} />
        </div>
      </SectionBox>
    </div>
  );
};

export default PerfilInquilino;
